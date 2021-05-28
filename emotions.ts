import express from "express";
import path from "path";
import fs from "fs";
import logger from "morgan";
import dateFormat from "dateformat";

import config from "./config.json";

function escapeQuotes(s: string) {
  if (s.indexOf(",") >= 0) {
    return '"' + s.replace(/"/g, '\\"') + '"';
  }

  return s;
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

app.get("/", (req, res) => {
  res.render("index", {
    title: "Annemo"
  });
});

app.get("/videos", (req, res) => {
  res.send({
    videos: config.videos
  });
});

app.post("/emotion", async (req, res) => {
  const { subject, data } = req.body;

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
