import firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/storage";

//dev
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCoyhHArm6O4v6w1rXOVY-WdxouzpNWccw",
  authDomain: "development-30737.firebaseapp.com",
  databaseURL: "https://development-30737.firebaseio.com",
  projectId: "development-30737",
  storageBucket: "development-30737.appspot.com",
  messagingSenderId: "109583410171"
});
//

export default {
  db: firebaseApp.firestore(),
  storage: firebaseApp.storage(),
  storageState: firebase.storage.TaskState,
}

