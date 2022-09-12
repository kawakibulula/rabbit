import express from "express";
import dotenv from "dotenv";
import * as rabbit from "amqplib/callback_api.js";
import cors from "cors";
import prisma from "./utils/prisma.js";
dotenv.config();
const app = express();

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
    channel.assertQueue("req.create.todo", { durable: false });
    channel.assertQueue("req.delete.todo", { durable: false });
    app.use(cors());
    app.use(express.json());
    channel.consume("req.create.todo", async (msg) => {
      const eventTodo = JSON.parse(msg.content.toString());
      console.log(eventTodo)
      await prisma.created.create({
        data: {
          id: eventTodo.id,
          name: eventTodo.name,
          description: eventTodo.description,
          createdAt: eventTodo.createdAt
        }
      })
    }, {
      noAck: true
    });
    channel.consume("req.delete.todo", async (msg) => {
      const eventTodo = JSON.parse(msg.content.toString());
      console.log(eventTodo)
      // await prisma.deleted.create({
      //   data: {
      //     id: eventTodo.id,
      //     name: eventTodo.name,
      //     description: eventTodo.description,
      //     createdAt: eventTodo.createdAt
      //   }
      // })
      await prisma.created.delete({
        where: {
          id: eventTodo.id
        }
      })
    }, {
      noAck: true
    })
    app.listen(port, () => {
      console.log("server running on", port);
    });
    process.on("beforeExit", () => {
      connection.close();
    });
  });
});
