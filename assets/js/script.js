// API key, can't be really hidden on Github pages
let keyAPI = "652bfd44571ae6c9a278b53d5d538b0d"
//openweathermap URL
let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Daugavpils,Latvia&appid=" + keyAPI;
//let queryWeatherURL = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
let queryWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?"
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

});