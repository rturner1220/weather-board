


var cityFormE1 = document.querySelector("#city-form");
var nameInputE1 = document.querySelector("#cityname");

// form submission browser event
var fromSubmitHandler = function(event) {
    event.preventDefoult();
    console.log(event);
};

// add submit even listener
cityFormE1.addEventListener("search", fromSubmitHandler);
