import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { printHostBanner, readPorts } from "./host-banner.mjs";

const { frontendPort, hostname } = readPorts();
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

printHostBanner({ ...readPorts(), mode: "dev" });

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  [nextBin, "dev", "-H", hostname, "-p", String(frontendPort)],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
