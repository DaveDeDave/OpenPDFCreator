const { ipcRenderer } = require('electron');

const windowsTitlebar = '\
<div class="container-fluid p-0">\
  <div class="ms-3 titlebarDrag"><i class="fas fa-file-pdf"></i></div>\
  <div id="titlebarSpace" class="px-5 titlebarDrag">&nbsp;</div>\
  <div>\
    <ul class="nav">\
      <li id="minimize" class="titlebarButton windows" onclick=""><i class="fas fa-window-minimize"></i></li>\
      <li id="maximize" class="titlebarButton windows" onclick=""><i class="far fa-square"></i></li>\
      <li id="close" class="titlebarButton windows" onclick=""><i class="fas fa-times"></i></li>\
    </ul>\
  </div>\
</div>';
const macosTitlebar = '\
<div class="container-fluid p-0">\
  <div>\
    <ul class="nav">\
      <li id="close" class="titlebarButton maclinux ms-1" onclick=""><i class="fas fa-circle"></i></li>\
      <li id="minimize" class="titlebarButton maclinux" onclick=""><i class="fas fa-circle"></i></i></li>\
      <li id="maximize" class="titlebarButton maclinux" onclick=""><i class="fas fa-circle"></i></li>\
    </ul>\
  </div>\
  <div id="titlebarSpace" class="px-5 titlebarDrag">&nbsp;</div>\
</div>';
const linuxTitlebar = '\
<div class="container-fluid p-0">\
  <div class="ms-3 titlebarDrag"><i class="fas fa-file-pdf"></i></div>\
  <div id="titlebarSpace" class="px-5 titlebarDrag">&nbsp;</div>\
  <div>\
    <ul class="nav">\
      <li id="minimize" class="titlebarButton maclinux" onclick=""><i class="fas fa-circle"></i></i></li>\
      <li id="maximize" class="titlebarButton maclinux" onclick=""><i class="fas fa-circle"></i></li>\
      <li id="close" class="titlebarButton maclinux me-1" onclick=""><i class="fas fa-circle"></i></li>\
    </ul>\
  </div>\
</div>';

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('titlebar').innerHTML = process.platform == 'win32' ? windowsTitlebar : process.platform == 'darwin' ? macosTitlebar : linuxTitlebar;

  document.getElementById('close').onclick = () => {  
    ipcRenderer.send('app:quit');
  };

  document.getElementById('minimize').onclick = () => {
    ipcRenderer.send('app:minimize');
  };

  document.getElementById('maximize').onclick = () => {
    ipcRenderer.send('app:maximize');
  }
});