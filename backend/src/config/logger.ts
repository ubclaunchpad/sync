import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "debug",
  base: null,
  prettyPrint: true,
  timestamp: () => {
    return `, "time":"${new Date(Date.now()).toLocaleString()}"`;
  }
});

export default logger;
