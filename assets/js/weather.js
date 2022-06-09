function initPage() {
var cityEl = document.getElementById("city");
var searchEl = document.getElementById("search-button");
var clearEl = document.getElementById("clear-button");
var nameEl = document.getElementById("city-name");
var picEl = document.getElementById("pic");
var currentTempEl = document.getElementById("temperature");
var currentWindEL = document.getElementById("wind");
var currentHumidityEl = document.getElementById("humidity");
var currentUvEl = document.getElementById("UV-index");
var historyEL = document.getElementById("city-form");
var fiveDays = document.getElementById("five-days");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// unique API
var id = "cf6597689bdfad677e7e63bf7ab531e6";

// stores cityList in localStorage
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// adds last searched city to list-group as button for user to select city
function createCityList() {
    $(".cityList").empty();
    cityList.forEach(function(city) {
        $(".cityList").prepend($(`<button class="list-group-item list-group-item-action cityButton"
        data-city="${city}">${city}</button>`));
    })
}

// loads citylist from local storage and calls api to get data for last searched city 
function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
// calls main on page load function
    init();


    createCityList();

    if (cityList) {
        var thisCity = cityList[cityList.length - 1]
        getCurrentWeather(thisCity, id);
        getForesCast(thisCity, id);
        }
    }

// get current weather for selected city
function getCurrentWeather(cityName) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + id + "&units=imperial";
    axios.get(weatherUrl).then(function(response) {
       currentWeatherEl.classList.remove("d-none");
       
       //display current weather
       var currentDate = new Date(response.data.dt * 1000);
       var day = currentDate.getDate();
       var month = currentDate.getMonth() + 1;
       var year = currentDate.getFullYear();
       nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
       var weatherPic = response.data.weather[0].icon;
       picEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
       picEl.setAttribute("alt", response.data.weather[0].description);
       currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
       currentWindEL.innerHTML = "Wind: " + response.data.wind.speed + "MPH";
       currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";

       // Get UV Index 
       var lat = response.data.coord.lat;
       var lon = response.data.coord.lon;
       var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + id + "&cnt=1" + "&units=imperial";
       axios.get(uvURL).then(function (response) {
           var UvIndex = document.createElement("span");
       
           // When UV is good, shows green, ok shows yellow, bad shows red
           if (response.data[0].value < 4) {
               UvIndex.setAttribute("class", "badge badge-success");
           }
           else if (response.data[0].value < 8) {
               UvIndex.setAttribute("class", "badge badge=danger");
           }
           console.log(response.data[0].value)
           UvIndex.innerHTML = response.data[0].value;
           currentUvEl.innerHTML = "UV Index: ";
           currentUvEl.append(UvIndex);
        });

       // get 5 days forescast for selected city
       var cityID = response.data.id;
       var forecastURL = "`https://api.openweathermap.org/data/2.5/forecast?q=" + cityID + "&appid=" + id + "&units=imperial";
       axios.get(forecastURL).then(function (response) {
           fiveDays.classList.remove("d-none");
       // display forecast for next 5 days
       var forecastEl = document.querySelectorAll(".forescast"); 
       for (i = 0; i < forecastEl.length; i++) {
           forecastEl[i].innerHTML = "";
           var forescastIndex = i * 8 + 4;
           var forescastDate = new Date(response.data.list[forescastIndex].dt * 1000);
           var forecastDay = forescastDate.getDate();
           var forecastMonth = forescastDate.getMonth() + 1;
           var forecastYear = forecastDate.getFullYear();
           var forecastDateEl = document.createElement("p");
           forecastDateEl.setAttribute("class", "mt-3 mb-0 forescast-date");
           forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
           forecastEl[i].append(forecastDateEl);

        // icon for current weather
        var forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src", "http://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastWeatherEl.setAttribute("alt", response.data.list[forescastIndex].weather[0].description);
        forecastEl[i].append(forecastWeatherEl);
        var forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp:" + k2f(response.data.list[forescastIndex].main.temp) + "&#176F";
        forecastEl[i].append(forecastTempEl);
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity:" + response.data.list[forescastIndex].main.humidity + "%";
        forecastEl[i].append(forecastHumidityEl);
         }
      })
    });
}
}
initPage();
