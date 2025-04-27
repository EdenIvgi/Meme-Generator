'use strict'

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 40,
            color: 'black',
            x: null,
            y: null
        },
        {
            txt: '',
            size: 40,
            color: 'black',
            x: null,
            y: null
        }
    ]
}


var gImgs = [
    { id: 1, url: 'img/real-size/003.jpg', keywords: ['funny', 'trump'] },
    { id: 2, url: 'img/real-size/004.jpg', keywords: ['dog', 'kiss'] },
    { id: 3, url: 'img/real-size/005.jpg', keywords: ['baby', 'sweet'] }
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

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function changeFontSize(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size += diff

    if (line.size < 10) line.size = 10
    if (line.size > 100) line.size = 100
}

// function addLine() {
//     gMeme.lines.push({
//         txt: 'Add text',
//         size: 40,
//         color: 'black',
//         x: gElCanvas.width / 2,
//         y: gElCanvas.height / 2 + 50
//     })
//     gMeme.selectedLineIdx = gMeme.lines.length - 1
// }

function updateLineText(lineIdx, text) {
    gMeme.lines[lineIdx].txt = text
}
