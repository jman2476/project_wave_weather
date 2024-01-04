// marine report api url, but missing coordinates
// latitude=54.544587&longitude=10.227487 --> append this later
var marineAPInub = `https://marine-api.open-meteo.com/v1/marine?&hourly=wave_height,wave_direction,wave_period&forecast_days=1`

// open weather api key
var apiKey = '999d8c94a5b075191ec274724647d4c0';
// geolocation api, just needs city Name
var geolocateAPInub = `https://api.openweathermap.org/geo/1.0/direct?&appid=${apiKey}&q=`
// current weather api, missing 'lat={lat}&lon={lon}'
var weatherAPInub = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`

// functions
// array.contains('watermelon')
// array.contains() {
//     return array.some(item)
// }
// Check if there is anything stored in localStorage, if there is add new item to them, if there is no history create a new array []
// make sure that there are no duplicates in the history array
// in a seperate function, call the getWeather function 6 times to populate the page with the most recent history
function writeToLocalStorage(key, cityName) {
    var history = JSON.parse(localStorage.getItem(key)) || [] //sets history variable to be the search history or an empty variable
    console.log('store');
    console.log(history)
    // if history doesn't include cityName
    // add cityName to history
    if (!history.includes(cityName.toLowerCase())) {
        history.push(cityName.toLowerCase());
        var serializeValue = JSON.stringify(history);
        localStorage.setItem(key, serializeValue);
    }
}

// function to see if card exhists on page
function cardExhists(cityName) {
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
    if (0 <= angle <= 10 || 350 <= angle <= 360) {
        return 'N';
    } else if (10 <= angle < 80) {
        return 'NE'
    } else if (80 <= angle <= 100) {
        return 'E'
    } else if (100 <= angle < 170) {
        return 'SE'
    } else if (170 <= angle <= 190) {
        return 'S'
    } else if (190 <= angle < 260) {
        return 'SW'
    } else if (260 <= angle < 280) {
        return 'W'
    } else if (280 <= angle < 350) {
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
    console.log(waveHeightMax, waveDirection, wavePeriod)

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

    // populate the card with the lovely information
    cardObject.find('.weather-content').append(`<p>Temperature: ${temperature} K</p>
    <p>Feels like: ${feelsLike} K </p>
    <p>Wind speed: ${windSpeed} m/s</p>
    <p>Wind direction: ${windDirection}</p>
    <p>Description: ${description}</p>`)
}

// function to get surf and weather conditions
function getWeather(coordinates, cityName) {
    console.log(coordinates[0])
    // extract longitude and latitude from coordinates
    var latitude = coordinates[0].lat;
    var longitude = coordinates[0].lon;

    // complete the api urls with the coordinates
    var marineAPI = marineAPInub + `&latitude=${latitude}&longitude=${longitude}`
    var weatherAPI = weatherAPInub + `lat=${latitude}&lon=${longitude}`
    // log urls for verification
    console.log(marineAPI)
    console.log(weatherAPI)

    // make a div that will hold the weather card
    // it's time to d-d-d-d-duel
    var card = $(`<div class="weather-card ${cityName.toLowerCase()}">`)
    // make some sections in the card for waves data and weather
    card.append(`<h3 class="title">${cityName}</h3>
                <div class="surf-content"></div>
                <div class="weather-content"></div>`)
    console.log(card);
    $('main').append(card)

    // call wave report api
    $.get(marineAPI).then(function (data) {
        console.log(data)
        populateSurf(data, card)
    })
    // call weather api
    $.get(weatherAPI).then(function (data) {
        console.log(data)
        populateWeather(data, card)
    })
}

function getCoordinates() {
    // get city name from text box
    var cityName = $('#city-search').val();
    console.log(cityName);

    // add city to history
    writeToLocalStorage('wave-history', cityName);
    // add city name to api url to complete and make request
    var geolocateAPI = geolocateAPInub + cityName;
    console.log(cardExhists(cityName))
    // check if card already exhists for city
    if (!cardExhists(cityName)) {
        // call the geolocation api
        $.get(geolocateAPI).then(function (data) {
            var coordinates = data;
            console.log(coordinates)
            getWeather(coordinates, cityName);
        })
    }
}


// buttons
$('#search').click(getCoordinates)