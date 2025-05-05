'use strict'
var STORAGE_KEY = 'savedMemes'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    selectedEmojiIdx: null,
    lines: [
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 60, isDrag: false },
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 240, isDrag: false }
    ],
    emojis: []
}

var gImgs = [
    { id: 1, url: 'img/real-size/003.jpg', keywords: ['funny', 'trump'] },
    { id: 2, url: 'img/real-size/004.jpg', keywords: ['dog', 'kiss'] },
    { id: 3, url: 'img/real-size/005.jpg', keywords: ['baby', 'sweet'] },
    { id: 4, url: 'img/real-size/006.jpg', keywords: ['cat', 'sweet'] },
    { id: 5, url: 'img/real-size/007.jpg', keywords: ['man', 'funny'] },
    { id: 6, url: 'img/real-size/008.jpg', keywords: ['child', 'smile'] },
    { id: 7, url: 'img/real-size/009.jpg', keywords: ['man', 'point'] },
    { id: 8, url: 'img/real-size/010.jpg', keywords: ['angry', 'poly'] },
    { id: 9, url: 'img/real-size/011.jpg', keywords: ['man', 'scientist'] },
    { id: 10, url: 'img/real-size/012.jpg', keywords: ['evil', 'man'] },
    { id: 11, url: 'img/real-size/013.jpg', keywords: ['child', 'funny'] },
    { id: 12, url: 'img/real-size/014.jpg', keywords: ['trump', 'funny'] },
    { id: 13, url: 'img/real-size/015.jpg', keywords: ['baby', 'sweet'] },
    { id: 14, url: 'img/real-size/016.jpg', keywords: ['dog', 'strange'] },
    { id: 15, url: 'img/real-size/017.jpg', keywords: ['obama', 'smile'] }
]

function getImgs() {
    return gImgs
}

function getImgById(id) {
    return gImgs.find(img => img.id === id)
}

function getMeme() {
    return gMeme
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function setLineTxt(txt) {
    if (gMeme.selectedLineIdx == null) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function changeFontSize(diff) {
    if (gMeme.selectedLineIdx == null) return
    var line = gMeme.lines[gMeme.selectedLineIdx]
    line.size = Math.min(100, Math.max(10, line.size + diff))
}

function setColor(color) {
    if (gMeme.selectedLineIdx == null) return
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function saveMeme(meme, dataUrl) {
    const saved = getSavedMemes()
    const memento = {
        selectedImgId: meme.selectedImgId,
        lines: meme.lines.map(l => ({ ...l })),
        emojis: meme.emojis.map(e => ({
            src: e.src,      // שמירת ה-src בלבד
            x: e.x,
            y: e.y,
            size: e.size
        })),
        dataUrl,
        id: Date.now()
    }
    saved.push(memento)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

function getSavedMemes() {
    var str = localStorage.getItem(STORAGE_KEY)
    return str ? JSON.parse(str) : []
}

function getSavedMemeById(id) {
    return getSavedMemes().find(m => m.id === id)
}
