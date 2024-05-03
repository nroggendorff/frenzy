import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import "./App.css";

import SignIn from "./templates/SignIn";
import ChatRoom from "./templates/ChatRoom";
import SignOut from "./templates/SignOut";

const firebaseConfig = {
  apiKey: "AIzaSyDGBVQhDrZa_VeMxiqxb-q83_pc-fIKlQ8",
  authDomain: "frenzy-4081d.firebaseapp.com",
  projectId: "frenzy-4081d",
  storageBucket: "frenzy-4081d.appspot.com",
  messagingSenderId: "210556134756",
  appId: "1:210556134756:web:72c4fdf721dc4128ce0671",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <h1>Frenzy</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
