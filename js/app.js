// Popup menu for text selection editing

(function () {
  let menu = null;
  const editor = document.getElementById('editor');

  function getVersions() {
    try {
      return JSON.parse(localStorage.getItem('versions')) || [];
    } catch (e) {
      return [];
    }
  }

  function storeVersions(versions) {
    localStorage.setItem('versions', JSON.stringify(versions));
  }

  function updateVersionList() {
    const versions = getVersions();
    const ul = document.getElementById('versions-list');
    if (!ul) return;
    ul.innerHTML = '';
    versions.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      li.addEventListener('click', () => {
        editor.innerText = text;
      });
      ul.appendChild(li);
    });
  }

  function saveVersion() {
    const text = editor.innerText;
    const versions = getVersions();
    if (versions.length === 0 || versions[versions.length - 1] !== text) {
      versions.push(text);
      storeVersions(versions);
      updateVersionList();
    }
  }

  function setupVersionTracking() {
    updateVersionList();
    let timer;
    editor.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(saveVersion, 300);
    });
  }

  document.addEventListener('DOMContentLoaded', setupVersionTracking);

  function getApiKey() {
    let key = sessionStorage.getItem('geminiApiKey');
    if (!key) {
      key = window.prompt('Insira sua chave da API Gemini:');
      if (key) {
        sessionStorage.setItem('geminiApiKey', key);
      }
    }
    return key;
  }

  async function sendToGemini(prompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key não fornecida.');
    }

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
      encodeURIComponent(apiKey);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      const part = data.candidates[0].content.parts[0];
      return part.text || data.candidates[0].output || '';
    }
    throw new Error('Resposta inesperada da API');
  }

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
    const prompts = {
      'Ajuste ortográfico': 'Corrija a ortografia do texto a seguir:',
      'Melhore a fluidez': 'Melhore a fluidez do texto a seguir:',
      'Tornar o texto mais formal': 'Torne o texto a seguir mais formal:'
    };

    options.forEach(label => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.display = 'block';
      btn.style.margin = '2px 0';
      btn.addEventListener('click', async () => {
        const currentText = range.toString();
        const prompt = `${prompts[label]}\n\n"${currentText}"`;
        try {
          const suggestion = await sendToGemini(prompt);
          if (suggestion) {
            range.deleteContents();
            range.insertNode(document.createTextNode(suggestion));
            saveVersion();
          }
        } catch (err) {
          alert(err.message);
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
