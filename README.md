# simple publisher and consumer with rabbitmq

# how to run
- first you need to install mysql database and run this command on terminal
```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management
```
- after that you can install required package in each folder with this command
```
yarn or npm install
```
- after that you can run this command to make the sql database and table
```
npx prisma migrate dev
```
- before running the app you can make the env file with your config, Okay now you run this app with this command
```
yarn dev or npm run dev
```

- after that you can test this simple microservice example with postman or you can change the connect function in index.js inside server folder eg:

```js
const connect = async () => {
  const con = await getConnection();
  const channel = await con.createChannel();
  channel.assertExchange(channel1, "fanout", {
    durable: false,
  });
  channel.publish(
    channel1,
    "",
    Buffer.from(
      JSON.stringify({
        name: "tidur",
      })
    )
  );
  setTimeout(() => {
    console.log("stop");
    con.close();
  }, 500);
};

connect()
```

# thankyou