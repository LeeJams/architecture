const fs = require('node:fs');

// Use the environment's browser when available, or Playwright's installed one.
const executablePath = process.env.ATLAS_CHROMIUM_EXECUTABLE
  || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);

module.exports = {
  headless: true,
  ...(executablePath ? { executablePath } : {}),
};
