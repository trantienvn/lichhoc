"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMonThi } from "@/types/monThi";
import { GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExamItem from "./examItem";
import Spinner from "@/components/spinner";

const Exam = () => {
  const [lichThi, setLichThi] = useState<IMonThi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLichThi = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/lichthi");
        setLichThi(response.data.lichthiData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getLichThi();
  }, []);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer">
            <div className="p-5 rounded-xl border bg-card shadow w-52 h-52 group-hover:bg-zinc-800 group-hover:scale-125 group-hover:text-muted dark:group-hover:text-muted-foreground transition duration-300 ease-in-out flex flex-col">
              <GraduationCap className="w-16 h-16" />
              <span className="mt-auto ml-auto font-medium text-xl text-card-foreground group-hover:text-card dark:group-hover:text-card-foreground">
                Lịch thi
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lịch thi</DialogTitle>
            <DialogDescription>
              Bạn có {lichThi.length} môn thi cần thực hiện!
            </DialogDescription>
            <div className="max-h-[70vh] overflow-y-auto flex flex-col space-y-2 py-2">
              {loading && (
                <div className="w-full min-h-40 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {!loading && lichThi.length > 0 ? (
                lichThi.map((item) => (
                  <div
                    className="rounded-lg border bg-card shadow-sm text-sm text-muted-foreground"
                    key={item.stt}
                  >
                    <ExamItem item={item} />
                  </div>
                ))
              ) : (
                <p>Không có môn thi nào</p>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exam;
