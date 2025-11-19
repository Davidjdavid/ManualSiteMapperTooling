let columnSelect = document.getElementById("toggleCheckbox");

// Get the currently checked radio button and send its value immediately
const defaultColumn = document.querySelector('input[name="column"]:checked');
if (defaultColumn) {
    chrome.runtime.sendMessage({ 
        action: "updateColumn", 
        column: defaultColumn.value 
    });
}

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

document.getElementById("resetBtn").addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "resetAction"});
    document.getElementById("sitemapPreview").innerHTML = "";
});

document.getElementById("undoBtn").addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "undoAction"});

});


document.getElementById("toggle").addEventListener('change', (event) => {
    chrome.runtime.sendMessage({
        action: "toggle",
        toggle: event.target.checked
    })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateSitemapPreviewAction") {
        const sitemap = message.sitemap;
        const previewContainer = document.getElementById("sitemapPreview");

        if (previewContainer && sitemap && sitemap.length > 0) {
            // Clear existing content
            previewContainer.innerHTML = '';

            const table = document.createElement('table');
            table.style.width = '100%'; // Optional: basic styling
            table.style.borderCollapse = 'collapse';

            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');

            // Get keys from the first object to use as headers
            const headers = Object.keys(sitemap[0]);

            // Create Headers
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.style.border = '1px solid #ccc'; // Basic grid styling
                th.style.padding = '4px';
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Create Rows
            sitemap.forEach(dataRow => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = dataRow[header] || ""; // Handle empty values
                    td.style.border = '1px solid #ccc';
                    td.style.padding = '4px';
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            previewContainer.appendChild(table);
        }
    }
});