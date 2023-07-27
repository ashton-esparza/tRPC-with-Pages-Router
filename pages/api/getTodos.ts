// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Todo = {
  id: string;
  title: string;
};

type Data = {
  todos: Todo[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = new MongoClient(process.env.DB_URI!);

  try {
    await client.connect();

    const db = client.db("demo");

    const todosCollection = db.collection("todos");

    const fetchedTodos = await todosCollection.find().toArray();

    res.status(200).json({
      todos: fetchedTodos as unknown as Todo[],
    });
  } catch (error) {
    res.status(405).json({ todos: [] });
  }
}
