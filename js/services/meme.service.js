'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 60 },
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 240 }
    ]
}

var gImgs = [
    { id: 1, url: 'img/real-size/003.jpg', keywords: ['funny', 'trump'] },
    { id: 2, url: 'img/real-size/004.jpg', keywords: ['dog', 'kiss'] },
    { id: 3, url: 'img/real-size/005.jpg', keywords: ['baby', 'sweet'] },
    { id: 4, url: 'img/real-size/006.jpg', keywords: ['cat', 'sweet'] },
    { id: 5, url: 'img/real-size/007.jpg', keywords: ['man', 'funny'] },
    { id: 6, url: 'img/real-size/008.jpg', keywords: ['child', 'smile'] },
    { id: 7, url: 'img/real-size/009.jpg', keywords: ['man', 'point'] },
    { id: 8, url: 'img/real-size/010.jpg', keywords: ['angry', 'shahar'] },
    { id: 9, url: 'img/real-size/011.jpg', keywords: ['man', 'scientist'] },
    { id: 10, url: 'img/real-size/012.jpg', keywords: ['evil', 'man'] },
    { id: 11, url: 'img/real-size/013.jpg', keywords: ['child', 'funny'] },
    { id: 12, url: 'img/real-size/014.jpg', keywords: ['trump', 'funny'] },
    { id: 13, url: 'img/real-size/015.jpg', keywords: ['baby', 'sweet'] },
    { id: 14, url: 'img/real-size/016.jpg', keywords: ['dog', 'strange'] },
    { id: 15, url: 'img/real-size/017.jpg', keywords: ['obama', 'smile'] },

]

function getImgs() {
    return gImgs
}

function getImgById(id) {
    return gImgs.find(function (img) { return img.id === id })
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    if (gMeme.selectedLineIdx == null) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setColor(color) {
    if (gMeme.selectedLineIdx == null) return
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function changeFontSize(diff) {
    if (gMeme.selectedLineIdx == null) return
    var line = gMeme.lines[gMeme.selectedLineIdx]
    line.size = Math.min(100, Math.max(10, line.size + diff))
}

function updateLineText(lineIdx, text) {
    gMeme.lines[lineIdx].txt = text
}

var STORAGE_KEY = 'savedMemes'

function saveMeme(meme, dataUrl) {
    const saved = getSavedMemes()
    const memento = JSON.parse(JSON.stringify(meme))
    memento.dataUrl = dataUrl
    memento.id = Date.now()
    saved.push(memento)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

function getSavedMemes() {
    var str = localStorage.getItem(STORAGE_KEY)
    return str ? JSON.parse(str) : []
}

function getSavedMemeById(id) {
    return getSavedMemes().find(function (m) { return m.id === id })
}

