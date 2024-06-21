import 'dart:io';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:http/http.dart';
import 'package:excel/excel.dart';

const loginURL = "http://220.231.119.171/kcntt/login.aspx";
Future<List<List<dynamic>>> parseExcel(File file) async {
  var bytes = file.readAsBytesSync();
  var excel = Excel.decodeBytes(bytes);

  List<List<dynamic>> jsonData = [];
  for (var table in excel.tables.keys) {
    for (var row in excel.tables[table]!.rows) {
      jsonData.add(row.map((cell) => cell?.value).toList());
    }
  }
  return jsonData;
}

String parseDate(String dateString) {
  List<String> parts = dateString.split('/');
  return '${parts[2]}-${parts[1]}-${parts[0]}';
}

Map<String, String> tinhtoan(String tiethoc) {
  if (!tiethoc.contains(' --> ')) {
    return {};
  }

  List<String> periods = tiethoc.split(' --> ');
  int vao = int.parse(periods[0]);
  int ra = int.parse(periods[1]);

  List<String> giovao = [
    '6:45',
    '7:40',
    '8:40',
    '9:40',
    '10:35',
    '13:00',
    '13:55',
    '14:55',
    '15:55',
    '16:50',
    '18:15',
    '19:10',
    '20:05'
  ];
  List<String> giora = [
    '7:35',
    '8:30',
    '9:30',
    '10:30',
    '11:25',
    '13:50',
    '14:45',
    '15:45',
    '16:45',
    '17:40',
    '19:05',
    '20:00',
    '20:55'
  ];

  return {
    'GioVao': giovao[vao - 1],
    'GioRa': giora[ra - 1],
  };
}

Map<String, String> lichtuan(String lich) {
  List<String> parts = lich.split(' đến ');
  return {
    'Tu': parseDate(parts[0]),
    'Den': parseDate(parts[1]),
  };
}

String thutrongtuan(int thu, String batdau, String ketthuc) {
  if (batdau == '' || ketthuc == '') return '';
  DateTime start = DateTime.parse(batdau);
  DateTime end = DateTime.parse(ketthuc);
  DateTime current = start;

  // Duyệt qua từng ngày trong khoảng thời gian
  while (current.isBefore(end) || current.isAtSameMomentAs(end)) {
    // Kiểm tra nếu ngày hiện tại là thứ 2
    if (current.weekday == thu - 1) {
      return current.toIso8601String().split('T')[0];
    }
    // Chuyển sang ngày tiếp theo
    current = current.add(Duration(days: 1));
  }

  return "";
}

class HttpClient {
  final client = Client();
  Map<String, String> headers = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  Future<String> getLH(String url) async {
    Response response = await get(Uri.parse(url), headers: headers);
    if (response.statusCode != 200) {
      return 'Login failed';
    }
    return response.body;
  }

  Future<Response> post(String url, Map<String, String> body) {
    return client.post(Uri.parse(url), headers: headers, body: body);
  }
}

class HttpClientWithCookies extends BaseClient {
  final DefaultCookieJar cookieJar;
  final Client _inner;

  HttpClientWithCookies(this.cookieJar) : _inner = Client();

  @override
  Future<StreamedResponse> send(BaseRequest request) async {
    final cookies = await cookieJar.loadForRequest(request.url);
    final cookieHeader =
        cookies.map((cookie) => '${cookie.name}=${cookie.value}').join('; ');

    request.headers['Cookie'] = cookieHeader;
    request.headers['User-Agent'] =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    final response = await _inner.send(request);

    final setCookies = response.headers['set-cookie'];
    if (setCookies != null) {
      final uri = request.url;
      final cookies = setCookies.split(', ');
      for (var cookie in cookies) {
        cookieJar.saveFromResponse(uri, [Cookie.fromSetCookieValue(cookie)]);
      }
    }

    return response;
  }
}

class LichHocJson {
  void main() {
    final jar = DefaultCookieJar();
    final client = HttpClientWithCookies(jar);
    client.get(Uri.parse(loginURL)).then((response) {
      print(response);
    });
  }

  Future<String> getlichhoc(String username, String password) async {
    HttpClient client = HttpClient();
    await client.getLH(loginURL).then((response) {
      //print(response);
      return response;
    });
    return 'lich hoc';
  }
}
