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

    const channel1 = "req.create.todo";
    const channel2 = "req.delete.todo";
    app.use(cors());
    app.use(express.json());
    channel.assertExchange(channel1, "fanout", {
      durable: false,
    });
    channel.assertExchange(channel2, "fanout", {
      durable: false,
    });
    channel.assertExchange('todo.created', "fanout", {
      durable: false
    })
    channel.assertExchange('todo.deleted', "fanout", {
      durable: false
    })
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
            try {
              const eventTodo = JSON.parse(msg.content.toString());
              console.log(eventTodo)
              const timeElapsed = Date.now()
              const today = new Date(timeElapsed);
              console.log(typeof eventTodo.createdAt)
              const date = eventTodo.createdAt !== undefined ? new Date(eventTodo.createdAt) : today;
              console.log(today)
              console.log(date.getTime())
              const milis = date.getTime();
              const todo = await prisma.todos.create({
                data: {
                  id: eventTodo.id,
                  name: eventTodo.name,
                  createdAt: milis,
                },
              });
              console.log(todo)
              todo.createdAt = Number(todo.createdAt)
              console.log(todo.createdAt)
              channel.sendToQueue(
                "todo.created",
                Buffer.from(JSON.stringify(todo))
              );
              channel.publish('todo.created', "", Buffer.from(JSON.stringify(todo)))       
            } catch (error) {
              console.log(error);
            }
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
            console.log(eventTodo.id);
            const deleted = await prisma.todos.delete({
              where: {
                id: eventTodo.id,
              },
            });
            console.log(deleted)
            deleted.createdAt = Number(deleted.createdAt)
            channel.sendToQueue(
              "todo.deleted",
              Buffer.from(JSON.stringify(deleted))
            );
            channel.publish("todo.deleted", "", Buffer.from(JSON.stringify(deleted)))
          },
          {
            noAck: true,
          }
        );
      }
    );
    app.get("/todos", async (req, res) => {
      const result = await prisma.todos.findMany();
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

 
