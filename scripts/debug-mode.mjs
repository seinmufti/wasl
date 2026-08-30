import { printDebugStatus, setProjectDebugEnabled } from "./debug-env.mjs";

const command = process.argv[2];

switch (command) {
  case "on":
    setProjectDebugEnabled(true);
    console.log("Debug mode ON");
    console.log("Restart the dev server so NEXT_PUBLIC_WASL_DEBUG reloads.");
    printDebugStatus();
    break;
  case "off":
    setProjectDebugEnabled(false);
    console.log("Debug mode OFF");
    printDebugStatus();
    break;
  case "status":
    printDebugStatus();
    break;
  default:
    console.log("Usage: node scripts/debug-mode.mjs <on|off|status>");
    process.exit(command ? 1 : 0);
}
