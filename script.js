const currentLocation = { long: "", lat: "", temp: 0, city: "" };
var locationPermission = false;
var daysList = [];
GetGeoLocation();

document
  .getElementById("location_details")
  .addEventListener("click", function () {
    if (daysList.length < 1) {
      GetWeeklyForecast(document.getElementById("current_zone_name").innerHTML);
    } else {
      location.reload();
      daysList = [];
      GetGeoLocation();
    }
  });
document.getElementById("btn_search").addEventListener("click", function () {
  var searchString = document.getElementById("searchbar").value;

  var APIstring =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchString +
    "&units=metric&appid=b5a6a4e37d967936d274f4adc367b506";

  SetCurrentLocation(APIstring);
});

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
        console.log(obj);
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
  var date;
  var hour;

  obj.list.forEach((element) => {
    date = new Date(element.dt_txt);
    hour = date.getHours();

    if (hour == 12) {
      daysList.push(element);
    }
  });

  if (daysList.length > 0) {
    for (var i = 0; i <= 4; i++) {
      var day = daysList[i];
      var div = document.getElementById("location_details");

      var h2temp = document.createElement("h4");
      var h3Date = document.createElement("h3");
      h2temp.innerHTML = day.main.temp + "°C";
      h3Date.innerHTML = day.dt_txt;

      div.appendChild(h3Date);
      div.appendChild(h2temp);
    }
  }
}
