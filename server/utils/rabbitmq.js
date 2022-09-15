import * as rabbit from "amqplib";

const user = process.env.USER || "guest";
const password = process.env.PASSWORD || "guest";
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 5673;

//function to connect on rabbitmq
export const getConnection = async () => {
  try {
    const connection = await rabbit.connect(`amqp://${user}:${password}@${host}:${port}`);
    return connection
  } catch (error) {
    console.error(error);
  }
};
