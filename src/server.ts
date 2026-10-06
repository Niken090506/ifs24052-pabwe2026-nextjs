import { createServer } from "node:http";
import next from "next";

const mode = process.argv[2] === "start" ? "start" : "dev";
const dev = mode === "dev";
const hostname = "localhost";
const port = Number(process.env.APP_PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Server berjalan (${mode}) di http://${hostname}:${port}`);
  });
});
