let capturedLinks = [];
let toolingActive = false; // Start the tool off by default
let currentColumn = "1";
let box = null;

document.addEventListener("mousedown", mouseDown);
document.addEventListener('click', logKey);




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    //Change all of this if else stuff into a switch statement
    if (message.command === "executeAction") {
        downloadJSONAsCSV(capturedLinks);
    } 
    if (message.command === "setColumn") {
        currentColumn = message.column;
    }
    if (message.command === "toggleActive") {
        toggleStatus = message.toggle;
        if(toggleStatus) {
            toolingActive = true;
        }
        if(!toggleStatus) {
            toolingActive = false;
        }
    }
    if (message.command === "resetAction") {
        capturedLinks.length = 0;
    }

    if (message.command === "undoAction") {
        if(capturedLinks.length > 0) {
            capturedLinks.pop();
        }
    }
});

// Class that is used to call on when a new Excel row is used
class ExcelRow {
    constructor(params) {
        this._col1 = params.col1 || ""
        this._col2 = params.col2 || ""
        this._col3 = params.col3 || ""
        this._col4 = params.col4 || ""
        this._col5 = params.col5 || ""
        // Fixed: The property should match what you set in logKey
        this._colURLs = params.colURLs || "" 
    }

}

function logKey(e) { // Fixed: Use 'e' instead of 'event'
    const linkElement = e.target.closest('a');

    // Check if a link was clicked, if the tool is on, AND if the link is NOT a blob URL
    if (toolingActive && !linkElement.href.startsWith('blob:')) {

        let newRow = new ExcelRow({})
        e.preventDefault(); // Fixed: Use 'e'

        // Fixed typo: currnetColumn -> currentColumn
        switch (currentColumn) {
            case "1":
                newRow._col1 = linkElement.text;
                break;
            case "2":
                newRow._col2 = linkElement.text;
                break;
            case "3":
                newRow._col3 = linkElement.text;
                break;
            case "4":
                newRow._col4 = linkElement.text;
                break;
            case "5":
                newRow._col5 = linkElement.text;
                break;
        }
        // Property now matches the class constructor (_colURLs)
        newRow._colURLs = linkElement.href 
        
        capturedLinks.push(newRow);

        chrome.runtime.sendMessage({
            action: "updateSitemapPreviewAction",
            sitemap: capturedLinks
        });

        let linksAsJSON = JSON.stringify(capturedLinks);

        
    }
}

function downloadJSONAsCSV(jsonData, filename = 'data.csv') {
    if (!jsonData || !jsonData.length) {
        console.error("Invalid or empty JSON data provided.");
        return;
    }

    const keys = Object.keys(jsonData[0]);
    const csvHeader = keys.join(',') + '\n';

    const csvRows = jsonData.map(row => {
        return keys.map(key => {
            let cell = row[key] === null || row[key] === undefined ? '' : row[key];
            cell = String(cell).replace(/"/g, '""'); // Escape double quotes
            if (/[",\n]/.test(cell)) {
                cell = `"${cell}"`; // Add quotes if cell contains comma, newline, or quote
            }
            return cell;
        }).join(',');
    }).join('\n');

    const csvData = csvHeader + csvRows;

    // 4. Create Blob and trigger download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) { // Check for browser support
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    }
}

let startX, startY;

function mouseDown(e) {
    startX = e.pageX;
    startY = e.pageY;

    box = document.createElement("span");
    box.style.position = "absolute";
    box.style.border = "2px dotted";
    box.style.left = startX + "px";
    box.style.top = startY + "px";
    box.style.visibility = "visible";

    document.body.appendChild(box);

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
}

function mouseMove(e) {
    if (!box) return; // If the box returns false then stop the function here

    const width = e.pageX - startX;
    const height = e.pageY - startY;

    box.style.left = Math.min(e.pageX, startX) + "px";
    box.style.top = Math.min(e.pageY, startY) + "px";
    box.style.width = Math.abs(width) + "px";
    box.style.height = Math.abs(height) + "px";
}

function mouseUp(e) {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    // get the actual <a> elements inside the selection box
    const selectedLinks = findUrlsInsideBox(box);

    if (selectedLinks && selectedLinks.length > 0) {
        selectedLinks.forEach(linkEl => {
            // skip blob: urls, same logic as your click handler
            if (!linkEl.href || linkEl.href.startsWith('blob:')) return;

            const newRow = new ExcelRow({}); // start empty

            // fill the correct column based on currentColumn
            switch (currentColumn) {
                case "1":
                    newRow._col1 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
                    break;
                case "2":
                    newRow._col2 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
                    break;
                case "3":
                    newRow._col3 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
                    break;
                case "4":
                    newRow._col4 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
                    break;
                case "5":
                    newRow._col5 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
                    break;
                default:
                    newRow._col1 = linkEl.text || linkEl.textContent || linkEl.innerText || "";
            }

            newRow._colURLs = linkEl.href;

            // optional: avoid exact duplicates (same URL + same column text)
            const isDuplicate = capturedLinks.some(r => r._colURLs === newRow._colURLs && r._col1 === newRow._col1 && r._col2 === newRow._col2 && r._col3 === newRow._col3 && r._col4 === newRow._col4 && r._col5 === newRow._col5);
            if (!isDuplicate) {
                capturedLinks.push(newRow);
            }
        });

        // send one update with the whole updated array (same as your click flow)
        chrome.runtime.sendMessage({
            action: "updateSitemapPreviewAction",
            sitemap: capturedLinks
        });
    }

    console.log("URLs inside selection:", selectedLinks.map(l => l.href));

    // remove and cleanup
    box.remove();
    box = null;
}



function findUrlsInsideBox(box) {
    const boxRect = box.getBoundingClientRect();
    const links = document.querySelectorAll("a[href]");
    const found = [];

    links.forEach(link => {
        const rect = link.getBoundingClientRect();

        const overlap =
            rect.left < boxRect.right &&
            rect.right > boxRect.left &&
            rect.top < boxRect.bottom &&
            rect.bottom > boxRect.top;

        if (overlap) {
            // push the element itself so caller can read href and text
            found.push(link);
        }
    });

    return found;
}

