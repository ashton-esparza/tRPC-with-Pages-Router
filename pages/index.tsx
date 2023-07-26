import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

const todos = [
  { id: "1", title: "Create DEMO Code" },
  { id: "2", title: "Create Script" },
  { id: "3", title: "Record" },
];

export default function Home() {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("api/hello");
      const data = await response.json();
      console.log(data);
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
            await fetchData();
            console.log(`Todo is submitted`);
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

      <div>
        {todos.map((todo) => {
          return <p key={todo.id}>{todo.title}</p>;
        })}
      </div>
    </>
  );
}
