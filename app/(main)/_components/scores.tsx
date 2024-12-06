import { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import Spinner from "@/components/spinner";
import { IDiemSo, IDiemTongKet } from "@/types/diem";
import ScoreTable from "./scoreTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScoreSumTable from "./scoreSumTable";

const Scores = () => {
  const [diemSo, setDiemSo] = useState<IDiemSo[]>([]);
  const [diemTongKet, setDiemTongKet] = useState<IDiemTongKet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLichThi = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/scores");
        setDiemSo(response.data.diemSoData);
        setDiemTongKet(response.data.tongKetData);
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
              <BookOpenCheck className="w-16 h-16" />
              <span className="mt-auto ml-auto font-medium text-xl text-card-foreground group-hover:text-card dark:group-hover:text-card-foreground">
                Bảng điểm
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Điểm chi tiết</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto flex flex-col space-y-2 py-2">
            <div className="pt-4">
              <Tabs defaultValue="winter">
                <TabsList>
                  <TabsTrigger value="sum">
                    Điểm trung bình năm học, học kỳ, toàn khóa
                  </TabsTrigger>
                  <TabsTrigger value="detail">Điểm chi tiết</TabsTrigger>
                </TabsList>
                <TabsContent value="sum">
                  {!loading && diemTongKet.length > 0 && (
                    <ScoreSumTable diemTongKetSum={diemTongKet} />
                  )}
                </TabsContent>
                <TabsContent value="detail">
                  {!loading && diemSo.length > 0 && (
                    <ScoreTable diemSo={diemSo} />
                  )}
                </TabsContent>
              </Tabs>
            </div>
            {loading && (
              <div className="w-full min-h-40 flex items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Scores;
