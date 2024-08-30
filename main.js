require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const { stringify } = require("csv-stringify/sync");
var uri = process.env.DATABASE_URL ?? "mongodb://localhost:27017/";
const { parse } = require("json2csv");

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function compareCollectionsOLD(olddb, newdb, collectionName) {
  const oldCollection = olddb.collection(collectionName);
  const newCollection = newdb.collection(collectionName);

  const oldKeys = await getUniqueKeys(oldCollection);
  const newKeys = await getUniqueKeys(newCollection);

  const addedKeys = new Set([...newKeys].filter((key) => !oldKeys.has(key)));

  const removedKeys = new Set([...oldKeys].filter((key) => !newKeys.has(key)));
  console.log(
    `\n **********${collectionName} Collection Key Compare**********\n `,
    "\n----------Old collection keys---------- \n",
    oldKeys,
    "\n ----------New Collection Keys----------\n",
    newKeys,
    "\n---------- New  Keys---------\n",
    [...addedKeys],
    "\n---------- Removed  Keys---------\n",
    [...removedKeys]
  );
}
async function getUniqueKeys(collection) {
  const keys = await collection
    .aggregate([
      { $project: { keys: { $objectToArray: "$$ROOT" } } },
      { $unwind: "$keys" },
      { $group: { _id: null, allKeys: { $addToSet: "$keys.k" } } },
    ])
    .toArray();

  return keys.length > 0 ? new Set(keys[0].allKeys) : new Set();
}

async function getAllUniqueKeys(collection) {
  const documents = await collection.find({}).toArray();
  let allKeysSet = new Set();

  documents.forEach((doc) => {
    collectAllKeys(doc, "", allKeysSet);
  });

  return allKeysSet;
}
function collectAllKeys(obj, prefix = "", keysSet = new Set()) {
  if (typeof obj !== "object" || obj === null || Buffer.isBuffer(obj)) {
    return keysSet;
  }

  for (const key in obj) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    // Add the key to the Set
    keysSet.add(fullKey);

    // Recursively collect keys if the value is a plain object
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !Buffer.isBuffer(value)
    ) {
      collectAllKeys(value, fullKey, keysSet);
    }
  }
  // console.log(`Keyset ${keysSet}`)
  return keysSet;
}

async function compareCollections(olddb, newdb, collectionName) {
  const oldCollection = olddb.collection(collectionName);
  const newCollection = newdb.collection(collectionName);

  const oldallkeys = await getAllUniqueKeys(oldCollection);
  const newallkeys = await getAllUniqueKeys(newCollection);

  const addedKeys = new Set(
    [...newallkeys].filter((key) => !oldallkeys.has(key))
  );

  const removedKeys = new Set(
    [...oldallkeys].filter((key) => !newallkeys.has(key))
  );
  // const addedKeysArray = Array.isArray(addedKeys) ? addedKeys : [];
  // const removedKeysArray = Array.isArray(removedKeys) ? removedKeys : [];
  // const addedKeysArray = Array.from(addedKeys)
  // const removedKeysArray = Array.from(removedKeys)

  const data = {
    "Old Collection Keys": [...oldallkeys],
    "New Collection Keys": [...newallkeys],
    "New Keys": [...addedKeys],
    "Removed Keys": [...removedKeys],
  };
  const headers = Object.keys(data);

  const maxLength = Math.max(...Object.values(data).map((arr) => arr.length)); // Determine the maximum length

  // Create the CSV rows
  let csvRows = [];
  for (let i = 0; i < maxLength; i++) {
    csvRows.push(headers.map((header) => data[header][i] || ""));
  }
  csvRows.unshift(headers);

  const csv = stringify(csvRows, {
    header: false,
    quoted: true,
    delimiter: ",",
  });
  const outputDir = path.join(__dirname, "MOW_V1_V2_collection_comparisons");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, `${collectionName}_comparison.csv`);
  fs.writeFileSync(filePath, csv);

  console.log(
    `\n **********${collectionName} Collection Key Compare (Nested/All Keys)**********\n `,
    "\n----------Old collection keys---------- \n",
    oldallkeys,
    "\n ----------New Collection Keys----------\n",
    newallkeys,
    "\n---------- New  Keys---------\n",
    [...addedKeys],
    "\n---------- Removed  Keys---------\n",
    [...removedKeys]
  );
}

async function run() {
  try {
    const olddatabse = process.env.OLD_DATABASE
    const newdatabase = process.env.NEW_DATABASE

    // const collection_list = ["rcp", "users", "impellers", "jobs", "tokens"];
    const collection_list = process.env.COLLECTIONS.split(",")
    console.log(collection_list)

    await client.connect();
    const old_database = client.db(olddatabse);
    const new_database = client.db(newdatabase);

    for (const collectionName of collection_list) {
      console.log(collectionName)
      // await compareCollections(old_database, new_database, collectionName);
    }
  } catch (error) {
    console.log("error ", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
