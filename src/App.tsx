import React from 'react';
import { DOMMessage, DOMMessageResponse } from './types';
import chatgptIcon from './assets/images/chatgpt.jpeg';
import './App.css';

function App() {
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { type: 'GET_DOM' } as DOMMessage,
        (response: DOMMessageResponse) => {
          setTitle(response.title);
          setHeadlines(response.headlines);
        });
    });
  });

  console.log(title, headlines);

  return (
    <div className="app">
      <div className="header">
        <img src={chatgptIcon} alt="chatgpt-icon" className="chatgpt-icon" />
        <h3>ChatGPT Chrome Extension</h3>
      </div>
      <div className="tip">
        <span>Tip: setup shortcuts for faster access</span>
      </div>
      <div className="main-content">
        <div>
          <span className="explain-text">
            Please login and pass Cloudflare check at
          </span>
        </div>
        <div className="link-text">
          <a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a>
        </div>
      </div>
    </div>
  );
}

export default App;
