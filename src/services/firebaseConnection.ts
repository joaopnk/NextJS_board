import firebase from "firebase/app";
import 'firebase/firestore'; //Serviço que atualmente estamos usando!

let firebaseConfig = {
    apiKey: "AIzaSyBrC2THO_yhv5n1l-a3BmhD9eVCUH6Q2vY",
    authDomain: "boardapp-1e109.firebaseapp.com",
    projectId: "boardapp-1e109",
    storageBucket: "boardapp-1e109.appspot.com",
    messagingSenderId: "339631707583",
    appId: "1:339631707583:web:27de6995d875c5b166bd0a",
    measurementId: "G-W909CG7T7F"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){ //Verificando se já tem uma conexão (caso não tenha, abre uma!)
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;