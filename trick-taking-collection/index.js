function loadCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(text => processCSV(text))
        .catch(error => console.error('Error loading CSV:', error));
}

function processCSV(text) {
    const data = parseCSV(text);
    const headers = data.shift();
    const table = document.getElementById('csvTable');
    table.innerHTML = '';

    createTableHeader(headers, table);
    populateTableBody(data, table);

    // Initially hide/show the column based on checkbox state
    toggleColumn('playedCheckbox', 'Played');

    // Add filter functionality
    document.getElementById('filterInput').addEventListener('input', filterTable);

    // Add checkbox hide column functionality
    setupColumnToggle('playedCheckbox', 'Played');
}

function parseCSV(text) {
    return text.trim().split('\n').map(row => row.split(','));
}

function createTableHeader(headers, table) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        // Skip the URL column
        if (!header.startsWith("#")) {
            const th = document.createElement('th');
            th.textContent = header;
            th.addEventListener('click', () => sortTable(header));
            headerRow.appendChild(th);
        }
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
}

function populateTableBody(data, table) {
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cellData, index) => {
            // Skip the URL column
            if (index !== 1) {
                const td = document.createElement('td');
                // Assume the 'Name' column is the first column
                if (index === 0) {
                    const a = document.createElement('a');
                    // Assume the 'URL' column is the second column
                    a.href = row[1];
                    a.textContent = cellData;
                    td.appendChild(a);
                } else {
                    td.textContent = cellData;
                }
                tr.appendChild(td);
            }
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);


    // Log the row count after populating the table
    const rowCount = getRowCount();
    console.log('Number of rows:', rowCount);

    // Update the total number of games
    updateTotalGames(rowCount);
}

function sortTable(columnName) {
    const table = document.getElementById('csvTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const colIndex = getIndex(columnName);

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${colIndex})`).textContent.trim();
        const bValue = b.querySelector(`td:nth-child(${colIndex})`).textContent.trim();
        return aValue.localeCompare(bValue);
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => tbody.appendChild(row));
}

function getIndex(columnName) {
    const headers = Array.from(document.querySelectorAll('#csvTable th'));
    return headers.findIndex(th => th.textContent === columnName) + 1;
}

function filterTable() {
    const filter = document.getElementById('filterInput').value.toLowerCase();
    const rows = document.querySelectorAll('#csvTable tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const matches = cells.some(cell => cell.textContent.toLowerCase().includes(filter));
        row.style.display = matches ? '' : 'none';
    });
}

function toggleColumn(checkboxId, columnName) {
    const showColumn = document.getElementById(checkboxId).checked;
    const colIndex = getIndex(columnName) - 1;

    const th = document.querySelectorAll(`#csvTable th:nth-child(${colIndex + 1})`)[0];
    th.style.display = showColumn ? '' : 'none';

    const rows = document.querySelectorAll('#csvTable tbody tr');
    rows.forEach(row => {
        const td = row.querySelectorAll('td')[colIndex];
        td.style.display = showColumn ? '' : 'none';
    });
}

function setupColumnToggle(checkboxId, columnName) {
    document.getElementById(checkboxId).addEventListener('change', function() {
        toggleColumn(checkboxId, columnName);
    });
}

function getRowCount() {
    const table = document.getElementById('csvTable');
    const tbody = table.querySelector('tbody');
    return tbody ? tbody.rows.length : 0;
}

function updateTotalGames(count) {
        const totalGamesElement = document.getElementById('totalGames');
        totalGamesElement.textContent = `Total number of games: ${count}`;
}
