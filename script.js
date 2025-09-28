class newtest {
  constructor(editorId) {
    this.editor = document.getElementById(editorId);
    this.formatButtons = document.querySelectorAll('[data-cmd]');
    this.fontSelect = document.getElementById('font');
    this.sizeSelect = document.getElementById('size');
    this.alignButtons = document.querySelectorAll('[data-cmd^="justify"]');
    this.textColorInput = document.getElementById('text');
    this.highlightInput = document.getElementById('highlight');

    this.sizeMap = { "12": 2, "14": 3, "16": 4, "18": 5, "22": 6, "24": 7 };


    this.initFormatButtons();
    this.initFont();
    this.initFontSize();
    this.initAlignment();
    this.initTextColor();
    this.initHighlight();
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
    });
  }

  initHighlight() {
    this.highlightInput.addEventListener('input', () => {
      const color = this.highlightInput.value;
      this.exec('hiliteColor', color);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const editor = new newtest('editor');
});
