import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBjxIduAzOkku6Ch3fXR6R8CUm97XCIArg',
  authDomain: 'teamproject-filmoteka-7bc1a.firebaseapp.com',
  projectId: 'teamproject-filmoteka-7bc1a',
  storageBucket: 'teamproject-filmoteka-7bc1a.appspot.com',
  messagingSenderId: '193917979085',
  appId: '1:193917979085:web:8e6412f7a6519c58559c84',
  measurementId: 'G-GVNJKHKHKS',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const dbref = ref(db);

export {
  auth,
  db,
  dbref,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  set,
  ref,
  get,
};
