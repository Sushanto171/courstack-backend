import { Response } from "express";

type Meta = {
  page?: number;
  limit?: number;
  total?: number;
} & Record<string, unknown>;

const sendResponse = <T>(res: Response, jsonData: {
  statusCode: number,
  success: boolean,
  message: string,
  meta?: Meta,
  data: T | null | undefined,
  error?: unknown
}) => {
  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
    error: jsonData.error || null || undefined
  })
}

export default sendResponse;