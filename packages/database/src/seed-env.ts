import { config } from '@dotenvx/dotenvx';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from monorepo root BEFORE any other imports
config({ path: resolve(__dirname, '../../../.env') });
