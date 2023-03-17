import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

import connectMongo from '@/database/connect';

import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from '../../../database/controller';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    connectMongo().catch(() => res.status(405).json({ error: "Connection error" }))

    //type of request
    const { method } = req

    switch (method) {
        case 'GET':
            getTodos(req, res)
            break;
        case 'POST':
            postTodo(req, res)
            break;
        case 'PUT':
            updateTodo(req, res)
            break;
        case 'DELETE':
            deleteTodo(req, res)
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} is not allow!`)
    }
    return res
}