'use strict'

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

function drawEmoji(emoji) {
    if (!emoji.img && emoji.src) {
        emoji.img = new Image()
        emoji.img.src = emoji.src
    }
    if (!emoji.img || !emoji.img.complete) return
    gCtx.drawImage(
        emoji.img,
        emoji.x - emoji.size / 2,
        emoji.y - emoji.size / 2,
        emoji.size,
        emoji.size
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