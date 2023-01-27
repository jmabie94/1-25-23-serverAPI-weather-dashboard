/* setting assignment variables */
var searchBar = document.querySelector("#search-bar");
var weatherContainer = document.querySelector("#results-table");
var cityListBtn = document.querySelector(".listed-cities");
const apiKey = "46c0824afd90fe2d2cd87183d46e3c22"

var formContainer = document.createElement("form");
formContainer.setAttribute("id", "cityForm");
formContainer.classList = "city-container";
searchBar.appendChild(formContainer);

var formH3 = document.createElement("h3");
formH3.textContent = " Enter a City Name! ";
formContainer.appendChild(formH3);

/* css class testing line 
forecast-container*/
var cityInput = document.createElement("input");
cityInput.setAttribute("id", "cityName");
cityInput.setAttribute("type", "text");
cityInput.setAttribute("autofocus", "true");
cityInput.classList = "city-input"
formContainer.appendChild(cityInput);

var searchBtn = document.createElement("button");
searchBtn.setAttribute("type", "submit");
searchBtn.textContent = " Search ";
searchBtn.classList = ("btn fas fa-search");
formContainer.appendChild(searchBtn);

var searchEvent = document.querySelector("#cityForm");
var searchByCityEl = document.querySelector("#cityName");

var cityContainer = document.createElement("div");
cityContainer.setAttribute("id", "cityList");
cityContainer.classList = "list-group";
searchBar.appendChild(cityContainer);

var cityListContainer = document.querySelector("#cityList");

/* var getCityWeather = function (searchByCity) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchByCity}&units=imperial&appid=${apiKey}`
    ).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data.list, "hello")
    });
}; */

var getWeatherData = function (event, cityClicked) {
    event.preventDefault();

    if (cityClicked) {
        var searchByCity = cityClicked.trim();
    } else {
        var searchByCity = searchByCityEl.value.trim();
    };

    if (searchByCity == "") {
        alert ("Please do not leave city name blank!");
        searchByCityEl.value = "";
        return
    } else {
        searchByCityEl.value = "";
    };

    var cityStorage = JSON.parse(localStorage.getItem("savedCities"));

    var cityTotal = 0;

    if (cityStorage === null) {
        citySearched = new Array();
    } else {
        citySearched = cityStorage;
    };

    /* API call to convert text city name into Latitude and Longitude numbers for second call */
    var openWeatherApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchByCity}&appid=${apiKey}&units=imperial`;
    var getcityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchByCity}&units=imperial&appid=${apiKey}`;

    fetch(openWeatherApiUrl
        ).then(function (weatherResponse) {
            if (weatherResponse.ok) {
                return weatherResponse.json();
            } else {
                window.alert(`Error: ${weatherResponse.statusText}. Please re-enter a valid city`);
                searchByCityEl = "";
                return
            };
        }).then(function (LatLon) {
            console.log(LatLon);
            /* getCityWeather(weatherLatLon); */
            var latNum = LatLon.lat;
            var lonNum = LatLon.lon;
        }).catch(function(error) {
            return
        });
    fetch(getcityWeatherUrl
        ).then(function (weatherResponse) {
            if (weatherResponse.ok) {
                return weatherResponse.json();
            } else {
                window.alert(`Error: ${weatherResponse.statusText}. Please re-enter a valid city`);
                searchByCityEl = "";
                return
            };
        }).then(function (weatherLatLon) {
            console.log(weatherLatLon);
            var latNum = weatherLatLon.coord.lat;
            var lonNum = weatherLatLon.coord.lon;
            var unixTimeCurrentDay = weatherLatLon.dt;
            var currentDayIcon = weatherLatLon.weather[0].icon;
            var currentTemp = weatherLatLon.main.temp;
            var currentHumid = weatherLatLon.main.humidity;
            var currentMPS = weatherLatLon.wind.speed;
            var mphWindSpeed = Math.round(currentMPS * 2.237);

            if (cityTotal === 0) {
                citySearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));

                localStorage.setItem("savedCities", JSON.stringify(citySearched));
            };

            fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTemp, currentHumid, currentMPS, mphWindSpeed);

            importCities();
        }).catch(function(error) {
            return
        });
};

function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTemp, currentHumid, currentMPS, mphWindSpeed) {
    /* uses Latitude and Longitude determined in first call to start gathering data */
    var openWeatherApiFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lonNum}&appid=${apiKey}&units=imperial`;
    fetch(openWeatherApiFiveDayUrl
        ).then(function (response) {
            return response.json();
        }).then(function (secondCallData) {
            /* var uvIndex = secondCallData.current.uvi; */
            var timestamp = unixTimeCurrentDay;
            var date = new Date(timestamp * 1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var fullDaily = `(${month}/${day}/${year})`
            console.log(`unix day format is ${day}`);
            console.log(`unix month format is ${month}`);
            console.log(`unix year format is ${year}`);
            console.log(`Full day of unix format is ${fullDaily}`);
            importCurrentDayHtml(searchByCity, fullDaily, currentDayIcon, currentTemp, currentHumid, currentMPS, mphWindSpeed);
            import5dayForecast(secondCallData)
        });
};

function importCurrentDayHtml(searchByCity, fullDaily, currentDayIcon, currentTemp, currentHumid,  mphWindSpeed) {
    /* clears for new search before loading new results */
    $('#daily-forecast-container').remove();

    var dailyForecastContainer = document.createElement("div");
    dailyForecastContainer.setAttribute("id", "daily-forecast-container");
    dailyForecastContainer.classList = "borderDiv";

    var currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = (searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDaily);

    var currentIconEl = document.createElement("span");
    var currentIconSymbol = `http://openweathermap.org/img/wn/${currentDayIcon}@2x.png`;
    currentIconEl.innerHTML = `<img src="${currentIconSymbol}"/>`;
    currentDayTitle.append(currentIconEl);

    var currentTemperature = document.createElement("p");
    var currentHumidity = document.createElement("p");
    var currentWindSpeed = document.createElement("p");
    /* var currentUVI = document.createElement("p"); */

    currentTemperature.textContent = `Temperature: ${currentTemp.toFixed(1)}°F`
    currentHumidity.textContent = `Humidity: ${currentHumid}%`;
    currentWindSpeed.textContent = `Wind Speed: ${mphWindSpeed} MPH`
    /* currentUVI.textContent = `UV Index: ${uvIndex}`; */

    weatherContainer.appendChild(dailyForecastContainer);
    weatherContainer.appendChild(currentDayTitle);
    weatherContainer.appendChild(currentTemperature);
    weatherContainer.appendChild(currentHumidity);
    weatherContainer.appendChild(currentWindSpeed);
    /* weatherContainer.appendChild(currentUVI); */
    console.log(weatherContainer);
};

function import5dayForecast(secondCallData) {
    /* clears for new search before loading new results */
    $('#weekly-forecast-container').remove();

    var weeklyForecastContainer = document.createElement("div");
    weeklyForecastContainer.setAttribute("id", "weekly-forecast-container");
    weeklyForecastContainer.classList = "borderDiv-right-column";

    var fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast";

    weatherContainer.appendChild(weeklyForecastContainer);
    weeklyForecastContainer.appendChild(fiveDayForecast);

    var weeklyContainer = document.createElement("div");
    weeklyContainer.classList = "week-container";
    weeklyForecastContainer.appendChild(weeklyContainer);

    for (i=1; i<= 5; i++) {
        console.log(secondCallData, "hola");
        var unixTime = secondCallData.list[i].dt;
        var timestamp = unixTime;
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var fullDay = `${month}/${day}/${year}`;
        var iconWeather = secondCallData.list[i].weather[0].icon;
        var fahrenheitTemp = secondCallData.list[i].main.temp;
        var humidity = secondCallData.list[i].main.humidity;

        var eachDayContainer = document.createElement("div")
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "borderDiv-five-days";

        var currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        var iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        var currentIcon = document.createElement("span");
        var currentIconSymbol = `http://openweathermap.org/img/wn/${iconWeather}@2x.png`;
        console.log(currentIconSymbol, "icon")
        currentIcon.innerHTML = `<img src="${currentIconSymbol}"/>`;
        iconSpan.append(currentIcon);

        var currentTemp = document.createElement("p");
        var currentHumid = document.createElement("p");
        currentTemp.textContent = `Temperature: ${fahrenheitTemp.toFixed(2)}°F`;
        currentHumid.textContent = `Humidity: ${humidity}%`;

        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIcon);
        eachDayContainer.appendChild(currentTemp);
        eachDayContainer.appendChild(currentHumid);
        weeklyContainer.appendChild(eachDayContainer);
    };
};

var importCities = function() {
    var cityStorage = JSON.parse(localStorage.getItem("savedCities"));

    if (cityStorage === null){
    } else {
        $(".listed-cities").remove();
        for (i=0; i<cityStorage.length; i++) {
            var cityNameEl = document.createElement("a");
            cityNameEl.setAttribute("href", "#");
            cityNameEl.setAttribute("data-city", cityStorage[i]);
            cityNameEl.setAttribute("id", cityStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "listed-cities listed-cities-action listed-cities-primary"
            cityNameEl.textContent = cityStorage[i];
            cityContainer.appendChild(cityNameEl);
        };
    };
};

searchEvent.addEventListener("submit",getWeatherData);

var cityClicked = function (event) {
    var cityClicked = event.target.getAttribute("data-city");
    if (cityClicked) {
        getWeatherData(event, cityClicked);
    } else {
        alert("Internal error found, please try again.");
    };
};

cityContainer.addEventListener("click", cityClicked);

importCities();