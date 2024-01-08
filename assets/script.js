// marine report api url, but missing coordinates
// latitude=54.544587&longitude=10.227487 --> append this later
var marineAPInub = `https://marine-api.open-meteo.com/v1/marine?&hourly=wave_height,wave_direction,wave_period&forecast_days=1`

// open weather api key
var apiKey = '999d8c94a5b075191ec274724647d4c0';
// geolocation api, just needs city Name
var geolocateAPInub = `https://api.openweathermap.org/geo/1.0/direct?&appid=${apiKey}&q=`
// current weather api, missing 'lat={lat}&lon={lon}'
var weatherAPInub = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`

var spin = false; // the page is not currently spinning
var kelvinModal = false;

//Write out the search history
function displayHistory() {
    // story history as a variable
    var history = JSON.parse(localStorage.getItem('wave-history')) || [];

    // if search history exists, make each into a button
    if (history[0]) {
        // for each element in history array, make a button in the history aside element
        for (var index = 0; index < history.length; index++) {
            $('aside').append(`<button class="text center bg-orange-800 hover:bg-emerald-600 text-white font-bold py-1.5 w-3/4 px-4 rounded">${history[index]}</button>`)
        }
        // display 6 most recent history searches
        for (var index = 0; index < 6; index++) {
            // set the search text box value to the city name at index
            $('#city-search').val(history[index]);
            // call the search function to get weather and surf data
            getCoordinates();
        }
    }

}


// Check if there is anything stored in localStorage, if there is add new item to them, if there is no history create a new array []
// make sure that there are no duplicates in the history array
// in a seperate function, call the getWeather function 6 times to populate the page with the most recent history
function writeToLocalStorage(key, cityName) {
    var history = JSON.parse(localStorage.getItem(key)) || [] //sets history variable to be the search history or an empty variable

    // if history doesn't include cityName
    // add cityName to history
    if (!history.includes(cityName.toLowerCase())) {
        history.push(cityName.toLowerCase());
        var serializeValue = JSON.stringify(history);
        localStorage.setItem(key, serializeValue);

        // add a button to the history aside with the city's name on it
        $('aside').append(`<button class="text center bg-orange-800 hover:bg-emerald-600 text-white font-bold py-1.5 w-3/4 px-4 rounded">${cityName}</button>`)
    }
}

// function to see if card exhists on page
function cardExists(cityName) {
    if ($(`.weather-card`).hasClass(`${cityName.toLowerCase()}`)) {
        return true;
    } else {
        return false;
    }
}


// function to turn angle into cardinal directions
// angles within 10 degrees of a cardinal directions 
// is normalized to that direction 
// (eg 5 deg becomes N, 11 deg becomes NE)
function angleCardinal(angle) {
    
    if ((0 <= angle && angle <= 10) || (350 <= angle && angle <= 360)) {
        return 'N';
    } else if (10 <= angle && angle < 80) {
        return 'NE'
    } else if (80 <= angle && angle <= 100) {
        return 'E'
    } else if (100 <= angle && angle < 170) {
        return 'SE'
    } else if (170 <= angle && angle <= 190) {
        return 'S'
    } else if (190 <= angle && angle < 260) {
        return 'SW'
    } else if (260 <= angle && angle < 280) {
        return 'W'
    } else if (280 <= angle && angle < 350) {
        return 'NW'
    } else {
        return "why?"
    }
}

// function to populate surf data
function populateSurf(waveData, cardObject) {
    // disect the waveData object into its components
    var waveHeightMax = waveData.hourly.wave_height[0]; // get wave height in meters
    var waveAngle = waveData.hourly.wave_direction[0]; // get wave angle
    var waveDirection = angleCardinal(waveAngle); // change angle into cardinal direction
    var wavePeriod = waveData.hourly.wave_period[0] // get wave period in seconds
    

    cardObject.find('.surf-content').append(`<p>Wave height max: ${waveHeightMax} m</p>
    <p>Wave direction: ${waveDirection}</p>
    <p>Wave period: ${wavePeriod} s</p>`)
}

// function to populate weather data
function populateWeather(weatherData, cardObject) {
    // disect the weather object to get temperature, wind speed, wind direction, and precipitation
    var temperature = weatherData.main.temp;
    var feelsLike = weatherData.main.feels_like;
    var windSpeed = weatherData.wind.speed;
    var windAngle = weatherData.wind.deg;
    var windDirection = angleCardinal(windAngle);
    var description = weatherData.weather[0].main;
    var cityName = weatherData.name;

    // use city name from weather object so it looks nicer

    cardObject.find('.title').append(cityName)
    // populate the card with the lovely information
    cardObject.find('.weather-content').append(`<p>Temperature: ${temperature} K</p>
    <p>Feels like: ${feelsLike} K </p>
    <p>Wind speed: ${windSpeed} m/s</p>
    <p>Wind direction: ${windDirection}</p>
    <p>Description: ${description}</p>`)
}

// function to get surf and weather conditions
function getWeather(coordinates, cityName) {

    // extract longitude and latitude from coordinates
    var latitude = coordinates[0].lat;
    var longitude = coordinates[0].lon;

    // complete the api urls with the coordinates
    var marineAPI = marineAPInub + `&latitude=${latitude}&longitude=${longitude}`
    var weatherAPI = weatherAPInub + `lat=${latitude}&lon=${longitude}`
    // log urls for verification


    // make a div that will hold the weather card
    // it's time to d-d-d-d-duel
    var card = $(`<div class="weather-card space-y-2 border-double border-8 border-cyan-900 rounded-lg text-center bg-cyan-700 text-white ${cityName.toLowerCase()}">`)
    // make some sections in the card for waves data and weather
    card.append(`<h3 class="title text-3xl"></h3>
                <div class="surf-content"></div>
                <div class="weather-content"></div>`)

    $('main').prepend(card)

    // if there are more than 6 cards, delete the last one
    if ($('main').find('.weather-card').length > 6) {
        // remove the last weather card
        $('.weather-card').last().remove()
    }

    // call wave report api
    $.get(marineAPI).then(function (data) {

        populateSurf(data, card)
    }).catch(function () {
        card.find('.surf-content').append(`<h3>No surf, bummer</h3>`)
    })
    // call weather api
    $.get(weatherAPI).then(function (data) {

        populateWeather(data, card)
    })
}

function getCoordinates() {
    // get city name from text box
    var cityName = $('#city-search').val();


    // if city name field is empty, return
    if (cityName === "" || cityName === " ") {
        return;
    }
    // add city to history
    writeToLocalStorage('wave-history', cityName);
    // add city name to api url to complete and make request
    var geolocateAPI = geolocateAPInub + cityName;

    // check if card already exhists for city
    if (!cardExists(cityName)) {
        // call the geolocation api
        $.get(geolocateAPI).then(function (data) {
            var coordinates = data;
            getWeather(coordinates, cityName);
        })
    }
}

// when you click a history button, it will load the information
function historySurfButton() {
    // get the city name from the button text
    var cityName = $(this).text()
    // set the search text box value to the city name
    $('#city-search').val(cityName);
    // call the search function to get weather and surf data
    getCoordinates();
}

// Carve the barrel!
function barrelTime() {
    // if the page isn't spinning, make it spin. if it is spinning, stop the spin
    // spin will be applied to all elements except the "carve the barrel button"
    if (!spin) {
        // make absolutely everything spin
        $("*").addClass('fa-spin');
        // no remove the spin class from html, head, body, header, and nav so that the spin button can be pressed again to turn it off
        $("html, head, body, header, nav").removeClass("fa-spin");
        spin = true; // now things spin, so set this to true
    } else {
        // remove the spin class to remove nausea
        $('*').removeClass("fa-spin");
        spin = false; // the spin has stopped, please
    }
}

// call displayHistory to show the search history in the aside
displayHistory()
// buttons
$('#search').click(getCoordinates)
$('#spin').click(barrelTime);
$('aside>button').click(historySurfButton);
// bring up the modal explaining why we are using Kelvin
$('#kelvin').click(function(){
    if (!kelvinModal){
        $('#why-kelvin').show()
        kelvinModal = true;
    } else {
        $('#why-kelvin').hide()
        kelvinModal = false;
    }
})
$('#resignation').click(function(){
    $("#why-kelvin").hide()
})