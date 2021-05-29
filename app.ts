import express from "express";
import path from "path";
import logger from "morgan";
import dateFormat from "dateformat";

import { checkResultsDirectory, Config, escapeQuotes, loadConfig, saveToCSV } from "./util";

/**
 * Starts an Express HTTP server with the values given in the param `config`.
 *
 * @param config Config for the server
 */
async function startServer(config: Config) {
  // Init app
  const app = express();

  // Check if directory `results/` exists. If not, attempt to create it
  await checkResultsDirectory();

  // Use ejs view engine
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  // Set port
  const port = process.env.PORT || 3001;
  app.set("port", port);

  // Set static for and set up middlewares
  app.use(express.static("static"))
  app.use(express.urlencoded({ extended: false }));
  app.use(logger("dev"));
  app.use(express.json());

  // Render index template
  app.get("/", (req, res) => {
    res.render("index", {
      title: "Annemo"
    });
  });

  // Return list of videos if subject in query param exists
  app.get("/videos", (req, res) => {
    const { subject } = req.query;

    // Check if subject exists in config
    if (config.users.find((u) => u == subject)) {
      // Return list of videos
      return res.send({
        videos: config.videos
      });
    }

    // Otherwise, return empty list
    res.send({ videos: [] })
  });

  // Receive and save emotion data point
  app.post("/emotion", async (req, res) => {
    const { subject, data } = req.body;

    // Make sure given subject exists in config. If not, return error 400
    if (!config.users.find((u) => u == subject)) {
      return res.status(400).send({
        message: "No such user"
      });
    }

    // Extract values from body and escape quotes
    const values = Object.values(data).map(escapeQuotes);
    // Generate formatted date string
    const formattedDate = escapeQuotes(dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"))

    try {
      // Generate and save line to file
      const csv = formattedDate + "," + values.join(",") + "\n"
      await saveToCSV(subject, csv);

      // Return success
      res.send({
        status: "OK"
      })
    } catch (err) {
      // Return with error 500 on error
      res.status(500).send({
        message: err
      });
    }
  });

  // Receive and save social dimension data point
  app.post("/social", async (req, res) => {
    const { subject, data } = req.body;

    // Make sure given subject exists in config. If not, return error 400
    if (!config.users.find((u) => u == subject)) {
      return res.status(400).send({
        message: "No such user"
      });
    }

    // Extract values from body and escape quotes
    const values = Object.values(data).map(escapeQuotes);

    try {
      // Generate and save line to file
      const csv = "Social," + values.join(",") + "\n";
      await saveToCSV(subject, csv);

      // Return success
      res.send({
        status: "OK"
      })
    } catch (err) {
      // Return with error 500 on error
      res.status(500).send({
        message: err
      });
    }
  });

  // Return base URL for video files from config
  app.get("/location", (req, res) => {
    res.send({
      location: config.location
    });
  });

  // Set up server for listening on configured port
  app.listen(port, () => {
    console.log(`Server listening on port http://0.0.0.0/${port}`);
  });
}

// Load configuration and then start server with loaded config values
loadConfig().then((config) => {
  console.log("Config:", config);
  startServer(config);
}).catch((err) => {
  // Log error and shut down process on error
  console.error(err);
  process.exit(1);
});
