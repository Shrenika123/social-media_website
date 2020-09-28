// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCT_LSh8RXK4R3-sHAUlgAjjykJllgLPrk",
    authDomain: "instagram-clone-72ba9.firebaseapp.com",
    databaseURL: "https://instagram-clone-72ba9.firebaseio.com",
    projectId: "instagram-clone-72ba9",
    storageBucket: "instagram-clone-72ba9.appspot.com",
    messagingSenderId: "881528783528",
    appId: "1:881528783528:web:6179d8baa08222f4aa789d",
    measurementId: "G-1SJP8TXNHR"
  });

  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  const storage=firebase.storage()

  export {db,auth,storage}