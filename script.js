const editor = document.getElementById('editor');
const formatButtons = document.querySelectorAll('[data-cmd]');

formatButtons.forEach(button => {
  button.addEventListener('click', () => {
    const command = button.dataset.cmd;
    document.execCommand(command, false, null); 
  });
});

const fontselect = document.getElementById('font');
fontselect.addEventListener('change', () => {
  const font = fontselect.value;
  document.execCommand('fontName', false, font);
  editor.focus();
});

const sizeselect = document.getElementById('size');
const sizeMap = {"12": 2,"14": 3,"16": 4,"18": 5,"22": 6,"24": 7};
sizeselect.addEventListener('change', () => {
  const px = sizeselect.value;
  const size = sizeMap[px];
  document.execCommand('fontSize', false, size);
  editor.focus();
});