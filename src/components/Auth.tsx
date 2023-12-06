"use client";
import React from "react";
import { Button } from "./ui/button";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { AddUsername } from "./AddUsername";

interface Props {}

function Auth({}: Props) {
  const { data, status } = useSession();

  if (data?.user.username) redirect("/chats");

  return (
    <div className="w-full max-w-sm">
      {status === "unauthenticated" ? (
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      ) : (
        <AddUsername />
      )}
    </div>
  );
}

export default Auth;
