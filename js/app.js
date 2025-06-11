// Popup menu for text selection editing

(function () {
  let menu = null;

  function removeMenu() {
    if (menu) {
      menu.remove();
      menu = null;
    }
  }

  function showMenu(x, y, range) {
    removeMenu();
    menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.background = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '4px';
    menu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    menu.style.zIndex = 1000;

    const options = [
      'Ajuste ortográfico',
      'Melhore a fluidez',
      'Tornar o texto mais formal'
    ];

    options.forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.display = 'block';
      btn.style.margin = '2px 0';
      btn.addEventListener('click', () => {
        const currentText = range.toString();
        const newText = window.prompt(label + ':', currentText);
        if (newText !== null) {
          range.deleteContents();
          range.insertNode(document.createTextNode(newText));
        }
        removeMenu();
      });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
  }

  document.addEventListener('mouseup', (e) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      const rect = range.getBoundingClientRect();
      const x = rect.left + window.pageXOffset;
      const y = rect.bottom + window.pageYOffset;
      showMenu(x, y, range);
    } else {
      removeMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (menu && !menu.contains(e.target)) {
      removeMenu();
    }
  });
})();
