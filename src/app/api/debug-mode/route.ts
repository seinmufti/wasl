import fs from "node:fs";
import path from "node:path";

const DEBUG_MARKER = path.join(process.cwd(), ".wasl-debug");
const ENV_LOCAL = path.join(process.cwd(), ".env.local");
const DEBUG_KEY = "NEXT_PUBLIC_WASL_DEBUG";

function isProjectDebugEnabled() {
  return fs.existsSync(DEBUG_MARKER);
}

function setProjectDebugEnabled(enabled: boolean) {
  if (enabled) {
    fs.writeFileSync(DEBUG_MARKER, "enabled\n", "utf8");
  } else if (fs.existsSync(DEBUG_MARKER)) {
    fs.unlinkSync(DEBUG_MARKER);
  }

  const line = `${DEBUG_KEY}=${enabled ? "1" : "0"}`;
  let contents = "";

  if (fs.existsSync(ENV_LOCAL)) {
    contents = fs.readFileSync(ENV_LOCAL, "utf8");
    const pattern = new RegExp(`^${DEBUG_KEY}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.trimEnd()}\n${line}\n`;
  } else {
    contents = `${line}\n`;
  }

  fs.writeFileSync(ENV_LOCAL, contents, "utf8");
}

export async function GET() {
  return Response.json({ projectDebug: isProjectDebugEnabled() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { enabled?: boolean };
  setProjectDebugEnabled(Boolean(body.enabled));
  return Response.json({ projectDebug: isProjectDebugEnabled() });
}
