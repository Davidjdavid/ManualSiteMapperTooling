chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSitemapPreviewAction") {
      console.log("Sitemap updated:", message.sitemap);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) return;
    const tabId = tabs[0].id;

    if (message.action === "exportButton") {
      chrome.tabs.sendMessage(tabId, { command: "executeAction" });
    } 
    
    if (message.action === "resetAction") {
      chrome.tabs.sendMessage(tabId, { command: "resetAction" });
    } 

    if (message.action === "undoAction") {
      chrome.tabs.sendMessage(tabId, { command: "undoAction" });
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
});