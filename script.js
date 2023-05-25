const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-Container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const grantBtn = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const errorWala = document.querySelector("[errorImage]");

let currentTab = userTab;
// let clickedTab = searchTab;
let API_KEY = "4c85a2b1ba162a369bc0b333fd9ae1f2";
currentTab.classList.add("current-tab");

getfromSessionStorage();


// Yeh Function ka itna hi kaam hai ki Jab bhi User Click kre usse wo (switchTab) Tab pr leke jana hai
 
function switchTab(clickedTab){

    // if wla condition bol raha hai jo clickedtab(old) hai woo agar currenttab(new) nahi hai toh 
    // 1st line says currentTab(new) ko hidden kro
    // 2nd line says clickedTab ko currentTab banao
    // 3rd Fir clickedTab(currentTab) ko visible kro

    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            // kya search form wla container is invisible, if yes then make it visible
            
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active");
            errorWala.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // Pehle main Search tab pr tha abhi YOur Weather wla tab visible krna hai....
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorWala.classList.remove("active");
            
            // ab mai yourTab wla Tab mai aa gaya hu toh weather bhi display krna hoga
            // so lets check local storage first for co-ordination, if we hava saved them there..
            getfromSessionStorage();
    
        }
    }

}


// User Tab pe hai toh search-Tab pr leke jao
userTab.addEventListener("click",()=>{
    //pass clicked tab as User Input parameter
    switchTab(userTab);
});

// Search Tab pe hai toh user Tab pr leke jao
searchTab.addEventListener("click",()=>{
    //pass clicked tab as User Input parameter
    switchTab(searchTab);
});


// Check if co-ordinates are already present in session storage 
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    if(!localCoordinates){
        // agar local coordinates nahi mile 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API Call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //  firstly , we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const messageNot = document.querySelector("[messageNotFound]");



    // Fetch value from weatherInfo object and put in UI Elements  
    cityName.innerText = weatherInfo?.name;
    countryIcon.src =  `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =` ${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = ` ${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    errorWala.innerText = weatherInfo?.cod;
    messageNot.innerText = `${weatherInfo?.message}`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("We can't get to this Geo-Location...");
    }
}

function showPosition(position){

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener('click',getLocation);

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorWala.classList.remove("active");

    try{
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if(response.status != "404"){   
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            errorWala.classList.remove("active")
            console.log(data?.cod)
            renderWeatherInfo(data);
        }
        else{
            loadingScreen.classList.remove("active");
            errorWala.classList.add("active");
            // 
            
            // console.log(data?.cod)
            renderWeatherInfo(data);
            // errorScreen(data);
        }

    }
    catch(err){
        // err.data?.cod = "404";
        // userInfoContainer.classList.remove("active");
        // errorWala.classList.add("active");
    }
    
}

// function errorScreen(errorfuck){
//     errorfuck.loadingScreen.classList.remove("active");
//     errorWala.classList.add("active");
// }


