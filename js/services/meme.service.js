'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 60 },
        { txt: '', size: 40, color: 'black', font: 'Arial', align: 'center', x: 250, y: 240 }
    ]
};

var gImgs = [
    { id: 1, url: 'img/real-size/003.jpg', keywords: ['funny', 'trump'] },
    { id: 2, url: 'img/real-size/004.jpg', keywords: ['dog', 'kiss'] },
    { id: 3, url: 'img/real-size/005.jpg', keywords: ['baby', 'sweet'] }
];

function getImgs() {
    return gImgs
}

function getImgById(id) {
    return gImgs.find(function (img) { return img.id === id; })
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    if (gMeme.selectedLineIdx === null) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setColor(color) {
    if (gMeme.selectedLineIdx === null) return
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function changeFontSize(diff) {
    if (gMeme.selectedLineIdx === null) return
    var line = gMeme.lines[gMeme.selectedLineIdx]
    line.size = Math.min(100, Math.max(10, line.size + diff))
}

function updateLineText(lineIdx, text) {
    gMeme.lines[lineIdx].txt = text
}

