"use client";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMonHoc } from "@/types/monHoc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ScheduleItem from "./scheduleItem";
import Spinner from "@/components/spinner";

// Hàm kiểm tra ngày hiện tại còn lịch học không
function have(items: IMonHoc[]) {
  const today = new Date();
  return items.some((item) => new Date(item.Ngay) >= today);
}

// Hàm tăng ngày
function nextDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}
function dateToString(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0"); // Đảm bảo ngày luôn có 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Đảm bảo tháng luôn có 2 chữ số
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`; // Trả về chuỗi định dạng dd/mm/yyyy
}
function stringToDate(dateStr: string): Date {
  // Tách chuỗi theo ký tự "/"
  const parts = dateStr.split("/");

  // Kiểm tra xem chuỗi có đúng định dạng "dd/mm/yyyy" hay không
  if (parts.length !== 3) {
    return new Date(); // Trả về null nếu chuỗi không hợp lệ
  }

  const day = parseInt(parts[0], 10); // Lấy ngày
  const month = parseInt(parts[1], 10) - 1; // Lấy tháng (giảm 1 vì tháng bắt đầu từ 0 trong JavaScript)
  const year = parseInt(parts[2], 10); // Lấy năm

  // Tạo đối tượng Date
  const date = new Date(year, month, day);

  // Kiểm tra tính hợp lệ của ngày (ví dụ: 30/02/2024 là không hợp lệ)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return new Date(); // Trả về null nếu ngày không hợp lệ
  }

  return date;
}
function ThuTrongTuan(day: string){
  const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return daysOfWeek[stringToDate(day).getDay()];
}
// Hàm hiển thị lịch học
function tin(data: Record<string, IMonHoc[]>, endDate: Date) {
  const DOM: JSX.Element[] = [];
  let day = new Date();
  console.log(endDate)
  while (day <= endDate) {
    const dayStr = dateToString(day); // Chuyển ngày về định dạng "YYYY-MM-DD"
    const itemsOnDay = data[dayStr] || []; // Lấy dữ liệu ngày tương ứng
    
    if (itemsOnDay.length > 0) {
      itemsOnDay.forEach((item) => {
        
        DOM.push(
          <div
            className="rounded-lg border bg-card shadow-sm text-sm text-muted-foreground"
            key={item.STT}
          >
            <ScheduleItem item={item} />
          </div>
        );
      });
    }else{
      DOM.push(
        <div
          className="rounded-lg border bg-card shadow-sm text-sm text-muted-foreground"
          key={0}
        >
          <div className="flex flex-col p-4 space-y-4">
      <div className="flex flex-col space-y-2">
      <div className="flex items-center">
      <p>{ThuTrongTuan(dayStr)}</p>
      <div className="mx-2">•</div>
          <p>Ngày: {dayStr}</p>
        </div>
        <div className="bg-muted-foreground w-full h-[1px]"></div> 
        <p className="font-semibold tracking-tight text-2xl text-card-foreground">
          Bạn rảnh!
        </p>
      </div>
    </div>
        </div>
      );
    }

    day = nextDay(day);
  }

  return <>{DOM}</>;
}



// Component chính
const Schedule = () => {
  const [LichHoc, setLichHoc] = useState<IMonHoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lichhocdata, setData] = useState<Record<string, IMonHoc[]>>({});
  const [endDate, setEnd] = useState<string>("01/01/1970");

  useEffect(() => {
    const getLichHoc = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/lichhoc");
        setData(response.data.lichhocdata);
        setEnd(response.data.endDate);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getLichHoc();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="p-5 rounded-xl border bg-card shadow w-52 h-52 group-hover:bg-zinc-800 group-hover:scale-125 group-hover:text-muted dark:group-hover:text-muted-foreground transition duration-300 ease-in-out flex flex-col">
            <CalendarRange className="w-16 h-16" />
            <span className="mt-auto ml-auto font-medium text-xl text-card-foreground group-hover:text-card dark:group-hover:text-card-foreground">
              Lịch học
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lịch học</DialogTitle>
          <DialogDescription>
            Bạn có thể xem lịch học của các môn học!
          </DialogDescription>
          <div className="max-h-[70vh] overflow-y-auto flex flex-col space-y-2 py-2">
            {loading ? (
              <div className="w-full min-h-40 flex items-center justify-center">
                <Spinner />
              </div>
            ) : Object.keys(lichhocdata).length > 0 ? (
              tin(lichhocdata,stringToDate(endDate))
            ) : (
              <p>Bạn không có lịch học!</p>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Schedule;
