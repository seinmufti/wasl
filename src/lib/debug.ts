/** True when debug was enabled at build/dev-server start via `.env.local`. */
export const DEBUG_ENV_ENABLED =
  process.env.NEXT_PUBLIC_WASL_DEBUG === "1" ||
  process.env.NEXT_PUBLIC_WASL_DEBUG === "true";
