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
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
);

const responseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const URLS = {
  login: "http://220.231.119.171/kcntt/login.aspx",
  home: "http://220.231.119.171/kcntt/Home.aspx",
  reports: "http://220.231.119.171/kcntt/Reports/Form/StudentTimeTable.aspx",
};

export const OPTIONS = async (request: Request) => {
  return new Response(null, {
    headers: responseHeaders,
  });
};

function tinhtoan(tiethoc: string) {
  if (typeof tiethoc !== 'string' || !tiethoc.includes(' --> ')) {
    return undefined;
  }

  const [vao, ra] = tiethoc.split(' --> ').map(str => parseInt(str, 10));
  const gio_vao = [
    '6:45', '7:40', '8:40', '9:40', '10:35', '13:00', '13:55', '14:55', '15:55', '16:50', '18:15', '19:10', '20:05'
  ][vao - 1];
  const gio_ra = [
    '7:35', '8:30', '9:30', '10:30', '11:25', '13:50', '14:45', '15:45', '16:45', '17:40', '19:05', '20:00', '20:55'
  ][ra - 1];

  return `${gio_vao} --> ${gio_ra}`;
}

function lichtuan(lich: string) {
  if (typeof lich !== 'string') {
    return { Tu: "1970-01-01", Den: "1970-01-01" };
  }

  const [tu, den] = lich.split(' đến ').map(parseDate);
  return { Tu: tu, Den: den };
}

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

function thutrongtuan(thu: string, batdau: string, ketthuc: string) {
  if (typeof thu !== 'string' || typeof batdau !== 'string' || typeof ketthuc !== 'string') {
    return "Invalid input";
  }

  let startDate = new Date(batdau);
  let endDate = new Date(ketthuc);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date format";
  }

  let thuIndex = parseInt(thu, 10);
  if (thuIndex < 2 || thuIndex > 8 || isNaN(thuIndex)) {
    return "Invalid weekday number";
  }

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (currentDate.getDay() === thuIndex - 1) {
      let day = currentDate.getDate().toString().padStart(2, '0');
      let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      let year = currentDate.getFullYear().toString();
      return `${day}/${month}/${year}`;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return "No such weekday found in the range";
}

function dateToString(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const GET = async (request: Request) => {
  try {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const username = urlParams.get('msv');
    const password = urlParams.get('pwd');

    const session = await client.get(URLS.login);
    const DOMsession = new JSDOM(session.data);

    const getAllFormElements = (element: HTMLFormElement) =>
      Array.from(element.elements).filter(
        (tag) => ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()) && tag.getAttribute("name")
      );

    const body = new URLSearchParams();
    getAllFormElements(DOMsession.window.document.getElementById("Form1") as HTMLFormElement)
      .forEach((input: any) => {
        const key = input.getAttribute("name");
        let value = input.getAttribute("value");

        if (key === "txtUserName") {
          value = username;
        } else if (key === "txtPassword" && password) {
          value = createHash("md5").update(password).digest("hex");
        }

        if (value) body.append(key, value);
      });

    const data = await client.post(session.request.res.responseUrl, body);
    const testError = new JSDOM(data.data);
    const errorInfo = testError.window.document.getElementById("lblErrorInfo");

    if (errorInfo && errorInfo.textContent !== "") {
      return new Response(
        JSON.stringify({
          error: true,
          message: errorInfo.textContent,
          msv: username,
          pwd: password,
        }),
        { headers: { "content-type": "application/json" } }
      );
    }

    try {
      const data2 = await client.get(URLS.home);
      const testError2 = new JSDOM(data2.data);
      const studentInfo = testError2.window.document.getElementById("PageHeader1_lblUserFullName");

      const lh = await client.get(URLS.reports);
      const DOMlichhoc = new JSDOM(lh.data);
      const DOMurl = lh.request.res.responseUrl;
      const document = DOMlichhoc.window.document;
      const hiddenFields = document.querySelectorAll('input[type="hidden"]');
      const hiddenValues: { [key: string]: string } = {};

      hiddenFields.forEach(input => {
        hiddenValues[(input as HTMLInputElement).name] = (input as HTMLInputElement).value;
      });

      const semester = (document.getElementById("drpSemester") as HTMLSelectElement).value;
      const term = (document.getElementById("drpTerm") as HTMLSelectElement).value;
      const type = (document.getElementById("drpType") as HTMLSelectElement).value;
      const btnView = (document.getElementById("btnView") as HTMLButtonElement).value;

      const hockiELM = document.getElementById("drpSemester") as HTMLSelectElement;
      let hocki = hockiELM.options[hockiELM.selectedIndex].text;
      const namhoc = `${hocki.split("_")[1]} - ${hocki.split("_")[2]}`;
      hocki = hocki.split("_")[0];

      const exportResponse = await client.post(DOMurl, new URLSearchParams({
        ...hiddenValues,
        drpSemester: semester,
        drpTerm: term,
        drpType: type,
        btnView: btnView,
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'arraybuffer'
      });

      const data = new Uint8Array(exportResponse.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const testdata: any = {};
      let endDate = "01/01/1970";
      let ngayhoct = { Tu: "", Den: "" };

      for (let i = 10; i < jsonData.length; i++) {
        const row = jsonData[i] as any;
        const STT = row[0];
        const TenHP = row[1];
        const GiangVien = row[2];
        const ThuNgay = row[3];
        const tg = row[4];
        const LetTime = tinhtoan(tg);

        let ThoiGian = "";
        const TTuan = TenHP.match(/\((.*?)\)/)[1];

        if (LetTime) {
          ThoiGian = LetTime;
          const DiaDiem = row[5];
          const Ngay = thutrongtuan(ThuNgay, parseDate(ngayhoct.Tu), parseDate(ngayhoct.Den));
          const gv = GiangVien.split('\n');
          endDate = dateToString(new Date(ngayhoct.Den));

          if (!testdata[Ngay]) {
            testdata[Ngay] = [];
          }
          testdata[Ngay].push({
            STT,
            Ngay,
            ThoiGian,
            TenHP,
            GiangVien: gv[0],
            Meet: gv[1],
            DiaDiem
          });
        } else {
          const Tuan = parseInt(TTuan, 10);
          const NgayHoc = lichtuan(TTuan);
          ngayhoct = NgayHoc;
        }
      }

      return new Response(
        JSON.stringify({
          HocKi: hocki,
          NamHoc: namhoc,
          lichhocdata: testdata,
          endDate
        }),
        { headers: responseHeaders }
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({
          error: true,
          message: e.message || e,
        }),
        { headers: responseHeaders }
      );
    }
  }
  catch (e: any) {
    console.error("Lỗi xảy ra:", e); // Ghi lại lỗi để phân tích
    return new Response(
      JSON.stringify({
        error: true,
        message: e.message || "Đã xảy ra lỗi không xác định.",
      }),
      { headers: responseHeaders }
    );
  }
};
