import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as rabbit from "amqplib/callback_api.js";
import dotenv from "dotenv";
import prisma from "./utils/prisma.js";
import bodyParser from "body-parser";
//import todoRoute from "./router/todoRoute.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3030;
const server = process.env.SERVER || "amqp://localhost";

rabbit.connect(server, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const app = express();
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(helmet());

    app.get("/todos", async (req, res) => {
      try {
        const response = await prisma.todos.findMany();
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    });
    app.post("/todos", async (req, res) => {
      console.log(req.body);
      const data = await req.body;
      console.log(data);
      try {
        const todos = await prisma.todos.create({
          data: data,
        });
        channel.sendToQueue(
          "req.create.todo",
          Buffer.from(JSON.stringify(todos))
        );
        res.status(201).json(todos);
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    });
    app.put("/todos", async (req, res) => {
      const description = req.body.description;
      try {
        const updated = await prisma.todos.update({
          where: {
            id: req.params.id,
          },
          data: {
            description: description,
          },
        });
        res.status(200).json(updated);
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    });
    app.delete("/deleted/:id", async (req, res) => {
      try {
        const deleted = await prisma.todos.delete({
          where: {
            id: req.params.id
          },
        });
        channel.sendToQueue(
          "req.delete.todo",
          Buffer.from(JSON.stringify(deleted))
        );
        console.log(req.params.id, 'the id')
        res.status(200).json(deleted);
      } catch (error) {
        res.status(400).json({ msg: error.message });
      }
    });
    // app.use(todoRoute);
    // app.get("/hello", (req, res) => {
    //   res.send(200).json({
    //     message: "Hello world",
    //   });
    // });
    // app.use("/example", (req, res) => {
    //   res.send(
    //     `
    //         <div><h1>Hello</h1></div>
    //     `
    //   );
    // });

    app.listen(port, () => {
      console.log("server running on", port);
    });
    process.on("beforeExit", () => {
      connection.close();
    });
  });
});
