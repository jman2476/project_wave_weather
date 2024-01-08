##  Wave and Weather Report
by Shannon Tice, Edson Guevara, and Jeremy McKeegan

https://jman2476.github.io/project_wave_weather/

# Description
Our application allows you to search the the wave and weather conditions in any city, and will return that data in up to six boxes, while saving your searches into little buttons for quick retrieval.

# Usage and Features
When you type in the name of a city, you will be presented with wave height, wave direction, and wave period, as well as measured and 'feels like' temperature, wind speed, wind direction and a brief description of the weather. After pressing the search button, your search will be added to the history section and a card displaying the information will show up. Any search history you have will be loaded to show the data on up to six unique cities.

When you type in the name of a city, the application calls the Geocoding API to find the coordinates of the city, which it then passes on to the Marine Weather API and Current Weather API. These return the surf data and weather data, respectively. 

Because the Geocoding API will look up the first city that fits the name, if you want to be specific make sure to add in the country code for the city you want. For example, inputing 'Nazare' will bring up Nazareth, Brazil, but looking up 'Nazare, pt' will bring up Nazaré, Portugal, home to some of the biggest waves ever surfed. To alleviate confusion, the application will use the place name returned by the Current Weather API, so the user knows where the weather is being reported from. 

When you load the page after using it, you should be greated with six of your historical searches displayed as full info cards, and a list of your full search history on the righthand side (or below the weather cards if you are on a mobile device). When you add another search, the last surf data card should be removed, and your new search will populate the first space, with the other surf data cards moving down.

# APIs and Frameworks
For this project, we used the following APIs to gather our weather and surf data:

- Marine Weather API by Open-Meteo: 
https://open-meteo.com/en/docs/marine-weather-api 

- Current Weather API by OpenWeather:
https://openweathermap.org/current

- Geocoding API by OpenWeather:
https://openweathermap.org/api/geocoding-api

And we used the following frameworks:

- Tailwind CSS: https://tailwindcss.com

- FontAwesome: https://fontawesome.com/

- jQuery: https://jQuery.com

# License
MIT License

# Badges

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)