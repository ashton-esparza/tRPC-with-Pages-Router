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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
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
            await createTodo(newTodoTitle);
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
