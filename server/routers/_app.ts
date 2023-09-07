import { z } from "zod";
import { procedure, router } from "../trpc";
import { MongoClient } from "mongodb";
import { TRPCError } from "@trpc/server";

type Todo = {
  id: string;
  title: string;
};

export const appRouter = router({
  getTodos: procedure.query(async () => {
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
  submitTodo: procedure
    .input(z.object({ todoTitle: z.string() }))
    .mutation(async ({ input }) => {
      const client = new MongoClient(process.env.DB_URI!);

      try {
        await client.connect();

        const db = client.db("demo");

        const todosCollection = db.collection("todos");

        const id: string = new Date().toString();

        await todosCollection.findOneAndReplace(
          { id: id },
          { id: id, title: input.todoTitle },
          { upsert: true, returnDocument: "after" }
        );
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
