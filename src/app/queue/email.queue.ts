import { ISendEmail } from "@/app/config/send-email";
import { emitter } from "@/app/utils/events";

export const addEmailQueue = (payload: ISendEmail) => {
  emitter.emit("email:send", payload);
}