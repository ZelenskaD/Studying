const fs = require('fs');
const axios = require('axios');
const { MarkovMachine } = require('./markov'); // Adjust the path accordingly

// Function to generate text from file
function generateTextFromFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            process.exit(1);
        } else {
            let mm = new MarkovMachine(data);
            console.log(mm.makeText());
        }
    });
}

// Function to generate text from URL
async function generateTextFromUrl(url) {
    try {
        let res = await axios.get(url);
        let mm = new MarkovMachine(res.data);
        console.log(mm.makeText());
    } catch (err) {
        console.error(`Error fetching URL: ${err.message}`);
        process.exit(1);
    }
}

// Main function to determine whether input is file or URL
function main() {
    let [type, path] = process.argv.slice(2);

    if (type === 'file') {
        generateTextFromFile(path);
    } else if (type === 'url') {
        generateTextFromUrl(path);
    } else {
        console.error('Invalid input. Use "file <path>" or "url <url>".');
        process.exit(1);
    }
}

main();

