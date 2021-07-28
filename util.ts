import fs from "fs/promises";
import path from "path";

/**
 * Specifies the shape of the data loaded from `config.json`
 */
export interface Config {
  location?: string;
  videos: Array<string>;
  users: Array<string>;
}

/**
 * Surrounds a value with double quotes if it is a string and contains one or
 * more commas. If the string contains double quotes, they are escaped. If the
 * given value is not a string, it is returned unchanged.
 *
 * @param s Value to be escaped
 * @returns The input surrounded by quotes if it contains a comma, otherwise unchanged
 */
export function escapeString<T>(s: T): T;
export function escapeString(s: string): string {
  // Check if input is a string and contains a comma
  if (typeof s == "string" && s.indexOf(",") >= 0) {
    return `"${s.replace(/"/g, "\\\"")}"`;
  }

  // Return unchanged otherwise
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
  if (!data.videos || !data.users) {
    return false;
  }

  // Return false if key location is not a string
  if (data.location && !(typeof data.location == "string")) {
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
  const configPath = path.join(__dirname, "config.json");

  const data = await fs.readFile(configPath, {
    encoding: "utf-8"
  });
  const config = JSON.parse(data);

  if (isConfigValid(config)) {
    return config;
  } else {
    throw "Config data invalid";
  }
}

/**
 * Appends the given line to a CSV file named after the value given by the
 * variable `subject`. If the line could not be appended, an error is raised.
 *
 * @param subject Name of test subject to be used as part of filename
 * @param subject Name of video file to be used as part of filename
 * @param subject Name of dimension to be used as part of filename
 * @param line Line to append to the file
 */
export async function saveToCSV(subject: string, video: string, dimension: string, line: string): Promise<void> {
  // Compute output path
  const outputPath = path.join(__dirname, "results", `${subject}_${video.split(".")[0]}_${dimension}.csv`);

  // Write data to file
  return await fs.writeFile(outputPath, line, {
    flag: "a"
  });
}

/**
 * Checks if the directory `results/` exists and creates it if not.
 */
export async function checkResultsDirectory() {
  const resultsDir = path.join(__dirname, "results");

  // Check if directory `results/` exists. If not, attempt to create it
  try {
    await fs.access(resultsDir);
  } catch {
    await fs.mkdir(resultsDir, 0o755);
  }
}

/**
 * Returns a list containing the names for available result CSV files located
 * in the `results/` directory.
 *
 * @returns A list of filenames located in the `results/` directory
 */
export async function getResultFiles() {
  const resultsDir = path.join(__dirname, "results");
  const files = await fs.readdir(resultsDir);

  return files.map((f) => path.basename(f)).filter((f) => f.endsWith(".csv"));
}

/**
 * Deletes the given file in the results directory.
 *
 * @param fname File to be deleted
 */
export async function deleteResultFile(fname: string) {
  const resultsDir = path.join(__dirname, "results");
  const basename = path.basename(fname);

  if (basename.endsWith(".csv")) {
    await fs.unlink(path.join(resultsDir, basename));
  }
}
