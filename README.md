# write

This simple text editor allows you to highlight text and choose one of three
editing options. When an option is selected, the highlighted text is sent to the
Gemini API and replaced with the returned suggestion. The user's API key is
requested once and stored in `sessionStorage` for the rest of the session.

## Setup

Open `index.html` in a modern browser. The first time you use one of the
editing buttons you will be prompted for your Gemini API key.

