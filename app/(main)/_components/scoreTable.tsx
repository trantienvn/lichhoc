import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { IDiemSo } from "@/types/diem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, FilterX } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

const ScoreTable = ({ diemSo }: { diemSo: IDiemSo[] }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string | null;
  }>({ key: "", direction: "ascending" });

  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const clearSortAndFilter = () => {
    setSearchTerm("");
    setSortConfig({ key: "", direction: null });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = diemSo.filter(
    (item) =>
      item.tenHP.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) // Sử dụng debouncedSearchTerm thay vì searchTerm
  );

  const sortedData = filteredData.sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const serialNumbers = Array.from(
    { length: sortedData.length },
    (_, i) => i + 1
  );

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <Input
          placeholder="Search"
          type="text"
          name="search"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-64 focus-visible:ring-transparent"
        />
        <Button onClick={clearSortAndFilter}>
          <FilterX className="w-4 h-4 mr-2" />
          Clear sort & filter
        </Button>
      </div>
      <Table>
        <TableCaption>
          Bạn có {sortedData.filter((item) => item.diemChu === "F").length} học
          phần cần thực hiện học lại
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("maHP")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Mã học phần</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("tenHP")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Tên học phần</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("soTC")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Số TC</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("danhGia")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Đánh giá</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("chuyenCan")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Chuyên cần</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("thi")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Thi</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("tongKet")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Tổng kết</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                onClick={() => handleSort("diemChu")}
                className="flex items-center justify-start space-x-2 cursor-pointer w-full hover:bg-transparent px-0"
                variant="ghost"
              >
                <span>Điểm chữ</span> <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow
              key={item.stt}
              className={cn(
                item.diemChu === "F" && "bg-red-100 hover:bg-red-200"
              )}
            >
              <TableCell>{serialNumbers[index]}</TableCell>
              <TableCell>{item.maHP}</TableCell>
              <TableCell>{item.tenHP}</TableCell>
              <TableCell>{item.soTC}</TableCell>
              <TableCell>{item.danhGia}</TableCell>
              <TableCell>{item.chuyenCan}</TableCell>
              <TableCell>{item.thi}</TableCell>
              <TableCell>{item.tongKet}</TableCell>
              <TableCell>{item.diemChu}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoreTable;
