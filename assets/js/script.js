// API key, can't be really hidden on Github pages
let keyAPI = "652bfd44571ae6c9a278b53d5d538b0d"
//openweathermap URL
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Daugavpils,Latvia&appid=" + keyAPI;
//let queryWeatherURL = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
let queryWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&"
let queryParams1 = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
queryParams1.lat;
queryParams1.lon;



let queryCityURL ="http://api.openweathermap.org/geo/1.0/direct?limit=1&"
// create query parameters (generate URL with parameters below)
//API key as it is
let queryParams = { "appid": "652bfd44571ae6c9a278b53d5d538b0d" };
// city (equivalent to &q=CityName)
queryParams.q = "Daugavpils"
//console.log("enot"+enot1 + $.param(queryParams));


/* 
$.ajax({
    
    url: queryCityURL+$.param(queryParams),
    method: "GET"
    // this required to return city coordinates before next APi call
    //async:false
  }).then(function(response) {
   // console.log(response)
   // console.log(response[0].name)
   // console.log(response[0].lat)
   // console.log(response[0].lon)
    




   
  
  });
 */

// idea from https://stackoverflow.com/questions/17216438/chain-multiple-then-in-jquery-when
 let request= $.ajax({
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

});
