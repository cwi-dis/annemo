import express from "express";
import path from "path";
import fs from "fs";
import logger from "morgan";
import dateFormat from "dateformat";

interface Config {
  location: string;
  videos: Array<string>;
  users: Array<string>;
}

function escapeQuotes(s: any) {
  if (typeof s == "string" && s.indexOf(",") >= 0) {
    return '"' + s.replace(/"/g, '\\"') + '"';
  }

  return s;
}

async function loadConfig(): Promise<Config> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(__dirname, "config.json"))) {
      reject("Config file not found");
      return;
    }

    fs.readFile(path.join(__dirname, "config.json"), "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      }
    })
  });
}

async function saveToCSV(subject: string, line: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(path.join(__dirname, "results", `${subject}.csv`), {
      flags: "a"
    });

    writer.write(line, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function startServer(config: Config) {
  const app = express();
  const resultsDir = path.join(__dirname, "results");

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, 0o755);
  }

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  const port = process.env.PORT || 3001;
  app.set("port", port);

  app.use(express.static("static"))
  app.use(express.urlencoded({ extended: false }));
  app.use(logger("dev"));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("index", {
      title: "Annemo"
    });
  });

  app.get("/videos", (req, res) => {
    const { subject } = req.query;

    if (config.users.find((u) => u == subject)) {
      return res.send({
        videos: config.videos
      });
    }

    res.send({ videos: [] })
  });

  app.post("/emotion", async (req, res) => {
    const { subject, data } = req.body;

    if (!config.users.find((u) => u == subject)) {
      return res.status(400).send({
        message: "No such user"
      });
    }

    const values = Object.values(data).map(escapeQuotes);
    const formattedDate = escapeQuotes(dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"))

    try {
      const csv = formattedDate + "," + values.join(",") + "\n"
      await saveToCSV(subject, csv);

      res.send({
        status: "OK"
      })
    } catch (err) {
      res.status(500).send({
        message: err
      });
    }
  });

  app.post("/social", async (req, res) => {
    const { subject, data } = req.body;

    if (!config.users.find((u) => u == subject)) {
      return res.status(400).send({
        message: "No such user"
      });
    }

    const values = Object.values(data).map(escapeQuotes);

    try {
      const csv = "Social," + values.join(",") + "\n";
      await saveToCSV(subject, csv);

      res.send({
        status: "OK"
      })
    } catch (err) {
      res.status(500).send({
        message: err
      });
    }
  });

  app.get("/location", (req, res) => {
    res.send({
      location: config.location
    });
  });

  app.listen(port, () => {
    console.log(`Server listening on port http://0.0.0.0/${port}`);
  });
}

loadConfig().then((config) => {
  console.log("Config:", config);
  startServer(config);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
