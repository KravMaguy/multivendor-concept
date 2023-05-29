import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const { REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_PROJID } = process.env;
firebase.initializeApp({
  // Your Firebase project configuration here
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: "multi-vendor-16cf0.firebaseapp.com",
  projectId: "multi-vendor-16cf0",
  storageBucket: "multi-vendor-16cf0.appspot.com",
  messagingSenderId: "234011330640",
  appId: REACT_APP_FIREBASE_PROJID,
});

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    // Listen for user authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Fetch user's todos from Firestore on user authentication
    const fetchTodos = async () => {
      if (!user) return;
      try {
        const todosRef = firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .collection("todos");
        const snapshot = await todosRef.get();
        const todosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setTodos([]);
      setTodo("");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addTodo = async () => {
    if (!todo) return;
    try {
      const todosRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("todos");
      await todosRef.add({ task: todo, done: false });
      setTodo("");
      setTodos([...todos, { task: todo, done: false }]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const editTodo = async (id, newTask) => {
    const { task } = newTask;
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task } : todo
    );
    setTodos(updatedTodos);
    // try {
    //   const todosRef = firebase
    //     .firestore()
    //     .collection("users")
    //     .doc(user.uid)
    //     .collection("todos");
    //   await todosRef.doc(id).update({ task: newTask });
    //   const updatedTodos = todos.map((todo) =>
    //     todo.id === id ? { ...todo, task: newTask } : todo
    //   );
    //   setTodos(updatedTodos);
    // } catch (error) {
    //   console.error("Error editing todo:", error);
    // }
  };

  const deleteTodo = async (id) => {
    try {
      const todosRef = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("todos");
      await todosRef.doc(id).delete();
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (!user) {
    return (
      <div>
        <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {user.displayName}!</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <h2>Todos</h2>
      <ul>
        {todos.map((todo) => {
          console.log(todo);
          return (
            <li key={todo.id}>
              {/* <input
                type='checkbox'
                checked={todo.done}
                onChange={(e) => {
                  const done = e.target.checked;
                  editTodo(todo.id, { ...todo, done });
                }}
              /> */}
              <input
                type='text'
                value={todo.task}
                onChange={(e) => {
                  const task = e.target.value;
                  editTodo(todo.id, { ...todo, task });
                }}
              />
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
      <div>
        <input
          type='text'
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={() => addTodo()}>Add</button>
      </div>
    </div>
  );
}

export default App;
