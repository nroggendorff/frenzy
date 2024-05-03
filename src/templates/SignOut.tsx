import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

import "../App.css";

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

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => signOut(auth)}>
        Sign Out
      </button>
    )
  );
}

export default SignOut;
