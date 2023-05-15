const router = require('express').Router();

const database = require('../db');
const { brand, itemDetail } = require('pscjs-module');

// GET /search
router.get('/', async (req, res) => {
    const { keyword } = req.query;
  
    try {
      // Perform search using custom node module
      const results = await brand(keyword, 1);
  
      // Respond with JSON
      res.json({
        searchTerm: keyword,
        results: results.phones.map(item => ({ display: item.phone_name, id: item.slug }))
      });
  
      // Create or update search history in MongoDB
      await updateSearchHistory(keyword, results.phones.length);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//search/:id/details?searched=:searchterm
router.get('/:id/details', async (req, res) => {
  const { params, query } = req;

  const { id } = params;
  const { searchTerm } = query;
  try {
    const phoneSpec = await itemDetail(id);

    if (!phoneSpec) {
      return res.status(404).json({ message: 'Object not found' });
    }
    // Update search history in MongoDB
    await updateSearchHistory(searchTerm, 0, id, phoneSpec.phone_name);

    // Return the details with a 200 status code
    res.status(200).json(phoneSpec);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to update search history in MongoDB
async function updateSearchHistory(searchTerm, searchCount, id, display) {
  try {
    const collectionName = 'PhoneSpecsAppCollection';
    const existingRecord = await database.find(collectionName, { searchTerm });

    // Update existing record with new date
    if (existingRecord) {
      const updateObj = { $set: { lastSearched: new Date() } };

      if (id && display) {
        if (existingRecord.selections) {
          // If there is a selections key then update the Array by adding a new object { id, display }
          updateObj.$push = { selections: { id, display } };
        } else {
          // If there is NO selections key on the saved document then add is as an Array with the first object { id, display }
          updateObj.$set.selections = [{ id, display }];
        }
      }
      await database.update(collectionName, { searchTerm }, updateObj);
    }
    // Create new record
    else {
      await database.save(collectionName, {
        searchTerm,
        searchCount,
        lastSearched: new Date()
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;