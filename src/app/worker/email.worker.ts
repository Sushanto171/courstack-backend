import { ISendEmail, sendEmail } from "@/app/config/send-email";
import { emitter } from "@/app/utils/events";

const MAX_RETRIES = 3;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const emailWorker = () => {

  if (emitter.listenerCount("email:send") > 0) return;

  emitter.on("email:send", async (payload: ISendEmail) => {
    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
      attempts++;

      try {
        await sendEmail(payload);
        success = true;

        console.log(JSON.stringify({
          level: "info",
          event: "email:sent",
          to: payload.to,
          subject: payload.subject,
          attempts,
          timestamp: new Date().toISOString(),
        }));

      } catch (error) {

        console.error(JSON.stringify({
          level: "error",
          event: "email:failed",
          to: payload.to,
          attempt: attempts,
          maxRetries: MAX_RETRIES,
          reason: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        }));

        if (attempts < MAX_RETRIES) {
          await delay(attempts * 1000);
        } else {

          console.error(JSON.stringify({
            level: "critical",
            event: "email:dead",
            to: payload.to,
            timestamp: new Date().toISOString(),
          }));
        }
      }
    }
  });
};