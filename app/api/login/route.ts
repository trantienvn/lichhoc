import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { createHash } from "crypto";
import { JSDOM } from "jsdom";

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

// CORS headers as a variable
const responseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow methods
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
};
export const OPTIONS = async (request: Request) => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Hoặc domain của bạn
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

export const POST = async (request: Request) => {
  try {
    const { username, password } = await request.json();

    // Get the session page to extract form data
    const session = await client.get(urlLogin);
    const DOMsession = new JSDOM(session.data);

    // Util Function
    const getAllFormElements = (element: HTMLFormElement) =>
      Array.from(element.elements).filter(
        (tag) =>
          ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()) &&
          tag.getAttribute("name")
      );

    // Create Body for login POST request
    const body = new URLSearchParams();
    getAllFormElements(
      DOMsession.window.document.getElementById("Form1") as HTMLFormElement
    ).forEach((elem: any) => {
      const key = elem.getAttribute("name");
      let value = elem.getAttribute("value");
      if (key === "txtUserName") {
        value = username;
      } else if (key === "txtPassword") {
        value = createHash("md5").update(password).digest("hex");
      }
      if (value) body.append(key, value);
    });

    // Perform login request
    const data = await client.post(session.request.res.responseUrl, body);
    const testError = new JSDOM(data.data);
    const errorInfo = testError.window.document.getElementById("lblErrorInfo");

    // Handle error if login fails
    if (errorInfo && errorInfo.textContent !== "") {
      return new Response(
        JSON.stringify({
          error: true,
          message: errorInfo.textContent,
        }),
        {
          headers: responseHeaders, // Use the CORS headers variable
        }
      );
    }

    // Get cookies for the signed-in user
    const getCookieSignInJSON = async (): Promise<any> => {
      const cookies = await jar.getCookies("http://220.231.119.171");
      return cookies.find((o) => o.key === "SignIn")?.toJSON();
    };

    // Check if the login succeeded by visiting a different page
    const data2 = await client.get("http://220.231.119.171/kcntt/Home.aspx");
    const testError2 = new JSDOM(data2.data);
    const studentInfo = testError2.window.document.getElementById(
      "PageHeader1_lblUserFullName"
    );

    // If user info is found, extract name and student ID
    if (studentInfo?.textContent) {
      let startIndex = studentInfo.textContent.indexOf("(");
      let endIndex = studentInfo.textContent.indexOf(")");

      const name = studentInfo.textContent.slice(0, startIndex).trim();
      const studentId = studentInfo.textContent.slice(startIndex + 1, endIndex);

      const cookieSignIn = await getCookieSignInJSON();

      return new Response(
        JSON.stringify({
          error: false,
          message: "Đăng nhập thành công!",
          name,
          studentId,
          token: cookieSignIn?.value || "",
        }),
        {
          headers: responseHeaders, // Use the CORS headers variable
        }
      );
    }

    // If no student info is found, return failure
    return new Response(
      JSON.stringify({
        error: true,
        message: "Không thể lấy thông tin sinh viên.",
      }),
      {
        headers: responseHeaders, // Use the CORS headers variable
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
      }),
      {
        headers: responseHeaders, // Use the CORS headers variable
      }
    );
  }
};
