import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getAuth
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  // Placeholder for future GitHub implementation
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName,
  email: firebaseUser.email,
  photoURL: firebaseUser.photoURL,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Get the ID token for backend communication
        const token = await firebaseUser.getIdToken();
        // Store the token in localStorage for API calls
        localStorage.setItem('authToken', token);
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful');
      navigate('/app');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      toast.success('Login successful');
      navigate('/app');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for future GitHub implementation
  const loginWithGithub = async () => {
    toast.info('GitHub login will be implemented soon');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
