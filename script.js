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
      div = document.getElementById("forecast_temp").innerHTML = "";
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
  div = document.getElementById("forecast_temp").innerHTML = "";
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
  // console.log(obj);
  var date;
  var hour;
  var elementDay = new Date(obj.list[0].dt_txt).getDay();
  var ElementsWithSameDay = [];

  var div = document.getElementById("forecast_temp");

  obj.list.forEach((element) => {
    date = new Date(element.dt_txt);
    hour = date.getHours();

    if (elementDay == date.getDay()) {
      ElementsWithSameDay.push(element);
    } else {
      CreateDayWithHighLow(ElementsWithSameDay);

      elementDay = date.getDay();
      ElementsWithSameDay = [];
      ElementsWithSameDay.push[element];
    }

    if (hour == 09) {
      daysList.push(element);
    }
  });

  if (daysList.length > 0) {
    for (var i = 0; i <= 4; i++) {
      var day = daysList[i];

      var h2temp = document.createElement("h4");
      var h3Date = document.createElement("h3");
      h2temp.innerHTML = day.main.temp + "°C";
      h3Date.innerHTML = day.dt_txt;

      div.appendChild(h3Date);
      div.appendChild(h2temp);
    }
  }
}

function CreateDayWithHighLow(ElementsWithSameDay) {
  let high = 0;
  let low = 500;

  for (i = 0; i < ElementsWithSameDay.length; i++) {
    if (parseFloat(ElementsWithSameDay[i].main.temp_max) > high) {
      high = parseFloat(ElementsWithSameDay[i].main.temp_max);
    }
    if (parseFloat(ElementsWithSameDay[i].main.temp_min) < low) {
      low = parseFloat(ElementsWithSameDay[i].main.temp_min);
    }
  }

  // skapa objekt för att lägga till i prognos.

  console.log(ElementsWithSameDay);
  console.log(high);
  console.log(low);
}
