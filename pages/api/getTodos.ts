// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Todos = {
  id: string;
  todoTitle: string;
};

type Data = {
  todos: Todos[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = new MongoClient(process.env.DB_URI!);

  try {
    await client.connect();

    console.log("CONNECTED TO DB!");

    const db = client.db("demo");

    const todosCollection = db.collection("todos");

    const fetchedTodos = await todosCollection.find().toArray();
    console.log("Fetched TODOS:");
    console.log(fetchedTodos);
    res.status(200).json({
      todos: [
        { id: "1", todoTitle: "title 1" },
        { id: "2", todoTitle: "title 2" },
      ],
    });
  } catch (error) {
    console.log("FAILED TO CONNECT TO DB!");

    res.status(405).json({ todos: [] });
  }
}
