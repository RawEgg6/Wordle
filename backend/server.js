import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    res.send("API is running!");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Test endpoint working" });
});

app.post("/api/word", async (req, res) => {
    const { word } = req.body;
    let isValid = false;
    
    if (!word) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const filePath = join(__dirname, 'public', 'words.txt');
        const fileData = await fs.readFile(filePath, 'utf-8');
        const dataWords = fileData.split('\n');

        let position = {};
        test = dataWords[generateDailyNumber()];
        console.log(test);

        dataWords.forEach((dataWord) => {
            if (word === dataWord.trim()) { 
                isValid = true;
                position = handle(word);
            }
        });

        return res.status(200).json({ 
            success: true, 
            message: "Word submitted", 
            wordFound: isValid, 
            answer: position 
        });
    } catch (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Only start the server if we're not in a Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;