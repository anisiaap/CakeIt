require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const connectDB = async () => {
  try {
    await client.connect();
    const dbRole = await client.db().command({ hello: 1 });
    console.log(
      `Role of database - Host: ${dbRole.me}  Is primary: ${dbRole.isWritablePrimary}`
    );
    await client.close();
  } catch (e) {
    console.log('Error: ', e.message);
  }
};
module.exports = connectDB; 