import { z } from "zod";
import { procedure, router } from "../trpc";

export const appRouter = router({
  getTodos: procedure
    // .input(
    //   z.object({
    //     text: z.string(),
    //   })
    // )
    .query(() => {
      return {
        greeting: `hello friend`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
