import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, adminClient } from 'better-auth/client/plugins';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        bio: { type: 'string', required: false },
        plan: { type: 'string', required: false },
      },
    }),
    adminClient(),
  ],
});