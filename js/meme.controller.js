'use strict'

var gElCanvas
var gCtx
var gElImg = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('click', onCanvasClick)
    renderGallery()
    onShowGallery()
}

function onSelectImg(elImg) {
    var imgId = +elImg.dataset.id
    setImg(imgId)
    getMeme().selectedLineIdx = 0
    loadImage(getImgById(imgId).url)
    onShowEditor()
}

function onRandomMeme() {
    var imgs = getImgs()
    var rnd = imgs[Math.floor(Math.random() * imgs.length)]
    setImg(rnd.id)
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
    loadImage(getImgById(rnd.id).url)
    onShowEditor()
}

function loadImage(url) {
    gElImg = new Image()
    gElImg.src = url
    gElImg.onload = function () {
        gElCanvas.width = gElImg.naturalWidth
        gElCanvas.height = gElImg.naturalHeight
        var meme = getMeme()
        meme.lines.forEach(function (line, idx) {
            line.x = gElCanvas.width / 2
            line.y = idx === 0
                ? 60
                : gElCanvas.height - 60
        })
        renderMeme()
    }
}

function onShowEditor() {
    document.querySelector('.meme-editor').classList.remove('hidden')
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
}

function onShowGallery() {
    document.querySelector('.gallery').classList.remove('hidden')
    document.querySelector('.meme-editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
}

function onShowSaved() {
    document.querySelector('.saved-memes').classList.remove('hidden')
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.meme-editor').classList.add('hidden')
    renderSavedMemes()
}

function renderMeme() {
    clearCanvas()
    if (gElImg) gCtx.drawImage(gElImg, 0, 0)
    var meme = getMeme()
    meme.lines.forEach(function (line, idx) {
        drawText(line)
        if (meme.selectedLineIdx === idx && line.txt.trim() !== '') {
            drawFrame(line)
        }
    })
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function drawText(line) {
    gCtx.save()
    gCtx.font = line.size + 'px ' + line.font
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = line.color
    gCtx.textAlign = line.align
    gCtx.textBaseline = 'middle'
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.strokeText(line.txt, line.x, line.y)
    gCtx.restore()
}

function drawFrame(line) {
    gCtx.save()
    gCtx.font = line.size + 'px ' + line.font
    var w = gCtx.measureText(line.txt).width
    var pad = 10
    var h = line.size + 10
    var x0 = line.x
    if (line.align === 'center') x0 -= w / 2
    if (line.align === 'right') x0 -= w
    var y0 = line.y - h / 2
    gCtx.strokeStyle = '#fff'
    gCtx.lineWidth = 2
    gCtx.strokeRect(x0 - pad, y0, w + pad * 2, h)
    gCtx.restore()
}

function getEvPos(ev) {
    var rect = gElCanvas.getBoundingClientRect()
    var scaleX = gElCanvas.width / rect.width
    var scaleY = gElCanvas.height / rect.height
    return {
        x: (ev.clientX - rect.left) * scaleX,
        y: (ev.clientY - rect.top) * scaleY
    }
}

function onCanvasClick(ev) {
    var pos = getEvPos(ev)
    var meme = getMeme()
    var idx = meme.lines.findIndex(function (line) {
        gCtx.font = line.size + 'px ' + line.font
        var w = gCtx.measureText(line.txt).width
        var pad = 10
        var h = line.size + 10
        var x0 = line.x
        if (line.align === 'center') x0 -= w / 2
        if (line.align === 'right') x0 -= w
        return pos.x >= x0 - pad && pos.x <= x0 + w + pad &&
            pos.y >= line.y - h / 2 && pos.y <= line.y + h / 2
    })
    meme.selectedLineIdx = idx !== -1 ? idx : null
    var inp = document.querySelector('input[type="text"]')
    if (inp) inp.value = idx !== -1 ? meme.lines[idx].txt : ''
    renderMeme()
}

function onSetColor(color) {
    setColor(color)
    renderMeme()
}

function onSetLineText(text) {
    setLineTxt(text)
    renderMeme()
}

function onTextKey(ev) {
    if (ev.key === 'Enter') {
        ev.target.value = ''
        getMeme().selectedLineIdx = null
        renderMeme()
    }
}

function onDownloadCanvas(a) {
    a.href = gElCanvas.toDataURL()
    a.download = 'My-Meme'
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    var meme = getMeme()
    meme.lines.push({
        txt: '',
        size: 40,
        color: 'black',
        font: 'Arial',
        align: 'center',
        x: gElCanvas.width / 2,
        y: gElCanvas.height - 60
    })
    meme.selectedLineIdx = meme.lines.length - 1
    var inp = document.querySelector('input[type="text"]')
    if (inp) inp.value = ''
    renderMeme()
}

function onSwitchLine() {
    var meme = getMeme()
    meme.selectedLineIdx = (meme.selectedLineIdx + 1) % meme.lines.length
    renderMeme()
}

function onSetFont(font) {
    var meme = getMeme()
    if (meme.selectedLineIdx == null) return
    meme.lines[meme.selectedLineIdx].font = font
    renderMeme()
}

function onSetAlign(align) {
    var meme = getMeme()
    if (meme.selectedLineIdx == null) return
    var line = meme.lines[meme.selectedLineIdx]
    line.align = align
    if (align === 'left') line.x = 50
    if (align === 'center') line.x = gElCanvas.width / 2
    if (align === 'right') line.x = gElCanvas.width - 50
    renderMeme()
}

function onDeleteLine() {
    var meme = getMeme()
    meme.lines.splice(meme.selectedLineIdx, 1)
    meme.selectedLineIdx = meme.lines.length - 1
    renderMeme()
}

function onUploadImg(ev) {
    ev.preventDefault()
    var data = gElCanvas.toDataURL('image/png')
    uploadImg(data, onSuccess)
}

async function uploadImg(imgData, onSuccess) {
    var CLOUD_NAME = 'webify'
    var UPLOAD_URL = 'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload'
    var formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        var res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
        var data = await res.json()
        onSuccess(data.secure_url)
    } catch (err) {
        console.log(err)
    }
}

function onSuccess(uploadedUrl) {
    var enc = encodeURIComponent(uploadedUrl)
    document.querySelector('.share-container').innerHTML =
        '<button class="btn-facebook" target="_blank" ' +
        'onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=' + enc + '&t=' + enc + '\')">' +
        'Share on Facebook</button>'
}

function onSaveMeme() {
    renderMeme()
    const meme = getMeme()
    if (!meme.selectedImgId) return
    const dataUrl = gElCanvas.toDataURL()
    saveMeme(meme, dataUrl)
    alert('Meme saved!')
}

function renderSavedMemes() {
    const saved = getSavedMemes()
    const el = document.querySelector('.saved-container')
    el.innerHTML = saved.map(m => {
        const src = m.dataUrl || getImgById(m.selectedImgId).url
        return `
      <div class="img-container">
        <img src="${src}" onclick="onSelectSavedMeme(${m.id})">
      </div>
    `
    }).join('')
}

function onSelectSavedMeme(id) {
    var m = getSavedMemeById(id)
    if (!m) return
    var meme = getMeme()
    meme.selectedImgId = m.selectedImgId
    meme.lines = m.lines.map(function (l) { return Object.assign({}, l) })
    meme.selectedLineIdx = 0
    loadImage(getImgById(meme.selectedImgId).url)
    onShowEditor()
}
