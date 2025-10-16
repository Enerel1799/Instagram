"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IG_LOGO } from "@/icons/png-clipart-instagram-logo-computer-icons-logo-blog-instagram-purple-violet-thumbnail-removebg-preview 1-2";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type inputValue = {
  email: string;
  password: string;
};

const Page = () => {
  const [inputValues, setInputValues] = useState<inputValue>({
    email: "",
    password: "",
  });

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { token, setToken, user } = useUser();
  const { push } = useRouter();

  const login = async () => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
      }),
    });

    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      toast.success("Successfully logged in");
      push("/");
    } else {
      toast.error("Wrong password or email");
    }
  };

  useEffect(() => {
    if (token) {
      push("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-md shadow-md">
        <div className="flex justify-center mb-6">
          <IG_LOGO />
        </div>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            placeholder="Phone number, username, or email"
            value={inputValues.email}
            onChange={handleInputValue}
            className="w-full"
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={inputValues.password}
            onChange={handleInputValue}
            className="w-full"
          />
          <Button
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Log In
          </Button>
          <div className="absolute text-sm text-gray-500">
            Don't have an account?
            <a
              href="/sign-up"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
