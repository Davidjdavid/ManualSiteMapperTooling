chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check for the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) return;
    const tabId = tabs[0].id;

    if (message.action === "exportButton") {
      chrome.tabs.sendMessage(tabId, { command: "executeAction" });
    
    } 
    
    if (message.action === "updateColumn") {
      chrome.tabs.sendMessage(tabId, { 
          command: "setColumn", 
          column: message.column 
      });
    }

    if (message.action === "toggle") {
      chrome.tabs.sendMessage(tabId, { 
          command: "toggleActive", 
          toggle: message.toggle 
      });
    }
  });
  
  // Return true if you might send a response asynchronously
  // (Not strictly needed here, but good practice)
  return true; 
});
