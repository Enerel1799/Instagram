"use client";
import { User } from "lucide-react";
import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useState } from "react";
import { useEffect } from "react";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
};

type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  login: (password: string, email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const user = await response.json();

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const values = { login: login, user: user, setUser: setUser };
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
