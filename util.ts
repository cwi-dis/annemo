import fs from "fs";
import { access, mkdir } from "fs/promises";
import path from "path";

/**
 * Specifies the shape of the data loaded from `config.json`
 */
export interface Config {
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
export function escapeQuotes(s: any) {
  if (typeof s == "string" && s.indexOf(",") >= 0) {
    return '"' + s.replace(/"/g, '\\"') + '"';
  }

  return s;
}

/**
 * Checks whether the given object has the required structure to be interpreted
 * as a config object.
 *
 * @param data Object to check
 * @returns Whether the passed object has the required structure
 */
function isConfigValid(data: any): boolean {
  // Make sure all the keys a present
  if (!data.location || !data.videos || !data.users) {
    return false;
  }

  // Return false if key location is not a string
  if (!(typeof data.location == "string")) {
    return false;
  }

  // Return false if key videos is not an array or its values aren't strings
  if (!Array.isArray(data.videos) || data.videos.some((e: any) => typeof e != "string")) {
    return false;
  }

  // Return false if key users is not an array or its values aren't strings
  if (!Array.isArray(data.users) || data.users.some((e: any) => typeof e != "string")) {
    return false;
  }

  return true;
}

/**
 * Loads the contents of the file `config.json`, parses them and returns them.
 * If the file `config.json` does not exist or could not be parsed, an error is
 * raised.
 *
 * @returns The contents of the config file
 */
export async function loadConfig(): Promise<Config> {
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
          // Parse data read from file
          const config = JSON.parse(data);

          // Check whether parsed config data is valid
          if (isConfigValid(config)) {
            resolve(config);
          } else {
            reject("Config data invalid")
          }
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
export async function saveToCSV(subject: string, line: string): Promise<void> {
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
 * Checks if the directory `results/` exists and creates it if not.
 */
export async function checkResultsDirectory() {
  const resultsDir = path.join(__dirname, "results");

  // Check if directory `results/` exists. If not, attempt to create it
  try {
    await access(resultsDir);
  } catch {
    await mkdir(resultsDir, 0o755);
  }
}
