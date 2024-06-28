// Copyright 2019 Aleksander Woźniak
// SPDX-License-Identifier: Apache-2.0

import 'dart:collection';

import 'package:lichhoc/table_calendar.dart';
import 'lichhocdatafetch.dart';

/// Example event class.
class Event {
  final String tenHP;

  const Event(this.tenHP);

  @override
  String toString() => tenHP;
}

class Schedule {
  final String tenHP, MaHP, ThoiGian, GiangVien, DiaDiem, Meet;

  const Schedule(this.tenHP, this.MaHP, this.ThoiGian, this.GiangVien,
      this.DiaDiem, this.Meet);

  @override
  String toString() => 'tenHP';
}

/// Example events.
///
/// Using a [LinkedHashMap] is highly recommended if you decide to use a map.
final kEvents = LinkedHashMap<DateTime, List<Event>>(
  equals: isSameDay,
  hashCode: getHashCode,
)..addAll(_kEventSource);

final _kEventSource = Map.fromIterable(List.generate(50, (index) => index),
    key: (item) => DateTime.utc(kFirstDay.year, kFirstDay.month, item * 5),
    value: (item) => List.generate(
        item % 4 + 1, (index) => Event('Event $item | ${index + 1}')))
  ..addAll({
    kToday: [
      Event('Today\'s Event 1'),
      Event('Today\'s Event 2'),
    ],
  });
Map<DateTime, List<Schedule>> kLichhoc() {
  return LinkedHashMap<DateTime, List<Schedule>>(
    equals: isSameDay,
    hashCode: getHashCode,
  )..addAll(_kLichhocSource());
}

Map<DateTime, List<Schedule>> _kLichhocSource() {
  var lichhoc = getLichhoc()['LichHoc'] as Map<String, dynamic>;
  Map<DateTime, List<Schedule>> data = {};
  lichhoc.forEach((String key, dynamic arr) {
    List<Schedule> list = [];
    arr.forEach((value) {
      String timestr =
          "${value['ThoiGian']['GioVao']} - ${value['ThoiGian']['GioRa']}";

      list.add(Schedule(value['TenHP'], value['MaHP'], timestr,
          value['GiangVien'], value['DiaDiem'], value['Meet']));
    });
    data[DateTime.parse(key)] = list;
  });
  return data;
}

DateTime dateFromString(String dateString) {
  var date = DateTime.parse(dateString);
  return date;
}

int getHashCode(DateTime key) {
  return key.day * 1000000 + key.month * 10000 + key.year;
}

/// Returns a list of [DateTime] objects from [first] to [last], inclusive.
List<DateTime> daysInRange(DateTime first, DateTime last) {
  final dayCount = last.difference(first).inDays + 1;
  return List.generate(
    dayCount,
    (index) => DateTime.utc(first.year, first.month, first.day + index),
  );
}

final kToday = DateTime.now();
final kFirstDay = DateTime(kToday.year, kToday.month - 3, kToday.day);
final kLastDay = DateTime(kToday.year, kToday.month + 3, kToday.day);
