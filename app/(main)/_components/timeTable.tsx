import { AlarmClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const TimeTable = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer">
            <div className="p-5 rounded-xl border bg-card shadow w-52 h-52 group-hover:bg-zinc-800 group-hover:scale-125 group-hover:text-muted dark:group-hover:text-muted-foreground transition duration-300 ease-in-out flex flex-col">
              <AlarmClock className="w-16 h-16" />
              <span className="mt-auto ml-auto font-medium text-xl text-card-foreground group-hover:text-card dark:group-hover:text-card-foreground">
                Thời gian biểu
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thời gian biểu</DialogTitle>
            <DialogDescription>
              Hãy ghi nhớ thời gian để đi học đúng giờ nhé!
            </DialogDescription>
            <div className="pt-4">
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
              06:45
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              07:40
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              08:40
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              09:40
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              10:35
            </TableRow>
          </TableCell>
          <TableCell>
            <TableRow className="w-full text-center block border-none">
              07:35
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              08:30
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              09:30
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              10:30
            </TableRow>
            <TableRow className="w-full text-center block border-none">
              11:25
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
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimeTable;
