import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from "url";

export function generateRandomSecret(): string {
    return crypto.randomBytes(64).toString('hex');
}

export function getDirName(importMetaUrl: string) {
    const __filename = fileURLToPath(importMetaUrl);
    return path.dirname(__filename);
}
