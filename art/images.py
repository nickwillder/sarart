# This script takes a list of JPG files in "images.txt", then
# outputs a formatted CSV file "images.csv" and a "lastmodified.txt" file,
# which are later processed by "index.html" with its associated Javascript.

import csv
import re
import os
import datetime
import sys

# --- Configuration ---
# The input file, expected to be in the same directory as this script.
input_filename = 'images.txt'

# The output files will be created in the current working directory of the script.
output_csv_path = 'images.csv'
output_last_modified_path = 'lastmodified.txt'
temp_csv_path = 'images_temp_working_file.csv' # Use a descriptive temp name
sitemap_path = '../sitemap.xml'

# Define the regex pattern to check if a string ends with a digit
ends_with_digit_pattern = re.compile(r'\d+$')

# List to hold the processed data for the CSV
processed_data = []

# --- Main Script Logic ---

print(f"Reading data from '{input_filename}'...")

# 1. Read and process data from the input file (images.txt)
try:
    with open(input_filename, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        for row in reader:
            if len(row) == 3:
                folder = row[0]
                filename_content = row[1]
                
                # Determine the text for the third field based on the filename content
                if ends_with_digit_pattern.search(filename_content):
                    third_field_content = f'{folder} forsale'
                else:
                    third_field_content = f'{folder} sold'
                
                processed_row = [folder, filename_content, third_field_content]
                processed_data.append(processed_row)
            else:
                print(f"Skipping malformed row: {row}. Expected 3 fields, got {len(row)}.")

except FileNotFoundError:
    print(f"Error: The input file '{input_filename}' was not found. Please ensure it's in the same directory as this script.")
    input("Press Enter to exit...")
    sys.exit(1)
except Exception as e:
    print(f"An error occurred while reading '{input_filename}': {e}")
    input("Press Enter to exit...")
    sys.exit(1)

print(f"Processing complete. Found {len(processed_data)} valid rows.")

# 2. Write processed data to a temporary CSV file in the current directory
print(f"Writing processed data to temporary file '{temp_csv_path}'...")
try:
    with open(temp_csv_path, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.writer(outfile, quoting=csv.QUOTE_ALL)
        header = ["folder", "name", "tags"] # Write the header row
        writer.writerow(header)
        writer.writerows(processed_data) # Write all the processed rows

except Exception as e:
    print(f"An error occurred while writing to the temporary CSV file '{temp_csv_path}': {e}")
    if os.path.exists(temp_csv_path):
        os.remove(temp_csv_path) # Clean up temp file on failure
    input("Press Enter to exit...")
    sys.exit(1)

print(f"Temporary file '{temp_csv_path}' created.")

# 3. Replace the final images.csv with the temporary file in the current directory
print(f"Replacing existing '{output_csv_path}' with the new file...")
try:
    if os.path.exists(output_csv_path):
        os.remove(output_csv_path) # Remove existing final file
    os.rename(temp_csv_path, output_csv_path) # Rename temp to final

except Exception as e:
    print(f"An error occurred while replacing '{output_csv_path}': {e}")
    print(f"The processed data might still be available in '{temp_csv_path}'.")
    input("Press Enter to exit...")
    sys.exit(1)

print(f"CSV file processing complete. '{output_csv_path}' has been created.")

# Delete the input_filename (images.txt) as it has served its purpose
try:
    if os.path.exists(input_filename): # Check if it exists before trying to delete
        os.remove(input_filename)
        print(f"Successfully deleted '{input_filename}'.")
    else:
        print(f"'{input_filename}' not found for deletion (perhaps already deleted?).")
except Exception as e:
    print(f"Error deleting '{input_filename}': {e}")

# -----------------------------------------------------------------------------------------------------------

# 4. Generate and write the lastmodified.txt file
def generate_last_modified_file():
    now = datetime.datetime.now()
    # Format the date as "DD MMMM YYYY" for UK format (e.g., "06 June 2025")
    # %d for day with leading zero, %B for full month name, %Y for 4-digit year
    formatted_date = now.strftime("%d %B %Y")

    try:
        with open(output_last_modified_path, 'w', encoding='utf-8') as f:
            f.write(f"gallery updated {formatted_date}")
        print(f"Successfully generated '{output_last_modified_path}' with date: {formatted_date}")
    except IOError as e:
        print(f"Error writing '{output_last_modified_path}': {e}")

# Call the function to generate the date file
generate_last_modified_file()

# -----------------------------------------------------------------------------------------------------------

# 5. Update the <lastmod> tag in sitemap.xml
def update_sitemap_lastmod(sitemap_file_path):
    now = datetime.datetime.now()
    # Format the date as "YYYY-MM-DD" for sitemap (e.g., "2025-07-13")
    formatted_date_sitemap = now.strftime("%Y-%m-%d")

    try:
        if not os.path.exists(sitemap_file_path):
            print(f"Warning: Sitemap file '{sitemap_file_path}' not found. Skipping sitemap update.")
            return

        with open(sitemap_file_path, 'r', encoding='utf-8') as f:
            sitemap_content = f.read()

        # Regex to find and replace the content within <lastmod> tags
        # This regex is designed to be robust, matching <lastmod> and </lastmod>
        # tags and replacing whatever is between them.
        updated_sitemap_content = re.sub(
            r'<lastmod>.*?</lastmod>',
            f'<lastmod>{formatted_date_sitemap}</lastmod>',
            sitemap_content,
            flags=re.DOTALL # DOTALL makes '.' match newlines as well
        )

        with open(sitemap_file_path, 'w', encoding='utf-8') as f:
            f.write(updated_sitemap_content)
        print(f"Successfully updated '{sitemap_file_path}' with lastmod date: {formatted_date_sitemap}")

    except Exception as e:
        print(f"Error updating '{sitemap_file_path}': {e}")

# Call the function to update the sitemap
update_sitemap_lastmod(sitemap_path)

# -----------------------------------------------------------------------------------------------------------

# Add this next line to pause the script at the end, else return to images.bat where the python was called from
# input("Press Enter to complete")