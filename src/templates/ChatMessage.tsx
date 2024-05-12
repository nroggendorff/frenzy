import { formatRelative } from "date-fns";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

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

function ChatMessage(props: {
  message: {
    text: string;
    uid: string;
    photoURL: string;
    username: string;
    imageUrl?: string;
    createdAt: firebase.firestore.Timestamp;
  };
}) {
  const { text, uid, photoURL, username, imageUrl, createdAt } = props.message;
  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";

  const formatTimestamp = (timestamp: firebase.firestore.Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)} minutes ago`;
    } else if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)} hours ago`;
    } else if (diffSeconds < 172800) {
      return "Yesterday";
    } else if (diffSeconds < 604800) {
      return formatRelative(date, now);
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`message ${messageClass}`}>
      <table>
        {messageClass !== "sent" && (
          <tr>
            <td></td>
            <td>
              <div
                className="user-info"
                style={{ display: "flex", alignItems: "center" }}
              >
                <p className="username">{username}</p>
                <p
                  className="timestamp"
                  style={{ color: "gray", marginLeft: "5px" }}
                >
                  {formatTimestamp(createdAt)}
                </p>
              </div>
            </td>
          </tr>
        )}
        <tr>
          <td>
            {messageClass !== "sent" && text && !imageUrl && (
              <img className="pfp" src={photoURL} alt={username} />
            )}
          </td>
          <td>{text && <p className="message-content">{text}</p>}</td>
          {messageClass !== "sent" && (
            <td>
              <button className="reply">
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
                  className="feather feather-corner-up-left"
                >
                  <polyline points="9 14 4 9 9 4"></polyline>
                  <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                </svg>
              </button>
            </td>
          )}
        </tr>
        <tr>
          <td>
            {imageUrl && messageClass !== "sent" && (
              <img className="pfp" src={photoURL} alt={username} />
            )}
          </td>
          {imageUrl && (
            <td>
              <img className="uploadedPhoto" src={imageUrl} />
            </td>
          )}
        </tr>
      </table>
    </div>
  );
}

export default ChatMessage;
