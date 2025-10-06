import { Client, Account, Databases } from 'appwrite';

const client = new Client();

try {
  const endpoint =  import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6880984b003cc7ae9f2f';
  
  client
    .setEndpoint(endpoint) 
    .setProject(projectId);

  if (import.meta.env.DEV) {
    const testConnection = async () => {
      try {
        const account = new Account(client);
        const connectionTest = account.get();
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection test timeout')), 5000)
        );
        await Promise.race([connectionTest, timeout]);
      } catch (error) {
      }
    };
    testConnection();
  }
} catch (error) {
  console.error('Failed to initialize Appwrite client:', error);
}

const account = new Account(client);
const databases = new Databases(client);
export { client, account, databases };
