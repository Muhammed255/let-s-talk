import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
// import { Server } from "socket.io";
// mongo connection
import "./config/mongo.js";
// socket configuration
// import WebSockets from "./utils/WebSockets.js";
// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";
// middlewares
import { decode } from "./middlewares/jwt.js";
import socketIo from "./utils/socket-io.js";

const app = express();

/** Get port from environment and store in Express. */
const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors([{origin: 'https://we-call-text.herokuapp.com'}]))


// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   next();
// });

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", decode, deleteRouter);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

/** Create HTTP server. */
//const server = http.createServer(app);
const server = app.listen(port)

const io = socketIo.init(server);
io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("Client connected!");
})

// const socket = new Server(server
//   , {cors: {
//   origin: 'http://localhost:4200',
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['content-type']
// }}
// )

/** Create socket connection */
// global.io = socket.listen(server);
// global.io.on("connection", WebSockets.connection);
/** Listen on provided port, on all network interfaces. */
/** Event listener for HTTP server "listening" event. */
//server.listen(port)
//server.on("listening", () => {
  //console.log(`Listening on port:: http://localhost:${port}/`);
//});

