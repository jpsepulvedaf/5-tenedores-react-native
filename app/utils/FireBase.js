import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDUokSUt_g63OohY33BX3qpXg7jfskwjtE",
  authDomain: "tenedores-1116e.firebaseapp.com",
  databaseURL: "https://tenedores-1116e.firebaseio.com",
  projectId: "tenedores-1116e",
  storageBucket: "tenedores-1116e.appspot.com",
  messagingSenderId: "275742335770",
  appId: "1:275742335770:web:cea558dd8b800fdf8702a3"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
