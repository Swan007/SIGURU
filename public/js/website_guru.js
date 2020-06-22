
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyC5UizZtX5FLKKrGvtwHYetCquZ0gne330",
    authDomain: "database-file-administrasi.firebaseapp.com",
    databaseURL: "https://database-file-administrasi.firebaseio.com",
    projectId: "database-file-administrasi",
    storageBucket: "database-file-administrasi.appspot.com",
    messagingSenderId: "900232079725",
    appId: "1:900232079725:web:4b9d9289339c6bd1f19264",
    measurementId: "G-GE24DSBJZV"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



const auth = firebase.auth();

function signUp(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");
        
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.then(() => {
      return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
    }).then(function(idToken) {
      console.log(idToken);
      window.location.href = `/validate-token/${idToken}`
    }).catch(e => alert(e.message));

    alert("Signed Up");
}

$( "#btn-signUp" ).click(function() {
  signUp()
});


function signIn(){
  
    var email = document.getElementById("email");
    var password = document.getElementById("password");
        
    const promise = firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
      return auth.signInWithEmailAndPassword(email.value, password.value);
    })

    promise.then(() => {
      return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
    }).then(function(idToken) {
      window.location.href = `/validate-token/${idToken}`
    }).catch(e => alert(e.message));
}

$( "#btn-signIn" ).click(function() {
  signIn()
});

function signOut(){

    auth.signOut();
    alert("Berhasil Keluar dari Sesi");
}

auth.onAuthStateChanged(function(user){
  if(user){
    var email = user.email;
    // alert("Active User " + email);
    // Berhasil Sign In
  }else{
    alert("Tidak Ada Pengguna Aktif");
    // Tidak berhasil Sign In
  }

});