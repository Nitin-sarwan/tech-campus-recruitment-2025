const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Function to extract logs for a given date
async function extractLogsForDate(logFilePath, targetDate) {
    // Ensure the log file exists
    if (!fs.existsSync(logFilePath)) {
        console.error("Error: Log file not found!");
        return;
    }

const outputDir = "output";
const outputFilePath = path.join(outputDir, `output_${targetDate}.txt`);

  // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir,  { recursive: true });
    }

    // Create read stream to process file line-by-line
    const fileStream = fs.createReadStream(logFilePath, { encoding: 'utf8' });

    const rline = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // Handle both Windows (\r\n) line endings
    });

    const writeStream = fs.createWriteStream(outputFilePath);

    console.log(`Extracting logs for date: ${targetDate}...`);

    let matchedLogs = 0;

    for await (const line of rline) {
        if (line.startsWith(targetDate)) {
            writeStream.write(line + '\n');
            matchedLogs++;
        }
    }

    writeStream.end();

    console.log(`Extraction complete! ${matchedLogs} logs saved in: ${outputFilePath}`);
}

// Check command-line arguments
if (process.argv.length !== 4) {
    console.error(`Usage: node ${path.basename(process.argv[1])} <log_file_path> <YYYY-MM-DD>`);
    process.exit(1);
}

// Get log file path and target date from command line
const logFilePath = process.argv[2];
const targetDate = process.argv[3];

extractLogsForDate(logFilePath, targetDate);
