import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyCRtMLN_Ir_HpztQg8jrp2gx3-kw9YF7dg",
      authDomain: "yatta-log.firebaseapp.com",
      databaseURL: "https://yatta-log.firebaseio.com",
      projectId: "yatta-log",
      storageBucket: "yatta-log.appspot.com",
      messagingSenderId: "795326159128"
    }
  )
}

export default firebase
