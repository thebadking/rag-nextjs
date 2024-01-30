// fileWatcher.mjs
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generateDatasource } from './generate.mjs';
import { fileURLToPath } from 'url';

dotenv.config();

let timeoutId = null;

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the path to the data directory
const dataDir = path.resolve(__dirname, './data');

// Watch the /data directory 
export function watchDataDirectory(serviceContext) {
  console.log(`>> Starting to watch ${dataDir} for changes...`); // Log when the watching starts

  // [BUG] fs.watch unable to detect added files event !!!
  // [TBD] "npm run generate" to generate embeddings/store 
  fs.watch(dataDir, (eventType, filename) => {
		console.log(`>> Event type: ${eventType}; File: ${filename}`); // Log all events

    if (eventType === 'change' && filename) {
      console.log(`>> File ${filename} has been changed`);

      // If a timeout is already set, clear it
      if (timeoutId) { clearTimeout(timeoutId); }

      // Set a delay before regenerating the datasource
      timeoutId = setTimeout(async () => {
        try {
          await generateDatasource(serviceContext);
          console.log(">> Finished generating storage.");
        } catch (error) {
          console.error(">> Error generating storage:", error);
        }
      }, process.env.GENERATE_DELAY);
    }
  });
}
