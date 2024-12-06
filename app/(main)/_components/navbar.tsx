"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MoonStar, Sun } from "lucide-react";
import Logo from "./logo";
import { useTheme } from "next-themes";

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [nameFallback, setNameFallback] = useState<string>("");

  // Get name and studentId from cookies
  useEffect(() => {
    setName(localStorage.getItem("username") || "");
    setStudentId(localStorage.getItem("studentId") || "");

    // Set fallback for avatar
    if (name) {
      let nameParts = name.split(" ");

      let firstWord = nameParts[nameParts.length - 2].slice(0, 1);
      let secondWord = nameParts[nameParts.length - 1].slice(0, 1);

      setNameFallback(firstWord + secondWord);
    }
  }, [name]);

  const handleLogout = () => {
    Cookies.remove("SignIn");
    localStorage.removeItem("username");
    localStorage.removeItem("studentId");
    router.push("/login");
  };

  return (
    <header className="px-10 py-3 flex items-center justify-between shadow-md dark:bg-zinc-900">
      <Logo />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarFallback>{nameFallback}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {studentId}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark"
              ? "Chuyển sang chế độ sáng"
              : "Chuyển sang chế độ tối"}
            <DropdownMenuShortcut>
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <MoonStar className="w-4 h-4" />
              )}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Đăng xuất
            <DropdownMenuShortcut>
              <LogOut className="w-4 h-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Navbar;
