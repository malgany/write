import CONFIG from './config.js';

async function callGemini(text, intervention) {
  const apiKey = CONFIG.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not set');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKey}`;
  const payload = {
    contents: [
      { parts: [{ text: `${intervention}: ${text}` }] }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function handleClick() {
  const textarea = document.getElementById('inputArea');
  const select = document.getElementById('intervention');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end) || textarea.value;

  try {
    const suggestion = await callGemini(selected, select.value);
    textarea.setRangeText(suggestion, start, end, 'end');
  } catch (err) {
    console.error(err);
    alert('Failed to fetch suggestion');
  }
document.getElementById('runButton').addEventListener('click', handleClick);
