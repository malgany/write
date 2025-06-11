# write

This simple text editor allows you to highlight text and choose one of three editing options. When an option is selected, the highlighted text is sent to the Gemini API and replaced with the returned suggestion.

## Adding your Gemini API key

The first time you choose one of the editing commands you will be prompted for your Gemini API key. The key is stored in `sessionStorage` for the duration of the browser session. To enter a different key later, clear the value with `sessionStorage.removeItem('geminiApiKey')` in the browser console and reload the page.

## Running locally

Simply open `index.html` in a modern browser. No build step is required as the project is completely client-side.

## Hosting with GitHub Pages

1. Push the repository to GitHub.
2. From the repository settings enable **GitHub Pages** and choose the root directory as the source.
3. Visit the generated URL (typically `https://<username>.github.io/<repository>/`) to access the editor online.

## Using the editor

1. Type or paste your text into the editable area.
2. Select a portion of text to make a pop-up appear with the three editing options.
3. Choose an option and the selected text will be replaced with the AI suggestion returned by Gemini.
4. Every change is stored locally. Earlier versions appear under **Past Versions**; click a version to restore it.
