// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { text } from "node:stream/consumers";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU7BpLleFeMUxTfv99MF1xALRe7zb-eRc",
  authDomain: "zoycebean.firebaseapp.com",
  databaseURL: "https://zoycebean-default-rtdb.firebaseio.com",
  projectId: "zoycebean",
  storageBucket: "zoycebean.firebasestorage.app",
  messagingSenderId: "911572583038",
  appId: "1:911572583038:web:ee1e9f6a2bfd03ec370e2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function writeUserData(userId, name, email, status) {
    const db = getDatabase();
    const reference = ref(db, "users/" + userId);

    set (reference, {
        name: name,
        email: email,
        rsvp_status: status,
    });
}

writeUserData("blah", "asdfasd", "@klkj", "YES!");