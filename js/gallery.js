// Function to fetch and parse CSV file
async function fetchCSV() {
    const response = await fetch("art/images.csv"); // Load CSV file - Ensure path is correct
    const data = await response.text(); // Read file as text
    return parseCSV(data); // Parse CSV content
}

// Function to parse CSV with quoted values
function parseCSV(csvText) {
    const rows = csvText.trim().split("\n"); // Split into rows
    rows.shift(); // Remove headers

    return rows.map(row => {
        const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); // Regex to handle quoted values
        if (!values || values.length < 3) {
            console.error("Skipping row due to incorrect format:", row);
            return null;
        }
        return {
            folder: values[0].replace(/"/g, "").trim(),
            name: values[1].replace(/"/g, "").trim(),
            tags: values[2].replace(/"/g, "").trim()
        };
    }).filter(item => item !== null);
}



// Function to generate HTML from CSV data and initialize scripts
async function generateGalleryAndInitialize() {
    //console.log("Generating gallery HTML...");
    const imageData = await fetchCSV();

    // Target the div with class "row" that is inside .projects-holder
    const galleryRow = document.querySelector('.projects-holder > .row');

    if (!galleryRow) {
        console.error("Error: Could not find the gallery row element (.projects-holder > .row).");
        return;
    }

    // Clear any existing placeholder content within the row
    galleryRow.innerHTML = '';

    let galleryHTML = '';
    imageData.forEach((item) => {
        galleryHTML += `
            <div class="col-md-6 col-sm-6 project-item mix ${item.tags}">
                <div class="thumb">
                    <div class="image">
                        <a href="art/${item.folder}/${item.name}.jpg" data-lightbox="gallery" data-title="${item.name}">
                            <img src="art/${item.folder}/thumb/${item.name}.jpg" alt="${item.name}">
                        </a>
                    </div>
                </div>
            </div>
            `;
    });

    // Append all generated HTML to the row element
    galleryRow.innerHTML += galleryHTML;

    //console.log("Gallery HTML generation complete. Appended items to .projects-holder > .row.");

    // ✅ After adding elements, tell MixItUp to REMIX with filter 'all'
    // Use a short delay
     setTimeout(() => {
         if (typeof $ !== 'undefined' && typeof $.fn.mixitup !== 'undefined') {
             console.log("Attempting MixItUp remix 'all' after generation.");
             $('.projects-holder').mixitup('remix', 'all'); // Use remix for v1.5.5
             console.log("MixItUp remix 'all' command issued.");
         } else {
             console.warn("jQuery or MixItUp library not loaded. Cannot trigger remix.");
         }
     }, 500); // Short delay (e.g., 150ms) - NW: 150 too quick. I tested 250 & 400 - too quick. 500 worked on my computer


    // ✅ Programmatically click the 'all' filter button after a slightly longer delay
    // This mimics the user action that currently fixes the blank display on load.
    setTimeout(() => {
        // Select the 'all' filter button - Adjust selector if yours is different
        const allFilterButton = document.querySelector('.filter[data-filter="all"]');

        if (allFilterButton) {
            //console.log("Programmatically clicking the 'all' filter button.");
            allFilterButton.click(); // Simulate a click
            //console.log("'all' filter button clicked programmatically.");
        } else {
            console.warn("Could not find the 'all' filter button with selector '.filter[data-filter=\"all\"]'.");
        }
    }, 400); // Delay long enough for remix to potentially finish and button to be interactive


    // ✅ Reinitialize Lightbox after images are added
    // Ensure Lightbox initializes after content is likely visible and positioned
    setTimeout(() => {
        if (typeof lightbox !== "undefined") {
            //console.log("Initializing Lightbox...");
            lightbox.init();
            //console.log("Lightbox initialized.");
        } else {
            console.warn("Lightbox library not found.");
        }
    }, 500); // Delay after the programmatic click and remix

}

// Ensure everything loads in the correct order
document.addEventListener("DOMContentLoaded", async function() {
    //console.log("DOMContentLoaded fired. Starting gallery generation and initialization process.");
    // Keep this direct call.
    await generateGalleryAndInitialize();
    //console.log("Gallery generation and initialization process complete.");
});