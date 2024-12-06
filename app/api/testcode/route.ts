
function tinhtoan(tiethoc: string) {
    const vao = parseInt(tiethoc.split(' --\u003E ')[0]);
    const ra = parseInt(tiethoc.split(' --\u003E ')[1]);
    let giovao = "";
    let giora = "";
  
    switch (vao) {
      case 1:
        giovao = "6:45";
        break;
      case 2:
        giovao = "7:40";
        break;
      case 3:
        giovao = "8:40";
        break;
      case 4:
        giovao = "9:40";
        break;
      case 5:
        giovao = "10:35";
        break;
      case 6:
        giovao = "13:00";
        break;
      case 7:
        giovao = "13:55";
        break;
      case 8:
        giovao = "14:55";
        break;
      case 9:
        giovao = "15:55";
        break;
      case 10:
        giovao = "16:50";
        break;
      case 11:
        giovao = "18:15";
        break;
      case 12:
        giovao = "19:10";
        break;
      case 13:
        giovao = "20:05";
        break;
      default:
        console.error("Invalid start period");
    }
  
    switch (ra) {
      case 1:
        giora = "7:35";
        break;
      case 2:
        giora = "8:30";
        break;
      case 3:
        giora = "9:30";
        break;
      case 4:
        giora = "10:30";
        break;
      case 5:
        giora = "11:25";
        break;
      case 6:
        giora = "13:50";
        break;
      case 7:
        giora = "14:45";
        break;
      case 8:
        giora = "15:45";
        break;
      case 9:
        giora = "16:45";
        break;
      case 10:
        giora = "17:40";
        break;
      case 11:
        giora = "19:05";
        break;
      case 12:
        giora = "20:00";
        break;
      case 13:
        giora = "20:55";
        break;
      default:
        console.error("Invalid end period");
    }
  
    return {
      GioVao: giovao,
      GioRa: giora
    };
  }
export const GET = async(req: Request) =>{
    const str = "1 --> 3";
    const result = tinhtoan(str);
    console.log(result);
    return new Response(
        JSON.stringify(result),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}