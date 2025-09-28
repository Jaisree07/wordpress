const editor = document.getElementById('editor');
const formatButtons = document.querySelectorAll('[data-cmd]');

formatButtons.forEach(button => {
  button.addEventListener('click', () => {
    const command = button.dataset.cmd;
    document.execCommand(command, false, null); 
  });
});
