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
    const { id, todoTitle } = req.body;
    // Here, you can process the todo item as needed (e.g., store it in a database, etc.)
    console.log("Received todo:", todoTitle);
    console.log("id:", id);

    const client = new MongoClient(process.env.DB_URI!);

    try {
      await client.connect();

      console.log("CONNECTED TO DB!");

      const db = client.db("demo");

      const todosCollection = db.collection("todos");

      await todosCollection.findOneAndReplace(
        { id: id },
        { id: id, title: todoTitle },
        { upsert: true, returnDocument: "after" }
      );
    } catch (error) {
      console.log("FAILED TO CONNECT TO DB!");

      res.status(405).json({ message: String(error) });
    }

    res.status(200).json({ message: "Todo item submitted successfully!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
