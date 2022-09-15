import * as rabbit from "amqplib";

const user = process.env.RABBIT_USER || "guest";
const password = process.env.RABBIT_PASSWORD || "guest";
const host = process.env.RABBIT_HOST || "localhost"
const port = process.env.RABBIT_PORT || 5672;

//function to connect on rabbitmq
export const getConnection = async () => {
  try {
    const connection = await rabbit.connect(`amqp://${user}:${password}@${host}:${port}`);
    return connection
  } catch (error) {
    console.error(error);
  }
};
