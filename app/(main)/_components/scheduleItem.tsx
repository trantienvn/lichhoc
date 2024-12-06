import { IMonHoc } from "@/types/monHoc";
import React from "react";
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
const ScheduleItem = ({ item }: { item: IMonHoc }) => {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="flex flex-col space-y-2">
         <div className="flex items-center">
         <p>{ThuTrongTuan(item.Ngay)}</p>
          <div className="mx-2">•</div>
          <p>Ngày: {item.Ngay}</p>
        </div>
        <div className="bg-muted-foreground w-full h-[1px]"></div> 
        <p className="font-semibold tracking-tight text-2xl text-card-foreground">
          {item.TenHP}
        </p>
        <p>Thời gian: {item.ThoiGian}</p>
        <p>Giảng viên: {item.GiangVien}</p>
        <p>Địa điểm: {item.DiaDiem}</p>
        <p>Meet: {item.Meet}</p>
      </div>
    </div>
  );
};

export default ScheduleItem;
