
import { DefaultArgs } from "@prisma/client/runtime/client";
import axios from "axios";
import { randomUUID } from "crypto";
import { EnrollmentStatus, PaymentStatus, PrismaClient } from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../config/prisma";
import { IipnBody, PaymentParams } from "./payment.types";

type ITnx = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">

const create = async (tnx: ITnx, price: number, enrollmentId: string) => {
  const transactionId = randomUUID()
  return await tnx.payment.create({
    data: {
      transactionId,
      price,
      enrollmentId
    }
  })
}

const initiatePayment = async ({
  total_amount,
  tran_id,
  courseTitle,
  student: { name, email, phone }
}: PaymentParams) => {

  const payload = new URLSearchParams({
    store_id: config.ssl.SSLC_STORE_ID,
    store_passwd: config.ssl.SSLC_STORE_PASSWORD,
    total_amount: total_amount.toString(),
    currency: "BDT",
    tran_id,
    success_url: `${config.FRONTEND_URL}/success`,
    fail_url: `${config.FRONTEND_URL}/fail`,
    cancel_url: `${config.FRONTEND_URL}/cancel`,
    ipn_url: `${config.BACKEND_URL}/api/v1/payment/ipn`,
    shipping_method: "NO",
    product_name: courseTitle,
    product_category: "course",
    product_profile: "general",
    cus_name: name,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: phone || "N/A"
  });

  const { data } = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    payload,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  if (!data.GatewayPageURL) {
    throw new Error("Payment initiation failed: GatewayPageURL missing");
  }
  return data

};



export const validatePayment = async ({ val_id, tran_id }: IipnBody) => {

  const url = `${process.env.SSLC_BASE_URL}/validator/api/validationserverAPI.php`;

  const { data } = await axios.get(url, {
    params: {
      val_id,
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_STORE_PASSWORD,
      format: "json"
    }
  });

  await prisma.$transaction(async (tnx) => {
    return await tnx.payment.update({
      where: {
        transactionId: tran_id
      },
      data: {
        status: data?.status === "VALID" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        enrollment: {
          update: {
            status: data?.status === "VALID" ? EnrollmentStatus.ACTIVE : EnrollmentStatus.UNPAID
          }
        }
      }
    })
  })
  return;
};

export const paymentService = { create, initiatePayment, validatePayment }