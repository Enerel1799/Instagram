"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useState } from "react";
type inputValue = {
  email: string;
  password: string;
  username: string;
};

const Page = () => {
  const { setUser, user } = useUser();
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
  console.log(inputValues);

  const signup = async () => {
    const response = await fetch("http://localhost:8080/sign-up", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
        username: inputValues.username,
      }),
    });

    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  if (user) push("/");
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
