const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');
require("dotenv").config();

// Function to perform database backup
async function backup() {
    // Database name to backup
    const dbName = 'test';
    try {
        // Connect to MongoDB server
        const client = new MongoClient(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Create spawn options
        const options = {
            shell: true, // Needed to use shell syntax (e.g., redirection)
            stdio: 'inherit' // Use parent's stdio streams for child
        };

        // Command to execute mongodump
        const cmd = `"mongodump" --uri=${process.env.DATABASE}${dbName}`;

        // Execute mongodump command
        const child = spawn(cmd, options);

        // Handle errors
        child.on('error', (err) => {
            console.error(`Error executing command: ${err}`);
        });

        // Handle exit event
        child.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Backup successful');
            } else {
                console.error(`Backup failed with code ${code}`);
            }
            client.close(); // Close MongoDB connection
        });
    } catch (err) {
        console.error('Error during backup:', err);
    }
}

async function dropDatabase(dbName) {
    let client;
    try {
        // Connect to MongoDB server
        client = new MongoClient(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Access the admin database
        const db = client.db(dbName);
        await db.dropDatabase();

    } catch (err) {
        console.error('Error deleting database:', err);
    } finally {
        // Close the MongoDB connection
        client.close();
    }
}

async function restore() {
    try {
        // Command to execute mongorestore\
        const dbName = 'test';
        const backupPath = './dump/test';
        dropDatabase(dbName);
        const cmd = `"mongorestore" --db ${dbName} ${backupPath}`;

        // Execute mongorestore command
        const child = spawn(cmd, { shell: true, stdio: 'inherit' });

        // Handle errors
        child.on('error', (err) => {
            console.error(`Error executing command: ${err}`);
        });

        // Handle exit event
        child.on('exit', (code, signal) => {
            if (code === 0) {
                console.log('Restore successful');
            } else {
                console.error(`Restore failed with code ${code}`);
            }
        });
    } catch (err) {
        console.error('Error during restore:', err);
    }
}

module.exports = { backup, restore };
