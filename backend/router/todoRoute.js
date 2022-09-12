import express from "express";
import {
  getTodo,
  updateTodo,
  deleteTodo,
  createTodo,
} from "../controller/todoController.js";

const router = express.Router();

router.get("/", getTodo);
router.post("/", createTodo);
router.put("/", updateTodo);
router.delete("/deleted/:id", deleteTodo);

export default router;
