- create db todo "todos" {id uuid, name string createdAt, updatedAt}
- GET /todos route to get all into todo database
- Consume event req.create.todo save into todo database
- Consume event req.delete.todo delete into todo database
- AFter todo craeted and deleted, publish event todo.created or todo.deleted with payload {id, name, created} (edited)
[6:51 PM]
We will send message on queue with on channel req.create.todo 5 times, and send message on req.delete.todo 2 times. and than our server will read todo.created for create data in our server and todo.deleted for delete data in our server. last thing we request http directly on your backend to get all todo data. if the data its same size compare our server task will be correct.

Don't forget to create .env for rabbitmq client host,port,user,password. So we can easy change it later.

'amqp://guest:guest@localhost:5672'. If the URI is omitted entirely, it will default to 'amqp://localhost'

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.10-management
yarn add @cloudamqp/amqp-client
[12:32 AM]
