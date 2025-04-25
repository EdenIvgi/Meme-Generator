'use strict'

function renderMeme() {
    const meme = getMeme()
    const img = getImgById(meme.selectedImgId)
    if (!img) return

    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gElCanvas.width = elImg.width
        gElCanvas.height = elImg.height
        gCtx.drawImage(elImg, 0, 0)

        meme.lines.forEach(line => {
            drawText(line.txt, gElCanvas.width / 2, gElCanvas.height / 2, line)
        })
    }
}

function drawText(text, x, y, line) {
    gCtx.lineWidth = 2
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = line.color
    gCtx.font = `${line.size}px Arial`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function drawImg(imgSrc, onImgReady = () => { }) {
    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
        gElCanvas.width = img.width
        gElCanvas.height = img.height
        gCtx.drawImage(img, 0, 0)
        onImgReady()
    }
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
        drawText(gBrush.text, gElCanvas.width / 2, gElCanvas.height / 2)
        gBrush.text = ''
        ev.target.value = ''
    }
}

function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()

    elLink.href = dataUrl
    elLink.download = 'My-Meme'
}