const utility = require('./utility');

/* offcanvas, modal and toast */
const sidebar = new bootstrap.Offcanvas(document.getElementById('sidebar'));
const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
const aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'));
const toast = new bootstrap.Toast(document.getElementById('alertToast'));

/* page elements */
const loadPage = document.getElementById('loadPage');
const preview = document.getElementById('preview_pages');
const pagesNumber = document.getElementById('pages_number');
const goLeft = document.getElementById('left');
const goRight = document.getElementById('right');
const pdfPreview = document.getElementById('pdfPreview');

/* variables */
window.pages = []; /* array of file */
let firstPreview = 0; /* it indicates the index of the first preview in the pages array */
let selectedPreview = -1; /* value beetwen [0, maxPagePreview-1]. It indicades which preview is selected. If it's set to -1 it indicates that no preview is selected */
const maxPagePreview = 10; /* this value indicates the max number of preview that are visible in the bottom area */

function ondrag(event) {
  event.stopPropagation();
  event.preventDefault();
  utility.style.hoverDropzoneStyle();
}

function ondrop(event) {
  event.stopPropagation();
  event.preventDefault();
  utility.style.defaultDropzoneStyle();
  addPage(event, true);
}

function triggerLoadPage() {
  loadPage.click();
}

/**
 * It adds new files to the pages array
 * @param drop if true you have added the page with drag and drop
 */
function addPage(event, drop=false) {
  const transferFiles = drop ? event.dataTransfer.files : event.target.files;
  for(const file of transferFiles) {
    if(file.type.startsWith('image')) {
      pages.push(file);
      document.getElementById('genereatePDF').disabled = false;
      if(pages.length <= maxPagePreview) { 
        preview.innerHTML += utility.newPage(file);
        pagesNumber.innerHTML += utility.newPageNumber(pages.length);
      } else if(goRight.disabled) {
        goRight.disabled = false;
      }
    } else {
      document.getElementById('alertContainer').style.display = 'block';
      toast.show();      
    }
  }
  if(!drop) loadPage.value = '';
}

function refreshPagesNumber() {
  pagesNumber.innerHTML = '';
  let n = pages.length >= maxPagePreview ? maxPagePreview : pages.length;
  for(let i = firstPreview; i < firstPreview+n; i++)
    pagesNumber.innerHTML += utility.newPageNumber(i+1);
}

/**
 * It scrolls to left the preview zone
 */
function left() {
  if(pages.length <= maxPagePreview || firstPreview - 1 < 0) return;
  if(selectedPreview == preview.children.length - 1) {
    selectedPreview = -1;
    utility.disableEditButtons();
  } else if(selectedPreview != -1) {
    selectedPreview += 1;
  }

  preview.children[preview.children.length-1].remove();
  firstPreview -= 1;
  preview.innerHTML = utility.newPage(pages[firstPreview]) + preview.innerHTML;
  goRight.disabled = false;

  if(firstPreview - 1 < 0)
    goLeft.disabled = true;
  refreshPagesNumber();
}

/**
 * It scrolls to right the preview zone
 */
function right() {
  if(pages.length <= maxPagePreview || firstPreview + maxPagePreview >= pages.length) return;
  if(selectedPreview == 0) {
    selectedPreview = -1;
    utility.disableEditButtons();
  } else if(selectedPreview != -1) {
    selectedPreview -= 1;
  }

  preview.children[0].remove();
  firstPreview += 1; 
  preview.innerHTML += utility.newPage(pages[firstPreview+maxPagePreview-1]);
  goLeft.disabled = false;

  if(firstPreview + maxPagePreview >= pages.length)
    goRight.disabled = true;
  refreshPagesNumber();
}

/**
 * It select the input page
 * @param page the page element you want to select
 */
function selectPage(page) {
  let i = utility.find(preview.children, page);

  if(i == selectedPreview) {
    selectedPreview = -1;
    utility.disableEditButtons();
    page.style = '';
    return;
  }

  page.style.opacity = 0.9;
  page.style.border = '1px solid blue';
  page.style.transform = 'translateY(-10%)';

  if(selectedPreview != -1) {
    preview.children[selectedPreview].children[0].style = '';
  }

  selectedPreview = i;
  utility.enableEditButtons(i);
}

/**
 * It delete the selected page
 */
function deletePage() {
  if(selectedPreview != -1) {
    preview.children[selectedPreview].remove();
    pages.splice(firstPreview+selectedPreview, 1);

    if(firstPreview + maxPagePreview - 1 < pages.length) {
      preview.innerHTML += utility.newPage(pages[firstPreview+maxPagePreview-1]);
    } else if(pages.length >= maxPagePreview) {
      firstPreview -= 1;
      preview.innerHTML = utility.newPage(pages[firstPreview]) + preview.innerHTML;
    }
    
    if((firstPreview - 1) < 0) {
      goLeft.disabled = true;
    }
    if((firstPreview + maxPagePreview) >= pages.length) {
      goRight.disabled = true;
    }
    if(pages.length == 0) {
      document.getElementById('genereatePDF').disabled = true;
    }
    
    selectedPreview = -1;
    refreshPagesNumber();
    utility.disableEditButtons();
  }
}

function showPreviewModal() {
  pdfPreview.innerHTML = '';
  let content = '';

  for(let i = 0; i < pages.length; i++) {
    content += `<div class="row my-3 text-center"><div class="col"><img class="img-fluid mx-auto w-25" src="${URL.createObjectURL(pages[i])}"></img></div></div>`
  }
  pdfPreview.innerHTML += content;

  sidebar.hide(); 
  previewModal.show();
} 

function showModal(modal) {
  sidebar.hide();
  modal.show();
}

function backToSidebar(modal) {
  modal.hide();
  sidebar.show();
}

function hideModal(modal) {
  modal.hide();
}

loadPage.oninput = addPage;

/* Sortable animation */
const sortable = new Draggable.Sortable(document.querySelectorAll('#preview_pages'), {
  draggable: '.draggable',
  mirror: {
    constrainDimensions: true,
  },
  plugins: [Draggable.Plugins.SortAnimation],
  swapAnimation: {
    duration: 200,
    easingFunction: 'ease-in-out',
  },
});

let source = undefined;

sortable.on('sortable:start', (evt) => {
  source = evt.data.startIndex;
});

sortable.on('sortable:stop', (evt) => {
  let destination = evt.data.newIndex;

  if(source == selectedPreview)
    selectedPreview = evt.data.newIndex;
  else if(source > selectedPreview && destination <= selectedPreview)
    selectedPreview += 1;
  else if(source < selectedPreview && destination >= selectedPreview) {
    selectedPreview -= 1;
  }

  source += firstPreview;
  destination += firstPreview;

  if(source > destination) {
    pages.splice(destination, 0, pages[source]);
    pages.splice(source+1, 1);
  } else if(source < destination) {
    pages.splice(destination+1, 0, pages[source]);
    pages.splice(source, 1);
  }
});

module.exports.onclick = {
  triggerLoadPage,
  left,
  right,
  selectPage,
  deletePage,
  showPreviewModal,
  showModal,
  hideModal,
  backToSidebar
}

module.exports.events = {
  ondrag,
  ondrop
}

module.exports.components = {
  sidebar,
  previewModal,
  infoModal,
  aboutModal,
  pdfPreview
}

module.exports.style = utility.style;