const API_KEY = '5a534dc0ecb794245c075551ed103427';
const searchBtn = document.querySelector("[searchBtn]");
const searchForm = document.querySelector("[data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]");
const yourWeatherTab = document.querySelector("[data-userWeather]");
const searchWeatherTab = document.querySelector("[data-searchWeather]");
const weatherInfoContainer=document.querySelector(".weatherInfoContainer");
const grantAccessContainer=document.querySelector(".grant-access-container");
const grantAccessBtn=document.querySelector("[data-grantAccess]");
const loadingScreen=document.querySelector(".loading-container");

grantAccessBtn.addEventListener("click",getLocation);

// initialising some variables
let currentTab = yourWeatherTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

yourWeatherTab.addEventListener("click",()=>{switchTab(yourWeatherTab)});
searchWeatherTab.addEventListener("click",()=>{switchTab(searchWeatherTab)});


function switchTab(clickedTab) {
    if (clickedTab != currentTab) {

        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {
            console.log(currentTab);
            // ab agar search form visible nahi hai, to matlab ki your weather tab khula hoga, to use invisible karaanna hoga.
            //aur agar your weather tab khula tha tab, ho skta hai ki grant locationn tab usme khula ho, to use bhi invisible karaana hoga
            weatherInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
           
            // pehle main searchweather tab me tha ab mujhe my weather par shift karna hai 
            searchForm.classList.remove("active");
            weatherInfoContainer.classList.remove("active");
            // ab main my weather tab par aa gya hu, to mujhe coordinates fetsh karke laane padenge aaur display karaana padega 
            getfromSessionStorage();

        }
    }
}

function getfromSessionStorage()
{
    // sabse pehle check kar lo ki kya local storage me coordinates dale hai, agar haan, to use fetch karke le aao
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");

    }
    else{
         const coordinates = JSON.parse(localCoordinates);
          fetchUserWeatherInfo(coordinates);
    }

}

 async function fetchUserWeatherInfo(coordinates){

    const {lat, lon} = coordinates; // is line ka matlab hai ki coordinates naam ke java script object se lat aur lon ki value ko fetch karke laao aur store karaa lo lat aur lon naam ke varibales me hi
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{

        const response= await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        weatherInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    
    }   
    catch(err)
    {
        loadingScreen.classList.remove("active");
        console.log("fetchuserweather info not working");
         // error hai yaai data fetch nahi ho paa rha hai

   }
 }

 // ab session storage me cordinates store karne ke lie 
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // text to show that your geolocation is not visible 
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}



// ab jab bhi search yout city ke button par click karoge to yeh call hoga 
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("searchbtn cllicked");
    const city = searchInput.value;
    if (city === "") return;
    else {
        userWeatherInfo(city);
    }
})

searchBtn.addEventListener('click', userWeatherInfo)

async function userWeatherInfo(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    weatherInfoContainer.classList.add("active");
    renderWeatherInfo(data);

}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidityDisplay = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidityDisplay.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;


}
