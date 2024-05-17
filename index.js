function loadCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const data = text.trim().split('\n').map(row => row.split(','));
            const headers = data.shift();
            const table = document.getElementById('csvTable');
            const tbody = document.createElement('tbody');

            // Create table headers
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.addEventListener('click', () => sortTable(header));
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Populate table body
            data.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Add filter functionality
            document.getElementById('filterInput').addEventListener('input', filterTable);
        })
        .catch(error => console.error('Error loading CSV:', error));
}

function sortTable(columnName) {
    const table = document.getElementById('csvTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getIndex(columnName)})`).textContent.trim();
        const bValue = b.querySelector(`td:nth-child(${getIndex(columnName)})`).textContent.trim();
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

loadCSV('trick-taking-collection.csv');
