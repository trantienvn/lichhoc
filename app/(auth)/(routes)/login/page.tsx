"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      return toast.error("Vui lòng nhập tên đăng nhập và mật khẩu");
    }

    // Call login API here
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        Cookies.set("SignIn", response.data.token);
        localStorage.setItem("username", response.data.name);
        localStorage.setItem("studentId", response.data.studentId);
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-zinc-900 p-6 flex flex-col">
        <div className="flex items-center space-x-2 text-muted dark:text-muted-foreground">
          <Command className="w-8 h-8" />
          <span className={cn("text-xl font-medium", poppins.className)}>
            Sinh viên
          </span>
        </div>
        <div className="mt-auto text-muted dark:text-muted-foreground">
          <blockquote className="text-lg">
            <Suspense fallback="Loading...">
              &quot; Failure is an option here. If things are not failing, you
              are not innovating enough. – Thất bại là một lựa chọn ở đây. Nếu
              mọi thứ không thất bại, bạn không đủ sáng tạo. &quot;
            </Suspense>
          </blockquote>
          <span className="text-sm font-semibold">Elon Musk</span>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <form
          className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-xl"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col p-6 space-y-4">
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold tracking-tight text-2xl">
                Đăng nhập
              </h3>
              <p className="text-sm text-muted-foreground">
                Nhập tài khoản và mật khẩu trên trang dangkitinchi để đăng nhập
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="block" htmlFor="username">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Tên đăng nhập"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="block" htmlFor="password">
                Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Spinner /> : "Đăng nhập"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
