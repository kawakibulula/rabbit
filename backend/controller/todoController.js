import prisma from "../utils/prisma";

export const getTodo = async (req, res) => {
  try {
    const response = await prisma.todos.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTodo = async (req, res) => {
  const { name, description } = req.body;
  try {
    const todos = await prisma.todos.create({
      data: {
        name: name,
        description: description,
      },
    });
    res.status(201).json(todos);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTodo = async (req, res) => {
  const description = req.body.description;
  try {
    const updated = await prisma.todos.update({
      where: {
        id: req.params.id,
      },
      data: {
        description: description,
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deleted = await prisma.todos.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
