import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock authentication function - replace with your actual auth logic
async function authenticateUser(email: string, password: string) {
  // TODO: Implement your authentication logic here
  // This is just a mock implementation
  if (email === "test@example.com" && password === "password") {
    return { id: "1", email, name: "Test User" };
  }
  return null;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: import.meta.env.VITE_GITHUB_ID ?? '',
      clientSecret: import.meta.env.VITE_GITHUB_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await authenticateUser(credentials.email, credentials.password);
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login', // optional
  },
  secret: import.meta.env.VITE_NEXTAUTH_SECRET,
});
