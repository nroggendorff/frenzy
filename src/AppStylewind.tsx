import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  QueryConstraint,
  Query,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";

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
const firestore = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Frenzy</h1>
        {user && <SignOut />}
      </header>
      <main className="flex-grow overflow-y-auto">
        {user ? <ChatRoom /> : <SignIn />}
      </main>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signInAnon = () => {
    signInAnonymously(auth);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md flex items-center mb-4"
        onClick={signInWithGoogle}
      >
        <svg className="w-5 h-5 mr-2">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Continue with Google
      </button>
      <button
        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        onClick={signInAnon}
      >
        <svg className="w-5 h-5 mr-2">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        Continue Anonymously
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => signOut(auth)}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef<HTMLDivElement>(null);
  const messagesRef = collection(firestore, "messages");

  const queryConstraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    limit(50),
  ];
  const q = query(messagesRef, ...queryConstraints) as Query<{
    id: string;
    text: string;
    createdAt: firebase.firestore.Timestamp;
    uid: string;
    username: string;
    photoURL: string;
    imageUrl: string;
  }>;

  const [messages] = useCollectionData<{
    id: string;
    text: string;
    createdAt: firebase.firestore.Timestamp;
    uid: string;
    username: string;
    photoURL: string;
    imageUrl?: string;
  }>(q);

  const [formValue, setFormValue] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser!;

    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `messages/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: uid,
        photoURL: photoURL,
        username: displayName,
        imageUrl: imageUrl,
      });
    } else {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: uid,
        photoURL: photoURL,
        username: displayName,
      });
    }

    setFormValue("");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  return (
    <>
      <main>
        {messages?.reverse().map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <label className="uploadFile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-upload"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </label>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Message"
        />
        <button type="submit" disabled={!formValue}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-send"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </>
  );
}

function ChatMessage({ message }) {
  const { text, uid, photoURL, username, imageUrl } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div
      className={`flex ${
        messageClass === "sent" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-xs rounded-lg p-4 ${
          messageClass === "sent"
            ? "bg-blue-500 text-white"
            : "bg-gray-700 text-white"
        }`}
      >
        {messageClass !== "sent" && (
          <div className="flex items-center mb-2">
            <img
              src={photoURL}
              alt={username}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="font-bold">{username}</span>
          </div>
        )}
        <p>{text}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="mt-2 max-w-full rounded-md"
          />
        )}
      </div>
    </div>
  );
}

export default App;
