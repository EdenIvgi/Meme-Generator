'use strict'

let gElCanvas
let gCtx
let gElImg = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('click', onCanvasClick)

    renderGallery()
    onShowGallery()
}

function onSelectImg(elImg) {
    const imgId = +elImg.dataset.id
    setImg(imgId)
    getMeme().selectedLineIdx = 0
    const { url } = getImgById(imgId)
    loadImage(url)
    onShowEditor()
}

function loadImage(url) {
    gElImg = new Image()
    gElImg.src = url
    gElImg.onload = () => {
        gElCanvas.width = gElImg.naturalWidth;
        gElCanvas.height = gElImg.naturalHeight;

        const meme = getMeme()
        meme.lines.forEach((line, idx) => {
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
}

function onShowGallery() {
    document.querySelector('.gallery').classList.remove('hidden')
    document.querySelector('.meme-editor').classList.add('hidden')
}

function renderMeme() {
    clearCanvas()
    if (gElImg) gCtx.drawImage(gElImg, 0, 0)
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
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
    gCtx.font = `${line.size}px ${line.font}`
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
    gCtx.font = `${line.size}px ${line.font}`
    const w = gCtx.measureText(line.txt).width
    const pad = 10
    const h = line.size + 10
    let x0 = line.x
    if (line.align === 'center') x0 -= w / 2
    if (line.align === 'right') x0 -= w
    const y0 = line.y - h / 2

    gCtx.strokeStyle = '#fff'
    gCtx.lineWidth = 2
    gCtx.strokeRect(x0 - pad, y0, w + pad * 2, h)
    gCtx.restore()
}

function getEvPos(ev) {
    const rect = gElCanvas.getBoundingClientRect()
    const scaleX = gElCanvas.width / rect.width
    const scaleY = gElCanvas.height / rect.height
    return {
        x: (ev.clientX - rect.left) * scaleX,
        y: (ev.clientY - rect.top) * scaleY
    }
}

function onCanvasClick(ev) {
    const { x, y } = getEvPos(ev)
    const meme = getMeme()
    const idx = meme.lines.findIndex(line => {
        gCtx.font = `${line.size}px ${line.font}`
        const w = gCtx.measureText(line.txt).width
        const pad = 10
        const h = line.size + 10
        let x0 = line.x
        if (line.align === 'center') x0 -= w / 2
        if (line.align === 'right') x0 -= w
        return x >= x0 - pad && x <= x0 + w + pad &&
            y >= line.y - h / 2 && y <= line.y + h / 2
    })

    meme.selectedLineIdx = idx !== -1 ? idx : null
    const inp = document.querySelector('input[type="text"]')
    if (inp) inp.value = idx !== -1 ? meme.lines[idx].txt : ''
    renderMeme()
}

function onSetColor(c) { setColor(c); renderMeme(); }
function onSetLineText(t) { setLineTxt(t); renderMeme(); }
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
function onChangeFontSize(d) { changeFontSize(d); renderMeme(); }
function onAddLine() {
    const meme = getMeme()
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
    document.querySelector('input[type="text"]').value = ''
    renderMeme()
}
function onSwitchLine() {
    const meme = getMeme()
    meme.selectedLineIdx = (meme.selectedLineIdx + 1) % meme.lines.length
    renderMeme()
}
function onSetFont(font) {
    const meme = getMeme()
    if (meme.selectedLineIdx === null) return
    meme.lines[meme.selectedLineIdx].font = font
    renderMeme()
}
function onSetAlign(a) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    line.align = a
    if (a === 'left') line.x = 50
    if (a === 'center') line.x = gElCanvas.width / 2
    if (a === 'right') line.x = gElCanvas.width - 50
    renderMeme()
}
function onDeleteLine() {
    const meme = getMeme()
    meme.lines.splice(meme.selectedLineIdx, 1)
    meme.selectedLineIdx = meme.lines.length - 1
    renderMeme()
}

window.onload = onInit
