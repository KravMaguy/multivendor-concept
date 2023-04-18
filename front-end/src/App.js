import { useState } from "react";
const todos = [
  { task: "do laundry", done: false, id: 1 },
  { task: "clean room", done: true, id: 2 },
];

function App() {
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
