import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Todos = [
  { task: "do laundry", done: false, id: 1 },
  { task: "clean room", done: true, id: 2 },
];

function App() {
  const [todos, setTodos] = useState([...Todos]);
  const [todo, setTodo] = useState("");
  const addTodo = () => {
    if (!todo) return;
    const newTodos = [...todos, { task: todo, done: false, id: uuidv4() }];
    setTodos(newTodos);
    setTodo("");
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const editTodo = (id, newTask) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, task: newTask };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <div>
      <input value={todo} onChange={(e) => setTodo(e.target.value)}></input>
      <button onClick={() => addTodo(todo)}>+</button>
      <ul>
        {todos.map(({ id, task }) => (
          <div key={id}>
            <li>{task}</li>
            <button onClick={() => editTodo(id, prompt("Edit task:"))}>
              Edit
            </button>
            <button onClick={() => deleteTodo(id)}>X</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
