import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-wiki-content.ts';
import '@/ai/flows/generate-solution.ts';
import '@/firebase/firestore/data.ts';
// This server-side seeding approach is not viable with default security rules.
// Seeding will now be handled on the client.
// import '@/firebase/firestore/seed-world-20.ts';
