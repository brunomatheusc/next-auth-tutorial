"use client";

import { useRouter } from "next/navigation";

interface LoginButtonprops {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export const LoginButton = ({ 
  children, 
  mode = "redirect", 
  asChild = false 
}: LoginButtonprops) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <span>
        TODO: Implement modal
      </span>
    );
  }

  return (
    <span 
      className="cursor-pointer"
      onClick={onClick}
    >
      {children}
    </span>
  );
};