"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "./_components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const isLogin = Cookies.get("SignIn");
    if (!isLogin) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
