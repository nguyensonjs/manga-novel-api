import { env } from "@/config/env.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import { HttpError } from "@/utils/http-error.ts";

export const fetchFromOTruyen = async <T = any>(
  path: string,
  query: any,
  method: string,
  body?: any,
): Promise<T> => {
  // Get the path from the request and remove the leading /otruyen
  const targetPath = path.replace(/^\/otruyen/, "");
  
  // Construct the target URL with query parameters
  const queryString = new URLSearchParams(query as any).toString();
  const targetUrl = `${env.OTRUYEN_API_URL}${targetPath}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(targetUrl, {
    method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: ["POST", "PUT", "PATCH"].includes(method) ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as any;
    throw new HttpError(
      response.status,
      errorData.message || `OTruyen API error: ${response.statusText}`
    );
  }

  return (await response.json()) as T;
};
