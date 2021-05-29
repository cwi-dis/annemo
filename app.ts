import express from "express";
import path from "path";
import fs from "fs";
import logger from "morgan";
import dateFormat from "dateformat";

/**
 * Specifies the shape of the data loaded from `config.json`
 */
interface Config {
  location: string;
  videos: Array<string>;
  users: Array<string>;
}

/**
 * Escapes potential quotes in the given input string. If the value passed is
 * not a string, it is returned unchanged.
 *
 * @param s String to be escaped
 * @returns The input string with all quotes escaped
 */
function escapeQuotes(s: any) {
  if (typeof s == "string" && s.indexOf(",") >= 0) {
    return '"' + s.replace(/"/g, '\\"') + '"';
  }

  return s;
}

/**
 * Loads the contents of the file `config.json`, parses them and returns them.
 * If the file `config.json` does not exist or could not be parsed, an error is
 * raised.
 *
 * @returns The contents of the config file
 */
async function loadConfig(): Promise<Config> {
  return new Promise((resolve, reject) => {
    // Check if the file `config.json` exists
    if (!fs.existsSync(path.join(__dirname, "config.json"))) {
      reject("Config file not found");
      return;
    }

    // Attempt to read the file
    fs.readFile(path.join(__dirname, "config.json"), "utf-8", (err, data) => {
      if (err) {
        // Reject promise if file could not be read
        reject(err);
      } else {
        try {
          // Parse and resolve the promise with the parsed data
          resolve(JSON.parse(data));
        } catch (err) {
          // Reject promise if file contents could not be parsed
          reject(err);
        }
      }
    })
  });
}

/**
 * Appends the given line to a CSV file named after the value given by the
 * variable `subject`. If the line could not be appended, an error is raised.
 *
 * @param subject Name of test subject to be used as filename
 * @param line Line to append to the file
 */
async function saveToCSV(subject: string, line: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create write stream for the file identified by the value in `subject`
    // in the `results/` directory
    const writer = fs.createWriteStream(path.join(__dirname, "results", `${subject}.csv`), {
      flags: "a"
    });

    // Write the line to the file, reject promise if an error occurs
    writer.write(line, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Starts an Express HTTP server with the values given in the param `config`.
 *
 * @param config Config for the server
 */
function startServer(config: Config) {
  // Init app
  const app = express();
  const resultsDir = path.join(__dirname, "results");

  // Check if directory `results/` exists. If not, attempt to create it
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, 0o755);
  }

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
