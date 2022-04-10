import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes.js";
import globalErrorHandler from "./controllers/errorController.js";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  morgan("dev", {
    skip: (req, res) => req.originalUrl === "/",
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful..."));

const dbCon = mongoose.connection;

dbCon.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", async (req, res) => {
  return res.status(200).send({
    status: "success",
  });
});

app.use("/", routes);

app.use(globalErrorHandler);

app.use((req, res, next) => {
  return res.status(404).send({
    status: "fail",
    errors: "404 not found",
  });
});

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`server listening on ${process.env.PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
