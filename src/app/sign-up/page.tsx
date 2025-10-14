"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
type inputValue = {
  email: string;
  password: string;
  username: string;
};

const Page = () => {
  const { setUser, user, token } = useUser();
  const { push } = useRouter();
  const [inputValues, setInputValues] = useState<inputValue>({
    email: "",
    password: "",
    username: "",
  });
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInputValues({ ...inputValues, email: value });
    } else if (name === "password") {
      setInputValues({ ...inputValues, password: value });
    } else if (name === "username") {
      setInputValues({ ...inputValues, username: value });
    }
  };

  const signup = async () => {
    const response = await fetch("http://localhost:8080/sign-up", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
        username: inputValues.username,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", user);
      setUser(user);
      push("/");
      toast.success("successfully signed up");
    } else {
      toast.error("Error");
    }
  };
  return (
    <div>
      <Input
        id="email"
        placeholder="email"
        name="email"
        value={inputValues.email}
        onChange={(e) => handleInputValue(e)}
      />
      <Input
        placeholder="password"
        id="password"
        name="password"
        value={inputValues.password}
        onChange={(e) => handleInputValue(e)}
      />
      <Input
        placeholder="username"
        id="username"
        name="username"
        value={inputValues.username}
        onChange={(e) => handleInputValue(e)}
      />
      <Button onClick={signup}>Sign-Up</Button>
    </div>
  );
};
export default Page;
