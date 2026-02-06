# Name Screening Service (Technical Assessment)

##  Project Overview

This service is a robust Node.js implementation designed to solve the "Name Screening" problem. It evaluates incoming user data against a known watchlist to identify potential matches using fuzzy string matching and name normalization techniques.

##  Technical Architecture

The project is structured with modularity and scalability in mind:

### 1. **Core Logic (`index.js`)**

The main entry point manages the lifecycle of a screening request:

* **Idempotency**: Checks for existing output to avoid redundant processing.
* **Classification**: Implements a tiered match result system:
* **EXACT_MATCH**: Score ≥ 0.9
* **POSSIBLE_MATCH**: Score ≥ 0.75
* **NO_MATCH**: Score < 0.75


* **Output Generation**: Produces both `detailed.json` for audit trails and `consolidated.json` for high-level decision making.

### 2. **Normalization Engine (`utils/normalize.js`)**

To handle variations in name formatting, the service applies the following transformations:

* **Case Sensitivity**: Converts all strings to lowercase.
* **Character Filtering**: Removes special characters and non-alphanumeric symbols.
* **Component Sorting**: Splits names and sorts them alphabetically (e.g., "Sharma Rahul" and "Rahul Sharma" are treated as identical).

### 3. **Similarity Algorithm (`utils/similarity.js`)**

The service utilizes a **Levenshtein Distance** algorithm to calculate a similarity score between 0 and 1. This allows the service to detect typos (e.g., "Rahul Sharm" vs "Rahul Sharma") and variations in spelling.

##  File Structure

* `data/`: Hierarchical storage for user requests and results.
* `utils/`: Isolated utility functions for testing and reusability.
* `watchlist.json`: The database of screened entities.
* `index.js`: The service controller.

##  Getting Started

### Prerequisites

* Node.js (LTS version recommended)

## How to Run the Service
The service is designed as a modular function that processes files from the local filesystem. Follow these steps to execute a screening:

1. Installation
Ensure you have Node.js installed, then clone the repository and install dependencies:

```
npm install
```

2. Prepare the Input Data

The service expects a specific folder hierarchy to locate the input files:

Create a folder inside data/ for the user (e.g., user123).

Create a subfolder for the specific request (e.g., REQ-3001).

Inside that, create an input/ folder and place an input.json file there.

Example File Path: data/user123/REQ-3001/input/input.json

3. Execution

The service exports the processRequest function. You can run it by calling it in a separate script or by adding a test execution line at the bottom of index.js:

Example Usage:

```
const processRequest = require('./index');

// Usage: processRequest(userId, requestId)
processRequest('user123', 'REQ-3001');
```

Then run the script via terminal:
```
node index.js
```

4. Verify Results

Once the script completes, check the output/ folder generated in your request directory:

data/user123/REQ-3001/output/detailed.json: Contains all matches found and normalization details.

data/user123/REQ-3001/output/consolidated.json: Contains the final match result and timestamp

## Technical Implementation Details

Similarity Logic: Calculated as (LongerLength - Distance) / LongerLength.

Normalization Path: Input is lowercased, non-alphanumeric characters are removed, and name components are sorted alphabetically before comparison.

Idempotency: If an output/ directory already exists for a specific requestId, the service skips processing to save resources.


## Sample Output

After processing, the system generates a result like this:

```json
{
  "finalMatch": {
    "watchlistId": "W1",
    "watchlistName": "Rahul Sharma",
    "score": 0.917
  },
  "matchType": "EXACT_MATCH",
  "timestamp": "2026-02-07T..."
}

```

##  Future Improvements

* **Phonetic Matching**: Integrating algorithms like Double Metaphone to catch names that sound similar but are spelled differently.
* **Performance**: Implementing a database (like MongoDB or PostgreSQL) for the watchlist to handle millions of records more efficiently than a JSON file.
* **API Layer**: Wrapping the logic in an Express.js or Fastify server for real-time screening via HTTP.

---
