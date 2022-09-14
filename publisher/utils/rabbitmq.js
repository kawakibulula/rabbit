import * as rabbit from "amqplib";

const server = process.env.SERVER || "amqp://localhost";

//function to connect on rabbitmq
export const getConnection = async () => {
  try {
    const connection = await rabbit.connect(server);
    return connection
  } catch (error) {
    console.error(error);
  }
};
