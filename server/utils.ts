import { createLogger } from "vite"; // Keep this for now, will handle later in dev-server.ts

const viteLogger = createLogger(); // Keep this for now

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
} 