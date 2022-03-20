var list = document.querySelector("ul");
var searchButton = document.getElementById("search-button");
var citySearchInput = document.getElementById("city-search");
var cityList = document.getElementById("city-list");
var lat;
var long;
var cityName;
var pastSearches = [];

searchButton.addEventListener("click", () => {
  getCoordinates(citySearchInput.value);
});

if (localStorage.getItem("searchHistory")) {
  pastSearches = JSON.parse(localStorage.getItem("searchHistory"));
  //console.log(parsedStorage);

  renderHistory();
}
function renderHistory() {
  cityList.innerHTML = "";
  pastSearches.forEach((element) => {
    var listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.innerText = element;
    listItem.addEventListener("click", (e) => {
      getCoordinates(e.target.innerText);
    });
    cityList.appendChild(listItem);
  });
}

function getCoordinates(cityInput) {
  // var cityInput = document.getElementById("city-search").value;
  // TODO: Insert the API url to get a list of your repos
  var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=593c0385215d05c9409439d0b1361f3e`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      long = data[0].lon;
      cityName = data[0].name;

      if (!pastSearches.includes(cityName)) {
        if (pastSearches.length >= 5) {
          pastSearches.shift();
        }
        pastSearches.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(pastSearches));
        //rerender the history
        renderHistory();
      }

      // pastSearches.push(cityName);
      // localStorage.setItem("searchHistory", JSON.stringify(pastSearches));
      // updateUIHistory(cityName);
      getWeather();
    });
}

function getWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=imperial&appid=593c0385215d05c9409439d0b1361f3e`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      currentWeatherCard(data);
    });
}

function currentWeatherCard(data) {
  var dateToday = new Date().toDateString();

  document.getElementById("current-city").innerText =
    "Conditions for " + cityName + " on " + dateToday;

  document.getElementById(
    "weather-icon"
  ).innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png">`;

  document.getElementById("temperature").innerText =
    "Temperature: " + data.current.temp + " F";
  document.getElementById("humidity").innerText =
    "Humidity: " + data.current.humidity;
  document.getElementById("wind-speed").innerText =
    "Wind Speed: " + data.current.wind_speed;
  document.getElementById("uv-index").innerText =
    "UV Index: " + data.current.uvi;

  if (data.current.uvi <= 4) {
    document.getElementById(
      "uv-icon"
    ).innerHTML = `<img src = "./assets/images/green.png" alt="good">`;
  }
  if (data.current.uvi > 4 && data.current.uvi < 8) {
    document.getElementById(
      "uv-icon"
    ).innerHTML = `<img src = "./assets/images/yellow.png" alt="mild">`;
  }
  if (data.current.uvi >= 8) {
    document.getElementById(
      "uv-icon"
    ).innerHTML = `<img src = "./assets/images/red.png" alt="severe">`;
  }

  forecastWeatherCard(data);
}

const forecastWeatherCard = (data) => {
  let container = document.getElementById("forecast");
  container.innerHTML = "";
  // data.daily.forEach((day, index) => {
  for (var i = 1; i <= 5; i++) {
    var day = data.daily[i];
    var timeMillisecond = `${day.dt}` * 1000;
    var dateObject = new Date(timeMillisecond).toDateString();
    // dateString = JSON.stringify(dateObject);
    // console.log(dateObject);

    let div = document.createElement("div");

    // div.id = `day${index + 1}`;
    div.classList.add("forecastCard");

    let forecastData = `<p class="forecastData">${dateObject}</p>
                        <img src = "https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                        <p class="forecastData">Temp: ${day.temp.day}</p>
                        <p class="forecastData">Wind: ${day.wind_speed}</p>
                        <p class="forecastData">Humidity: ${day.humidity}</p>`;

    div.innerHTML = forecastData;
    container.appendChild(div);
  }
};
