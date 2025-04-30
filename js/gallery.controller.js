'use strict'

function renderGallery() {
  var imgs = getImgs()
  var elContainer = document.querySelector('.gallery .imgs-container')
  var strHTMLs = imgs.map(function (img) {
    return '<div class="img-container">' +
      '<img src="' + img.url + '" data-id="' + img.id + '" onclick="onSelectImg(this)">' +
      '</div>'
  })
  elContainer.innerHTML = strHTMLs.join('')
}


function onSelectImg(elImg) {
  var imgId = +elImg.dataset.id
  setImg(imgId)
  getMeme().selectedLineIdx = 0
  var url = getImgById(imgId).url
  loadImage(url)
  onShowEditor()
}

function onRandomMeme() {
  var imgs = getImgs()
  var randomImg = imgs[Math.floor(Math.random() * imgs.length)]
  setImg(randomImg.id)
  var meme = getMeme()
  meme.lines = [{
    txt: '',
    size: 40,
    color: 'black',
    font: 'Arial',
    align: 'center',
    x: gElCanvas.width / 2,
    y: 60
  }]
  meme.selectedLineIdx = 0
  loadImage(getImgById(randomImg.id).url)
  onShowEditor()
}




