const hTimer = document.getElementById("time");
const bg = document.getElementById("bg");
const aqiSpan = document.getElementById("AQI");
const tempSpan = document.getElementById("temp");
const realFeelSpan = document.getElementById("realFeel");
let aqi = null;
let temp = null;
let realFeel = null;

bg.style.backgroundImage = 'url("https://picsum.photos/seed/' + new Date().toDateString() + '/3840/2160")';

setInterval(() => {
    let timer = new Date;
    hTimer.innerText = timer.getHours() + ":" + timer.getMinutes().toString().padStart(2, '0');
},100)

async function getInfo() {
    

    try {
        const [aqiResponse, tempResponse] = await Promise.all([
            fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=50.088&longitude=14.4208&current=european_aqi'),
            fetch('https://api.open-meteo.com/v1/forecast?latitude=50.088&longitude=14.4208&current=temperature_2m,apparent_temperature')
        ]);
        const aqiJson = await aqiResponse.json();
        const tempJson = await tempResponse.json();
        aqi = aqiJson.current.european_aqi;
        temp = tempJson.current.temperature_2m;
        realFeel = tempJson.current.apparent_temperature;
    } catch (error) {
        console.error(error);
    }

    aqiSpan.innerText = aqi;
    tempSpan.innerText = temp;
    realFeelSpan.innerText = realFeel;
}
addEventListener("DOMContentLoaded", (event) => {
    getInfo();
    setInterval(getInfo, 1800000);
});