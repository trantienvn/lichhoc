function numberToWords(num: number, lang: 'en' | 'vi'): string {
    if (num === 0) return lang === 'en' ? 'zero' : 'không';

    const enUnits = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const enTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const enScales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quatttuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion"];

    const viUnits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
    const viTens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
    const viScales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ", "nghìn tỷ tỷ", "triệu tỷ tỷ", "tỷ tỷ tỷ", "nghìn tỷ tỷ tỷ", "triệu tỷ tỷ tỷ", "tỷ tỷ tỷ tỷ", "nghìn tỷ tỷ tỷ tỷ", "triệu tỷ tỷ tỷ tỷ", "tỷ tỷ tỷ tỷ tỷ", "nghìn tỷ tỷ tỷ tỷ tỷ", "triệu tỷ tỷ tỷ tỷ tỷ", "tỷ tỷ tỷ tỷ tỷ tỷ", "nghìn tỷ tỷ tỷ tỷ tỷ tỷ", "triệu tỷ tỷ tỷ tỷ tỷ tỷ", "tỷ tỷ tỷ tỷ tỷ tỷ tỷ", "nghìn tỷ tỷ tỷ tỷ tỷ tỷ tỷ",];

    let words: string[] = [];

    if (lang === 'en') {
        words = numberToWordsHelper(num,  enUnits, enTens, enScales, lang);
    } else if (lang === 'vi') {
        words = numberToWordsHelper(num,  viUnits, viTens, viScales, lang);
    }
    return `${words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1)} ${lang === 'en' ? 'dollars' : 'đồng'}`;
}

function numberToWordsHelper(num: number, units: string[], tens: string[], scales: string[], lang: string): string[] {
    let words: string[] = [];
    let scale = 0;

    while (num > 0) {
        let n = num % 1000;

        if (n !== 0) {
            let chunk = convertChunk(n, units, tens, lang);
            if (scale > 0) {
                chunk.push(scales[scale]);
            }
            words = chunk.concat(words);
        }

        num = Math.floor(num / 1000);
        scale++;
    }

    return words;
}

function convertChunk(num: number, units: string[], tens: string[], lang: string): string[] {
    let chunk: string[] = [];

    if (num >= 100) {
        chunk.push(units[Math.floor(num / 100)]);
        chunk.push(lang== 'vi' ? 'trăm' : 'hundred');
        num %= 100;
    } else if (lang === 'vi' && num > 0 && chunk.length > 0) {
        chunk.push("không trăm");
    }

    if (num >= 20) {
        chunk.push(tens[Math.floor(num / 10)]);
        if (num % 10 > 0) {
            chunk.push(units[num % 10]);
        }
    } else if (num > 0) {
        chunk.push(units[num]);
    }

    return chunk;
}
export const GET = async (request: Request) => {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const number = urlParams.get('number')?.replace('$', '').replace('₫', '');
    const language = urlParams.get('lang');
    const result = numberToWords(Number(number), language as 'en' | 'vi');
    return new Response(result);
}