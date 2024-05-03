import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
import { useCollectionData } from "react-firebase-hooks/firestore";

import "../App.css";

import ChatMessage from "./ChatMessage";

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

function ChatRoom() {
  const [isTyping, setIsTyping] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

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
    setIsTyping(false);
    setIsFileSelected(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsFileSelected(true);
    }
  };

  const sendIcon = () => (
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
  );

  return (
    <>
      <main>
        {messages?.reverse().map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        {isTyping && (
          <label className="uploadFile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-chevron-right"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <button
              onClick={() => setIsTyping(!isTyping)}
              style={{ display: "none" }}
            />
          </label>
        )}
        {!isTyping && (
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
        )}
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          placeholder="Message"
        />
        {isTyping ? (
          <button type="submit" disabled={!formValue}>
            {sendIcon()}
          </button>
        ) : (
          isFileSelected && <button type="submit">{sendIcon()}</button>
        )}
      </form>
    </>
  );
}

export default ChatRoom;
