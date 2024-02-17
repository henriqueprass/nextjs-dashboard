import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
/* 1. Adding the Credentials provider
  1.1. Importar Credentials */
import Credentials from 'next-auth/providers/credentials';
/* 2. Adding the sign in functionality
  2.1. Importar z from zod */
import { z } from 'zod';
/* 2.3. After validating the credentials, create a new getUser function that queries the user from the database. */
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
/* 2.3. (FIM) */

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  /* 1.2. Next, you will need to add the providers option for NextAuth.js. providers is an array where you list different login options such as Google or GitHub. For this course, we will focus on using the Credentials provider only.
  The Credentials provider allows users to log in with a username and a password.
  Good to know:
    Although we're using the Credentials provider, it's generally recommended to use alternative providers such as OAuth or email providers. See the NextAuth.js docs for a full list of options. */
  //providers: [Credentials({})], // Substituído
  /* 2.2. You can use the authorize function to handle the authentication logic. Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database: */
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        /* 2.4. Inserir */
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          /* 2.5. Then, call bcrypt.compare to check if the passwords match: */
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
          /* 2.5. (FIM) */
        }
        /* 2.4. (FIM) */

        /* 2.6. Finally, if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in. */
        console.log('Invalid credentials');
        return null;
        /* 2.6. (FIM) */
      },
    }),
  ],
  /* 2.2. (FIM) */
});
