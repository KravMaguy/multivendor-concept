import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  // your Firebase config here
});

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const todosRef = firebase.firestore().collection("todos");
      const snapshot = await todosRef.get();
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!todo) return;
    const todosRef = firebase.firestore().collection("todos");
    await todosRef.add({ task: todo, done: false });
    setTodo("");
  };

  const editTodo = async (id, newTask) => {
    const todosRef = firebase.firestore().collection("todos");
    await todosRef.doc(id).update({ task: newTask });
  };

  const deleteTodo = async (id) => {
    const todosRef = firebase.firestore().collection("todos");
    await todosRef.doc(id).delete();
  };

  return (
    <div>
      <input value={todo} onChange={(e) => setTodo(e.target.value)}></input>
      <button onClick={() => addTodo()}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.task}
            <button
              onClick={() => editTodo(todo.id, prompt("Enter new task:"))}
            >
              Edit
            </button>
            <button onClick={() => deleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
