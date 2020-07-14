// 92b8d2f944302fe08320a81c80bff075

$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var searchInput = $("#search-value").val();
    $("#search-value").val("");

    weatherSearch(searchInput);
  });

  $(".cities").on("click", "li", function () {
    weatherSearch($(this).text());
  });

  function makeRow(text) {
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

          makeRow(searchInput);
        }


        $("#today").empty();

        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + Math.round(((data.main.temp)-273.15) * (9/5) + 32) + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);


        fiveDayForecast(searchInput);
        uvIndex(data.coord.lat, data.coord.lon);
      }
    });
  }

  function fiveDayForecast(searchInput) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=92b8d2f944302fe08320a81c80bff075",
      dataType: "json",
      success: function (data) {

        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");


        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            var p1 = $("<p>").addClass("card-text").text("Temp: " + Math.round(((data.list[i].main.temp_max)-273.15) * (9/5) + 32) + " °F");
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");


            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }

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

        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  var cities = JSON.parse(window.localStorage.getItem("cities")) || [];

  if (cities.length > 0) {
    weatherSearch(cities[cities.length - 1]);
  }

  for (var i = 0; i < cities.length; i++) {
    makeRow(cities[i]);
  }
});
