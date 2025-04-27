'use strict'
var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('mousedown', onCanvasClick)
    renderGallery()
}

