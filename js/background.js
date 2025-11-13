chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if message is from the sidebar (sender.url) or has a specific action
  if (message.action === "doSomething") {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "executeAction" });
      }
    });
  }
});