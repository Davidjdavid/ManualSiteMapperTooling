// Variable to store all of the links we grab.
let capturedLinks = [];
// Fixed typo: currnetColumn -> currentColumn
let currentColumn = "1";
let sitemappingModeToggle = false;

document.addEventListener("click", logKey);

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

//Changes the current column we are adding pages to whatever depth the user clicks on their keyboard
document.addEventListener("keydown", (event) => {
    if (event.key === "Alt") {
        sitemappingModeToggle = !sitemappingModeToggle;
        console.log("Sitemapping Mode:", sitemappingModeToggle);
    }
});

// Downloads the JSON as an Excel file
document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        downloadJSONAsCSV(capturedLinks);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") {
        capturedLinks = [];
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

    // **THE FIX FOR BLOB URLS IS HERE**
    // Check if a link was clicked, if the tool is on, AND if the link is NOT a blob URL
    if (linkElement && sitemappingModeToggle === false && !linkElement.href.startsWith('blob:')) {
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
        
        // **THE FIX FOR TWO URL COLUMNS IS HERE**
        // Property now matches the class constructor (_colURLs)
        testRow._colURLs = linkElement.href 
        
        capturedLinks.push(testRow);
        let linksAsJSON = JSON.stringify(capturedLinks);
        console.log(linksAsJSON);

    }
}


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