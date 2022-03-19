var list = document.querySelector("ul");
var buttonClick = document.getElementById("search-btn");
var lat;
var long;
var cityName;
var pastSearches = [];

// if (localStorage.getItem("searchHistory")) {
//   var parsedStorage = JSON.parse(localStorage.getItem("searchHistory"));
//   console.log(parsedStorage);
// for (var i = parsedStorage.length - 1; i <= 0; i--) {
// var previousCity = document.createElement("li");
// previousCity.innerText = parsedStorage[i];
// document.getElementById("city-list").appendChild(previousCity);
// console.log(parsedStorage[i]);
// }
// }

const updateUIHistory = (name) => {
  //check pastSearches array and make sure that cityName is not in the array before pushing
  //if index of name < 0 then you want to push
  //empty pastHistory html container
  //forEach on pastHistory array
  //create div for each item with unique id
  //attach to pastHistory
  //add eventhandler if any of the divs are clicked, it will extract name from that div and use that name to call method that gets the lat/long and it will call weather info
  pastSearches.push(cityName);
};

function getCoordinates() {
  var cityInput = document.getElementById("city-search").value;
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
      if (pastSearches.length >= 5) {
        pastSearches.shift();
      }

      // pastSearches.push(cityName);
      // localStorage.setItem("searchHistory", JSON.stringify(pastSearches));
      updateUIHistory(cityName);
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
      console.log(data);
      currentWeatherCard(data);
    });
}

function currentWeatherCard(data) {
  var dateToday = new Date().toDateString();
  console.log(dateToday);

  document.getElementById("current-city").innerText =
    "Conditions for " + cityName + " on " + dateToday;

  if (data.current.temp < 50) {
    document.getElementById(
      "weather-icon"
    ).innerHTML = `<img src = "./assets/images/cold.png">`;
  }
  if (data.current.temp > 50) {
    document.getElementById(
      "weather-icon"
    ).innerHTML = `<img src = "./assets/images/warm.png">`;
  }

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
  if (data.current.uvi > 4 && data.current.avi < 8) {
    document.getElementById(
      "uv-icon"
    ).innerHTML = `<img src = "./assets/images/yellow.png" alt="mild">`;
  }
  if (data.current.avi >= 8) {
    document.getElementById(
      "uv-icon"
    ).innerHTML = `<img src = "./assets/images/red.png" alt="severe">`;
  }

  forecastWeatherCard(data);
}

const forecastWeatherCard = (data) => {
  let container = document.getElementById("forecast");
  container.innerHTML = "";
  data.daily.forEach((day, index) => {
    if (index < 5) {
      // var timeMillisecond = `${day.dt}` * 1000;
      // var dateObject = new Date(timeMillisecond);
      // dateString = JSON.stringify(dateObject);
      // console.log(dateString);

      let div = document.createElement("div");

      div.id = `day${index + 1}`;
      div.classList.add("forecastCard");

      let forecastData = `<p class="forecastData">${day.dt}</p>
                          <p class="temperatureIcon"></p>
                          <p class="forecastData">Temp: ${day.temp.day}</p> 
                          <p class="forecastData">Wind: ${day.wind_speed}</p> 
                          <p class="forecastData">Humidity: ${day.humidity}</p>`;

      if (`${day.temp.day}` < 50) {
        // document.getElementsByClassName(
        //   "temperatureIcon"
        // ).innerHTML = `<img src = "./assets/images/cold.png">`;
        console.log("cold");
      }
      if (`${day.temp.day}` > 50) {
        // document.getElementsByClassName(
        //   "temperatureIcon"
        // ).innerHTML = `<img src = "./assets/images/warm.png">`;
        console.log("warm");
      }

      div.innerHTML = forecastData;
      container.appendChild(div);
    }
  });
};
