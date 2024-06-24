const { envs } = require("../src/config/env.js");
const { startServer } = require("../src/server/server.js");

const main = () => {
  startServer({
    port: process.PORT,
    public_path:  process.env.VERCEL_URL
   // public_path: envs.PUBLIC_PATH,
  
  });
};

(async () => {
  main();
})();
