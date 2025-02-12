import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let wordsList;
try {
    const filePath = join(__dirname, 'public', 'words.txt');
    wordsList = readFileSync(filePath, 'utf-8').split('\n').map(word => word.trim());
    console.log('Words loaded successfully:', wordsList.length, 'words');
} catch (err) {
    console.error('Error reading words file:', err);
    wordsList = [];
}

let test = "outer";

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json());

function generateDailyNumber() {
    const maxRange = 14855;
    const today = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) % maxRange;
    }
    return hash;
}

function occurance(word) {
    let occur = {};
    for (let i in word) {
        if (word[i] in occur) {
            occur[word[i]]++;
        } else {
            occur[word[i]] = 1;
        }
    }
    return occur;
}

function initOccurance(word) {
    let occur = {};
    for (let i in word) {
        if (word[i] in occur) {
            continue;
        } else {
            occur[word[i]] = 0;
        }
    }
    return occur;
}

function handle(word) {
    let position = {};
    const testOccur = occurance(test);
    let wordOccur = initOccurance(word);

    for (let i in word) {
        if (word[i] === test[i]) {
            if (testOccur[word[i]] === wordOccur[word[i]]) {
                for (let key in position) {
                    if (word[key] === word[i] && position[key] === "position") {
                        delete position[key];
                        position[i] = "correct";
                    }
                }
            } else {
                position[i] = "correct";
                wordOccur[word[i]]++;
            }
        } else {
            for (let j = 0; j < 5; j++) {
                if (word[i] === test[j]) {
                    if (testOccur[word[i]] > wordOccur[word[i]]) {
                        position[i] = "position";
                        wordOccur[word[i]]++;
                        break;
                    }
                }
            }
        }
    }
    return position;
}

// Routes
app.get("/", (req, res) => {
    try {
        res.status(200).json({ 
            status: "success", 
            message: "Wordle API is running!",
            endpoints: {
                test: "/api/test",
                word: "/api/word (POST)"
            }
        });
    } catch (error) {
        console.error('Root route error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.get("/api/test", (req, res) => {
    try {
        res.status(200).json({ 
            status: "success",
            message: "Test endpoint working",
            wordsLoaded: wordsList.length
        });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.post("/api/word", async (req, res) => {
    try {
        const { word } = req.body;
        
        if (!word) {
            return res.status(400).json({ 
                status: "error", 
                message: "Missing word in request body" 
            });
        }

        test = wordsList[generateDailyNumber()];
        console.log('Current test word:', test);

        const isValid = wordsList.includes(word.trim());
        const position = isValid ? handle(word) : {};

        return res.status(200).json({
            status: "success",
            message: "Word processed",
            wordFound: isValid,
            answer: position
        });
    } catch (error) {
        console.error('Word route error:', error);
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        status: "error",
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Global error:', error);
    res.status(500).json({ 
        status: "error",
        message: error.message 
    });
});

export default app;