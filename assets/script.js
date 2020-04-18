// Declare Variables
var searchBtn = $('#search-btn');
var cityList = $('#city-list');
var cityTitle = $('#city-title'); 
var tempDisplay = $('#temperature');
var humidityDisplay = $('#humidity'); 
var windDisplay = $('#wind-speed');
var uvDisplay = $('#uv-index'); 
var cityInput = '';


var currentDate = new Date(); 
var today = currentDate.getDate();
var day = currentDate.getDay(); 
var month = currentDate.getMonth(); 
var year = currentDate.getFullYear(); 



    var APIKey = "02d888ba45e0cc8be097f82b4ce2058d"; 


//    searchBtn.click(function(){
       cityInput = $('#city-input').val().trim().toLowerCase(); 
       console.log(cityInput)

       
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + "chicago"  + "&appid=" + APIKey;
          $.ajax({
        url: weatherURL,
        method: "GET"
      }).then(function(response) {
       var lat = response.coord.lat; 
        var lon = response.coord.lon; 
        // Create CODE HERE to Log the weatherURL
        console.log(weatherURL); 
        // Create CODE HERE to log the resulting object
        console.log(response); 
        // Create CODE HERE to calculate the temperature (converted from Kelvin)
        var Kelvin = parseInt(response.main.temp); 
        var Fahrenheit = (Kelvin-273.15)*(9/5) + 32; 
        Fahrenheit = Math.round(Fahrenheit); 
        console.log(Fahrenheit); 
        
        cityTitle.text(response.name + " " + (month + 1) + "/" + today + "/" + year);
        tempDisplay.text(Fahrenheit + "°F");
        humidityDisplay.text(response.main.humidity + "%");
        windDisplay.text(response.wind.speed + ' MPH'); 
        
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
          $.ajax({
        url: uvURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        var uvIndex = $('#uv-badge');
       
        if (response.value <= 5) {
            uvIndex.attr('class', 'badge-success');
        } else if (response.value >= 5.01 && response.value < 8.00){
            uvIndex.attr('class', 'badge-warning');
        } else {
            uvIndex.attr('class', 'badge-danger');
        } 
        uvIndex.text(response.value); 
  
      });
      });
      
      

//    })
 