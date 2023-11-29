// routes.js
const express = require('express');
const db = require('./db/db');

const router = express.Router();

// Route to get all titles from the codeblock table
router.get('/titles', (req, res) => {
    const sql = 'SELECT title FROM codeblock';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});

// Route to get code content based on title
router.get('/code/:title', (req, res) => {
    const title = req.params.title;
    const sql = 'SELECT code FROM codeblock WHERE title = ?';
    db.query(sql, title, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            if (result.length > 0) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ message: 'Code not found for the given title' });
            }
        }
    });
});

let isUpdateInProgress = false; // Semaphore to control access
// Route to update mentor id in a code block if needed, based on provided session ID and title
router.post('/updateMentor', (req, res) => {
    if (isUpdateInProgress) {
        return res.status(409).json({ message: 'Update in progress. Try again later.' });
    }
    isUpdateInProgress = true; // Set semaphore to true, indicating an update is in progress

    const { title, sessionId } = req.body;
    const checkSql = 'SELECT mentor FROM codeblock WHERE title = ?';
    db.query(checkSql, title, (checkErr, checkResult) => {
        if (checkErr) {
            isUpdateInProgress = false;
            res.status(500).json({ error: checkErr.message });
        } else {
            if (checkResult.length > 0) {
                const currentMentor = checkResult[0].mentor;
                if (currentMentor === '-1') {
                    const updateSql = 'UPDATE codeblock SET mentor = ? WHERE title = ?';
                    db.query(updateSql, [sessionId, title], (updateErr, updateResult) => {
                        if (updateErr) {
                            isUpdateInProgress = false;
                            res.status(500).json({ error: updateErr.message });
                        } else {
                            isUpdateInProgress = false;
                            res.status(200).json({ updated: true });
                        }
                    });
                } else {
                    isUpdateInProgress = false;
                    res.status(200).json({ updated: false });
                }
            } else {
                isUpdateInProgress = false;
                res.status(404).json({ message: 'Title not found' });
            }
        }
    });
});

// Route to check and update mentor status to -1 if the mentor is leaving
router.post('/checkAndUpdateMentor', (req, res) => {
    const { title, sessionId } = req.body;    
        const checkSql = 'SELECT mentor FROM codeblock WHERE title = ?';
        db.query(checkSql, title, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                if (result.length > 0) {
                    const currentMentor = result[0].mentor;
                    if (currentMentor === sessionId) {
                        const updateSql = 'UPDATE codeblock SET mentor = ? WHERE title = ?';
                        db.query(updateSql, ['-1', title], (updateErr, updateResult) => {
                            if (updateErr) {
                                res.status(500).json({ error: updateErr.message });
                            } else {
                                res.status(200).json({ message: 'Updated mentor to -1' });
                            }
                        });
                    } else {
                        res.status(200).json({ message: 'Session ID does not match mentor column for the given title. Not updated.' });
                    }
                } else {
                    res.status(404).json({ message: 'Title not found' });
                }
            }
        });
    ;
});

// Route to update code content in a code block and check if the new code matches the official solution
router.post('/updateCode', (req, res) => {
    const { title, code } = req.body;
    const updateSql = 'UPDATE codeblock SET code = ? WHERE title = ?';
    const checkSolutionSql = 'SELECT solution FROM codeblock WHERE title = ?';

    db.query(updateSql, [code, title], (updateErr, updateResult) => {
        if (updateErr) {
            res.status(500).json({ error: updateErr.message });
        } else {
            db.query(checkSolutionSql, title, (solutionErr, solutionResult) => {
                if (solutionErr) {
                    res.status(500).json({ error: solutionErr.message });
                } else {
                    if (solutionResult.length > 0) {
                        const solutionCode = solutionResult[0].solution;
                        if (code === solutionCode) {
                            res.status(200).json({ message: 'Match the solution' });
                            console.log('Code updated successfully. It matches the solution!')
                        } else {
                            res.status(200).json({ message: 'Not a solution match' });
                            console.log('Code updated successfully, but it does not match the solution.')
                        }
                    } else {
                        res.status(404).json({ message: 'Title not found' });
                    }
                }
            });
        }
    });
});



module.exports = router;
