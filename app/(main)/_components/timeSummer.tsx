import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TimeSummer = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Buổi</TableHead>
          <TableHead className="text-center">Tiết</TableHead>
          <TableHead className="text-center">Thời gian vào</TableHead>
          <TableHead className="text-center">Thời gian ra</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-center">Sáng</TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              1
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              2
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              3
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              4
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              5
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              06:30
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              07:25
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              08:25
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              09:25
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              10:20
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              07:20
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              08:15
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              09:15
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              10:15
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              11:10
            </TableRow>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-center">Chiều</TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              6
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              7
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              8
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              9
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              10
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              13:00
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              13:55
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              14:55
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              15:55
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              16:50
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              13:50
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              14:45
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              15:45
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              16:45
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              17:40
            </TableRow>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="text-center">Tối</TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              11
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              12
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              18:15
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              19:10
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              19:05
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              20:00
            </TableRow>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TimeSummer;
