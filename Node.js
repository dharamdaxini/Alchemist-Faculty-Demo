// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Allows your HTML file to talk to this server
app.use(express.json()); // Allows server to read JSON sent from the app

// Path to your Master Dataset
const DATA_PATH = path.join(__dirname, 'data', 'master_pool.json');

/**
 * ROUTE 1: GET /api/curriculum
 * Purpose: Serves the full V170 Master Set to the engine.
 */
app.get('/api/curriculum', (req, res) => {
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf8');
        const curriculum = JSON.parse(rawData);
        
        console.log(`[SYSTEM] Served ${curriculum.length} questions to user.`);
        res.status(200).json(curriculum);
    } catch (error) {
        console.error("[ERROR] Failed to read curriculum data:", error);
        res.status(500).json({ error: "Curriculum injection failed." });
    }
});

/**
 * ROUTE 2: POST /api/diagnostics
 * Purpose: Logs student failures to identify gatekeeper concepts.
 */
app.post('/api/diagnostics', (req, res) => {
    const { userId, questionId, domain, rank, errorType } = req.body;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] USER:${userId} | FAIL:${questionId} | DOMAIN:${domain} | RANK:${rank}\n`;
    
    // Append to a simple text file for analysis
    fs.appendFile('student_failures.log', logEntry, (err) => {
        if (err) console.error("[ERROR] Logging failed:", err);
    });

    res.status(200).send({ message: "Diagnostic synchronized." });
});

// Start the Faculty Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    -------------------------------------------
    ALCHEMIST V170 BACKEND ACTIVE
    Port: ${PORT}
    Status: Faculty Data Stream Live
    -------------------------------------------
    `);
});
