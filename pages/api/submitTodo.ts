// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const client = new MongoClient(process.env.DB_URI!);

    try {
      const { id, todoTitle } = req.body;

      await client.connect();

      const db = client.db("demo");

      const todosCollection = db.collection("todos");

      await todosCollection.findOneAndReplace(
        { id: id },
        { id: id, title: todoTitle },
        { upsert: true, returnDocument: "after" }
      );

      res.status(200).json({ message: "Todo item submitted successfully..." });
    } catch (error) {
      res.status(405).json({ message: String(error) });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
