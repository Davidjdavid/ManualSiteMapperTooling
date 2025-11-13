console.log('sidepanel.js');


let columnSelect = document.getElementById("toggleCheckbox");
console.log(columnSelect);

//Changes the current column we are adding pages to whatever depth the user clicks on their keyboard
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "1":
            // Fixed typo: currnetColumn -> currentColumn
            return currentColumn = "1";
        case "2":
            return currentColumn = "2";
        case "3":
            return currentColumn = "3";
        case "4":
            return currentColumn = "4";
        case "5":
            return currentColumn = "5";
    }
});

document.getElementById("exportBtn").addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "doSomething"});
});