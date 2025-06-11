const editor = document.getElementById('editor');
const historyList = document.getElementById('history');

function loadVersions() {
    return JSON.parse(localStorage.getItem('versions') || '[]');
}

function saveVersions(versions) {
    localStorage.setItem('versions', JSON.stringify(versions));
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
    editor.value = version.content;
    recordVersion(version.content);
}

// manual input
editor.addEventListener('input', () => recordVersion(editor.value));

// simulate an API update
document.getElementById('apiUpdate').addEventListener('click', () => {
    const apiContent = `API content at ${new Date().toLocaleString()}`;
    editor.value = apiContent;
    recordVersion(apiContent);
});

// initialize
(function init() {
    const versions = loadVersions();
    if (versions.length) {
        editor.value = versions[versions.length - 1].content;
    }
    updateHistory();
})();
