import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  // your Firebase config here
  apiKey: "AIzaSyCID7pPkLB7PN_ktRXAvIYrmOG9mLtrYms",
  authDomain: "multi-vendor-16cf0.firebaseapp.com",
  projectId: "multi-vendor-16cf0",
  storageBucket: "multi-vendor-16cf0.appspot.com",
  messagingSenderId: "234011330640",
  appId: "1:234011330640:web:469b9ac826865779b0e955",
});

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    // Fetch todos from Firebase on component mount
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
    try {
      const todosRef = firebase.firestore().collection("todos");
      await todosRef.add({ task: todo, done: false });
      setTodo("");
      setTodos([...todos, { task: todo, done: false }]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const editTodo = async (id, newTask) => {
    try {
      const todosRef = firebase.firestore().collection("todos");
      await todosRef.doc(id).update({ task: newTask });
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, task: newTask } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todosRef = firebase.firestore().collection("todos");
      await todosRef.doc(id).delete();
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
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
