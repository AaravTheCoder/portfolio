import { createClient } from '@base44/sdk';

export const createAxiosClient = () => ({
    get: async () => ({ data: {} }),
    post: async () => ({ data: {} })
});

export const db = createClient({
    baseUrl: '/api', 
    appId: import.meta.env.VITE_BASE44_APP_ID,
    apiKey: import.meta.env.VITE_BASE44_API_KEY,
});

export const base44 = db;
export default db;