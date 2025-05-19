import csv
import re
import os
import sys # Import the sys module for input

# Define the input and output file names
input_filename = 'images.txt'
# ✅ Change output filename to images.csv
output_filename = 'images.csv'
# We'll process the data and write back to the same file,
# but it's safer to write to a temporary file first.
temp_filename = 'images_temp.csv' # Use .csv extension for temp file too

# Define the regex pattern to check if a string ends with a digit
# \d+ matches one or more digits at the end of the string ($)
ends_with_digit_pattern = re.compile(r'\d+$')

# List to hold the processed data
processed_data = []

print(f"Reading data from {input_filename}...")

# Read the data from the input file
try:
    # Use 'with open(...)' which ensures the file is closed properly
    # newline='' is important for the csv module to handle line endings correctly
    with open(input_filename, mode='r', newline='', encoding='utf-8') as infile:
        # Create a CSV reader object
        reader = csv.reader(infile)

        # Read each row from the CSV file
        for row in reader:
            # Each row is a list of strings (the fields)
            # Example row: ['folder', 'filename', 'folder'] after csv.reader handles quotes
            # The csv module handles the quotes correctly when reading.

            if len(row) == 3:
                # Extract the fields. The csv reader has already handled the quotes.
                folder = row[0] # The string 'folder'
                filename_content = row[1] # The string 'filename'
                # original_third_field_content = row[2] # Not needed for the new third field logic

                # Determine the text for the third field based on the filename content
                if ends_with_digit_pattern.search(filename_content):
                    # Filename ends with a digit, use " forsale"
                    # Construct the string WITHOUT surrounding double quotes
                    third_field_content = f'{folder} forsale'
                else:
                    # Filename does NOT end with a digit, use " sold"
                    # Construct the string WITHOUT surrounding double quotes
                    third_field_content = f'{folder} sold'

                # Append the processed row to our list
                # Pass the raw string values to the processed row list.
                # The csv.writer with quoting=csv.QUOTE_ALL will add quotes around ALL fields.
                processed_row = [folder, filename_content, third_field_content]
                processed_data.append(processed_row)

            else:
                print(f"Skipping malformed row: {row}")

except FileNotFoundError:
    print(f"Error: The file '{input_filename}' was not found.")
    # Pause before exiting
    input("Press Enter to exit...")
    sys.exit(1) # Exit the script with an error code
except Exception as e:
    print(f"An error occurred while reading the file: {e}")
    # Pause before exiting
    input("Press Enter to exit...")
    sys.exit(1) # Exit on other reading errors

print(f"Processing complete. Found {len(processed_data)} valid rows.")
# ✅ Update print statement to show new output filename
print(f"Writing processed data to temporary file {temp_filename} (will be renamed to {output_filename})...")

# Write the processed data to a temporary file
try:
    with open(temp_filename, mode='w', newline='', encoding='utf-8') as outfile:
        # Create a CSV writer object
        # Use quoting=csv.QUOTE_ALL to ensure all fields are quoted
        writer = csv.writer(outfile, quoting=csv.QUOTE_ALL)

        # ✅ Write the header row first
        header = ["folder", "name", "tags"]
        writer.writerow(header)

        # Write all the processed rows
        writer.writerows(processed_data)

except Exception as e:
    print(f"An error occurred while writing to the temporary file: {e}")
    # Clean up the temporary file if writing failed
    if os.path.exists(temp_filename):
        os.remove(temp_filename)
    # Pause before exiting
    input("Press Enter to exit...")
    sys.exit(1) # Exit on writing errors

print(f"Temporary file {temp_filename} created.")
# ✅ Update print statement to show new output filename
print(f"Replacing original file {input_filename} with {output_filename}...")

# Replace the original file with the temporary file
try:
    # Remove the original input file (images.txt)
    if os.path.exists(input_filename):
        os.remove(input_filename)

    # Remove any existing output file (images.csv) before renaming
    if os.path.exists(output_filename):
        os.remove(output_filename)

    # Rename the temporary file to the final output filename
    os.rename(temp_filename, output_filename)

except Exception as e:
    print(f"An error occurred while replacing the original file: {e}")
    print(f"The processed data is still available in {temp_filename}.")
    # Pause before exiting
    input("Press Enter to exit...")
    sys.exit(1) # Exit on file replacement errors

# ✅ Update print statement to show new output filename
print(f"File processing complete. {output_filename} has been created.")

# Add a line to pause the script at the end
input("Press Enter to finish...")
