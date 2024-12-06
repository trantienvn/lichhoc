import { IDiemTongKet } from "@/types/diem";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScoreSumTable = ({
  diemTongKetSum,
}: {
  diemTongKetSum: IDiemTongKet[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Năm học</TableHead>
          <TableHead>Học kỳ</TableHead>
          <TableHead>TBTL Hệ 10</TableHead>
          <TableHead>TBTL Hệ 4</TableHead>
          <TableHead>Số TCTL</TableHead>
          <TableHead>TBC Hệ 10</TableHead>
          <TableHead>TBC Hệ 4</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {diemTongKetSum.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.namHoc}</TableCell>
            <TableCell>{item.hocKy}</TableCell>
            <TableCell>{item.TBTL10}</TableCell>
            <TableCell>{item.TBTL4}</TableCell>
            <TableCell>{item.TC}</TableCell>
            <TableCell>{item.TBC10}</TableCell>
            <TableCell>{item.TBC4}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

};

export default ScoreSumTable;
