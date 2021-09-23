const currentLocation = { long: "", lat: "", temp: 0, city: "" };
var locationPermission = false;
var foreCastDiv = document.getElementById("forecast_temp");
var daysList = [];
var favorites = [];
foreCastDiv.hidden = true;
GetGeoLocation();

//<comment>
// Opends/close the location div and calls function
// to get a five day forecast.
//</comment>
document
  .getElementById("location_details")
  .addEventListener("click", function () {
    if (foreCastDiv.hidden == true) {
      GetWeeklyForecast(document.getElementById("current_zone_name").innerHTML);

      foreCastDiv.hidden = false;
      daysList = [];
      GetGeoLocation();
    } else {
      foreCastDiv.hidden = true;
    }
  });

//<comment>
// Gets the user input and calls API with entered location.
//</comment>
document.getElementById("btn_search").addEventListener("click", function () {
  document.getElementById("forecast_temp").innerHTML = "";
  foreCastDiv.hidden = true;
  var searchString = document.getElementById("searchbar").value;

  var APIstring =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchString +
    "&units=metric&appid=b5a6a4e37d967936d274f4adc367b506";

  SetCurrentLocation(APIstring);
});

document
  .getElementById("add_favorite")
  .addEventListener("click", function () {});

function GetGeoLocation() {
  if (locationPermission == false) {
    navigator.geolocation.getCurrentPosition(setLongLangAPI);
    locationPermission = true;
  }
}

function setLongLangAPI(pos) {
  currentLocation.long = pos.coords.longitude;
  currentLocation.lat = pos.coords.latitude;

  var APIstring =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    currentLocation.lat +
    "&lon=" +
    currentLocation.long +
    "&units=metric&appid=b5a6a4e37d967936d274f4adc367b506";

  SetCurrentLocation(APIstring);
}

function SetCurrentLocation(APIstring) {
  try {
    fetch(APIstring)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (obj) {
        currentLocation.city = obj.name;
        currentLocation.temp = obj.main.temp;
        document.getElementById("current_temp").innerHTML =
          currentLocation.temp + "°C";
        document.getElementById("current_zone_name").innerHTML =
          currentLocation.city;
      });
  } catch (error) {}
}

function GetWeeklyForecast(location) {
  try {
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
        location +
        "&units=metric&appid=b5a6a4e37d967936d274f4adc367b506"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (obj) {
        filterAndDisplayDays(obj);
      });
  } catch (error) {}
}

function filterAndDisplayDays(obj) {
  console.log(obj);
  var date;
  var hour;
  var elementDay = new Date(obj.list[3].dt_txt).getDay();
  var dayWithAddedMinMax = null;
  var ElementsWithSameDate = [];

  //console.log(obj.list.length);
  for (i = 3; i < obj.list.length; i++) {
    date = new Date(obj.list[i].dt_txt);
    //console.log(elementDay);
    hour = date.getHours();

    obj.list[i].main.temp = GetDayMaxMin(ElementsWithSameDate);

    if (elementDay == date.getDay() && i != obj.list.length - 1) {
      ElementsWithSameDate.push(obj.list[i]);
      dayWithAddedMinMax = obj.list[i];
    } else if (i == obj.list.length - 1) {
      ElementsWithSameDate.push(obj.list[i]);
      obj.list[i].main.temp = GetDayMaxMin(ElementsWithSameDate);
      dayWithAddedMinMax = obj.list[i];
      daysList.push(dayWithAddedMinMax);
      continue;
    } else {
      daysList.push(dayWithAddedMinMax);
      dayWithAddedMinMax = obj.list[i];

      elementDay = date.getDay();
      ElementsWithSameDate = [];

      ElementsWithSameDate.push[obj.list[i]];
    }
  }

  if (daysList.length > 0) {
    foreCastDiv.innerHTML = "";
    for (var i = 0; i <= 4; i++) {
      var day = daysList[i];

      var h2temp = document.createElement("h4");
      var h3Date = document.createElement("h3");
      h2temp.innerHTML = day.main.temp;
      h3Date.innerHTML = new Date(day.dt_txt).getUTCDate();

      foreCastDiv.appendChild(h3Date);
      foreCastDiv.appendChild(h2temp);
    }
  }
}

function GetDayMaxMin(ElementsWithSameDay) {
  let max = 0;
  let min = 500;

  for (i = 0; i < ElementsWithSameDay.length; i++) {
    if (parseFloat(ElementsWithSameDay[i].main.temp_max) > max) {
      max = parseFloat(ElementsWithSameDay[i].main.temp_max);
    }
    if (parseFloat(ElementsWithSameDay[i].main.temp_min) < min) {
      min = parseFloat(ElementsWithSameDay[i].main.temp_min);
    }
  }

  return "Max: " + max + "°C" + " - Min: " + min + "°C";
}
