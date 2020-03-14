import express from "express";
import bodyParser from "body-parser";
import { apiRouter } from "./router/api";

export const app = express();
const port = 80;

app.use(bodyParser.json());
app.use("/api", apiRouter);

// const STATIC_ASSET_DIR = path.join(__dirname, '..', 'static');
// const INDEX_PATH = path.resolve(STATIC_ASSET_DIR, 'index.html');

// app.use(express.static(STATIC_ASSET_DIR));
// app.get('*', (req, res) => res.sendFile(INDEX_PATH));

app.get("/", (_req, res) => res.send("Hello World!"));

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

export async function closeServer() {
  await new Promise(resolve => server.close(resolve)).then();
}
