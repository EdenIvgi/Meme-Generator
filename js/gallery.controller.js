'use strict'

var gKeywordCounts = {}

function renderSavedMemes() {
  const saved = getSavedMemes()
  const html = saved.map(m => `
    <div class="saved-item">
      <img src="${m.dataUrl}" onclick="onSelectSavedMeme(${m.id})">
      <button class="btn-delete" onclick="onDeleteSavedMeme(${m.id})">×</button>
    </div>
  `).join('')
  document.querySelector('.saved-container').innerHTML = html
}

function onOpenUploadModal() {
  document.querySelector('.upload-dialog').showModal()
}

function onUploadForm(ev) {
  ev.preventDefault()
  const fileEl = document.querySelector('.upload-file')
  const kwEls = document.querySelectorAll('.upload-kw')
  const keywords = Array.from(kwEls)
    .map(el => el.value.trim().toLowerCase())
    .filter(Boolean)
  const reader = new FileReader()
  reader.onload = e => {
    const img = new Image()
    img.onload = () => {
      const newId = Date.now()
      gImgs.push({ id: newId, url: img.src, keywords })
      initKeywords()
      renderFilterOptions()
      renderKeywordCloud()
      renderGallery()
      document.querySelector('.upload-dialog').close()
      fileEl.value = ''
      kwEls.forEach(el => el.value = '')
      renderSavedMemes()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(fileEl.files[0])
  onShowGallery()
}

function initKeywords() {
  gKeywordCounts = getImgs()
    .flatMap(img => img.keywords)
    .reduce((counts, kw) => {
      counts[kw] = (counts[kw] || 0) + 1
      return counts
    }, {})
}

function renderFilterOptions() {
  const dataList = document.getElementById('keywords')
  dataList.innerHTML = Object.keys(gKeywordCounts)
    .map(kw => `<option value="${kw}">`)
    .join('')
}

function renderKeywordCloud() {
  document.getElementById('keyword-cloud').innerHTML = Object.entries(gKeywordCounts)
    .map(([kw, count]) => {
      const size = 6 + count * 8
      return `<span class="keyword-tag" style="font-size:${size}px" onclick="onFilterGallery('${kw}')">${kw}</span>`
    })
    .join(' ')
}

function onFilterGallery(txt) {
  if (!txt) {
    renderGallery()
    renderSavedMemes()
    return
  }
  const filtered = getImgs().filter(img =>
    img.keywords.some(kw => kw.toLowerCase().includes(txt.toLowerCase()))
  )
  renderGallery(filtered)
}

function renderGallery(filteredImgs) {
  const imgs = filteredImgs || getImgs()
  document.querySelector('.gallery .imgs-container').innerHTML = imgs
    .map(img => `
      <div class="img-container">
        <img src="${img.url}" data-id="${img.id}" onclick="onSelectImg(this)">
      </div>
    `)
    .join('')
}

function onSelectImg(elImg) {
  const imgId = +elImg.dataset.id
  setImg(imgId)
  getMeme().selectedLineIdx = 0
  loadImage(getImgById(imgId).url)
  onShowEditor()
}

function onSelectSavedMeme(id) {
  const savedMeme = getSavedMemeById(id)
  if (!savedMeme) return

  const meme = getMeme()
  meme.lines = savedMeme.lines.map(l => ({ ...l }))
  meme.emojis = savedMeme.emojis
    ? savedMeme.emojis.map(e => {
      const img = new Image()
      img.src = e.src
      return {
        src: e.src,
        img,
        x: e.x,
        y: e.y,
        size: e.size,
        isDrag: false
      }
    })
    : []
  meme.selectedLineIdx = 0
  meme.selectedEmojiIdx = null

  const originalUrl = getImgById(savedMeme.selectedImgId).url
  loadImage(originalUrl)
  onShowEditor()
}


function onDeleteSavedMeme(id) {
  const remaining = getSavedMemes().filter(m => m.id !== id);
  localStorage.setItem('savedMemes', JSON.stringify(remaining));
  renderSavedMemes();
}

