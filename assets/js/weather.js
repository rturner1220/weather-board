// add functionality to pull current location weather
// create button to clear the city array
var cityList = [];
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

// gets current forecast for selected city
function getCurrentWeather(thisCity, id) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${thisCity}&unit=imperial&appid=${id}`;
    var cityLat;
    var cityLong;

    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function(data) {
        $(".cityToday").append (
            `<div class="row ml-1">
            <h3 class="mr-3">${data.name} (${(new Date(1000 * data.dt).getUTCMonth()) + 
            1}/${(new Date(1000 * data.dt).getUTCDate()) - 1}/${new Date(1000 * data.dt).getUTCFullYear()})</h3>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
            </div>`
        )
        $(".cityToday").append(`<p>Temperature: ${data.main.temp} &degF</p>`)
        $(".cityToday").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityToday").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        cityLat = data.coord.lat;
        cityLong = data.coord.lon;
        getUVI(id, cityLat, cityLong);
    })
}

// called within getcurrentweather() to get uv index for selected city 
function getUVI(id, cityLat, cityLong) {
    var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLong}&appid=${id}`;

    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (data) {
        $(".cityToday").append(`<p>UV Index: <span class="bagde bagde-danger p-2">${data.value}</span></p>`);
    })
}


// submit event that loads new data
$("form").on("submit", function(event) {
    event.preventDefault();
    console.log()
    var newCity = $("#cityname").val().trim();
    cityList.push(newCity);
    createCityList();
    storeCities();
    $("#searchButton").val("");
})

// get  day forescast for wlwcted city
function getForesCast(thisCity, id) {
    var foreCastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${thisCity}&units=imperial&appid=${id}`;

    $.ajax({
        url: foreCastURL,
        method: "GET"
    }).then(function(data) {
        for (i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.search("15:00:00") != -1) {
                var forecastDate = data.list[i];
                $(".forecast").append(`<div class="card bg-primary shadow m-4">
                <div class="card-body">
                <h4 class="card-title">${(new Date(1000 * forecastDate.dt).getUTCMonth()) +1}/${new Date(1000 * forecastDate.dt).getUTCDate()}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h4>
                <div class="card-text"><img src="http://openweathermap.org/img/wn/${forecastDate.weather[0].icon}.png">
                <p class="card-text">temp: ${forecastDate.main.temp} &degF</p>
                <p class="card-text">Humidity: ${forecastDate.main.humidity} %</p>
                </div>
             </div>
        </div>`
        );
       }
      }
    })
  }