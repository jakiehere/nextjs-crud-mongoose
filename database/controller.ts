/** Controller */
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

import Todos from '../models/Todos';

export async function getTodos(req: NextApiRequest, res: NextApiResponse) {
  const { todo } = req.query;
  try {
    if (todo) {
      const todos = await Todos.find({ $text: { $search: `${todo}` } }).sort({updatedAt: -1});
      if (todos.length === 0) {
        return res.status(200).json("No result. Create a new one instead!");
      }
      res.status(200).json(todos);
    } else {
      const todos = await Todos.find({}).sort({updatedAt: -1});
      if (!todos) {
        return res.status(400).json({ error: "Data not found" });
      }
      res.status(200).json(todos);
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function postTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { todo, isCompleted } = req.body;
    if (!todo) {
      return res.status(400).json({ error: "Form data not provide!" });
    }
    await Todos.create({ todo, isCompleted });
    res.status(200).json({ success: true, message: "Created successfully." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { todo, isCompleted } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Form data not provide!" });
    }
    await Todos.findByIdAndUpdate(id, { todo, isCompleted });
    res.status(200).json({ success: true, message: "Updated successfully." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Id not provide!" });
    }
    await Todos.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted successfully." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
