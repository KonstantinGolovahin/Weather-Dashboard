// API key, can't be really hidden on Github pages

let queryWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&"
let queryCoordParams = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
// city latitude and longitude
queryCoordParams.lat;
queryCoordParams.lon;

// amount of timestamps received. Fixed value at this point
let queryCnt = 40;

// get city coordinates by name
let queryCityURL = "https://api.openweathermap.org/geo/1.0/direct?limit=1&"
// create query parameters (generate URL with parameters below)
//API key as it is
let queryCityParams = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
// city to search for
queryCityParams.q;
// Replace incorect city name
let defaultCity = "London";

// new array for values from a local storage
let taskSaved = [];
taskSaved = getTasks(taskSaved);

////////////////// functions /////////////

// idea from https://stackoverflow.com/questions/17216438/chain-multiple-then-in-jquery-when
function request() {
  // first request to get city coordinates for the second query
  $.ajax({
    url: queryCityURL + $.param(queryCityParams),
    method: "GET"

    // after receiving details
  }).then(function (responseCity) {

    // in case there is no city data returned, search for London, warn user
    if (responseCity.length === 0) {
      queryCoordParams.lat = 56.9494;
      queryCoordParams.lon = 24.1052;
      alert("Incorrect city. Please check spelling and try again. Data for London will be displayed")
      queryCityParams.q = defaultCity;
    }

    else {

      queryCoordParams.lat = responseCity[0].lat;
      queryCoordParams.lon = responseCity[0].lon;
    }

    // second request to receive required data
    return $.ajax({

      url: queryWeatherURL + $.param(queryCoordParams),
      method: "GET"

    });

    // after all data received
  }).then(function (responseCoord) {
    // One loop for today and next 5 days does not seem a correct decision as result can't be split in exactly 6 parts

    // generate data for the closest timestamp
    let iconcode = responseCoord.list[0].weather[0].icon;
    let tempToday = responseCoord.list[0].main.temp
    let windToday = responseCoord.list[0].wind.speed
    let humidityToday = responseCoord.list[0].main.humidity
    // display data for for the closest timestamp

    $('#icon-weather-today').text(queryCityParams.q + " (" + moment().format("DD/MM/YYYY") + ") ");
    $('#temp-today').text("Temperature: " + tempToday + " ℃");
    $('#wind-today').text("Wind: " + windToday + " KPH");
    $('#humidity-today').text("Humidity: " + humidityToday + " %");
    let iconurl = "http://openweathermap.org/img/wn/" + iconcode + ".png";
    $('#wicon').attr('src', iconurl);

    // clear prevoius
    $("#forecast").empty()
    // next 5 days
    // loop for data after each 8 timestamps = 1 day (max=40 by API). 
    for (i = 7; i < queryCnt; i = i + 8) {
      let iconcodeTemp = responseCoord.list[i].weather[0].icon;
      let tempTemp = responseCoord.list[i].main.temp
      let windTemp = responseCoord.list[i].wind.speed
      let humidityTemp = responseCoord.list[i].main.humidity

      // dynamically create a set of bootstrap cards for a list of array elements
      let cardContainer;
      cardContainer = $("#forecast");

      //card itself
      let card = $("<div>");
      $(card).attr("class", "card card-forecast");
      // card body
      let cardBody = $("<div>");
      $(cardBody).attr("class","card-body" );
      // Date
      let taskDate = $("<p>");
      $(taskDate).text(moment(responseCoord.list[i].dt_txt).format("DD/MM/YYYY"));
      $(taskDate).attr("class","taskDate");
      // Icon
      let taskImg = $("<img>");
      let taskURL = "http://openweathermap.org/img/wn/" + iconcodeTemp + ".png";
      $(taskImg).attr("src", taskURL);
      $(taskImg).attr("class","taskIMG");

      // Temperature
      let taskTemperature = $("<p>");
      $(taskTemperature).text("Temperature: " + tempTemp + " ℃");
      $(taskTemperature).attr("class", "taskText");

      // Wind
      let taskWind = $("<p>");
      $(taskWind).text("Wind: " + windTemp + " KPH");
      $(taskWind).attr("class","taskText");

      // Humidity
      let taskHumidity = $("<p>");
      $(taskHumidity).text("Humidity: " + humidityTemp + " %");
      $(taskHumidity).attr("class","taskText");

      // set card body element order
      $(cardBody).append(taskDate);
      $(cardBody).append(taskImg);
      $(cardBody).append(taskTemperature);
      $(cardBody).append(taskWind);
      $(cardBody).append(taskHumidity);

      // set a card body inside a card
      $(card).append(cardBody);
      $(cardContainer).append(card);

    }

  });
}

// retrieve saved values from local storage if any exists
function getTasks(arr) {
  if (localStorage.getItem("taskObject") === null) {
    arr = [];
  } else {
    arr = JSON.parse(localStorage.getItem("taskObject"));
  }
  return arr;
}

// render buttons for history
function renderButtons() {

  // clear prevoius entries
  $("#history").empty()
  getTasks(taskSaved)

  if (taskSaved.length > 0) {
    for (i = 0; i < taskSaved.length; i++) {
      // add button for each city
      let taskButton = document.createElement('button');
      $(taskButton).text(taskSaved[i].city);
      $(taskButton).attr("class","taskButton");
      $("#history").append(taskButton);
    }
  }

  // create clear history button
  let clearHistoryButton = document.createElement('button');
  $(clearHistoryButton).text("Clear history");
  $(clearHistoryButton).attr("class","clearHistoryButton");
  $("#history").append(clearHistoryButton);

}


//////////////////// buttons ////////////////
// start search button
$(".search-button").on('click', function (e) {
  e.preventDefault();
  // get user input
  queryCityParams.q = $("#search-input")
    .val()
    .trim();
  if (queryCityParams.q === "") {
    alert("Please enter city name")
  }

  else {

    // get updated list of tasks from storage 
    taskObject = getTasks(taskSaved);
    let userSave = {

      city: queryCityParams.q,

    }
    // add new value to array
    taskObject.push(userSave);
    // save to local storage
    localStorage.setItem("taskObject", JSON.stringify(taskObject));
    // add this city to search history
    taskSaved = taskObject;
    renderButtons()
    // execute request for current city
    request()

  }

});

// call forecast for saved city
$("#history").on("click", function (e) {

  if ($(e.target).text() === "Clear history") {
    $("#history").empty()
    localStorage.clear()
  }
  else {
    queryCityParams.q = $(e.target).text();
    request();
  }
})

// start rendering on load
renderButtons()
