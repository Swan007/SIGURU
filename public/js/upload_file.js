// Create a root reference
const storageRef = firebase.storage().ref()
// Get a reference to the database service
const database = firebase.database();

$("#btn-upload").on("click", function(){
    $('#upload-result').hide()
    // Get the file from DOM permohonan.pdf -> "permohonan", "pdf"
    const file = document.getElementById("input-file").files[0]
    const category = $('#input-category').val()

    // Create a reference to 'mountains.jpg'
    var fileRef = storageRef.child(`${category}/${file.name}`)
    let uploadTask = fileRef.put(file)
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        }, function(error) {
            console.log(error)
        }, function() {
            // Upload completed successfully, now we can get the download URL
            alert('Upload berhasil')
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                const dataRef = database.ref(`file_administrasi/${category}`).child(`${file.name.split('.')[0]}`)
                dataRef.set({
                    fileName: file.name,
                    url: downloadURL,
                    category: category
                })

                $('#file-result-link').attr('href', downloadURL)
                $('#upload-result').show()
            })
        }
    )
})

//listen to key jenis_dokumen
firebase.database().ref('kategori_dokumen').on('value', (snapshot) => {
    const category = Object.keys(snapshot.val())
    let htmlString = ``
  
    category.map((item) => {
      htmlString += `<option value="${item}">${item}</option>`
    })
  
    $('#input-category').html(htmlString)
})