import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-wiki-content.ts';
import '@/ai/flows/generate-solution.ts';
import '@/firebase/firestore/data.ts';
import '@/firebase/firestore/seed-world-20.ts';
