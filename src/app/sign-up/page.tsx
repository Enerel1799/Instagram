"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { IG_LOGO } from "@/icons/png-clipart-instagram-logo-computer-icons-logo-blog-instagram-purple-violet-thumbnail-removebg-preview 1-2";

type InputValue = {
  email: string;
  password: string;
  username: string;
};

const Page = () => {
  const { setUser, token } = useUser();
  const { push } = useRouter();

  const [inputValues, setInputValues] = useState<InputValue>({
    email: "",
    password: "",
    username: "",
  });

  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signup = async () => {
    const response = await fetch("http://localhost:8080/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inputValues),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Successfully signed up");
      push("/");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-md shadow-md">
        <div className="flex justify-center mb-6">
          <IG_LOGO />
        </div>

        <div className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            value={inputValues.email}
            onChange={handleInputValue}
          />
          <Input
            name="username"
            type="text"
            placeholder="Username"
            value={inputValues.username}
            onChange={handleInputValue}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={inputValues.password}
            onChange={handleInputValue}
          />

          <Button
            onClick={signup}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Sign Up
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Have an account?
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
