class newtest {
  constructor(editorId) {
    this.editor = document.getElementById(editorId);
    this.formatButtons = document.querySelectorAll('[data-cmd]');
    this.fontSelect = document.getElementById('font');
    this.sizeSelect = document.getElementById('size');
    this.alignButtons = document.querySelectorAll('[data-cmd^="justify"]');
    this.textColorInput = document.getElementById('text');
    this.highlightInput = document.getElementById('highlight');
    this.linkButton = document.getElementById('link');
    this.imageBtn = document.getElementById('image');
    this.fileInput = document.getElementById('file');
    this.tableBtn = document.getElementById('table');
    this.pdfBtn = document.getElementById('pdf');
    const content = document.querySelector("#editor");
    const clearBtn = document.getElementById('clear-saved');
    this.sizeMap = { "12": 2, "14": 3, "16": 4, "18": 5, "22": 6, "24": 7 };
    if (clearBtn) {
   clearBtn.addEventListener('click', () => this.clearSavedContentAndStopAutoSave());
}

    this.initFormatButtons();
    this.initFont();
    this.initFontSize();
    this.initAlignment();
    this.initTextColor();
    this.initHighlight();
    this.initLink();
    this.makeLinksClickable();
    this.initLocalImage();
    this.initTable();
    this.initCopyFunctions();
    this.initReset();
    this.initFindReplace();
    this.initAutoSave();
    this.initExportPDF();
    this.initPreview();
    this.initClearFormatting();
    this.initMode();
    this.clearSavedContentAndStopAutoSave();
    this.initExportDoc();

  }

  clearSavedContentAndStopAutoSave() {
  localStorage.removeItem('editorContent');
  if (this.autoSaveInterval) {
    clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = null;
  }
}

  exec(command, value = null) {
    this.editor.focus();
    document.execCommand(command, false, value);
  }

  initFormatButtons() {
    this.formatButtons.forEach(button => {
      button.addEventListener('click', () => {
        const command = button.dataset.cmd;
        this.exec(command);
      });
    });
  }

  initFont() {
    this.fontSelect.addEventListener('change', () => {
      const font = this.fontSelect.value;
      this.exec('fontName', font);
    });
  }

  initFontSize() {
    this.sizeSelect.addEventListener('change', () => {
      const px = this.sizeSelect.value;
      const size = this.sizeMap[px];
      this.exec('fontSize', size);
    });
  }

  initAlignment() {
    this.alignButtons.forEach(button => {
      button.addEventListener('click', () => {
        const command = button.dataset.cmd;
        this.exec(command);
      });
    });
  }

  initTextColor() {
  this.textColorInput.addEventListener('input', () => {
    const color = this.textColorInput.value;
    this.exec('foreColor', color);
    this.textColorInput.style.backgroundColor = color;
    this.textColorInput.style.color = this.getContrastColor(color);
  });
}
getContrastColor(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return (r*0.299 + g*0.587 + b*0.114) > 186 ? '#000000' : '#ffffff';
}
 initHighlight() {
  this.highlightInput.addEventListener('input', () => {
    const color = this.highlightInput.value;
    this.exec('hiliteColor', color);
    this.highlightInput.style.backgroundColor = color;
    this.highlightInput.style.color = this.getContrastColor(color);
  });
}
  makeLinksClickable() {
  this.editor.addEventListener('click',(e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault(); 
      window.open(e.target.href, '_blank'); 
    }
  });
}

 initLink() {
  const linkBtn = document.getElementById('link');
  if (!linkBtn) return;

  linkBtn.addEventListener('click',() => {
    const url = prompt("Enter the URL:");
    if (!url) return;
    this.exec('createLink', url);
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank"; 
        anchor.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(anchor);
      }
    }
    this.editor.focus();
  });
}
initLocalImage() {
  this.imageBtn.addEventListener("click", () => this.fileInput.click());

  this.fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => this.insertImage(ev.target.result);
    reader.readAsDataURL(file);
  });
}

insertImage(src) {
  const container = document.createElement("div");
  container.classList.add("image-container");
  container.contentEditable = "false";
  container.style.display = "inline-block";
  container.style.resize = "both";
  container.style.overflow = "hidden";
  container.style.border = "1px dashed transparent";
  container.style.maxWidth = "100%"; 
  container.style.margin = "8px 0";

  const img = document.createElement("img");
  img.src = src;
  img.draggable="false";
  img.contentEditable = "false";
  img.style.width = "100%";  
  img.style.height = "100%";
  img.style.objectFit = "contain"; 

  container.appendChild(img);

  const sel = window.getSelection();
  if (!sel.rangeCount) {
    this.editor.appendChild(container);
  } else {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(container);
  }

  this.editor.focus();

  container.addEventListener("click", () => {
  this.clearSelectedImages();
  container.classList.add("selected");
  container.style.border = "1px dashed #007bff";

  const deleteHandler = (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && container.classList.contains("selected")) {
      e.preventDefault();
      container.remove();
      document.removeEventListener("keydown", deleteHandler);
    }
  };
  document.addEventListener("keydown", deleteHandler);
});
}

clearSelectedImages() {
  const containers = this.editor.querySelectorAll(".image-container");
  containers.forEach(c => {
    c.classList.remove("selected");
    c.style.border = "1px dashed transparent";
  });
}

initTable() {
    this.tableBtn.addEventListener('click', () => {
      const size = prompt("Enter table size as Rows x Columns (e.g., 2x3):", "3x3");
      if (!size) return;
      const parts = size.split('x');
      if (parts.length !== 2) return alert("Invalid format. Use Rows x Columns");
      const rows = parseInt(parts[0]);
      const cols = parseInt(parts[1]);
      if (isNaN(rows) || isNaN(cols)) return alert("Invalid numbers");
      this.insertTableAtCursor(rows, cols);
    });
  }

insertTableAtCursor(rows, cols) {
  const container = document.createElement('div');
  container.contentEditable = "false";
  container.style.resize = "both";
  container.style.overflow = "auto";
  container.style.border = "2px dashed #888";
  container.style.width = "400px";   
  container.style.height = "200px";  
  container.style.margin = "10px 0";


  const table = document.createElement('table');
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.height = "100%";      
  table.style.tableLayout = "fixed";
  table.style.margin = "0";

  for (let r = 0; r < rows; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
      const td = document.createElement('td');
      td.style.border = "1px solid #999";
      td.style.padding = "8px";
      td.style.wordBreak = "break-word";
      td.contentEditable = "true";
      td.innerHTML = "&nbsp;";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
  const sel = window.getSelection();
  if (!sel.rangeCount) {
    this.editor.appendChild(container);
  } else {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(container);
    const space = document.createTextNode("\n");
    container.parentNode.insertBefore(space, container.nextSibling);
  }


  this.editor.focus();

  container.addEventListener("click", () => {
  this.clearSelectedTables();
  container.classList.add("selected");

  const deleteHandler = (e) => {
    const active = document.activeElement;
    if (active && active.tagName === "TD" && active.isContentEditable) {
      return; 
    }

    if ((e.key === "Delete" || e.key === "Backspace") && container.classList.contains("selected")) {
      e.preventDefault();
      container.remove();
      document.removeEventListener("keydown", deleteHandler);
    }
  };

  document.addEventListener("keydown", deleteHandler);
});
}


clearSelectedTables() {
  const containers = this.editor.querySelectorAll("div[contenteditable='false']");
  containers.forEach(c => c.classList.remove("selected"));
}


initCopyFunctions() {
  const copyPlainBtn = document.getElementById('copyplain');
  const copyHtmlBtn = document.getElementById('copyhtml');

  if (copyPlainBtn) {
    copyPlainBtn.addEventListener('click', () => {
      const selection = window.getSelection();
      const text = selection.toString();  
      if (!text) {
        alert("Select the text to copy");
        return;
      }
      navigator.clipboard.writeText(text)
        .then(() => alert("Text Copied"))
        .catch(err => alert("Copy failed: " + err));
    });
  }

  if (copyHtmlBtn) {
    copyHtmlBtn.addEventListener('click', () => {
      const html = this.editor.innerHTML;
      navigator.clipboard.writeText(html)
        .then(() => alert("Copied as HTML"))
        .catch(err => alert("Copy failed: " + err));
    });
  }
}
initReset() {
  const clearBtn = document.getElementById('reset');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    this.editor.innerHTML = "";   
    this.editor.focus();          
  });
}

initFindReplace() {
  const findBtn = document.getElementById('find');
  if (!findBtn) return;
  findBtn.addEventListener('click', () => {
    const findText = prompt("Enter text to find");
    if (!findText) return;
    const replaceText = prompt(`Replace "${findText}" with:`) ?? "";
    this.editor.innerHTML = this.editor.innerHTML.replaceAll(findText, replaceText);
    this.editor.focus();
  });
}

initAutoSave() {
  const saved = localStorage.getItem("editorContent");
  if (saved) this.editor.innerHTML = saved;
  setInterval(() => {
    localStorage.setItem("editorContent", this.editor.innerHTML);
  }, 2000);
}
initExportPDF() {
  const pdfBtn = document.getElementById("pdf");
  if (!pdfBtn) return;

  pdfBtn.addEventListener("click", () => {
    const content = document.getElementById("editor");
    if (!content) return;

    const clone = content.cloneNode(true);
    clone.querySelectorAll('input, button, select, .placeholder').forEach(el => el.remove());
    const tempContainer = document.createElement('div');
    tempContainer.style.background = "#ffffff";
    tempContainer.style.padding = "20px";
    tempContainer.style.width = "800px"; 
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);
    html2pdf()
      .set({
        margin: 10,
        filename: "document.pdf",
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      })
      .from(tempContainer)
      .save()
      .then(() => document.body.removeChild(tempContainer));
  });
}



initPreview() {
  const previewBtn = document.getElementById('preview');
  const modal = document.getElementById('previewmodal');
  const previewContent = document.getElementById('previewcontent');
  const closeBtn = document.getElementById('closepreview');
  previewBtn.addEventListener('click', () => {
    previewContent.innerHTML = this.editor.innerHTML;
    modal.style.display = 'flex'; 
  });
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'; 
    previewContent.innerHTML = '';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      previewContent.innerHTML = '';
    }
  });
}

initClearFormatting() {
  const clearBtn = document.getElementById('clear');
  if (!clearBtn) return;
  clearBtn.addEventListener('click', () => {
    const plainText = this.editor.innerText;
    this.editor.innerHTML = plainText;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(this.editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    this.editor.focus();
  });
}

initMode() {
  const darkBtn = document.getElementById('dark');
  const darkText = document.getElementById('dark-text');

  if (!darkBtn) return;

  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      darkText.textContent = 'Light Mode';
    } else {
      darkText.textContent = 'Dark Mode';
    }
  });
}

initExportDoc() {
  const docBtn = document.getElementById("doc");
  if (!docBtn) return;

  docBtn.addEventListener("click", () => {
    const content = document.getElementById("editor");
    if (!content) return;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"></head><body>`;
    const footer = `</body></html>`;
    const sourceHTML = header + content.innerHTML + footer;
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}


}
document.addEventListener('DOMContentLoaded', () => {
  const editor = new newtest('editor');
//   editor.initExportPDF();
//   editor.initExportDoc();
});
