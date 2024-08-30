# Mongo Key Comparator

Mongo Key Comparator is a Node.js tool designed to compare keys between collections in two MongoDB databases. This tool helps identify keys that have been added or removed when migrating data or changing the database schema.

## Features

- Compares keys between two MongoDB databases.
- Identifies new and removed keys in the collections.
- Generates CSV reports for each collection comparison.
- Configurable via environment variables.

## Setup and Usage

### Prerequisites

- Node.js (Tesed with V16.20.2 | V12 or later)
- MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone[ https://github.com/your-username/mongo-key-comparator.git](https://github.com/pradipwaghela/mongo-key-comparator)
   cd mongo-key-comparator
   ```

2. **Install the dependencies:**
    ```bash
    npm install
    ```
3. **Create an .env file in the root directory of the project with the following structure:**

    ```bash
    DATABASE_URL=mongodb://127.0.0.1:27017
    OLD_DATABASE=mixit-dbv1
    NEW_DATABASE=mixit-db
    OUTPUT_FOLDER=./collection_comparisons
    COLLECTIONS=users,tokens
    ```

- DATABASE_URL: The connection string for your MongoDB instance.
- OLD_DATABASE: The name of the old database to compare.
- NEW_DATABASE: The name of the new database to compare.
- OUTPUT_FOLDER: The folder where the CSV files will be saved 
- COLLECTIONS: Comma-separated list of collections to compare.


4. **Running the Tool**
    ```bash
    node main.js
    ```
    This will generate CSV files for each collection comparison in the specified output folder.

## Output ##

**The tool generates a CSV file for each collection with the following fields:**


- Old Collection Keys: Keys present in the old database collection.
- New Collection Keys: Keys present in the new database collection.
- New Keys: Keys that are in the new collection but not in the old collection.
- Removed Keys: Keys that are in the old collection but not in the new collection.

## Example ##

**Given a .env configuration like this:**

```env
DATABASE_URL=mongodb://127.0.0.1:27017
OLD_DATABASE=db1
NEW_DATABASE=db2
OUTPUT_FOLDER=./collection_comparisons
COLLECTIONS=users,tokens
```
_Running the tool will compare the specified collections (rcp, users, impellers, jobs, tokens) between mixit-dbv1 and mixit-db, and generate CSV reports in the ./collection_comparisons directory._

## License ##
This project is licensed under the MIT License.

## Author ##
*_Pradip Waghela_* 

[![text](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://in.linkedin.com/in/pradip-waghela-a63951145)

[![text](https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white)](mailto:pradip.waghela787@gmail.com?)

Mongo Key Comparator was created and maintained by Pradip Waghela.
