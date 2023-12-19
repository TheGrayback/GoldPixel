window.oncontextmenu = () => false; // cancel default menu

const bgCanvas = document.querySelector(".background-canvas");
const drawCanvas = document.querySelector(".drawing-canvas");
const shadowCanvas = document.querySelector(".shadow-canvas");
const pencilButton = document.querySelector(".pencil-button");
const eraserButton = document.querySelector(".eraser-button");
const colorPicker = document.querySelector(".color-picker");
const saveButton = document.querySelector(".save-button");
const popupContainer = document.querySelector(".popup-container");
const closePopup = document.querySelector(".close-popup");
const saveFile = document.querySelector(".save-file");
const fileName = document.querySelector(".file-name");

const canvasSize = 600;

function setCanvasSize(canvas, canvasSize) {
    canvas.width = canvasSize;
    canvas.height = canvasSize;
}

setCanvasSize(bgCanvas, canvasSize);
setCanvasSize(drawCanvas, canvasSize);
setCanvasSize(shadowCanvas, canvasSize);

const bgCtx = bgCanvas.getContext("2d");
const drawCtx = drawCanvas.getContext("2d");
const shadowCtx = shadowCanvas.getContext("2d");

const pixelCount = 50;

const pixelSize = canvasSize / pixelCount;

bgCtx.fillStyle = "#CCC";
for (let i = 0; i < pixelCount; i++) {
    const startPoint = i % 2;
    for (let j = startPoint; j < canvasSize; j += 2) {
        bgCtx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
}

let x, y;
let isMouseDown = false;
let isEraserOn;
pencilOn();
shadowCtx.fillStyle = "rgba(0, 0, 0, 0.5)";

shadowCanvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        draw(x, y, pixelSize, pixelSize);
    }
    shadowCtx.clearRect(x, y, pixelSize, pixelSize);

    x = pixelSize * roundToPixel(e.offsetX);
    y = pixelSize * roundToPixel(e.offsetY);

    shadowCtx.fillRect(x, y, pixelSize, pixelSize);
});

function draw(x, y, pixelSize, pixelSize) {
    if (isEraserOn) {
        drawCtx.clearRect(x, y, pixelSize, pixelSize);
    } else {
        drawCtx.fillRect(x, y, pixelSize, pixelSize);
    }
}

function roundToPixel(value) {
    return Math.floor(value / pixelSize);
}

shadowCanvas.addEventListener("mousedown", (e) => {
    draw(x, y, pixelSize, pixelSize);
    isMouseDown = true;
});

shadowCanvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
});

eraserButton.addEventListener("click", () => {
    isEraserOn = true;
    eraserButton.style.backgroundColor = "rgba(0, 127, 0, 0.7)";
    pencilButton.style.backgroundColor = "white";
});
pencilButton.addEventListener("click", (e) => pencilOn());

function pencilOn() {
    isEraserOn = false;
    pencilButton.style.backgroundColor = "rgba(0, 127, 0, 0.7)";
    eraserButton.style.backgroundColor = "white";
}

colorPicker.addEventListener("change", () => {
    drawCtx.fillStyle = colorPicker.value;
});

saveButton.addEventListener("click", () => {
    popupContainer.style.display = 'flex';
});

closePopup.addEventListener("click", () => {
    popupContainer.style.display = 'none';
});

saveFile.addEventListener("click", () => {
    const link = document.createElement('a');
    link.download = `${fileName.value}.png`;
    link.href = drawCanvas.toDataURL();
    link.click();
    link.delete;
});