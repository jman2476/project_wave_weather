// marine report api url, but missing coordinates
// latitude=54.544587&longitude=10.227487 --> append this later
var marineAPInub = `https://marine-api.open-meteo.com/v1/marine?&hourly=wave_height,wave_direction,wave_period&forecast_days=1`

// open weather api key
var apiKey = '999d8c94a5b075191ec274724647d4c0'; 
// geolocation api, just needs city Name
var geolocateAPInub = `https://api.openweathermap.org/geo/1.0/direct?&appid=${apiKey}&q=`
// current weather api, missing 'lat={lat}&lon={lon}'
var weatherAPInub = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&`

function getWeather (coordinates) {
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


    // call wave report api
    $.get(marineAPI).then(function (data){
        console.log(data)
    })
    // call weather api
    $.get(weatherAPI).then(function (data){
        console.log(data)
    })
}

function getCoordinates () {
    // get city name from text box
    var cityName = $('#city-search').val();
    console.log(cityName);

    // add city name to api url to complete and make request
    var geolocateAPI = geolocateAPInub + cityName;

    // call the geolocation api
    $.get(geolocateAPI).then( function (data){
        var coordinates = data;
        console.log(coordinates)
        getWeather(coordinates);
    })
}

$('#search').click(getCoordinates)