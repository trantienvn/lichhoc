import { ChevronsUpDown } from 'lucide-react';
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { createHash } from "crypto";
import { JSDOM } from "jsdom";
import * as XLSX from 'xlsx';

const jar = new CookieJar();

const client = wrapper(
  axios.create({
    jar,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
);

const urlLogin = "http://220.231.119.171/kcntt/login.aspx";

function tinhtoan(tiethoc: string) {
  if (typeof tiethoc !== 'string' || !tiethoc.includes(' --\u003E ')) {
    //console.error("Invalid input format. Expected format: 'startPeriod --\u003E endPeriod'");
    return undefined;
  }
  const [vao, ra] = tiethoc.split(' --\u003E ').map(Number);
  const giovao = ['6:45', '7:40', '8:40', '9:40', '10:35', '13:00', '13:55', '14:55', '15:55', '16:50', '18:15', '19:10', '20:05'][vao - 1];
  const giora = ['7:35', '8:30', '9:30', '10:30', '11:25', '13:50', '14:45', '15:45', '16:45', '17:40', '19:05', '20:00', '20:55'][ra - 1];
  return { GioVao: giovao, GioRa: giora };
}

function lichtuan(lich: string) {
  if (typeof lich !== 'string') {
    return {
      Tu: "1970-1-1",
      Den: "1970-1-1"
    };
  }
  const tu = parseDate(lich.split(' đến ')[0]);
  const den = parseDate(lich.split(' đến ')[1]);
  return {
    Tu: tu,
    Den: den
  };
}
function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

function thutrongtuan(thu: string, batdau: string, ketthuc: string) {
  // Check if inputs are strings
  if (typeof thu !== 'string' || typeof batdau !== 'string' || typeof ketthuc !== 'string') {
    return "Invalid input";
  }
  //console.log(thu, batdau, ketthuc);
  // Convert batdau and ketthuc to Date objects
  let startDate = new Date(batdau);
  let endDate = new Date(ketthuc);
  // Validate date parsing
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date format";
  }

  // Validate thu input
  let thuIndex = parseInt(thu, 10); // Convert thu to integer
  if (thuIndex < 2 || thuIndex > 8 || isNaN(thuIndex)) {
    return "Invalid weekday number";
  }

  // Find the first occurrence of the specified weekday within the date range
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (currentDate.getDay() === thuIndex - 1) {
      return toDateString(currentDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return "No such weekday found in the range";
}

function toDateString(currentDate: Date) {
  let day = currentDate.getDate().toString().padStart(2, '0');
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let year = currentDate.getFullYear().toString();
  return `${year}-${month}-${day}`;
}
export const GET = async (request: Request) => {
  // Lấy thông tin tài khoản từ URLSearchParams
  const urlParams = new URLSearchParams(request.url.split('?')[1]);
  const username = urlParams.get('msv');
  const password = urlParams.get('pwd');
  const ishash = urlParams.get('hash');
  const session = await client.get(urlLogin);
  const DOMsession = new JSDOM(session.data);
  // Util Function
  const getAllFormElements = (element: HTMLFormElement) =>
    Array.from(element.elements).filter(
      (tag) =>
        ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()) &&
        tag.getAttribute("name")
    );
  // Create Body
  const body = new URLSearchParams();
  getAllFormElements(
    DOMsession.window.document.getElementById("Form1") as HTMLFormElement
  ).forEach((_: any) => {
    const key = _.getAttribute("name");
    let value = _.getAttribute("value");
    if (key == "txtUserName") {
      value = username;
    } else if (key == "txtPassword") {
      if (password) {
        if (ishash == "true") {
          value = password;
        }
        else
          value = createHash("md5").update(password).digest("hex");
      }
    }
    if (value) body.append(key, value);
  });
  // Post!
  const data = await client.post(session.request.res.responseUrl, body);
  const testError = new JSDOM(data.data);
  const errorInfo = testError.window.document.getElementById("lblErrorInfo");
  if (errorInfo && errorInfo.textContent !== "") {
    return new Response(
      JSON.stringify({
        error: true,
        message: errorInfo.textContent,
        msv: username,
        pwd: password
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }



  // đăng nhập thành công thì kiểm tra có chuyển trang không nếu chuyển trang thì lấy tên sinh viên
  const data2 = await client.get("http://220.231.119.171/kcntt/Home.aspx");
  const testError2 = new JSDOM(data2.data);
  const studentInfo = testError2.window.document.getElementById("PageHeader1_lblUserFullName");
  const lh = await client.get("http://220.231.119.171/kcntt/Reports/Form/StudentTimeTable.aspx");
  const DOMlichhoc = new JSDOM(lh.data);
  const DOMurl = lh.request.res.responseUrl;
  const document = DOMlichhoc.window.document;
  const hiddenFields = DOMlichhoc.window.document.querySelectorAll('input[type="hidden"]');
  const hiddenValues: { [key: string]: string } = {};
  hiddenFields.forEach(input => {
    hiddenValues[(input as HTMLInputElement).name] = (input as HTMLInputElement).value;
  });
  const semester = (document.getElementById("drpSemester") as HTMLSelectElement).value;
  const term = (document.getElementById("drpTerm") as HTMLSelectElement).value;
  const type = (document.getElementById("drpType") as HTMLSelectElement).value;
  const btnView = (document.getElementById("btnView") as HTMLButtonElement).value;

  if (studentInfo && studentInfo?.textContent) {
    let studenId = studentInfo.textContent;
    studenId = studenId.split("(")[1];
    studenId = studenId.split(")")[0];
    let studentname = studentInfo.textContent;
    studentname = studentname.split("(")[0];
    const sinhvien = {
      MaSV: studenId,
      TenSV: studentname
    }

    const hockiELM = document.getElementById("drpSemester") as HTMLSelectElement;
    let hocki = hockiELM.options[hockiELM.selectedIndex].text;
    const namhoc = `${hocki.split("_")[1]} - ${hocki.split("_")[2]}`;
    hocki = hocki.split("_")[0];
    const exportResponse = await client.post(DOMurl, new URLSearchParams({
      ...hiddenValues,
      drpSemester: semester, // Giá trị cần thiết từ form
      drpTerm: term,
      drpType: type,
      btnView: btnView
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'arraybuffer'
    });
    const data = new Uint8Array(exportResponse.data);
    if(data!=null){
        return new Response(data,{
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });
    }
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const LichHoc = [];
    const TuanData = [];
    let Tuan = 0;
    let ngayhoct = {
      Tu: "",
      Den: ""
    }
    for (let i = 10; i < jsonData.length; i++) {
      const STT = parseInt(JSON.parse(JSON.stringify(jsonData[i]))[0]);
      const hocphan = JSON.parse(JSON.stringify(jsonData[i]))[1];
      const MaHP = hocphan.match(/\((.*?)\)/)[1];
      const TenHP = hocphan.replace(/\((.*?)\)/, "").trim();
      const GiangVien = JSON.parse(JSON.stringify(jsonData[i]))[2];
      const ThuNgay = JSON.parse(JSON.stringify(jsonData[i]))[3];
      const tg = JSON.parse(JSON.stringify(jsonData[i]))[4];
      const LetTime = tinhtoan(tg);
      //let ThoiGian = "";
      const TTuan = hocphan.match(/\((.*?)\)/)[1];

      if (typeof LetTime !== 'undefined') {
        //ThoiGian = `${LetTime.GioVao} - ${LetTime.GioRa}`;
        const DiaDiem = JSON.parse(JSON.stringify(jsonData[i]))[5];
        const Ngay = thutrongtuan(ThuNgay, parseDate(ngayhoct.Tu), parseDate(ngayhoct.Den));
        const gv = GiangVien.split('\n');
        LichHoc.push({
          STT,
          // Tuan,
          Ngay,
          TenHP,
          MaHP,
          //ThoiGian,
          ThoiGian: LetTime,
          GiangVien: gv[0],
          Meet: gv[1],
          DiaDiem
        });
      } else {
        Tuan++;
        const NgayHoc = lichtuan(TTuan);
        ngayhoct = lichtuan(TTuan);
        TuanData.push({
          Tuan,
          NgayHoc
        });
      }


    }
    var lastUpdateTime = new Date();
    return new Response(
      JSON.stringify({
        HocKi: hocki,
        NamHoc: namhoc,
        lastUpdateTime: toDateString(lastUpdateTime),
        SinhVien: sinhvien,
        // TuanData: TuanData,
        LichHoc: LichHoc
      }), {
      headers: {
        "content-type": "application/json",
      },
    }
    );
  } else {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Sai mã sinh viên hoặc mật khẩu",
        msv: username,
        pwd: password
      })
    );
  }
};
