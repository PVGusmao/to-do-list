const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) return response.status(400).json({ error: "Customer not Found!" });

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const newUser = {
    id: uuidv4(),
    name, 
    username, 
    todos: []
  }

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(task);

  return response.status(201).json(task);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;

  const { user } = request;

  const updateTask = user.todos.find((task) => task.id === id);

  updateTask.deadline = deadline;
  updateTask.title = title;

  return response.status(200).send('Atualizado com sucesso.')
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const patchUser = user.todos.find((todos) => todos.id === id);

  patchUser.done = true;

  return response.status(200).send('Atualizado com sucesso.');
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const newTodosList = user.todos.filter((element) => element.id !== id);

  user.todos = newTodosList;

  console.log(newTodosList);

  return response.status(200).send('Deletado com sucesso.')
});

module.exports = app;