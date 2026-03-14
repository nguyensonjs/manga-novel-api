type EnvKey =
  | "CORS_ORIGIN"
  | "JWT_SECRET"
  | "MONGODB_URI"
  | "PORT"
  | "OTRUYEN_API_URL";

const getEnv = (key: EnvKey, fallback?: string): string => {
  const value = process.env[key];

  if (value) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

const port = Number(getEnv("PORT", "3333"));

if (Number.isNaN(port)) {
  throw new Error("PORT must be a valid number");
}

export const env = {
  CORS_ORIGIN: getEnv("CORS_ORIGIN", "*"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  MONGODB_URI: getEnv("MONGODB_URI"),
  PORT: port,
  OTRUYEN_API_URL: getEnv("OTRUYEN_API_URL", "https://otruyenapi.com/v1/api"),
} as const;
