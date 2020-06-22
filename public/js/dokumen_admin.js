$(document).keypress(
  function(event){
    if (event.which == '13') {
      event.preventDefault();
    }
});

$('#section-jenis-dokumen').hide()

$('#btn-open-add-jenis-dokumen').click((e) => {
  $('#section-jenis-dokumen').show()
})

$('#submit-jenis').click((e) => {
  firebase.database().ref('kategori_dokumen').child($('#input-jenis').val()).set($('#input-jenis').val())
  $('#input-jenis').val('')
  alert("Berhasil Menambahkan Kategori Dokumen/Berkas")
})

//listen to key jenis_dokumen
firebase.database().ref('kategori_dokumen').on('value', (snapshot) => {
  const category = Object.keys(snapshot.val())
  let htmlString = ``

  category.map((item) => {
    htmlString += `<option value="${item}">${item}</option>`
  })

  $('#input-category').html(htmlString)
  getListDocument()
})

$('#input-category').change((e) => {
  getListDocument()
})

let currentDocuments = []

function getListDocument() {
  currentDocuments = []
  renderListDokumen(currentDocuments)
  const currentCategory = $('#input-category').val()
  firebase.database().ref('file_administrasi').child(currentCategory).once('value', (snapshot) => {
    const daftarDokumen = snapshot.val()
    const keys = Object.keys(daftarDokumen)

    keys.map((item, index) => {
      const dokumen = daftarDokumen[item]
      currentDocuments.push(dokumen)
    })

    renderListDokumen(currentDocuments)
  })
}

function renderListDokumen(listDokumen) {
  $('#content-list-dokumen').html(``)
  let htmlString = ``
  listDokumen.map((dokumen, index) => {
    const str = `
    <tr>
      <td>${ index + 1 }</td>
      <td>${ dokumen.fileName }</td>
      <td>${ dokumen.category }</td>
      <td>
        <a href="${ dokumen.url }" target="__blank">Unduh</a>
      </td>
    </tr>`

    htmlString += str
  })

  $('#content-list-dokumen').html(htmlString)
}

$('#btn-cari').click(e => {
  const keyword = $('#input-pencarian').val()
  const result = currentDocuments.filter((item) => {
    return item.fileName.match(new RegExp(keyword, 'gi'))
  })
  renderListDokumen(result)
})

$('#input-pencarian').on('keypress', function(e) {
  if(e.which == 13) {
    const keyword = $('#input-pencarian').val()
    const result = currentDocuments.filter((item) => {
      return item.fileName.match(new RegExp(keyword, 'gi'))
    })
    renderListDokumen(result)
  }
});
