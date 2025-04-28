'use strict'

function renderGallery() {
    const imgs = getImgs()
    const elGallery = document.querySelector('.gallery')
    const strHTMLs = imgs.map(img => `
    <div class="img-container">
      <img src="${img.url}" data-id="${img.id}" onclick="onSelectImg(this)">
    </div>
  `)
    elGallery.innerHTML = strHTMLs.join('')
}

function onSelectImg(elImg) {
    const imgId = +elImg.dataset.id
    setImg(imgId)
    renderMeme()
    onShowEditor()
}




