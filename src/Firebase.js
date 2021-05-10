
  import firebase from 'firebase';
  
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCjCoLSqL0b7azXEiSt7lMHFIpB9DVNOHY",
    authDomain: "instagram-clone-react-4980e.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-4980e-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-4980e",
    storageBucket: "instagram-clone-react-4980e.appspot.com",
    messagingSenderId: "909378912897",
    appId: "1:909378912897:web:bf688974a70ad2be38c380",
    measurementId: "G-0EPJ57VKPX"
  })

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export{ db, auth, storage};