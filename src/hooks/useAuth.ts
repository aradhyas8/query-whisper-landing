import { useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  Auth,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthError {
  code?: string;
  message: string;
}

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleAuthError = (error: any) => {
    let message = 'An unexpected error occurred';
    if (error.code === 'auth/wrong-password') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email';
    } else if (error.code === 'auth/email-already-in-use') {
      message = 'An account with this email already exists';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address';
    }
    return { code: error.code, message };
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const authError = handleAuthError(err);
      setError(authError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const authError = handleAuthError(err);
      setError(authError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (err: any) {
      const authError = handleAuthError(err);
      setError(authError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      const authError = handleAuthError(err);
      setError(authError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    error
  };
}