# simple publisher and consumer with rabbitmq

# how to run
- first you need to run this command on terminal
```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management
```
- after that you can install required package in folder backend and backend2 with this command
```
yarn or npm install
```
- to run the app you can run this command
```
yarn dev or npm run dev
```

- after that you can test this simple microservice example with postman 