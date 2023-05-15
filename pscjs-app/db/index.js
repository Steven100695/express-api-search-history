const { MongoClient } = require('mongodb');

const config = require('../config.json');

/**
 * @description         es6 style module to support mongo connection adn crud operations
 * @return {Object}     object containing functions
 */
const mongo = () => {
  const mongoURL = `mongodb+srv://${config.username}:${config.password}@cluster0.puiudsd.mongodb.net/${config.database_name}?retryWrites=true&w=majority`;
  let db = null;

  async function connect() {
    try {
      const client = new MongoClient(mongoURL);
      await client.connect();

      db = client.db();

      console.log('Connected to Mongo DB');
    } catch (error) {
      console.log(error);
    }
  }
  async function save(collectionName, data) {
    try {
      const collection = db.collection(collectionName);
      await collection.insertOne(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function find(collectionName, searchTerm) {
    try {
      if (searchTerm) {
        const collection = db.collection(collectionName);
        return await collection.findOne(searchTerm);
      } else {
        const collection = db.collection(collectionName);
        const documents = await collection.find().toArray();
        return documents;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function update(collectionName, searchTerm, data) {
    try {
      const collection = db.collection(collectionName);

      await collection.updateOne(searchTerm, data);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    connect,
    save,
    find,
    update
  };
};

module.exports = mongo();
