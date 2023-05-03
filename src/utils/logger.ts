import path from "path";
import winston, { format } from "winston";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logPath = path.join(__dirname, "..", "..", "logs");

const logger = winston.createLogger({
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: "atem-airbox" },
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logPath, "combined.log"),
      level: "info",
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
