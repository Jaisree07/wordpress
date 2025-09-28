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
    this.sizeMap = { "12": 2, "14": 3, "16": 4, "18": 5, "22": 6, "24": 7 };


    this.initFormatButtons();
    this.initFont();
    this.initFontSize();
    this.initAlignment();
    this.initTextColor();
    this.initHighlight();
    this.initLink();
    this.makeLinksClickable();
    this.initLocalImage();
    this.initUrlImage();
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
    this.textColorInput.addEventListener('input',() => {
      const color = this.textColorInput.value;
      this.exec('foreColor', color);
    });
  }

  initHighlight() {
    this.highlightInput.addEventListener('input',() => {
      const color = this.highlightInput.value;
      this.exec('hiliteColor', color);
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
    this.imageBtn.addEventListener('click',() => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => this.insertImage(ev.target.result);
      reader.readAsDataURL(file);
    });
  }

  insertImage(src) {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100%";
    img.style.cursor = "pointer";
    img.classList.add("resizable-img");
    this.editor.appendChild(img);
    this.makeImageEditable(img);
  }

  makeImageEditable(img) {
    img.addEventListener("click",() => this.selectImage(img));
  }

  selectImage(img) {
    this.clearSelectedImages();

    img.style.border = "2px solid black";
    img.style.resize = "both";
    img.style.overflow = "auto";
    const deleteHandler = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        img.remove();
        document.removeEventListener("keydown", deleteHandler);
      }
    };

    document.addEventListener("keydown", deleteHandler);
  }

  clearSelectedImages() {
    const imgs = this.editor.querySelectorAll("img");
    imgs.forEach(i => {
      i.style.border = "";
      i.style.resize = "";
      i.style.overflow = "";
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const editor = new newtest('editor');
});
