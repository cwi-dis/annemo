import express from "express";
import path from "path";
import fs from "fs";
import logger from "morgan";

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

app.listen(port, () => {
  console.log(`Server listening on port http://0.0.0.0/${port}`);
});
