'use strict'
var gElCanvas, gCtx, gElImg = null
let gStartPos, gDragType = null

const gEmojiSrcs = [
    'img/emojis/alien.png', 'img/emojis/blush.png', 'img/emojis/clown_face.png',
    'img/emojis/earth_africa.png', 'img/emojis/fist.png', 'img/emojis/flag-il.png',
    'img/emojis/grin.png', 'img/emojis/grinning (1).png', 'img/emojis/hammer_and_wrench.png',
    'img/emojis/heart_eyes.png', 'img/emojis/heart.png', 'img/emojis/joy.png',
    'img/emojis/kissing_heart.png', 'img/emojis/laughing.png', 'img/emojis/male-pilot.png',
    'img/emojis/money_mouth_face.png', 'img/emojis/muscle.png',
    'img/emojis/rolling_on_the_floor_laughing.png', 'img/emojis/see_no_evil.png',
    'img/emojis/skull_and_crossbones.png', 'img/emojis/sleeping.png',
    'img/emojis/smiley.png', 'img/emojis/smiling_imp.png', 'img/emojis/star-struck.png',
    'img/emojis/sunglasses (1).png', 'img/emojis/sweat_smile.png', 'img/emojis/tongue.png',
    'img/emojis/v.png', 'img/emojis/wink.png', 'img/emojis/yum.png', 'img/emojis/zap.png'
]

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('click', onCanvasClick)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchstart', onDown, { passive: false })
    gElCanvas.addEventListener('touchmove', onMove, { passive: false })
    gElCanvas.addEventListener('touchend', onUp, { passive: false })
    gElCanvas.addEventListener('dragover', ev => ev.preventDefault())
    gElCanvas.addEventListener('drop', onEmojiDrop)

    initKeywords()
    renderFilterOptions()
    renderKeywordCloud()
    renderGallery()
    onShowGallery()
}
function renderMeme() {
    clearCanvas()
    if (gElImg) gCtx.drawImage(gElImg, 0, 0)
    const meme = getMeme()
    meme.lines.forEach(ln => drawText(ln))
    if (meme.emojis) meme.emojis.forEach(e => drawEmoji(e))
    if (meme.selectedLineIdx != null) {
        const ln = meme.lines[meme.selectedLineIdx]
        if (ln.txt.trim()) drawFrame(ln)
    }
}

function renderEmojiPanel() {
    const container = document.querySelector('.emoji-panel .emojis-container')
    container.innerHTML = ''
    gEmojiSrcs.forEach(src => {
        const img = document.createElement('img')
        img.src = src
        img.draggable = true
        img.dataset.src = src
        img.addEventListener('dragstart', onEmojiDragStart)
        img.addEventListener('click', () => onEmojiClick(src))
        container.appendChild(img)
    })
}

function onEmojiDragStart(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.dataset.src)
}

function onEmojiDrop(ev) {
    ev.preventDefault()
    const src = ev.dataTransfer.getData('text/plain')
    const pos = getEvPos(ev)
    addEmojiToCanvas(src, pos)
}

function onEmojiClick(src) {
    const pos = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    addEmojiToCanvas(src, pos)
}

function addEmojiToCanvas(src, pos) {
    const img = new Image()
    img.src = src
    const meme = getMeme()
    meme.emojis = meme.emojis || []
    meme.emojis.push({
        src,
        img,
        x: pos.x,
        y: pos.y,
        size: 40,
        isDrag: false
    })
    meme.selectedEmojiIdx = meme.emojis.length - 1
    renderMeme()
}


function onRandomMeme() {
    const imgs = getImgs()
    const rnd = imgs[Math.floor(Math.random() * imgs.length)]
    setImg(rnd.id)
    const meme = getMeme()
    meme.lines = [{
        txt: '', size: 40, color: 'black', font: 'Arial', align: 'center',
        x: gElCanvas.width / 2, y: 60, isDrag: false
    }]
    meme.selectedLineIdx = 0
    meme.emojis = []
    meme.selectedEmojiIdx = null
    loadImage(getImgById(rnd.id).url)
    onShowEditor()
}

function loadImage(src) {
    gElImg = new Image()
    gElImg.src = src
    gElImg.onload = () => {
        gElCanvas.width = gElImg.naturalWidth
        gElCanvas.height = gElImg.naturalHeight
        renderMeme()
    };
}

function onShowEditor() {
    renderEmojiPanel()
    renderMeme()
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
    const w = gCtx.measureText(line.txt).width
    const pad = 10, h = line.size + 10
    let x0 = line.x
    if (line.align === 'center') x0 -= w / 2
    if (line.align === 'right') x0 -= w
    const y0 = line.y - h / 2
    gCtx.strokeStyle = '#fff'; gCtx.lineWidth = 2
    gCtx.strokeRect(x0 - pad, y0, w + pad * 2, h)
    gCtx.restore()
}
function drawEmoji(e) {
    if (!e.img && e.src) {
        e.img = new Image()
        e.img.src = e.src
    }
    if (!e.img || !e.img.complete) return
    gCtx.drawImage(
        e.img,
        e.x - e.size / 2,
        e.y - e.size / 2,
        e.size,
        e.size
    )
}

function getEvPos(ev) {
    ev.preventDefault()

    const point = ev.type.startsWith('touch')
        ? (ev.touches[0] || ev.changedTouches[0])
        : ev;

    const rect = gElCanvas.getBoundingClientRect()
    return {
        x: (point.clientX - rect.left) * (gElCanvas.width / rect.width),
        y: (point.clientY - rect.top) * (gElCanvas.height / rect.height)
    }
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()
    const idx = meme.lines.findIndex(ln => {
        gCtx.font = ln.size + 'px ' + ln.font
        const w = gCtx.measureText(ln.txt).width, pad = 10, h = ln.size + 10
        let x0 = ln.x
        if (ln.align === 'center') x0 -= w / 2
        if (ln.align === 'right') x0 -= w
        return pos.x >= x0 - pad && pos.x <= x0 + w + pad && pos.y >= ln.y - h / 2 && pos.y <= ln.y + h / 2
    })
    meme.selectedLineIdx = idx !== -1 ? idx : null
    const inp = document.getElementById('meme-text-input')
    if (inp) {
        inp.value = idx !== -1 ? meme.lines[idx].txt : ''
        if (idx !== -1) inp.setSelectionRange(inp.value.length, inp.value.length)
    }
    renderMeme()
}

function onSetColor(color) {
    setColor(color); renderMeme()
}

function onSetLineText(text) {
    setLineTxt(text); renderMeme()
}

function onTextKey(ev) {
    if (ev.key === 'Enter') {
        ev.target.value = ''
        getMeme().selectedLineIdx = null
        renderMeme()
    }
}

function onDownloadCanvas() {
    const dataURL = gElCanvas.toDataURL()
    const link = document.createElement('a')
    link.href = dataURL; link.download = 'My-Meme.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    const meme = getMeme()
    const idx = meme.lines.length
    meme.lines.push({
        txt: '', size: 40, color: 'black', font: 'Arial', align: 'center',
        x: gElCanvas.width / 2,
        y: idx === 0 ? 60 : idx === 1 ? gElCanvas.height - 60 : gElCanvas.height / 2,
        isDrag: false
    })
    meme.selectedLineIdx = meme.lines.length - 1
    document.getElementById('meme-text-input').value = ''
    renderMeme()
}

function onSwitchLine() {
    const meme = getMeme()
    meme.selectedLineIdx = (meme.selectedLineIdx + 1) % meme.lines.length
    renderMeme()
}

function onSetFont(font) {
    const meme = getMeme()
    if (meme.selectedLineIdx == null) return
    meme.lines[meme.selectedLineIdx].font = font
    renderMeme()
}

function onSetAlign(align) {
    const meme = getMeme()
    if (meme.selectedLineIdx == null) return
    const ln = meme.lines[meme.selectedLineIdx]
    ln.align = align
    if (align === 'left') ln.x = 50
    if (align === 'center') ln.x = gElCanvas.width / 2
    if (align === 'right') ln.x = gElCanvas.width - 50
    renderMeme()
}

function onDeleteLine() {
    const meme = getMeme()
    meme.lines.splice(meme.selectedLineIdx, 1)
    meme.selectedLineIdx = meme.lines.length - 1
    renderMeme()
}
function onUploadImg(ev) {
    ev.preventDefault()
    const fbPopup = window.open('', '_blank')
    const data = gElCanvas.toDataURL('image/png')
    uploadImg(data, uploadedUrl => {
        const enc = encodeURIComponent(uploadedUrl)
        fbPopup.location.href = `https://www.facebook.com/sharer/sharer.php?u=${enc}&t=${enc}`
    })
}

async function uploadImg(imgData, onSuccess) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
        const data = await res.json()
        onSuccess(data.secure_url)
    } catch (err) {
        console.error(err)
    }
}

function onSuccess(uploadedUrl) {
    const enc = encodeURIComponent(uploadedUrl)
    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${enc}&t=${enc}`,
        '_blank'
    )
}

function onSaveMeme() {
    renderMeme()
    const dataUrl = gElCanvas.toDataURL()
    saveMeme(getMeme(), dataUrl)
    alert('Meme saved!')
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()
    let idx = meme.lines.findIndex(ln => isPosInLine(pos, ln))
    if (idx !== -1) {
        meme.selectedLineIdx = idx
        meme.lines[idx].isDrag = true
        gDragType = 'line'
        gStartPos = pos
        document.body.style.cursor = 'grabbing'
        return
    }
    idx = meme.emojis ? meme.emojis.findIndex(e => isPosInEmoji(pos, e)) : -1
    if (idx !== -1) {
        meme.selectedEmojiIdx = idx
        meme.emojis[idx].isDrag = true
        gDragType = 'emoji'
        gStartPos = pos
        document.body.style.cursor = 'grabbing'
    }
}

function onMove(ev) {
    const pos = getEvPos(ev)
    const meme = getMeme()
    if (gDragType === 'line') {
        const idx = meme.selectedLineIdx
        if (idx == null || !meme.lines[idx].isDrag) return
        const dx = pos.x - gStartPos.x, dy = pos.y - gStartPos.y
        meme.lines[idx].x += dx; meme.lines[idx].y += dy
        gStartPos = pos
        renderMeme()
    } else if (gDragType === 'emoji') {
        const idx = meme.selectedEmojiIdx
        if (idx == null || !meme.emojis[idx].isDrag) return
        const dx = pos.x - gStartPos.x, dy = pos.y - gStartPos.y
        meme.emojis[idx].x += dx; meme.emojis[idx].y += dy
        gStartPos = pos
        renderMeme()
    }
}

function onUp() {
    const meme = getMeme()
    if (gDragType === 'line' && meme.selectedLineIdx != null) {
        meme.lines[meme.selectedLineIdx].isDrag = false
    } else if (gDragType === 'emoji' && meme.selectedEmojiIdx != null) {
        meme.emojis[meme.selectedEmojiIdx].isDrag = false
    }
    gDragType = null
    document.body.style.cursor = 'default'
}

function isPosInLine(pos, ln) {
    gCtx.font = ln.size + 'px ' + ln.font
    const w = gCtx.measureText(ln.txt).width, pad = 10, h = ln.size + 10
    let x0 = ln.x
    if (ln.align === 'center') x0 -= w / 2
    if (ln.align === 'right') x0 -= w
    const y0 = ln.y - h / 2
    return pos.x >= x0 - pad && pos.x <= x0 + w + pad && pos.y >= y0 && pos.y <= y0 + h
}

function isPosInEmoji(pos, e) {
    const half = e.size / 2
    return pos.x >= e.x - half && pos.x <= e.x + half && pos.y >= e.y - half && pos.y <= e.y + half
}

function scrollEmojis(dir) {
    const win = document.querySelector('.emoji-panel .emojis-window')
    win.scrollBy({ left: dir * win.clientWidth * 0.6, behavior: 'smooth' })
}

function onImgInput(ev) {
    const [file] = ev.target.files
    if (!file) return

    const reader = new FileReader()
    reader.onload = ({ target }) => {
        const img = new Image()
        img.src = target.result
        img.onload = () => {
            const MAX_W = 600
            const scale = Math.min(MAX_W / img.naturalWidth, 1)
            const w = img.naturalWidth * scale
            const h = img.naturalHeight * scale
            const tmpCanvas = document.createElement('canvas')
            tmpCanvas.width = w
            tmpCanvas.height = h
            tmpCanvas.getContext('2d').drawImage(img, 0, 0, w, h)
            const scaledDataUrl = tmpCanvas.toDataURL('image/png')

            const newId = Date.now()
            gImgs.push({ id: newId, url: scaledDataUrl, keywords: [] })
            onSelectImg({ dataset: { id: newId } })
        }
    }
    reader.readAsDataURL(file)
}