import { z } from "zod";
import { procedure, router } from "../trpc";
import { MongoClient } from "mongodb";

type Todo = {
  id: string;
  title: string;
};

export const appRouter = router({
  getTodos: procedure
    // .input(
    //   z.object({
    //     text: z.string(),
    //   })
    // )
    .query(async () => {
      const client = new MongoClient(process.env.DB_URI!);

      try {
        await client.connect();

        const db = client.db("demo");

        const todosCollection = db.collection("todos");

        const fetchedTodos = await todosCollection.find().toArray();

        return {
          todos: fetchedTodos as unknown as Todo[],
        };
      } catch (error) {
        return { todos: [] };
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
