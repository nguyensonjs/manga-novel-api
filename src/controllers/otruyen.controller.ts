import type { Request, Response } from "express";
import { env } from "@/config/env.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import { HttpError } from "@/utils/http-error.ts";

/**
 * Proxy function to forward requests to OTruyen API
 */
export const proxyOTruyen = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the path from the request and remove the leading /otruyen
    // Example: /api/otruyen/home -> /home
    const targetPath = req.path.replace(/^\/otruyen/, "");
    
    // Construct the target URL with query parameters
    const queryString = new URLSearchParams(req.query as any).toString();
    const targetUrl = `${env.OTRUYEN_API_URL}${targetPath}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      // Forward body if it's a POST/PUT request
      body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any;
      throw new HttpError(
        response.status,
        errorData.message || `OTruyen API error: ${response.statusText}`
      );
    }

    const data = await response.json();
    res.status(HTTP_STATUS.OK).json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      `Failed to fetch from OTruyen: ${(error as Error).message}`
    );
  }
};
