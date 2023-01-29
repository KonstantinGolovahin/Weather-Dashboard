// API key, can't be really hidden on Github pages
let keyAPI = "652bfd44571ae6c9a278b53d5d538b0d"
//openweathermap URL
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Daugavpils,Latvia&appid=" + keyAPI;
//let queryWeatherURL = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
let queryWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&"
let queryParams1 = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
 queryParams1.lat ;
 queryParams1.lon ;

// amount of timestamps received. Fixed value at this point
let queryCnt = 40;


let queryCityURL ="http://api.openweathermap.org/geo/1.0/direct?limit=1&"
// create query parameters (generate URL with parameters below)
//API key as it is
let queryParams = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
// city (equivalent to &q=CityName)
queryParams.q ;
//console.log("enot"+enot1 + $.param(queryParams));

// idea from https://stackoverflow.com/questions/17216438/chain-multiple-then-in-jquery-when
 function request(){
  $.ajax({
    url: queryCityURL+$.param(queryParams),
    method: "GET"
    

  }).then(function(response){

    // console.log(response[0].name)
   /// console.log(response[0].lat)
   // console.log(response[0].lon)
   
    queryParams1.lat = response[0].lat;
    queryParams1.lon= response[0].lon;
     return $.ajax({

        url: queryWeatherURL+$.param(queryParams1),
        method: "GET"

    });

   
}).then(function(response1){
  
    //return $.ajax({...});
    console.log(response1)
   // console.log(response1.list[0].weather[0].icon)

   // generate data for the closest timestamp
    let iconcode = response1.list[0].weather[0].icon;
    let tempToday= response1.list[0].main.temp
    let windToday= response1.list[0].wind.speed
    let humidityToday= response1.list[0].main.humidity
// display data for for the closest timestamp
    console.log(tempToday)
    $('#icon-weather-today').text(queryParams.q + " (" +moment().format("DD/MM/YYYY") +") ");
    $('#temp-today').text("Temperature: "+tempToday+ " ℃");
    $('#wind-today').text("Wind: "+windToday+ " KPH");
    $('#humidity-today').text("Humidity: "+humidityToday+ " %");
    var iconurl = "http://openweathermap.org/img/wn/" + iconcode + ".png";
    //var iconurl = "http://openweathermap.org/img/wn/10d@2x.png"
    $('#wicon').attr('src', iconurl);


// next 5 days
// loop for data after each 8 timestamps - 1 day (max=40 by API). 
for (i=7;i<queryCnt;i=i+8) {
  let iconcodeTemp = response1.list[i].weather[0].icon;
  let tempTemp= response1.list[i].main.temp
  let windTemp= response1.list[i].wind.speed
  let humidityTemp= response1.list[i].main.humidity
  console.log(response1.list[i].dt_txt + tempTemp +windTemp+  humidityTemp)


// dynamically create a set of bootstrap cards for a list of array elements
let cardContainer;
cardContainer = document.getElementById('forecast');

    //card itself
    let card = document.createElement('div');
    card.className = 'card ';
    // card body
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    // Date
    let taskDate = document.createElement('p');
    taskDate.innerText = moment(response1.list[i].dt_txt).format("DD/MM/YYYY");
    taskDate.className = 'taskDate';
    // Icon
    let taskImg = document.createElement('img');
    let taskURL =  "http://openweathermap.org/img/wn/" + iconcodeTemp + ".png";
    $(taskImg).attr('src', taskURL);
    taskImg.className = 'taskIMG';

// Temperature
let taskTemperature = document.createElement('p');
taskTemperature.innerText = "Temperature: "+tempTemp+ " ℃";
taskTemperature.className = 'taskText';

// Wind
let taskWind = document.createElement('p');
taskWind.innerText = "Wind: "+windTemp+ " KPH";
taskWind.className = 'taskText';

// Humidity
let taskHumidity = document.createElement('p');
taskHumidity.innerText = "Humidity: "+humidityTemp+ " %";
taskHumidity.className = 'taskText';

    // save button
    //let taskButton = document.createElement('button');
    //taskButton.innerText = "Save";
    //taskButton.className = 'col-1  taskButton';

    // set card body element order
    cardBody.appendChild(taskDate);
    cardBody.appendChild(taskImg);
    cardBody.appendChild(taskTemperature);
    cardBody.appendChild(taskWind);
    cardBody.appendChild(taskHumidity);
   
    // set a card body inside a card
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
  
} 



});
 } 

// start search button
$('.search-button').on('click', function (e) {
  e.preventDefault();
  // no need for other checks as there is a default London value
  queryParams.q = $("#search-input")
  .val()
  .trim();
  if (queryParams.q===""){
    alert("Please enter city name")
  }
  else{
    //console.log(queryParams.q)
    request()
  }

});