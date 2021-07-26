const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

/**
 * It generate the pdf from the files in the pages array
 */
function generate() {
  const pdf = new PDFDocument({autoFirstPage: false});
  const stream = pdf.pipe(blobStream());
  let xhr = new XMLHttpRequest;
  let img = new Image();
  let i = 0;

  xhr.responseType = 'arraybuffer';
  xhr.onload = () => {
    pdf.addPage({size: [720, img.height*720/img.width]});
    pdf.image(xhr.response, 0, 0, {width: 720});
    i += 1;
    if(i < pages.length) {
      img.src = URL.createObjectURL(pages[i]);
    } else {
      pdf.end();
    }
  }

  img.onload = () => {
    xhr.open('GET', URL.createObjectURL(pages[i]), true);
    xhr.send();
  }
  img.src = URL.createObjectURL(pages[i]);

  stream.on('finish', () => {
    const link = document.createElement('a');
    link.href = stream.toBlobURL('application/pdf');
    link.download = 'default';
    link.click();
  });
}

module.exports.generate = generate;