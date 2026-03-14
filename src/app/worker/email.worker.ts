import { ISendEmail, sendEmail } from "@/app/config/send-email";
import { emitter } from "@/app/utils/events";

export const emailWorker = async () => {

  emitter.on("email:send", async (payload: ISendEmail) => {
    try {
      const res = await sendEmail(payload);
      console.log("email worker result", res);

    } catch (error) {
      console.log("error from email worker:", error);
    }
  })
}