"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IG_LOGO } from "@/icons/png-clipart-instagram-logo-computer-icons-logo-blog-instagram-purple-violet-thumbnail-removebg-preview 1-2";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

type inputValue = {
  email: string;
  password: string;
};

const Page = () => {
  const [inputValues, setInputValues] = useState<inputValue>("");
  const handleInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInputValues({ ...inputValues, email: value });
    } else if (name === "password") {
      setInputValues({ ...inputValues, password: value });
    }
  };
  console.log(inputValues);
  const { setUser, user } = useUser();
  const { push } = useRouter();

  const login = async () => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
      }),
    });
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      push("/");
      toast.success("successfully logged in");
    } else {
      toast.error("Wrong password or Email");
    }
  };
  return (
    <div>
      <IG_LOGO />
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
      <Button onClick={login}>Login</Button>
    </div>
  );
};
export default Page;
