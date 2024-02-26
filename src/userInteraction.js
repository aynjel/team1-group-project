import Notiflix from 'notiflix';
Notiflix.Notify.init({ position: 'center-top' });
import {
  auth,
  db,
  dbref,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  set,
  ref,
  get,
} from './firebase.js';

var authModal = document.getElementById('loginModal');
var loginModal = document.getElementById('SignInForm');
var registerModal = document.getElementById('RegistrationForm');

var tabAuth = document.getElementById('tab-auth');
var tabLibrary = document.getElementById('tab-library');

const RegisterUser = (
  inputEmail,
  inputPassword,
  inputFirstName,
  inputLastName
) => {
  return createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
    .then(credentials => {
      console.log(credentials);
      Notiflix.Notify.success('Registration Sucessfull');
      loginModal.style.display = 'flex';
      registerModal.style.display = 'none';
      return set(ref(db, 'UserAuthList/' + credentials.user.uid), {
        userId: credentials.user.uid,
        firstname: inputFirstName,
        lastname: inputLastName,
      });
    })
    .catch(error => {
      throw error;
    });
};

const SignInUser = (inputEmail, inputPassword) => {
  return signInWithEmailAndPassword(auth, inputEmail, inputPassword)
    .then(credentials => {
      const userId = credentials.user.uid;
      const userRef = ref(db, 'UserAuthList/' + userId);
      Notiflix.Notify.success('You’ve successfully logged in');
      authModal.style.display = 'none';
      tabAuth.style.display = 'none';
      tabLibrary.style.display = 'block';
      return get(userRef).then(snapshot => {
        if (snapshot.exists()) {
          const userData = {
            MovieIDToWatched: snapshot.val().MovieIDToWatched,
            MovieIDToQueue: snapshot.val().MovieIDToQueue,
          };

          console.log('User Data:', userData);
          sessionStorage.setItem('user-info', JSON.stringify(userData));
          sessionStorage.setItem(
            'user-credentials',
            JSON.stringify(credentials.user)
          );
        }
      });
    })
    .catch(error => {
      throw error;
    });
};

const addToWatch = () => {
  const movieId = addToWatchedBtn.dataset.movieId;
  const userCredentials = sessionStorage.getItem('user-credentials');

  if (!userCredentials) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  const user = auth.currentUser;
  if (!user) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  const userId = user.uid;
  const userWatchListRef = ref(
    db,
    'UserAuthList/' + userId + '/MovieIDToWatched'
  );

  return get(userWatchListRef)
    .then(snapshot => {
      const updatedList = snapshot.exists() ? snapshot.val() : [];

      if (!updatedList.includes(movieId)) {
        updatedList.push(movieId);
        Notiflix.Notify.success('Movie Added to your Watchlist');
      } else {
        Notiflix.Notify.info('Movie is already in the watched list');
        return Promise.resolve('Movie is already in the watched list');
      }

      return set(userWatchListRef, updatedList).then(() => {
        const userInfo = {
          MovieIDToWatched: updatedList,
        };
        sessionStorage.setItem('user-info', JSON.stringify(userInfo));
      });
    })
    .catch(error => {
      Notiflix.Notify.error('Error adding movie to watched list:', error);
      throw error;
    });
};

const addToQueue = () => {
  const movieId = addToQueueBtn.dataset.movieId;
  const userCredentials = sessionStorage.getItem('user-credentials');

  if (!userCredentials) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }
  const user = auth.currentUser;
  if (!user) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  const userId = user.uid;
  const userQueueRef = ref(db, 'UserAuthList/' + userId + '/MovieIDToQueue');

  return get(userQueueRef)
    .then(snapshot => {
      const updatedQueue = snapshot.exists() ? snapshot.val() : [];

      if (!updatedQueue.includes(movieId)) {
        updatedQueue.push(movieId);
        Notiflix.Notify.success('Movie Added to your Queue');
      } else {
        Notiflix.Notify.info('Movie is already in the queue');
        return Promise.resolve('Movie is already in the queue');
      }

      return set(userQueueRef, updatedQueue).then(() => {
        const userInfo = {
          MovieIDToQueue: updatedQueue,
        };
        sessionStorage.setItem('user-info', JSON.stringify(userInfo));
      });
    })
    .catch(error => {
      console.error('Error adding movie to queue:', error);
      throw error;
    });
};

const updateUserInfoFromFirebase = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(db, 'UserAuthList/' + userId);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = {
              MovieIDToWatched: snapshot.val().MovieIDToWatched,
              MovieIDToQueue: snapshot.val().MovieIDToQueue,
            };

            console.log('User Data:', userData);

            sessionStorage.setItem('user-info', JSON.stringify(userData));
          }
          resolve();
        } catch (error) {
          console.error('Error updating user info from Firebase:', error);
          reject(error);
        } finally {
          unsubscribe();
        }
      } else {
        console.error('User not authenticated');
        reject('User not authenticated');
        unsubscribe();
      }
    });
  });
};

export {
  RegisterUser,
  SignInUser,
  addToWatch,
  addToQueue,
  updateUserInfoFromFirebase,
};
