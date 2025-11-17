document.addEventListener('click', logKey);
let capturedLinks = []
let toolingActive = false; // Start the tool off by default

// js/content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
    //Change all of this if else stuff into a switch statement
    if (message.command === "executeAction") {
        console.log('Action triggered by sidebar');
        downloadJSONAsCSV(capturedLinks);

    } 

    if (message.command === "setColumn") {
        currentColumn = message.column;
        console.log("Column set to:", currentColumn);
    }


    if (message.command === "toggleActive") {
        toggleStatus = message.toggle;
        console.log("checkbox toggled at:", toggleStatus);
        if(toggleStatus) {
            console.log("Its on")
            toolingActive = true;
        }
        if(!toggleStatus) {
            console.log("Its off")
            toolingActive = false;
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

    printCol1() {
        console.log(this._col1)
    }
}

function logKey(e) { // Fixed: Use 'e' instead of 'event'
    const linkElement = e.target.closest('a');
    console.log("Tool is on and working");

    // Check if a link was clicked, if the tool is on, AND if the link is NOT a blob URL
    if (toolingActive && !linkElement.href.startsWith('blob:')) {
        console.log("Tool is on and working part 2");

        let testRow = new ExcelRow({})
        e.preventDefault(); // Fixed: Use 'e'

        // Fixed typo: currnetColumn -> currentColumn
        switch (currentColumn) {
            case "1":
                testRow._col1 = linkElement.text;
                break;
            case "2":
                testRow._col2 = linkElement.text;
                break;
            case "3":
                testRow._col3 = linkElement.text;
                break;
            case "4":
                testRow._col4 = linkElement.text;
                break;
            case "5":
                testRow._col5 = linkElement.text;
                break;
        }
        // Property now matches the class constructor (_colURLs)
        testRow._colURLs = linkElement.href 
        
        capturedLinks.push(testRow);
        let linksAsJSON = JSON.stringify(capturedLinks);
        console.log(linksAsJSON);

    }
}

// TO DO!!
// Need to link to this up to the executeAction function so when the export button is clicked it exports the JSON using this function

// Exports the JSON as a CSV file named "data.csv"
function downloadJSONAsCSV(jsonData, filename = 'data.csv') {
    // 1. Check if jsonData is valid
    if (!jsonData || !jsonData.length) {
        console.error("Invalid or empty JSON data provided.");
        return;
    }

    // 2. Get CSV Headers (from the keys of the first object)
    const keys = Object.keys(jsonData[0]);
    const csvHeader = keys.join(',') + '\n';

    // 3. Convert JSON objects to CSV rows
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
