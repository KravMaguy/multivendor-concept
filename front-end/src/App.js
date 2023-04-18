import { useState } from "react";
const Todos = [
  { task: "do laundry", done: false, id: 1 },
  { task: "clean room", done: true, id: 2 },
];

function App() {
  const [todos, setTodos] = useState([...Todos]);
  const [todo, setTodo] = useState("");
  const addTodo = () => {
    const newTodos = [
      ...todos,
      { task: todo, done: false, id: todos.length + 1 },
    ];
    setTodos(newTodos);
  };
  console.log(todos);
  return (
    <div>
      <input value={todo} onChange={(e) => setTodo(e.target.value)}></input>
      <button onClick={() => addTodo(todo)}>+</button>
      <ul>
        {todos.map((todo) => (
          <li>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
