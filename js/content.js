// Variable to store all of the links we grab.
let capturedLinks = [];

document.addEventListener("click", logKey);

// Class that is used to call on when a new Excel row is used
class ExcelRow {
    constructor(params) {
        this._col1 = params.col1 || "Empty"
        this._col2 = params.col1 || "Empty"
        this._col3 = params.col1 || "Empty"
        this._col4 = params.col1 || "Empty"
        this._col5 = params.col1 || "Empty"
    }

    printCol1() {
        console.log(this._col1)
    }
}


function logKey(e) {
    const linkElement = event.target.closest('a');
    if (linkElement) { // This can be null if a link isnt actually clicked on
    
    // Stop the browser from navigating to the link.
    event.preventDefault();
    // Get the URL from the link's href attribute.
    const url = linkElement.href;
    // Add the URL to the captured links.
    capturedLinks.push(url); 
    // Convert the array to a JSON string. NOTE: This is not what we need it to do. We want this to be hierarchy
    let linksAsJSON = JSON.stringify(capturedLinks);
    console.log(linksAsJSON); // Delete later
    let testRow = new ExcelRow({})
    testRow.printCol1();
    }
}