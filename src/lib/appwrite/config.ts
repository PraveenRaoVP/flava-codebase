import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

// appwriteConfig is an object that contains the Appwrite project ID and collection IDs
export const appwriteConfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_POSTS_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_SAVES_ID,
}
// console.log(appwriteConfig.url)
// console.log(appwriteConfig.projectId)

// create a new Appwrite client
export const client = new Client();

// set the client's project ID and endpoint
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url)

// create new instances of the Appwrite services
export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
