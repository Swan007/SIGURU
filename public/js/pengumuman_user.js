$('#section-pengumuman').hide()

let arrayPengumuman = []
const pengumumanCount = 10
let currentPengumumanPage = 1
let maxPage = 0

firebase.database().ref('pengumuman').on('value', (snapshot) => {
  const data = snapshot.val()
  arrayPengumuman = []

  for(const year in data) {
    const monthData = data[year]
    for(const month in monthData) {
      const dates = monthData[month]
      for(const date in dates) {
        const daftarPengumuman = dates[date]
        for(const idPengumuman in daftarPengumuman) {
          arrayPengumuman.push({
            by: 'Admin',
            pengumuman: daftarPengumuman[idPengumuman],
            tanggal: `${date}/${month}/${year}`
          })
        }
      }
    }
  }

  maxPage = Math.ceil(arrayPengumuman.length / pengumumanCount)
  renderPengumuman()
})

function renderPengumuman() {
  $('#content-pengumuman').html(``)
  let startIndex = (currentPengumumanPage - 1) * pengumumanCount
  let endIndex = startIndex + pengumumanCount

  if(startIndex < 0) {
    starIndex = 0
  }

  if(endIndex > arrayPengumuman.length) {
    endIndex = arrayPengumuman.length
  }

  let strPengumuman = ``
  for(let i = startIndex; i < endIndex; i++) {
    const pengumuman = arrayPengumuman[i]
    strPengumuman += `
    <tr class="unread">
      <td class="inbox-small-cells">${i + 1}</td>
      <td class="view-message  dont-show">${pengumuman.by}</td>
      <td class="view-message ">${pengumuman.pengumuman}</td>
      <td class="view-message  text-right">${pengumuman.tanggal}</td>
    </tr>`
  }

  $('#pagination-pengumuman').text(`${startIndex + 1} - ${endIndex} dari ${arrayPengumuman.length}`)
  $('#content-pengumuman').html(strPengumuman)
}

$('#prev-page').click((e) => {
  if(currentPengumumanPage > 1) {
    currentPengumumanPage -= 1
  }

  renderPengumuman()
})

$('#next-page').click((e) => {
  if(currentPengumumanPage < maxPage) {
    currentPengumumanPage += 1
  }

  renderPengumuman()
})

$('#tanggal-lama').click(e => {
  arrayPengumuman.sort((a, b) => {
    const arrA = a.tanggal.split('/')
    const arrB = b.tanggal.split('/')

    const timestampA = new Date(parseInt(arrA[2]), parseInt(arrA[1]), parseInt(arrA[0])).getTime()
    const timestampB = new Date(parseInt(arrB[2]), parseInt(arrB[1]), parseInt(arrB[0])).getTime()
    if(timestampA > timestampB) {
      return 1
    } else if(timestampA < timestampB) {
      return -1
    }

    return 0
  })
  renderPengumuman()
})

$('#tanggal-baru').click(e => {
  arrayPengumuman.sort((a, b) => {
    const arrA = a.tanggal.split('/')
    const arrB = b.tanggal.split('/')

    const timestampA = new Date(parseInt(arrA[2]), parseInt(arrA[1]), parseInt(arrA[0])).getTime()
    const timestampB = new Date(parseInt(arrB[2]), parseInt(arrB[1]), parseInt(arrB[0])).getTime()
    if(timestampA > timestampB) {
      return -1
    } else if(timestampA < timestampB) {
      return 1
    }

    return 0
  })
  renderPengumuman()
})