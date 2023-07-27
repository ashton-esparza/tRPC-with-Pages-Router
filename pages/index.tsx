import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Todo = {
  id: string;
  title: string;
};

type Data = {
  todos: Todo[];
};

//query todos
const getTodos = async () => {
  const res = await fetch("/api/getTodos");
  if (!res.ok) {
    throw new Error("Returned todos invalid...");
  }

  const data: Data = await res.json();

  return data;
};

//create todo
const createTodo = async (newTodoTitle: String) => {
  try {
    const response = await fetch("api/submitTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: new Date().toString(),
        todoTitle: newTodoTitle,
      }),
    });
    console.log((await response.json()).message);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
};

export default function Home() {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: (newTodo: string) => {
      return createTodo(newTodo);
    },
    onSuccess: () => {
      console.log("mutation was successful....");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <>
      <Head>
        <title>TanStack Query Demo</title>
      </Head>

      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            mutation.mutate(newTodoTitle);
            setNewTodoTitle("");
          }}
        >
          <label>New Todo</label>
          <input
            value={newTodoTitle}
            onChange={(e) => {
              setNewTodoTitle(e.target.value);
            }}
          ></input>
          <button>Create Todo</button>
          {mutation.isLoading && <p>Creating todo...</p>}
          {mutation.isSuccess && <p>Todo Created...</p>}
        </form>
      </div>

      <div>
        {isLoading ? (
          <p>Loading todos...</p>
        ) : isError ? (
          <p>Error...</p>
        ) : (
          data.todos.map((todo) => <p key={todo.id}>{todo.title}</p>)
        )}
      </div>
    </>
  );
}

// Steps
// 1: Wrap app with QueryClientProvider
// 2: Wire up useQuery
// 3: Create JSX to display todos
// 4: Create mutation
// 5: Call mutation
// 6: Show JSX examples and callback from mutation state
// 7: Create query client with useQueryClient
// 8: Invalidate todos query
