"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface AuthControlsProps {
  userId?: string;
}

export function AuthControls({ userId }: AuthControlsProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (userId) {
    return (
      <div className="flex items-center space-x-4">
        <span>Hello, {userId}</span>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    );
  }

  return (
    <Link href="/sign-in" className="flex items-center hover:text-gray-300">
      Login
    </Link>
  );
}
