// Function to fetch and parse CSV file
async function fetchCSV() {
    // console.log("Fetching images.csv file..."); // Debugging log
    try {
        const response = await fetch("art/images.csv"); // Load CSV file - Ensure path is correct relative to index.html
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        // console.log("images.csv fetched."); // Debugging log
        return parseCSV(data); // Parse CSV content
    } catch (error) {
        console.error("Error fetching images.csv:", error);
        // Display an error message on the page if fetch fails
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.textContent = `Error loading gallery data: ${error.message}`;
        document.body.appendChild(errorDiv); // Or append to a specific error area
        return []; // Return empty array on error to prevent further issues
    }
}

// Function to parse CSV with quoted values and apply formatting rules
function parseCSV(csvText) {
    console.log("Parsing CSV text..."); // Debugging log
    const rows = csvText.trim().split("\n");
    if (rows.length === 0) {
        console.warn("CSV file is empty."); // Debugging log
        return [];
    }
    // Assuming header is always the first row:
    rows.shift(); // Remove headers

    const imageData = rows.map(row => {
        // ✅ Manual parsing loop to handle quoted fields and escaped quotes more robustly
        const values = [];
        let currentValue = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            const nextChar = row[i + 1]; // Look ahead for escaped quotes

            if (char === '"') {
                 if (inQuotes && nextChar === '"') {
                    currentValue += '"'; // Handle escaped quote "" -> add a single quote
                    i++; // Skip the next quote character
                 } else {
                    inQuotes = !inQuotes; // Enter or exit quote mode
                 }
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue); // Do not trim yet, trim after getting value
                currentValue = '';
            } else {
                // Otherwise, append the character to the current value
                currentValue += char;
            }
        }
        values.push(currentValue); // Push the last value after the loop

        // Trim leading/trailing whitespace from each collected value
        const trimmedValues = values.map(val => val.trim());

        if (trimmedValues.length < 3) {
            console.warn(`Skipping row due to incorrect format: "${row}"`); // Debugging log for skipped rows
            return null;
        }

        // Access values from the trimmed array and remove surrounding quotes
        const folder = trimmedValues[0].replace(/"/g, "").trim();
        const originalName = trimmedValues[1].replace(/"/g, "").trim(); // Name from CSV (for filenames)
        const tags = trimmedValues[2].replace(/"/g, "").trim();

        // Start with original name for display processing
        let displayName = originalName;

        // ✅ Rule 1: If the name ends with digits, insert &pound; before them
        // Apply this rule first
        const endsWithDigitsMatch = originalName.match(/(\d+)$/);
        if (endsWithDigitsMatch) {
            displayName = originalName.replace(/(\d+)$/, '&pound;$1');
        }

        // ✅ Rule 2: If displayname contains "x" immediately followed by a digit, replace "x" with &times;
        // Apply this rule to the current displayName (result of Rule 1)
        displayName = displayName.replace(/x(\d)/g, '&times;$1');

        // console.log(`Parsed: Original='${originalName}', Display='${displayName}', Folder='${folder}', Tags='${tags}'`); // Debugging parsed data

        return {
            folder: folder,
            name: originalName, // Original name (for filenames)
            displayName: displayName, // Modified name for display with both rules applied
            tags: tags
        };
    }).filter(item => item !== null);

    console.log(`CSV parsing complete. Found ${imageData.length} valid image entries.`); // Debugging log
    return imageData;
}

// Function to generate HTML from CSV data and initialize scripts
async function generateGalleryAndInitialize() {
    //console.log("Starting gallery generation and initialization..."); // Debugging log
    const imageData = await fetchCSV();

    // Target the div with class "row" that is inside .projects-holder
    const galleryRow = document.querySelector('.projects-holder > .row');

    if (!galleryRow) {
        console.error("Error: Could not find the gallery row element (.projects-holder > .row).");
        // Display an error message on the page
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.textContent = 'Error loading gallery: Gallery container not found.';
        document.body.appendChild(errorDiv); // Or append to a specific error area
        return; // Stop execution if the container is not found
    }

    // Clear any existing placeholder content within the row
    galleryRow.innerHTML = '';

    let galleryHTML = '';
    if (imageData.length > 0) {
        imageData.forEach((item) => {
            galleryHTML += `
                <div class="col-md-6 col-sm-6 project-item mix ${item.tags}">
                    <div class="thumb">
                        <div class="image">
                            <a href="art/${item.folder}/${item.name}.jpg" data-lightbox="gallery" data-title="${item.displayName}">
                                <img src="art/${item.folder}/thumb/${item.name}.jpg" alt="${item.displayName}">
                            </a>
                        </div>
                    </div>
                </div>
                `;
        });
        // console.log(`Generated HTML for ${imageData.length} images.`); // Debugging log
    } else {
        console.warn("No valid image data found in CSV to generate gallery."); // Debugging log
        galleryHTML = '<p>No gallery items available.</p>'; // Display message if no images
    }


    // Append all generated HTML to the row element
    galleryRow.innerHTML += galleryHTML;

    console.log("Gallery HTML appended to .projects-holder > .row."); // Debugging log

    // ✅ After adding elements, tell MixItUp to REMIX with filter 'all'
    // Use a short delay
     setTimeout(() => {
         // Check if jQuery and MixItUp are loaded
         if (typeof $ !== 'undefined' && typeof $.fn.mixitup !== 'undefined') {
             console.log("Attempting MixItUp remix 'all' after generation."); // Debugging log
             // Select the MixItUp container (.projects-holder) and call the remix method
             $('.projects-holder').mixitup('remix', 'all'); // Use remix for v1.5.5
             console.log("MixItUp remix 'all' command issued."); // Debugging log
         } else {
             console.warn("jQuery or MixItUp library not loaded. Cannot trigger remix.");
         }
     }, 500); // User tested delay


    // ✅ Programmatically click the 'all' filter button after a slightly longer delay
    // This mimics the user action that currently fixes the blank display on load.
    setTimeout(() => {
        // Select the 'all' filter button - Adjust selector if yours is different
        const allFilterButton = document.querySelector('.filter[data-filter="all"]');

        if (allFilterButton) {
            console.log("Programmatically clicking the 'all' filter button."); // Debugging log
            allFilterButton.click(); // Simulate a click
            console.log("'all' filter button clicked programmatically."); // Debugging log
        } else {
            console.warn("Could not find the 'all' filter button with selector '.filter[data-filter=\"all\"]'.");
        }
    }, 400); // User tested delay


    // ✅ Reinitialize Lightbox after images are added
    // Ensure Lightbox initializes after content is likely visible and positioned
    setTimeout(() => {
        if (typeof lightbox !== "undefined") {
            console.log("Initializing Lightbox..."); // Debugging log
            lightbox.init();
            console.log("Lightbox initialized."); // Debugging log
        } else {
            console.warn("Lightbox library not found.");
        }
    }, 500); // User tested delay

    console.log("Gallery generation and initialization process complete."); // Debugging log
}

// Ensure everything loads in the correct order
document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOMContentLoaded fired. Starting gallery generation and initialization process."); // Debugging log
    // Keep this direct call.
    await generateGalleryAndInitialize();
    console.log("Initial gallery setup process initiated."); // Debugging log
});