// marine report api url, but missing coordinates
// latitude=54.544587&longitude=10.227487 --> append this later
var marineAPInub = `https://marine-api.open-meteo.com/v1/marine?hourly=wave_height,wave_direction,wave_period`

// open weather api key
var apiKey = '999d8c94a5b075191ec274724647d4c0'; 
// geolocation api, just needs city Name
var geolocateAPInub = `http://api.openweathermap.org/geo/1.0/direct?&appid=${apiKey}&q=`
// current weather api, missing 'lat={lat}&lon={lon}'
var weatherAPInub = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`

function getWeather (coordinates) {
    console.log(coordinates[0])
    // extract longitude and latitude from coordinates
    var latitude = coordinates[0].lat;
    var longitude = coordinates[0].lon;

    // complete the api urls with the coordinates
    var marineAPI = `https://marine-api.open-meteo.com/v1/marine?&hourly=wave_height,wave_direction,wave_period&forecast_days=1&latitude=${latitude}&longitude=${longitude}`
    var weatherAPI = weatherAPInub + `lat=${latitude}&lon=${longitude}`
    console.log(marineAPI)
    console.log(weatherAPI)


    // call the two apis
    $.get(marineAPI).then(function (data){
        console.log(data)
    })
    $.get(weatherAPI).then(function (data){
        console.log(data)
    })
}

function getCoordinates () {
    var cityName = $('#city-search').val();
    console.log(cityName);

    var geolocateAPI = geolocateAPInub + cityName;

    $.get(geolocateAPI).then( function (data){
        var coordinates = data;
        console.log(coordinates)
        getWeather(coordinates);
    })
}

$('#search').click(getCoordinates)