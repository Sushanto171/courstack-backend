import pino from "pino"

export const logger = pino({
  transport: {
    level: "debug",
    target: "pino-pretty",
    options: { colorize: true }
  }
}
)