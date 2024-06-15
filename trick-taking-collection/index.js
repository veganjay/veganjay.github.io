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
                if (header.startsWith("#")) {
                    return; // Skip this header
                }
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

                row.forEach((cellData, index) => {
                    if (index === 1) {
                        return;
                    }
                    const td = document.createElement('td');
                    if (index === 0) { // Assume the "Name" column is the first column
                        const a = document.createElement('a');
                        a.href = row[1]; // Assume the "URL" column is the second column
                        a.textContent = cellData;
                        td.appendChild(a);
                    } else if (index !== 1) { // Skip the URL column
                        td.textContent = cellData;
                        console.log("index: ", index, "= ", cellData);
                    }
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Initially hide/show the column based on checkbox state
            toggleColumn('publisherCheckbox', 'Publisher');
            toggleColumn('designerCheckbox', 'Designer');
            toggleColumn('notesCheckbox', 'Notes');

            // Add filter functionality
            document.getElementById('filterInput').addEventListener('input', filterTable);

            // Add checkbox hide column functionality
            document.getElementById('publisherCheckbox').addEventListener('change', function() {
                toggleColumn('publisherCheckbox', 'Publisher');
            });
            document.getElementById('designerCheckbox').addEventListener('change', function() {
                toggleColumn('designerCheckbox', 'Designer');
            });
            document.getElementById('notesCheckbox').addEventListener('change', function() {
                toggleColumn('notesCheckbox', 'Notes');
            });

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

function toggleColumn(checkboxId, columnName) {
    const showPublisher = document.getElementById(checkboxId).checked;
    const colIndex = getIndex(columnName) - 1; // Adjust for 0-based index

    const th = document.querySelectorAll(`#csvTable th:nth-child(${colIndex + 1})`)[0];
    th.style.display = showPublisher ? '' : 'none';

    const rows = document.querySelectorAll('#csvTable tbody tr');
    rows.forEach(row => {
        const td = row.querySelectorAll('td')[colIndex];
        td.style.display = showPublisher ? '' : 'none';
    });
}
