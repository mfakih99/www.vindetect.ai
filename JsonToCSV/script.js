document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');
    const error = document.getElementById('error');
    
    let csvData = null;

    // Function to convert JSON to CSV
    function jsonToCSV(jsonData) {
        try {
            // Handle both array and object inputs
            const data = Array.isArray(jsonData) ? jsonData : [jsonData];
            
            if (data.length === 0) {
                throw new Error('No data to convert');
            }

            // Get headers from the first object
            const headers = Object.keys(data[0]);
            
            // Create CSV content
            const csvRows = [];
            
            // Add headers
            csvRows.push(headers.join(','));
            
            // Add data rows
            for (const row of data) {
                const values = headers.map(header => {
                    const value = row[header];
                    // Handle different data types and escape commas
                    if (value === null || value === undefined) {
                        return '';
                    } else if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    } else if (typeof value === 'object') {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    return value;
                });
                csvRows.push(values.join(','));
            }
            
            return csvRows.join('\n');
        } catch (err) {
            throw new Error('Invalid JSON data: ' + err.message);
        }
    }

    // Function to create and download CSV file
    function downloadCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'converted_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Function to update preview
    function updatePreview(csv) {
        preview.textContent = csv;
    }

    // Event listeners
    convertBtn.addEventListener('click', () => {
        error.textContent = '';
        try {
            const jsonData = JSON.parse(jsonInput.value);
            csvData = jsonToCSV(jsonData);
            updatePreview(csvData);
            downloadBtn.disabled = false;
        } catch (err) {
            error.textContent = err.message;
            downloadBtn.disabled = true;
            preview.textContent = '';
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (csvData) {
            downloadCSV(csvData);
        }
    });

    // Add input validation
    jsonInput.addEventListener('input', () => {
        downloadBtn.disabled = true;
        preview.textContent = '';
        error.textContent = '';
    });
}); 