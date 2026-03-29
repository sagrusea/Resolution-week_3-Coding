const hTimer = document.getElementById("time");
const bg = document.getElementById("bg");
const aqiSpan = document.getElementById("AQI");
const tempSpan = document.getElementById("temp");
const realFeelSpan = document.getElementById("realFeel");
const quotetextContainer = document.getElementById("quoteContent");
const newsHeader = document.getElementById("head");
const newsLink = document.getElementById("newscontent");
const settingsButton = document.getElementById("settings");
const settingsModal = document.getElementById("settingsModal");
let aqi = null;
let temp = null;
let realFeel = null;
let lat = localStorage.getItem("userLat") || 50.088;
let long = localStorage.getItem("userLong") || 14.420;
let settingsOpen = false;

console.log("hello!");

bg.style.backgroundImage = 'url("https://picsum.photos/seed/' + new Date().toDateString() + '/3840/2160")';

setInterval(() => {
    let timer = new Date;
    hTimer.innerText = timer.getHours() + ":" + timer.getMinutes().toString().padStart(2, '0');
},100)

async function getInfo() {
    try {
        const [aqiResponse, tempResponse, quoteResponse,topStoryId] = await Promise.all([
            fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=european_aqi`),
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature`),
            fetch('https://api.adviceslip.com/advice'),
            fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
        ]);
        const aqiJson = await aqiResponse.json();
        const tempJson = await tempResponse.json();
        const quoteJson = await quoteResponse.json();
        const topStoryIdJson = await topStoryId.json();
        aqi = aqiJson.current.european_aqi;
        temp = tempJson.current.temperature_2m;
        realFeel = tempJson.current.apparent_temperature;
        quotetextContainer.innerText = quoteJson.slip.advice;
        const newsData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStoryIdJson[0]}.json`);
        const newsDataJson = await newsData.json();
        newsHeader.innerText = newsDataJson.title;
        newsLink.href = newsDataJson.url;
        switch (true) {
            case (aqi <= 20):
                aqiSpan.style.color = "#00ff88";
                break;
            case (aqi <= 40):
                aqiSpan.style.color = "#f1c40f";
                break;
            case (aqi <= 60):
                aqiSpan.style.color = "#e67e22";
                break;
            case (aqi <= 80):
                aqiSpan.style.color = "#e74c3c";
                break;
            default:
                aqiSpan.style.color = "#9b59b6";
        }
    } catch (error) {
        console.error(error);
    }

    aqiSpan.innerText = aqi;
    tempSpan.innerText = temp;
    realFeelSpan.innerText = realFeel;
};
async function searchCity() {
    const cityName = document.getElementById("citySearch").value;
    if (!cityName) return;

    try {
        const cityResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
        const cityData = await cityResponse.json();

        if (cityData.results) {
            const result = cityData.results[0];
            document.getElementById("lat").value = result.latitude;
            document.getElementById("long").value = result.longitude;
        }
    } catch (error) {
        console.error(error);
    }
}
addEventListener("DOMContentLoaded", (event) => {
    getInfo();
    setInterval(getInfo, 1800000);
});

settingsButton.addEventListener("mousedown",(click) => {
    if (settingsOpen) {
        settingsModal.classList.add("hidden");
        settingsOpen = !settingsOpen;
    } else {
        settingsModal.classList.remove("hidden");
        settingsOpen = !settingsOpen;
    };
});
document.getElementById("citySearch").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchCity();
});
document.getElementById("save").addEventListener("click", () => {
    const finalLat = document.getElementById("lat").value;
    const finalLong = document.getElementById("long").value;

    if (finalLat && finalLong) {
        localStorage.setItem("userLat", finalLat);
        localStorage.setItem("userLong", finalLong);
        lat = finalLat;
        long = finalLong;
        getInfo();
        settingsModal.classList.add("hidden");
        settingsOpen = !settingsOpen;
    }
});