function newPage(file) {
  return `<div class="col my-auto draggable"><img class="img-preview" src="${URL.createObjectURL(file)}" onclick="openpdfcreator.onclick.selectPage(this)" alt="preview"></div>`;
}

function newPageNumber(i) {
  return `<div class="col">${i}</div>`;
}

function defaultDropzoneStyle() {
  let dropzone = document.getElementById("dropzone");
  dropzone.style.fontSize = 35;
  dropzone.style.opacity = 1;
}

function hoverDropzoneStyle() {
  let dropzone = document.getElementById("dropzone");
  dropzone.style.fontSize = 50;
  dropzone.style.opacity = 0.9;
}

function disableEditButtons() {
  document.getElementById('deletePage').disabled = true;
}

function enableEditButtons(i) {
  document.getElementById('deletePage').disabled = false;
}

function find(previewPages, page) {
  for(let i = 0; i < previewPages.length; i++)
    if(previewPages[i].children[0] == page)
      return i;
  return -1;
}

module.exports = {
  newPage,
  newPageNumber,
  disableEditButtons,
  enableEditButtons,
  find
}

module.exports.style = {
  defaultDropzoneStyle,
  hoverDropzoneStyle
}