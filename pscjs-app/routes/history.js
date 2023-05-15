const router = require('express').Router();
const database = require('../db');

// Endpoint handler for GET /history
router.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm; // Get the value of the search term query parameter
        const collectionName = 'PhoneSpecsAppCollection';
    
        if (searchTerm) {
            // Find history by search term
            const results = await database.find(collectionName, { searchTerm });
            res.json(results);
        } else {
            // Retrieve all history
            const results = await database.find(collectionName);
            res.json(results);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to search history' });
    }
});

module.exports = router;