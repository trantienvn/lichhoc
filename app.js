// const scheduleData = [
//     {'STT': 1, 'TenHP': 'Cơ sở dữ liệu-1-24', 'MaHP': 'K22K.CNTT.D1.K1.N09', 'GiangVien': 'Phạm Thị Liên', 'Meet': 'https://meet.google.com/wez-ygei-ecq', 'ThuNgay': '3', 'ThoiGian': '6:45 --> 11:25', 'MocTG': '06/08/2024', 'DiaDiem': 'C5.504'},
//     {'STT': 2, 'TenHP': 'Cấu trúc dữ liệu và giải thuật-1-24', 'MaHP': 'K22K.CNTT.D1.K1.N09', 'GiangVien': 'Dương Thị Quy', 'Meet': 'meet.google.com/vbq-pzpr-vrz', 'ThuNgay': '4', 'ThoiGian': '6:45 --> 11:25', 'MocTG': '07/08/2024', 'DiaDiem': 'C5.205'},
//     {'STT': 3, 'TenHP': 'Anh văn 3-1-24', 'MaHP': 'K22K.CNTT.D1.K1.N09', 'GiangVien': 'Dương Thị Hồng An', 'Meet': 'http://meet.google.com/osh-facy-jvy', 'ThuNgay': '5', 'ThoiGian': '6:45 --> 11:25', 'MocTG': '08/08/2024', 'DiaDiem': 'C5.503'},
//     {'STT': 4, 'TenHP': 'Mạng máy tính-1-24', 'MaHP': 'K22K.CNTT.D1.K1.N09', 'GiangVien': 'Vũ Huy Lượng', 'Meet': '', 'ThuNgay': '8', 'ThoiGian': '13:00 --> 17:40', 'MocTG': '11/08/2024', 'DiaDiem': 'C5.104'},
//     // Thêm dữ liệu khác tại đây
// ];


const daysOfWeek = [
    'Chủ Nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7'
];
function getDayStr(today) {
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}
function stringToDate(str) {
    const strs = str.split('/');
    const date = new Date(strs[2], strs[1] - 1, strs[0]);
    return date;
}
function renderSchedule() {
    const scheduleDiv = document.getElementById('schedule');

    // Lấy ngày cuối cùng trong danh sách
    const today = new Date();
    const startDay = scheduleData[0].MocTG;
    
    const endDay = scheduleData[scheduleData.length - 1].MocTG;
    const lastDate = stringToDate(endDay);
    lastDate.setDate(lastDate.getDate() + 7);
    let time = stringToDate(startDay);
    console.log(time.getDay(), time.getDate(), time.getMonth(), time.getFullYear())
    
    const list = {};
    scheduleData.forEach(data => {
        if (!list[data.MocTG]) {
            list[data.MocTG] = []; // Initialize as an empty array if not already set
        }
        list[data.MocTG].push(data);
    });
    time = today;
    do{
        const day = daysOfWeek[time.getDay()];
        const date = getDayStr(time);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `<h2>${day} (${date})</h2>`;
        if (list[date]) {
            // if (stringToDate(date) < today) continue;
            // else
            list[date].forEach(classItem => {
                let linkmeet = classItem.Meet;
                if(linkmeet.length === 0)
                    linkmeet = "Không có link meet";
                else if(!linkmeet.startsWith("http"))
                    linkmeet = "http://"+linkmeet;
                const classDiv = document.createElement('div');
                classDiv.className = 'class';
                classDiv.innerHTML = `
                <h6>${classItem.TenHP}</h6>
                <ul>
                    <li>Mã HP: ${classItem.MaHP}</li>
                    <li>Giảng viên: ${classItem.GiangVien}</li>
                    <li>Thời gian: ${classItem.ThoiGian}</li>
                    <li>Địa điểm: ${classItem.DiaDiem}</li>
                    <li>Link Meet: <a href="${linkmeet}" target="_blank">${linkmeet}</a></li>
                </ul>
                `;
                dayDiv.appendChild(classDiv);
            });
        } else {
            dayDiv.innerHTML += '<div class="class empty">Bạn rảnh</div>';
        }
        scheduleDiv.appendChild(dayDiv);

        time.setUTCDate(time.getUTCDate() + 1);
    } while (time <= lastDate) ;
    const dayDiv = document.createElement('div');
    dayDiv.innerHTML =
        `<div class="class empty">Bạn đã hết lịch học</div>`
    scheduleDiv.appendChild(dayDiv);
}


renderSchedule();
