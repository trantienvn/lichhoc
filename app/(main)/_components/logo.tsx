import { Command } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Command className="w-8 h-8" />
      <span className={cn("text-xl font-medium", poppins.className)}>
        Sinh viên ICTU
      </span>
    </Link>
  );
};

export default Logo;
