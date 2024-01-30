import {
  serviceContextFromDefaults,
  SimpleDirectoryReader,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";

import * as dotenv from "dotenv";

import {
  CHUNK_OVERLAP,
  CHUNK_SIZE,
  STORAGE_CACHE_DIR,
  STORAGE_DIR,
} from "./constants.mjs";

import { watchDataDirectory } from './fileWatcher.mjs';

// Load environment variables from local .env file
dotenv.config();

async function getRuntime(func) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}

export async function generateDatasource(serviceContext) {
  console.log(`Generating storage context...`);
  // Split documents, create embeddings and store them in the storage context
  const ms = await getRuntime(async () => {
    const storageContext = await storageContextFromDefaults({
      persistDir: STORAGE_CACHE_DIR,
    });
    // const documents = await new SimpleDirectoryReader().loadData({
    let documents = await new SimpleDirectoryReader().loadData({
      directoryPath: STORAGE_DIR,
    });

    // Ensure the total number of tokens is within the limit
    documents = documents.map(document => {
      if (document.length > 4096) {
        return document.substring(0, 4096);
      }
      return document;
    });

    await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
      serviceContext,
    });
  });
  console.log(`Storage context successfully generated in ${ms / 1000}s.`);
}

(async () => {
  const serviceContext = serviceContextFromDefaults({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  await generateDatasource(serviceContext);
  console.log("Finished generating storage.");

  // Start watching the data directory for changes
  watchDataDirectory(serviceContext);
})();
