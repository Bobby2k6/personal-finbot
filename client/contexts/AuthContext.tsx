import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  getCurrentUser,
  logoutUser as apiLogout,
  updateUserSettings,
  User as ApiUser
} from "@/lib/finance-api";

export interface User {
  id: number;
  email: string;
  name: string;
  profilePicture?: string;
  isDemo?: boolean;
  familyMode?: boolean;
  familyMembers?: User[];
  preferred_currency?: string;
  theme_mode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("financebot-token");
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            familyMode: userData.family_mode,
            preferred_currency: userData.preferred_currency,
            theme_mode: userData.theme_mode,
            isDemo: false,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("financebot-token");
          // Set demo user as fallback
          setUser({
            id: 0,
            email: "demo@example.com",
            name: "Saif",
            isDemo: true,
            familyMode: false,
            preferred_currency: "INR",
          });
        }
      } else {
        // Set demo user if no token
        setUser({
          id: 0,
          email: "demo@example.com",
          name: "Saif",
          isDemo: true,
          familyMode: false,
          preferred_currency: "INR",
        });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        familyMode: response.user.family_mode,
        preferred_currency: response.user.preferred_currency,
        theme_mode: response.user.theme_mode,
        isDemo: false,
      };
      setUser(userData);
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await apiRegister(email, password, name);
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        familyMode: response.user.family_mode,
        preferred_currency: response.user.preferred_currency,
        theme_mode: response.user.theme_mode,
        isDemo: false,
      };
      setUser(userData);
    } catch (error) {
      throw new Error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser({
      id: 0,
      email: "demo@example.com",
      name: "Saif",
      isDemo: true,
      familyMode: false,
      preferred_currency: "INR",
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user && !user.isDemo) {
      try {
        const updatedUser = await updateUserSettings({
          name: updates.name,
          preferred_currency: updates.preferred_currency,
          theme_mode: updates.theme_mode,
          family_mode: updates.familyMode,
        });
        setUser({
          ...user,
          name: updatedUser.name,
          preferred_currency: updatedUser.preferred_currency,
          theme_mode: updatedUser.theme_mode,
          familyMode: updatedUser.family_mode,
        });
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    } else if (user) {
      // For demo user, just update local state
      setUser({ ...user, ...updates });
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
