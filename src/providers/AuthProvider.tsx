"use client";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useState } from "react";
import { useEffect } from "react";

export type User = {
  _id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  following: string[];
  followers: string[];
};

type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<null | string>>;
  login: (password: string, email: string) => Promise<void>;
};

type decodedTokenType = {
  data: User;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (typeof window !== "undefined") {
      if (localToken) {
        setToken(localToken);
        const decodedToken: decodedTokenType = jwtDecode(localToken);
        setUser(decodedToken.data);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("https://ig-backend-a8gz.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      push("/login");
    }
  };
  const values = {
    login: login,
    user: user,
    setUser: setUser,
    token,
    setToken,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "Auth context ashiglahiin tuld zaaval provider dotor baih heregtei!"
    );
  }
  return authContext;
};
