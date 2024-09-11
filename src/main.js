import './config/init';
import { createServer } from './server/main';
import mongoose from 'mongoose';
import * as http from "node:http"
import express from "express"
import initApi from "./api"
import initAdminApi from "./server/admin_api"
import errorMiddleware from "./server/middleware/error"
import Config from "@/config"
import _404Middleware from "./server/middleware/404"
import cors from "./server/middleware/cors"
import { JSONMiddleware } from "./server/middleware/JSON"
import { stripeWebhook } from "./server/middleware/stripe_webhook"
import { staticFileMiddleware } from "./server/middleware/staticFile"
import { parseJsonMiddleware } from "./server/middleware/parseJson"
import { initSocket } from "./server/websocket/sockets"
import { securityHeader } from "./server/middleware/securityHeader"
process.on('uncaughtException', (err) => {
  console.log(err);
});

process.on('unhandledRejection', reason => {
  console.log(reason);
});

async function main() {
  await mongoose.connect(Config.MONGODB_URI);
  createServer();
  const app = express()
  const server = http.createServer(app)
  const io = new ServerIo(server, { cors: { origin: "*" } })
  app.set("io", io)
  initSocket(io)
  initMiddleware(app)
  initApi(app)
  initAdminApi(app)
  app.use(() => {
    throw new RequestError('Not Found!', HttpStatus.NotFound);
  }); 
  errorMiddleware(app)
  app.listen(Config.PORT, () => {
    console.log(`listening on ${Config.PORT}`)
  })
}
function initMiddleware(app) {
  securityHeader(app)
  stripeWebhook(app)
  cors(app)
  staticFileMiddleware(app)
  app.use(express.json());
  JSONMiddleware(app)
}

main();
