import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { JSDOM } from "jsdom";

const jar = new CookieJar();

const client: AxiosInstance = wrapper(
  axios.create({
    jar,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
);

// Function to handle errors
function handleError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({
      error: true,
      message,
    }),
    {
      status,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export const GET = async (request: Request): Promise<Response> => {
  try {
    const cookieHeader = request.headers.get("cookie");

    const lichhocResponse = await client.get(
      "http://220.231.119.171/kcntt/StudentMark.aspx",
      {
        headers: {
          Cookie: cookieHeader, // Use cookie from request
        },
      }
    );

    const DOMlichhoc = new JSDOM(lichhocResponse.data);
    const document = DOMlichhoc.window.document;

    const dataScoreDetail = [];
    const dataScoreSum = [];
    const tableScoreDetail =
      document.querySelector("#tblMarkDetail") ||
      document.querySelector("#tblStudentMark");
    const tableScoreSum = document.querySelector("#tblSumMark");
    if (!tableScoreDetail || !tableScoreSum) {
      return handleError("Table not found", 404);
    } else {
      const rows = Array.from(tableScoreDetail.querySelectorAll("tr"));
      const rowsSum = Array.from(tableScoreSum.querySelectorAll("tr"));

      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll("td");

        if (cells.length < 14) {
          continue;
        }

        dataScoreDetail.push({
          stt: cells[0].textContent,
          maHP: cells[1].textContent,
          tenHP: cells[2].textContent,
          soTC: cells[3].textContent,
          danhGia: cells[8].textContent,
          chuyenCan: cells[10].textContent,
          thi: cells[11].textContent,
          tongKet: cells[12].textContent,
          diemChu: cells[13].textContent,
        });
      }

      for (let i = 2; i < rowsSum.length; i++) {
        const row = rowsSum[i];
        const cells = row.querySelectorAll("td");

        if (cells.length < 14) {
          continue;
        }

        dataScoreSum.push({
          namHoc: cells[0].textContent,
          hocKy: cells[1].textContent,
          TBTL10: cells[2].textContent,
          TBTL4: cells[4].textContent,
          TC: cells[6].textContent,
          TBC10: cells[8].textContent,
          TBC4: cells[10].textContent,
        });
      }
    }
    return new Response(
      JSON.stringify({
        error: false,
        message: "Success",
        diemSoData: dataScoreDetail,
        tongKetData: dataScoreSum,
      })
    );
  } catch (error) {
    return handleError("Error fetching exam schedule data after login", 500);
  }
};
