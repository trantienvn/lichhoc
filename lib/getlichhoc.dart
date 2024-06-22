import 'dart:typed_data';
import 'dart:io' as io;
import 'dart:convert';
import 'package:excel/excel.dart';
import 'package:http/http.dart' as http;
import 'package:html/parser.dart' show parse;
import 'package:html/dom.dart';
import 'package:crypto/crypto.dart';
import 'package:path_provider/path_provider.dart';

String urlLogin = "http://220.231.119.171/kcntt/login.aspx";
String curenURL = "";
String homeURL = "http://220.231.119.171/kcntt/Home.aspx";
String sessioncode = "";

Future<String> getData(String username, String password, bool? ishash) async {
  try {
    // Initial GET request to fetch the login form
    var session = await http.get(
      Uri.parse(urlLogin),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    );
    if (session.statusCode != 200) {
      if (session.statusCode == 302) {
        String locationHeader = session.headers['location'] as String;
        curenURL =
            '${urlLogin.split("kcntt")[0]}kcntt${locationHeader.split("kcntt")[1]}';
      } else
        throw Exception('Failed to load login page');
    }
    print(curenURL);

    var document = parse(utf8.decode(session.bodyBytes));

    // Utility function to get all form elements
    List<Element> getAllFormElements(Element form) {
      return form.querySelectorAll('input, select, textarea').where((tag) {
        return tag.attributes.containsKey('name');
      }).toList();
    }

    // Create the body for POST request
    var body = <String, String>{};
    var form = document.getElementById('Form1');
    if (form != null) {
      var elements = getAllFormElements(form);

      for (var element in elements) {
        var key = element.attributes['name'];
        var value = element.attributes['value'];

        if (key == 'txtUserName') {
          value = username;
        } else if (key == 'txtPassword') {
          if (ishash != null && ishash) {
            value = password;
          } else {
            value = md5.convert(utf8.encode(password)).toString();
          }
        }

        if (value != null) {
          body[key!] = value;
        }
      }

      // Sending POST request
      var postResponse;
      curenURL = urlLogin;
      while (curenURL == urlLogin) {
        postResponse = await http.post(
          Uri.parse(
              curenURL), // Should be the same login URL or the action URL from the form
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': session.headers['set-cookie'] ?? '',
          },
          body: body,
        );
        if (postResponse.statusCode == 302) {
          String locationHeader = postResponse.headers['location'].toString();
          curenURL =
              '${urlLogin.split("kcntt")[0]}kcntt${locationHeader.split("kcntt")[1]}';
          sessioncode = curenURL.split("(S(")[1].split("))")[0];
        } else if (postResponse.statusCode == 200) {
          curenURL = postResponse.request!.url.toString();
        }
      }
      print(curenURL);
      postResponse = await http.post(
        Uri.parse(curenURL),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body,
      );
      // if (postResponse.statusCode != 200) {
      //   throw Exception(
      //       'Failed to submit login form, code: ${postResponse.statusCode}');
      // }
      //print(postResponse.body);

      var postDocument = parse(utf8.decode(postResponse.bodyBytes));
      var errorInfo = postDocument.getElementById('lblErrorInfo');
      print(errorInfo);
      if (errorInfo != null) {
        print('Error Info: ${errorInfo.text}');
        return errorInfo.text.trim();
      }
      var SinhViendata = await http.get(Uri.parse(homeURL), headers: {
        'Cookie': postResponse.headers['set-cookie'] ?? '',
      });
      var SinhVienDocument = parse(utf8.decode(SinhViendata.bodyBytes));
      var StudentInfo =
          SinhVienDocument.getElementById("PageHeader1_lblUserFullName");
      //print(SinhViendata.body.toString());

      //print(SinhViendata.statusCode);
      if (StudentInfo != null) {
        print(StudentInfo.text);
        String name = StudentInfo.text.split('(')[0];
        RegExp bieuThucChinhQuy = RegExp(r'\(([^)]+)\)');
        Match ketQua = bieuThucChinhQuy.firstMatch(StudentInfo.text) as Match;
        students = Student(name, ketQua.group(1) as String);
        //lay lich hoc file xls
        var getXlsWeb = await http.get(
            Uri.parse(
                "http://220.231.119.171/kcntt/(S($sessioncode))/Reports/Form/StudentTimeTable.aspx"),
            headers: {
              'Cookie': postResponse.headers['set-cookie'] ?? '',
            });
        print(getXlsWeb.request!.url);
        var getXlsDocument = parse(utf8.decode(getXlsWeb.bodyBytes));
        //print(getXlsWeb.body);
        var hiddenFields =
            getXlsDocument.querySelectorAll('input[type="hidden"]');
        var hiddenValues = <String, String>{};
        for (var hiddenField in hiddenFields) {
          hiddenValues[hiddenField.attributes['name'] ?? ''] =
              hiddenField.attributes['value'] ?? "";
        }
        var semester = getXlsDocument.getElementById('drpSemester');
        var term = getXlsDocument.getElementById('drpTerm');
        var type = getXlsDocument.getElementById('drpType');
        var btnView = getXlsDocument.getElementById('btnView');
        var formData = <String, String>{
          ...hiddenValues,
          'drpSemester': semester?.attributes['value'] ?? '',
          'drpTerm': term?.attributes['value'] ?? '',
          'drpType': type?.attributes['value'] ?? '',
          'btnView': btnView?.text ?? 'Xuất file Excel'
        };
        print(formData);
        var getXlsFilesForm = await http.post(
            Uri.parse(
                "http://220.231.119.171/kcntt/(S($sessioncode))/Reports/Form/StudentTimeTable.aspx"),
            headers: {
              'Cookie': postResponse.headers['set-cookie'] ?? '',
            },
            body: formData);
        print(getXlsFilesForm.body);
        saveXlsFile(getXlsFilesForm.bodyBytes);
      }
      return 'Login successful';
    } else {
      return 'Form not found in the document';
    }
  } catch (e) {
    print("an error occurred: $e");
    return 'An error occurred: $e';
  }
}

class Student {
  final String TenSV;
  final String MaSV;
  const Student(this.TenSV, this.MaSV);
}

class MonHoc {
  const MonHoc(this.TenHP, this.MaHP, this.NgayHoc, this.Tuan, this.DiaDiem,
      this.ThoiGian, this.GiangVien, this.Meet);
  final String TenHP;
  final String MaHP;
  final DateTime NgayHoc;
  final int Tuan;
  final String DiaDiem;
  final String ThoiGian;
  final String GiangVien;
  final String Meet;
  DateTime getNgayHoc() {
    return NgayHoc;
  }
}

class TableData {
  final List<MonHoc> MonHocs;
  final String HocKy;
  final String NamHoc;
  final Student Students;
  const TableData(this.HocKy, this.NamHoc, this.Students, this.MonHocs);
}

String namhoc = "2023-2024";
String hocky = "1";
Student students = Student('TenSV', 'MaSV');
TableData tableData = TableData('HocKy', 'NamHoc', students, []);

Future<String> StudentInfo(String username, String password) async {
  return await getData(username, password, false);
}

Future<List<List<dynamic>>> parseExcel(io.File file) async {
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

void saveXlsFile(Uint8List data) async {
  try {
    String dir = (await getApplicationDocumentsDirectory()).path;
    io.File file = new io.File("$dir/app.xls");
    await file.writeAsBytes(data);
    print("File saved to $dir/app.xls");
  } catch (e) {
    print("Error saving file: $e");
  }
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
