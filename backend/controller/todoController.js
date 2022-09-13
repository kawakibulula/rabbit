import prisma from "../utils/prisma.js";
import { getConnection } from "../utils/rabbitmq.js";
export const getTodo = async (req, res) => {
  try {
    const response = await prisma.todos.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTodo = async (req, res) => {
  console.log(req.body);
  const data = await req.body;
  const con = await getConnection();
  const channel = await con.createChannel();
  console.log(data);
  try {
    const todos = await prisma.todos.create({
      data: data,
    });
    let exchange = "req.create.todo"
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })
    channel.publish(exchange, '', Buffer.from(JSON.stringify(todos)))
    res.status(201).json(todos);
    setTimeout(() => {
      console.log('stop')
      con.close();
    }, 500);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const con = await getConnection();
  const channel = await con.createChannel();
  try {
    const deleted = await prisma.todos.delete({
      where: {
        id: req.params.id,
      },
    });
    let exchange = "req.delete.todo"
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })
    channel.publish(exchange, '', Buffer.from(JSON.stringify(deleted)))
    res.status(200).json(deleted);
    setTimeout(() => {
      con.close();
    }, 500);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
