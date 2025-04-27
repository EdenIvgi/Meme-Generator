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

        const topY = 60
        const bottomY = gElCanvas.height - 60
        const centerX = gElCanvas.width / 2

        if (meme.lines[0]) {
            meme.lines[0].x = centerX
            meme.lines[0].y = topY
        }
        if (meme.lines[1]) {
            meme.lines[1].x = centerX
            meme.lines[1].y = bottomY
        }

        meme.lines.forEach((line, idx) => {
            drawText(line.txt, line.x, line.y, line)
            if (meme.selectedLineIdx === idx) drawFrame(line)
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
    const meme = getMeme()
    if (meme.selectedLineIdx === null) return
    meme.lines[meme.selectedLineIdx].txt = text
    renderMeme()
}

function onTextKey(ev) {
    if (ev.key === 'Enter') {
        ev.target.value = ''
        gMeme.selectedLineIdx = null
        renderMeme()
    }
}

function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()

    elLink.href = dataUrl
    elLink.download = 'My-Meme'
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    const meme = getMeme()
    const y = gElCanvas.height - 60
    const x = gElCanvas.width / 2

    meme.lines.push({
        txt: '',
        size: 40,
        color: 'black',
        x,
        y
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

function onEditLine(lineIdx, text) {
    updateLineText(lineIdx, text)
    renderMeme()
}

function drawFrame(line) {
    const textWidth = gCtx.measureText(line.txt).width
    const padding = 10
    const height = line.size + 10

    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.strokeRect(
        line.x - textWidth / 2 - padding,
        line.y - height / 2,
        textWidth + padding * 2,
        height
    )
}

function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev
    const meme = getMeme()

    meme.lines.forEach((line, idx) => {
        const textWidth = gCtx.measureText(line.txt).width
        const height = line.size
        const isClicked =
            offsetX >= line.x - textWidth / 2 &&
            offsetX <= line.x + textWidth / 2 &&
            offsetY >= line.y - height / 2 &&
            offsetY <= line.y + height / 2

        if (isClicked) {
            meme.selectedLineIdx = idx
            document.querySelector('input[type="text"]').value = line.txt
            renderMeme()
        }
    })
}

