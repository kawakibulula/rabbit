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
    
    let channel1 = "req.create.todo";
    let channel2 = "req.delete.todo";
    app.use(cors());
    app.use(express.json());
    channel.assertExchange(channel1, "fanout", {
      durable: false,
    });
    channel.assertExchange(channel2, "fanout", {
      durable: false,
    });
    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );
        channel.bindQueue(q.queue, channel1, "");

        channel.consume(
          q.queue,
          async (msg) => {
            const eventTodo = JSON.parse(msg.content.toString());
            console.log(eventTodo);
            const todo = await prisma.created.create({
              data: {
                id: eventTodo.id,
                name: eventTodo.name,
                description: eventTodo.description,
                createdAt: eventTodo.createdAt,
              },
            });
            channel.sendToQueue(
              "todo.created",
              Buffer.from(JSON.stringify(todo))
            );
          },
          {
            noAck: true,
          }
        );
      }
    );
    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );
        channel.bindQueue(q.queue, channel2, "");

        channel.consume(
          q.queue,
          async (msg) => {
            const eventTodo = JSON.parse(msg.content.toString());
            await prisma.created.delete({
              where: {
                id: eventTodo.id
              },
            });
          },
          {
            noAck: true,
          }
        );
      }
    );
    app.get("/todos", async (req, res) => {
      const result = await prisma.created.findMany();
      res.status(200).json(result);
    });
    app.listen(port, () => {
      console.log("server running on", port);
    });
    process.on("beforeExit", () => {
      connection.close();
    });
  });
});
