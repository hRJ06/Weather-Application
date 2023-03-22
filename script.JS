const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".api-error-container");
const errorText = document.querySelector("[data-apiErrorText]");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",() => {
    switchTab(userTab);
});
searchTab.addEventListener("click",() => {
    switchTab(searchTab);
});
function getfromSessionStorage(){
    // Check to see if present in Session Storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // If not present
        grantAccessContainer.classList.add("active");
    }else{
        // If present convert string to JSON.
        const coordinates = JSON.parse(localCoordinates);
        // for fetching lat and lon from coordinates
        fetchUserWeatherInfo(coordinates);
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("No Geolocation Support available");
    } 
}
function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    errorContainer.classList.remove("active");
    // API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(e) {
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        errorText.innerText = `Unable to fetch your Location`;
    }
}
function renderWeatherInfo(weatherInfo) {
    // fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch info from weatherInfo that has been fetched from API Call and update in respective places
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// search form
let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(event) => {
    event.preventDefault();
    if(searchInput.value === ""){
        return;
    }else{
        fetchSearchWeatherInfo(searchInput.value);
    }
})
async function fetchSearchWeatherInfo(city){
    errorContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        errorText.innerText = `City Not Found`; 
        errorContainer.classList.add("active");
    }
}
