/* setting assignment variables */
var searchBar = document.querySelector("#search-bar");
var weatherContainer = document.querySelector("#results-table");
var cityListBtn = document.querySelector(".listed-cities");
const apiKey = "46c0824afd90fe2d2cd87183d46e3c22"

/* creating left column, step by step */
var formContainer = document.createElement("form");
formContainer.setAttribute("id", "cityForm");
formContainer.classList = "forecast-container";
searchBar.appendChild(formContainer);

/* adds title */
var formH3 = document.createElement("h3");
formH3.textContent = " Search for a City! ";
formContainer.appendChild(formH3)

/* adds text input bar */
var cityInput = document.createElement("input");
cityInput.setAttribute("id", "cityName");
cityInput.setAttribute("type", "text");
cityInput.setAttribute("autofocus", "true");
cityInput.classList = "cityInput"
formContainer.appendChild(cityInput);

/* adds button to search for the text input */
var searchButton = document.createElement("button");
searchButton.setAttribute("type", "submit");
searchButton.classList = ("btn fas fa-search");
formContainer.appendChild(searchButton);

var searchEventHandler = document.querySelector("#cityForm");
var searchByCityEl = document.querySelector("#cityName");

var cityContainer = document.createElement("div");
cityContainer.setAttribute("id", "cityList");
cityContainer.classList = "list-group";
searchBar.appendChild(cityContainer);

var cityListContainer = document.querySelector("#cityList");

var importCities = function() {
    var cityStorage = JSON.parse(localStorage.getItem("savedCities"));
    /* check and see if this is erroneous */
    var cityTotal = 0;
    /* check and see if the "if/else" here is doing anything */
    if (cityStorage === null) {
    } else {
        $(".listed-cities").remove();
        for (i=0; i<cityStorage.length; i++) {
            var cityNameEl = document.createElement("a");
            cityNameEl.setAttribute("href", "#");
            cityNameEl.setAttribute("data-city", cityStorage[i]);
            cityNameEl.setAttribute("id", cityStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "listed-cities listed-cities-action listed-cities-primary";
            cityNameEl.textContent = cityStorage[i];
            cityContainer.appendChild(cityNameEl);
        };
    };
};

function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed) {
    /* var openWeatherApiFiveDayUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=46c0824afd90fe2d2cd87183d46e3c22&units=imperial" */
    var openWeatherApiFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lonNum}&appid=${apiKey}&units=imperial`;
    fetch(openWeatherApiFiveDayUrl
        ).then(function (response) {
        return response.json();
    })
    .then(function (secondCallData) {
        var uvIndex = secondCallData.current.uvi
        var timestamp = unixTimeCurrentDay;
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var fullDaily = "(" + month + "/" + day + "/" + year + ")";
        console.log("unix day format is " + day);
        console.log("unix month format is " + month);
        console.log("unix year format is " + year);
        console.log("Full day of unix format is " + fullDaily);
        importCurrentDayHtml(searchByCity, fullDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex);
        import5dayForecast(secondCallData);
    });
};

function importCurrentDayHtml(searchByCity, fullDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {
    var dailyForecastContainer = document.createElement("div");
    dailyForecastContainer.setAttribute("id", "daily-forecast-container")
    dailyForecastContainer.classList = "borderDiv";

    var currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = (searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDaily);

    var currentIconEl = document.createElement("span");
    var currentIconSymbol = `http://openweathermap.org/img/wn/${currentDayIcon}@2x.png`;
    currentIconEl.innerHTML = `<img src=${currentIconSymbol}></img>`;
    currentDayTitle.append(currentIconEl);

    var currentTemp = document.createElement("p");
    var currentHumid = document.createElement("p");
    var currentWindSpeed = document.createElement("p");
    var currentUVI = document.createElement("p");

    currentTemp.textContent = `Temperature: ${currentTempImperial.toFixed(1)}°F`;
    currentHumid.textContent = `Humidity: ${currentHumidity}%`;
    currentWindSpeed.textContent = `Wind Speed: ${currentMPS} MPH`;
    currentUVI.textContent = `UV Index: ${uvIndex}`;

    $("#daily-forecast-container").remove();

    weatherContainer.appendChild(dailyForecastContainer);
    weatherContainer.appendChild(currentDayTitle);
    weatherContainer.appendChild(currentTemp);
    weatherContainer.appendChild(currentHumid);
    weatherContainer.appendChild(currentWindSpeed);
    weatherContainer.appendChild(currentUVI);
};

function import5dayForecast(secondCallData) {
    $("#weekly-forecast-container").remove();

    var weeklyForecastContainer = document.createElement("div");
    weeklyForecastContainer.setAttribute("id", "weekly-forecast-container");
    weeklyForecastContainer.classList = "borderDiv-right-column";

    var fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:";

    weatherContainer.appendChild(weeklyForecastContainer);
    weeklyForecastContainer.appendChild(fiveDayForecast);

    var weeklyContainer = document.createElement("div");
    weeklyContainer.classList = "week-container";
    weeklyForecastContainer.appendChild(weeklyContainer);

    for (i=1; i <= 5; i++) {
        var unixTime = secondCallData.daily[i].dt;
        var timestamp = unixTime;
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var fullDay = `${month}/${day}/${year}`;
        var iconWeather = secondCallData.daily[i].weather[0].icon;
        var fahrenheitTemp = secondCallData.daily[i].temp.day;
        var humidity = secondCallData.daily[i].humidity;

        var eachDayContainer = document.createElement("div")
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "borderDiv-five-day-forecast";

        var currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        var iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        var currentIcon = document.createElement("span");
        var currentIconSymbol = `http://openweathermap.org/img/wn/${iconWeather}@2x.png`;
        currentIcon.innerHTML = `<img src=${currentIconSymbol}></img>`;
        iconSpan.append(currentIcon);

        var currentTemp = document.createElement("p");
        var currentHumid = document.createElement("p");
        currentTemp.textContent = `Temperature: ${fahrenheitTemp.toFixed(2)}°F`;
        currentHumid.textContent = `Humidity: ${humidity}%`

        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIcon);
        eachDayContainer.appendChild(currentTemp);
        eachDayContainer.appendChild(currentHumid);
        weeklyContainer.appendChild(eachDayContainer);
    };
};

var getWeatherData = function (event , cityClicked) {
    event.preventDefault();

    if (cityClicked) {
        var searchByCity = cityClicked.trim();
    } else {
        var searchByCity = searchByCityEl.value.trim();
    };

    if (searchByCity == "") {
        alert("Please do not leave city name blank!");
        searchByCityEl.value = "";
        return
    } else {
        searchByCityEl.value = "";
    };

    var cityStorage = JSON.parse(localStorage.getItem("savedCities"));

    var cityTotal = 0;

    if (cityStorage === null) {
        citiesSearched = new Array();
    } else {
        citiesSearched = cityStorage;
    };

    var openWeatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchByCity}&appid=${apiKey}&units=imperial`;

    fetch(openWeatherApiUrl
        ).then(function (weatherResponse) {
            if(weatherResponse.ok) {
                return weatherResponse.json();
            } else {
                window.alert(`Error: ${weatherResponse.statusText}. Please re-enter a valid city`);
                searchByCityEl.value = "";
                return;
            };
        }).then(function (weatherLatLon) {
            var latNum = weatherLatLon.coord.lat;
            var lonNum = weatherLatLon.coord.lon;
            var unixTimeCurrentDay = weatherLatLon.dt;
            var currentDayIcon = weatherLatLon.weather[0].icon;
            var currentTemp = weatherLatLon.main.temp;
            var currentHumid = weatherLatLon.main.humidity;
            var currentMPS = weatherLatLon.wind.speed;
            var mphWindSpeed = Math.round(currentMPS * 2.237);

            for (i=0; i <citiesSearched.length; i++) {
                if (searchByCity.toLowerCase() === citiesSearched[i].toLowerCase()){
                    cityTotal = 1
                    break;
                };
            };
            
            if (cityTotal === 0) {
                citiesSearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));

                localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
            };

            fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTemp, currentHumid, currentMPS, mphWindSpeed);

            importCities();
        }).catch(function(error) {
            return;
        });
};

searchEventHandler.addEventListener("submit",getWeatherData);

var cityClicked = function (event) {
    var cityClicked = event.target.getAttribute("data-city");
    if (cityClicked) {
        getWeatherData(event, cityClicked);
    } else {
        alert("Internal error found. Please try again.")
    };
};

cityContainer.addEventListener("click", cityClicked);

importCities();