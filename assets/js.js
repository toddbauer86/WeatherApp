var list = document.querySelector("ul");
var buttonClick = document.getElementById("search-btn");
var lat;
var long;

function getCoordinates() {
  var cityName = document.getElementById("city-search").value;
  // TODO: Insert the API url to get a list of your repos
  var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=593c0385215d05c9409439d0b1361f3e`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      long = data[0].lon;
      //   console.log(lat);
      //   console.log(long);
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
    });
}
