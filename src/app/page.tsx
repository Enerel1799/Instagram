"use client";

import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const { push } = useRouter();

  if (!user) push("/login");
  return <div>{user?.username}</div>;
}
