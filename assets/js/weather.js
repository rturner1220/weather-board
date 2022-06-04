// add functionality to pull current location weather
// create button to clear the city array
var cityList = [];
var id = "f1a31b169738f6caeabf63c37fa3d56b";

// stores citiList in localStorage
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