import { IMonThi } from "@/types/monThi";
import React from "react";

const ExamItem = ({ item }: { item: IMonThi }) => {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <p>Ngày thi: {item.ngayThi}</p>
          <div className="mx-2">•</div>
          <p>Ca thi: {item.caThi}</p>
        </div>
        <div className="bg-muted-foreground w-full h-[1px]"></div>
        <p className="font-semibold tracking-tight text-2xl text-card-foreground">
          {item.tenHP}
        </p>
        <p>Mã học phần: {item.maHP}</p>
        <p>Số tín chỉ: {item.soTC}</p>

        <p>Hình thức thi: {item.hinhThucThi}</p>
        <p>Số báo danh: {item.soBaoDanh}</p>
        <p>Phòng thi: {item.phongThi}</p>
        <p>Ghi chú: {item.ghiChu}</p>
      </div>
    </div>
  );
};

export default ExamItem;
