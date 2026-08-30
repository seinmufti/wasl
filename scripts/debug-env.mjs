import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DEBUG_MARKER = path.join(ROOT, ".wasl-debug");
export const ENV_LOCAL = path.join(ROOT, ".env.local");
const DEBUG_KEY = "NEXT_PUBLIC_WASL_DEBUG";

export function isProjectDebugEnabled() {
  return fs.existsSync(DEBUG_MARKER);
}

export function setProjectDebugEnabled(enabled) {
  if (enabled) {
    fs.writeFileSync(DEBUG_MARKER, "enabled\n", "utf8");
  } else if (fs.existsSync(DEBUG_MARKER)) {
    fs.unlinkSync(DEBUG_MARKER);
  }
  updateEnvLocal(enabled);
}

export function updateEnvLocal(enabled) {
  const line = `${DEBUG_KEY}=${enabled ? "1" : "0"}`;
  let contents = "";

  if (fs.existsSync(ENV_LOCAL)) {
    contents = fs.readFileSync(ENV_LOCAL, "utf8");
    const pattern = new RegExp(`^${DEBUG_KEY}=.*$`, "m");
    if (pattern.test(contents)) {
      contents = contents.replace(pattern, line);
    } else {
      contents = `${contents.trimEnd()}\n${line}\n`;
    }
  } else {
    contents = `${line}\n`;
  }

  fs.writeFileSync(ENV_LOCAL, contents, "utf8");
}

export function printDebugStatus() {
  const project = isProjectDebugEnabled();
  let env = "not set";
  if (fs.existsSync(ENV_LOCAL)) {
    const match = fs.readFileSync(ENV_LOCAL, "utf8").match(
      new RegExp(`^${DEBUG_KEY}=(.*)$`, "m"),
    );
    if (match) env = match[1];
  }

  console.log(`Project marker (.wasl-debug): ${project ? "ON" : "off"}`);
  console.log(`${DEBUG_KEY}: ${env}`);
  console.log(
    project ? "\nDebug mode is on (local only)." : "\nDebug mode is off.",
  );
}
