// Version tracking for the contenteditable editor
const editor = document.getElementById('editor');
const historyList = document.getElementById('history');

function loadVersions() {
  return JSON.parse(localStorage.getItem('versions') || '[]');
}

function saveVersions(versions) {
  localStorage.setItem('versions', JSON.stringify(versions));
}

function getEditorContent() {
  return editor.innerHTML;
}

function setEditorContent(content) {
  editor.innerHTML = content;
}

function recordVersion(content) {
  const versions = loadVersions();
  versions.push({ content, timestamp: new Date().toISOString() });
  saveVersions(versions);
  updateHistory();
}

function updateHistory() {
  const versions = loadVersions();
  historyList.innerHTML = '';
  versions.forEach((v, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = v.timestamp;
    button.addEventListener('click', () => restoreVersion(i));
    li.appendChild(button);
    historyList.appendChild(li);
  });
}

function restoreVersion(index) {
  const versions = loadVersions();
  const version = versions[index];
  if (!version) return;
  setEditorContent(version.content);
  recordVersion(version.content);
}

editor.addEventListener('input', () => recordVersion(getEditorContent()));

document.getElementById('apiUpdate').addEventListener('click', () => {
  const apiContent = `API content at ${new Date().toLocaleString()}`;
  setEditorContent(apiContent);
  recordVersion(apiContent);
});

(function init() {
  const versions = loadVersions();
  if (versions.length) {
    setEditorContent(versions[versions.length - 1].content);
  }
  updateHistory();
})();
