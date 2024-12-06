import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { JSDOM } from "jsdom";
import * as cookie from "cookie";

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
      "http://220.231.119.171/kcntt/StudentViewExamList.aspx",
      {
        headers: {
          Cookie: cookieHeader, // Use cookie from request
        },
      }
    );

    const DOMlichhoc = new JSDOM(lichhocResponse.data);
    const document = DOMlichhoc.window.document;

    const table = document.querySelector("#tblCourseList");
    if (!table) {
      return handleError("Table 'tblCourseList' not found", 404);
    } else {
      const data = [];
      const rows = Array.from(table.querySelectorAll("tr"));

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map((td) =>
          td.textContent ? td.textContent.trim() : ""
        );
        const [
          stt,
          maHP,
          tenHP,
          soTC,
          ngayThi,
          caThi,
          hinhThucThi,
          soBaoDanh,
          phongThi,
          ghiChu,
        ] = rowData;

        // Kiểm tra nếu stt không rỗng ("")
        if (stt !== "") {
          data.push({
            stt,
            maHP,
            tenHP,
            soTC,
            ngayThi,
            caThi,
            hinhThucThi,
            soBaoDanh,
            phongThi,
            ghiChu,
          });
        }
      }

      return new Response(
        JSON.stringify({
          error: false,
          lichthiData: data,
        })
      );
    }
  } catch (error) {
    return handleError("Error fetching exam schedule data after login", 500);
  }
};