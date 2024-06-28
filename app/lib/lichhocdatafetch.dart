import 'dart:convert';
import 'dart:io';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:http/http.dart';
import 'package:path_provider/path_provider.dart';

var url =
    "https://trantienapi-git-main-trantienvns-projects.vercel.app/api/schedule";

class LichHocDataFetch {
  final String user;
  final String password;
  HttpClient httpClient = HttpClient();
  String data = '{"error":true, "message":"Data not found"}';
  LichHocDataFetch(this.user, this.password);
  Future<void> run() async {
    httpClient = HttpClient();
    await httpClient.post(url, body: {
      "username": user,
      "password": password,
    }).then((response) {
      data = response.body;
      return data;
    });
  }

  void stop() {
    httpClient.close();
  }

  toJSON() {
    return jsonDecode(data);
  }
}

Future<String> runRequest(String url, String user, String password) async {
  String data = '{"error":true, "message":"Data not found"}';

  // Dữ liệu gửi đi
  var body = jsonEncode({
    "username": user,
    "password": password,
  });

  // Gửi yêu cầu POST
  try {
    var res = await post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    );

    // Cập nhật data nếu yêu cầu thành công
    if (res.statusCode == 200) {
      data = utf8.decode(res.bodyBytes);
    } else {
      // Xử lý lỗi khi status code không phải 200
      data =
          '{"error":true, "message":"Failed with status: ${res.statusCode}"}';
    }
  } catch (e) {
    // Xử lý lỗi khi có ngoại lệ
    data = '{"error":true, "message":"Exception: $e"}';
  }

  return data;
}

Future<void> saveFile(String data, String path) async {
  try {
    final file = File(path);
    // Ghi dữ liệu văn bản vào file
    await file.writeAsString(data);

    print("Saved text to file at $path");
  } catch (e) {
    print("Error saving text to file: $e");
  }
}

Future<void> luulichhoc(String data) async {
  String dir = (await getApplicationDocumentsDirectory()).path;
  var dataBase64 = base64Encode(utf8.encode(data));
  saveFile(dataBase64, "$dir/lichhoc.json");
}

dynamic getLichhoc() async {
  String dir = (await getApplicationDocumentsDirectory()).path;
  String dataBase64 = readTextFile("$dir/lichhoc.json");
  String data = utf8.decode(base64Decode(dataBase64));
  return jsonDecode(data);
}

String readTextFile(String path) {
  try {
    final file = File(path);
    final contents = file.readAsStringSync();
    return contents;
  } catch (e) {
    return "Error reading text file: $e";
  }
}

class HttpClient {
  final Client _client;
  final CookieJar _cookieJar;

  HttpClient()
      : _client = Client(),
        _cookieJar = CookieJar();

  Future<Response> get(String url, {Map<String, String>? headers}) async {
    final uri = Uri.parse(url);
    final requestHeaders = await _addHeaders(uri, headers);
    final response = await _client.get(uri, headers: requestHeaders);
    _saveCookies(uri, response);
    return response;
  }

  Future<Response> post(String url,
      {Map<String, String>? headers, Object? body, Encoding? encoding}) async {
    final uri = Uri.parse(url);
    final requestHeaders = await _addHeaders(uri, headers);
    final response = await _client.post(uri,
        headers: requestHeaders, body: body, encoding: encoding);
    _saveCookies(uri, response);
    return response;
  }

  Future<Map<String, String>> _addHeaders(
      Uri url, Map<String, String>? headers) async {
    final defaultHeaders = {
      'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (headers != null) {
      defaultHeaders.addAll(headers);
    }

    // Add cookies to the headers
    final cookies = await _cookieJar.loadForRequest(url);
    if (cookies.isNotEmpty) {
      final cookieHeader =
          cookies.map((cookie) => '${cookie.name}=${cookie.value}').join('; ');
      defaultHeaders['Cookie'] = cookieHeader;
    }

    return defaultHeaders;
  }

  void _saveCookies(Uri url, Response response) {
    final cookies = response.headers['set-cookie'];
    if (cookies != null) {
      final cookieList = cookies.split(',');
      for (var cookie in cookieList) {
        _cookieJar.saveFromResponse(url, [Cookie.fromSetCookieValue(cookie)]);
      }
    }
  }

  void close() {
    _client.close();
  }
}
