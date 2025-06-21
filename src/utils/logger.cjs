import fs from "fs";
import path from "path";

// Define log file path
const logFilePath = path.join(__dirname, "../logs/sandbox.log");

/**
 * Log a message to the log file.
 * @param {string} level - Log level ( "INFO", "ERROR").
 * @param {string} message - Log message.
 */
export function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Append log message to file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
}
