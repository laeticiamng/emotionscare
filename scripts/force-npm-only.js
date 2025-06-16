#!/usr/bin/env node
if (process.env.npm_config_user_agent?.includes("bun")) {
  console.error("\x1b[31m✖ This project requires npm – bun install is disabled.\x1b[0m");
  process.exit(1);
}
