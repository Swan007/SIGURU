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

let userData

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userData = user
    $('#user-email').text(user.email)

    getUserData()
    initListener()
  } else {
    alert('Sesi tidak valid')
  }
});

function getUserData() {
  firebase.database().ref('/profil_guru/' + userData.uid).once('value').then(function(snapshot) {
    const storedUserData = snapshot.val()
    if(!storedUserData) {
      return
    }

    $('#input-nama').val(storedUserData.nama)
    $('#input-nip').val(storedUserData.nip)
    $('#input-bidangpelajaran').val(storedUserData.bidangpelajaran)
  });
}

function initListener() {
  $('#submit-profile').click((e) => {
    const dataUser = {
      nama: $('#input-nama').val(),
      nip: $('#input-nip').val(),
      jabatan: 'Guru',
      bidangpelajaran: $('#input-bidangpelajaran').val()      
    }

    const dataRef = firebase.database().ref('profil_guru').child(userData.uid)
    dataRef.set(dataUser)
    alert('Profil berhasil diperbaharui')
  })

  $('#submit-password').click((e) => {
    const password = $('#input-passwordbaru').val()
    const konfirmasiPassword = $('#input-konfirmasipassword').val()
    const passwordLama = $('#input-passwordlama').val()
    
    if(password != konfirmasiPassword) {
      return alert('Konfirmasi password tidak sesuai')
    }

    var user = firebase.auth().currentUser
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email, 
      passwordLama
    )

    user.reauthenticateWithCredential(credential).then(function() {
      // User re-authenticated.
      return user.updatePassword(password)
    }).then(function() {
      $('#input-passwordbaru').val('')
      $('#input-konfirmasipassword').val('') 
      $('#input-passwordlama').val('')
      alert('Password berhasil diperbaharui')
    }).catch(function(error) {
      console.error(error)
      alert('Gagal memperbaharui password')
    });
  })
}