console.log('sidepanel.js');


let columnSelect = document.getElementById("toggleCheckbox");
console.log(columnSelect);

document.querySelectorAll('input[name="column"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        chrome.runtime.sendMessage({ 
            action: "updateColumn", 
            column: event.target.value 
        });
    });
});

document.getElementById("exportBtn").addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "exportButton"});
});

document.getElementById("toggle").addEventListener('change', (event) => {
    chrome.runtime.sendMessage({
        action: "toggle",
        toggle: event.target.checked
    })
});
