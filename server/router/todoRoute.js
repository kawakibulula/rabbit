import express from "express";
import {
  getTodo,
  deleteTodo,
  createTodo,
} from "../controller/todoController.js";

const router = express.Router();

router.get("/", getTodo);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);

export default router;
