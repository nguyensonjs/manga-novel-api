const ANSI = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
} as const;

const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) {
    return ANSI.red;
  }

  if (statusCode >= 400) {
    return ANSI.yellow;
  }

  if (statusCode >= 300) {
    return ANSI.blue;
  }

  return ANSI.green;
};

const getStatusLabel = (statusCode: number): string => {
  if (statusCode >= 500) {
    return "CRASH";
  }

  if (statusCode >= 400) {
    return "OOPS";
  }

  if (statusCode >= 300) {
    return "MOVE";
  }

  return "NICE";
};

const formatTimestamp = (): string => {
  return new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });
};

const writeStdout = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

const writeStderr = (message: string): void => {
  process.stderr.write(`${message}\n`);
};

const formatTag = (tag: string, color: string): string => {
  return `${color}[${tag}]${ANSI.reset}`;
};

const formatRequestId = (requestId?: string): string => {
  return requestId ? `${ANSI.dim}#${requestId}${ANSI.reset}` : "";
};

export const logger = {
  info(message: string): void {
    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("INFO", ANSI.cyan)} ${message}`,
    );
  },
  warn(message: string, requestId?: string): void {
    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("WARN", ANSI.yellow)} ${formatRequestId(requestId)} ${message}`,
    );
  },
  ready(message: string): void {
    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("READY", ANSI.green)} ${message}`,
    );
  },
  database(message: string): void {
    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("DB", ANSI.magenta)} ${message}`,
    );
  },
  requestStart(method: string, path: string, requestId?: string): void {
    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("REQ:IN", ANSI.cyan)} ${formatRequestId(requestId)} --> ${method.toUpperCase()} ${path}`,
    );
  },
  request(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    requestId?: string,
  ): void {
    const statusColor = getStatusColor(statusCode);
    const statusLabel = getStatusLabel(statusCode);
    const formattedStatus = `${statusColor}${statusCode}${ANSI.reset}`;
    const formattedDuration = `${ANSI.dim}${durationMs.toFixed(1)}ms${ANSI.reset}`;
    const formattedTag = formatTag(`REQ:${statusLabel}`, statusColor);
    const formattedRequestId = formatRequestId(requestId);

    writeStdout(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formattedTag} ${formattedRequestId} <-- ${method.toUpperCase()} ${path} ${formattedStatus} ${formattedDuration}`,
    );
  },
  error(error: unknown, requestId?: string): void {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

    writeStderr(
      `${ANSI.dim}[${formatTimestamp()}]${ANSI.reset} ${formatTag("ERROR", ANSI.red)} ${formatRequestId(requestId)} ${message}`,
    );
  },
};
