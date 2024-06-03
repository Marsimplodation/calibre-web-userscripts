// ==UserScript==
// @name         Calibreweb annotation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set width of manga pages
// @author       You
// @match        https://manga/*
// @grant        none
// ==/UserScript==


(function() {
        'use strict';

setTimeout(function(){
var content = document.getElementById('mainContent');
var canvas = content.children[1];
var ctx = canvas.getContext('2d');
var isDrawing = false;
var enableDrawing = false;
// Event listeners for drawing
document.addEventListener('pointerdown', (e) => {
    if (!enableDrawing) return;
    startDrawing(e);
    e.stopPropagation();
})

document.addEventListener('pointermove', (e) => {
    if (!enableDrawing) return;
    draw(e);
    e.stopPropagation();
});

document.addEventListener('pointerup', (e) => {
    if (!enableDrawing) return;
    endDrawing(e);
    e.stopPropagation();
});

document.addEventListener('pointercancel', (e) => {
    if (!enableDrawing) return;
    endDrawing(e);
    e.stopPropagation();
});

document.addEventListener('pointerout', (e) => {
    if (!enableDrawing) return;
    endDrawing(e);
    e.stopPropagation();
});

function startDrawing(e) {
    isDrawing = true;
    var elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementUnderCursor.classList.contains('mainImage')) return;
    canvas = elementUnderCursor;
    ctx = canvas.getContext('2d');
    draw(e);
}

function hexToRgba(hex, opacity) {
    // Remove the leading hash if it's there
    hex = hex.replace(/^#/, '');
    // Parse the r, g, b values
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    // Create the RGBA color string
    let rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    return rgba;
}


function getValueOf(e) {
    return document.getElementById(e).value;
}

function draw(e) {
    if (!isDrawing) return;
    var fx = canvas.width / canvas.scrollWidth;
    var fy = canvas.height / canvas.scrollHeight;
    var x = e.clientX - canvas.getBoundingClientRect().left;
    x = x * fx;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    y *= fy;
    ctx.lineWidth = getValueOf("writing-size");
    ctx.lineCap = 'round';
    if (document.getElementById("is-marker").checked) ctx.globalCompositeOperation = 'multiply';
    else ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = hexToRgba(getValueOf("writing-color"), getValueOf("writing-opacity"));
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function endDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function inject() {
    var titleBar = document.getElementById('settings-modal');

    // Color Picker
    var colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'writing-color';
    colorPicker.value = '#000000'; // Default color
    titleBar.appendChild(colorPicker);

    // Size Selector
    var sizeLabel = document.createElement('label');
    sizeLabel.for = 'writing-size';
    sizeLabel.innerText = 'Size: ';
    titleBar.appendChild(sizeLabel);

    var sizeSelector = document.createElement('input');
    sizeSelector.type = 'number';
    sizeSelector.id = 'writing-size';
    sizeSelector.min = '1';
    sizeSelector.max = '100';
    sizeSelector.value = '5'; // Default size
    titleBar.appendChild(sizeSelector);

    var opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.id = 'writing-opacity';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.01';
    opacitySlider.value = '1'; // Default opacity
    titleBar.appendChild(opacitySlider);

    var drawEnabled = document.createElement('input');
    drawEnabled.type = 'checkbox';
    drawEnabled.id = 'annotate';
    drawEnabled.addEventListener('input', function() {enableDrawing = !enableDrawing;});
    titleBar.appendChild(drawEnabled);


    var markerCheckbox = document.createElement('input');
    markerCheckbox.type = 'checkbox';
    markerCheckbox.id = 'is-marker';
    titleBar.appendChild(markerCheckbox);
}
inject();
}, 3000);
})();
