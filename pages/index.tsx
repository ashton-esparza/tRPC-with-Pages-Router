import Head from "next/head";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Todo = {
  id: string;
  title: string;
};

type Data = {
  todos: Todo[];
};

//query
const getTodos = async () => {
  const res = await fetch("/api/getTodos");
  if (!res.ok) {
    throw new Error("Returned todos invalid...");
  }

  const data: Data = await res.json();

  return data;
};

export default function Home() {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  //onSubmit handler
  const createTodo = async () => {
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
      const data = await response.json();
      console.log(data.message);
      setNewTodoTitle("");
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  };

  return (
    <>
      <Head>
        <title>TanStack Query Demo</title>
      </Head>

      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createTodo();
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
        </form>
      </div>

      {isLoading ? (
        <p>Loading todos...</p>
      ) : isError ? (
        <p>Error...</p>
      ) : (
        data.todos.map((todo) => <p key={todo.id}>{todo.title}</p>)
      )}
    </>
  );
}
