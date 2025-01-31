import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandle from "~/middlewares/error-handler";
import logger from "~/lib/logger";
import MAIN_ROUTER from "~/v1/routes/index";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { createServer } from "http";
//import { Server } from "socket.io";
//import { socketHandler } from "~/lib/socket";
import swaggerDocs from "~/utils/swagger";
import prisma from "./lib/db";
import { limiter } from "./middlewares/rate-limiter";

const app = express();

const server = createServer(app);

app.use(cors());

app.use(limiter);

app.use(
  helmet({
    frameguard: { action: "deny" }, // Prevent click jacking
    referrerPolicy: { policy: "no-referrer" }, // Hide referrer information
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, //HSTS header to force the use of HTTPS.
    noSniff: true, //Prevent Sniffing of MIME Types
  }),
);

app.disable("x-powered-by"); //reduce fingerprinting

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", MAIN_ROUTER);

// Error handler middleware
app.use(errorHandle);

// Start the server
server.listen(process.env.PORT_NO, () => {
  logger.info(`Server started on port :${process.env.PORT_NO}`);
  // Swagger docs
  swaggerDocs(app);
  prisma.$connect().then(() => {
    logger.info("Connected to the database successfully!");
  });
});
