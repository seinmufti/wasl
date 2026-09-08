import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

function loadEnvFiles() {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  for (const file of [".env", ".env.local"]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed
        .slice(index + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnvFiles();

export function getNetworkAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

function backendUrl(host, frontendPort, backendPort) {
  if (backendPort === frontendPort) {
    return `http://${host}:${frontendPort}/api`;
  }
  return `http://${host}:${backendPort}`;
}

export function printHostBanner({ frontendPort, backendPort, mode = "dev" }) {
  const networkIp = getNetworkAddress();
  const label = mode === "start" ? "Wasl (production)" : "Wasl";

  console.log("");
  console.log(label);
  console.log("");
  console.log("Local:");
  console.log(`  Frontend: http://localhost:${frontendPort}`);
  console.log(`  Backend:  ${backendUrl("localhost", frontendPort, backendPort)}`);
  console.log("");
  console.log("Network:");
  if (networkIp) {
    console.log(`  Frontend: http://${networkIp}:${frontendPort}`);
    console.log(`  Backend:  ${backendUrl(networkIp, frontendPort, backendPort)}`);
  } else {
    console.log("  Frontend: (no network interface found)");
    console.log("  Backend:  (no network interface found)");
  }
  console.log("");
}

export function readPorts() {
  const frontendPort = Number(process.env.FRONTEND_PORT || process.env.PORT || 3000);
  const backendPort = Number(process.env.BACKEND_PORT || frontendPort);
  const hostname = process.env.HOST || "0.0.0.0";
  return { frontendPort, backendPort, hostname };
}
