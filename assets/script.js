// 92b8d2f944302fe08320a81c80bff075

$(document).ready(function () {
  //button to search api on click
  $("#search-btn").on("click", function () {
    var searchInput = $("#search-input").val();
    $("#search-input").val("");
    weatherSearch(searchInput);
  });

  $(".cities").on("click", "li", function () {
    weatherSearch($(this).text());
  });
  function Row(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".cities").append(li);
  }
  function weatherSearch(searchInput) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=92b8d2f944302fe08320a81c80bff075",
      dataType: "json",
      success: function (data) {
        if (cities.indexOf(searchInput) === -1) {
          cities.push(searchInput);
          window.localStorage.setItem("cities", JSON.stringify(cities));
          Row(searchInput);
        }
        //empty remaining content
        $("#current-day").empty();

        // html elements
        var title = $("<h2 style='font-style:italic;'>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.round(((data.main.temp) - 273.15) * (9 / 5) + 32) + " °F");
        var cardContent = $("<div>").addClass("card-body");
        // append elements 
        cardContent.append(title, temp, humid, wind);
        card.append(cardContent);
        $("#current-day").append(card);
        fiveDayForecast(searchInput);
        uvIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  //get UV Index
  function uvIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=92b8d2f944302fe08320a81c80bff075&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        if (data.value < 3) {
          btn.addClass("btn-success");
        }
        else if (data.value < 7) {
          btn.addClass("btn-warning");
        }
        else {
          btn.addClass("btn-danger");
        }
        $("#current-day .card-body").append(uv.append(btn));
      }
    });
  }
  var cities = JSON.parse(window.localStorage.getItem("cities")) || [];

  if (cities.length > 0) {
    weatherSearch(cities[cities.length - 1]);
  }
  for (var i = 0; i < cities.length; i++) {
    Row(cities[i]);
  }
});
// get 5 day forecast
function fiveDayForecast(searchInput) {
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=92b8d2f944302fe08320a81c80bff075",
    dataType: "json",
    success: function (data) {

      $("#fiveDayForecast").html("<p class=\"mt-3\">5-Day Forecast:</p>").append("<div class=\"row\">");
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          //html elements
          var col = $("<div>").addClass("col-md-2");
          var card = $("<div>").addClass("card bg-info text-white");
          var body = $("<div>").addClass("card-body p-2");
          var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
          var pOne = $("<p>").addClass("card-text").text("Temp: " + Math.round(((data.list[i].main.temp_max) - 273.15) * (9 / 5) + 32) + " °F");
          var pTwo = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
          //append elements
          col.append(card.append(body.append(title, pOne, pTwo)));
          $("#fiveDayForecast .row").append(col);
        }
      }
    }
  });
}
