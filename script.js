const currentLocation = { long: "", lat: "", temp: 0, city: "" };
var locationPermission = false;
var foreCastDiv = document.getElementById("forecast_temp");
var daysList = [];
var favorites = [];
foreCastDiv.hidden = true;
GetGeoLocation();
LoadFavorites();

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
    CheckIfFavorite();
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

document.getElementById("add_favorite").addEventListener("click", function () {
  if (document.getElementById("current_zone_name").innerHTML != null) {
    favorites.push(document.getElementById("current_zone_name").innerHTML);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    LoadFavorites();
    CheckIfFavorite();
  }
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

        document.getElementById("iconImg").src = CreateWeatherIcon(
          obj.weather[0].icon
        ).src;
        document.getElementById("current_zone_name").innerHTML =
          currentLocation.city;
        CheckIfFavorite();
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
        console.log(obj);
        filterAndDisplayDays(obj);
      });
  } catch (error) {}
}

function filterAndDisplayDays(obj) {
  var todaysDate = new Date().getDay();

  var elementDay = new Date(obj.list[0].dt_txt).getDay();
  var dayWithAddedMinMax = null;
  var ElementsWithSameDate = [];

  for (i = 0; i < obj.list.length; i++) {
    var date = new Date(obj.list[i].dt_txt);
    hour = date.getHours();

    obj.list[i].main.temp = GetDayMaxMin(ElementsWithSameDate);

    if (date.getDay() != todaysDate) {
      if (elementDay == date.getDay() && i != obj.list.length - 1) {
        ElementsWithSameDate.push(obj.list[i]);
        dayWithAddedMinMax = obj.list[i];
      } else if (i == obj.list.length - 1) {
        ElementsWithSameDate.push(obj.list[i]);
        obj.list[i].main.temp = GetDayMaxMin(ElementsWithSameDate);
        dayWithAddedMinMax = obj.list[i];
        daysList.push(dayWithAddedMinMax);
      } else {
        daysList.push(dayWithAddedMinMax);
        dayWithAddedMinMax = obj.list[i];

        elementDay = date.getDay();
        ElementsWithSameDate = [];

        ElementsWithSameDate.push[obj.list[i]];
      }
    }
  }

  if (daysList.length > 0) {
    foreCastDiv.innerHTML = "";
    for (var i = 1; i <= 5; i++) {
      var day = daysList[i];
      var dayDiv = document.createElement("div");
      var h2temp = document.createElement("h4");
      var h3Date = document.createElement("h3");
      var icon = CreateWeatherIcon(day.weather[0].icon);

      dayDiv.className = "day_div";
      h2temp.innerHTML = day.main.temp;
      h3Date.innerHTML = new Date(day.dt_txt).toLocaleDateString();

      dayDiv.appendChild(h3Date);
      dayDiv.appendChild(icon);
      dayDiv.appendChild(h2temp);

      foreCastDiv.appendChild(dayDiv);
    }
  }
}

function CheckIfFavorite() {
  if (favorites.length < 1) {
    document.getElementById("favorite_star_div").innerHTML = "";
    document
      .getElementById("favorite_star_div")
      .appendChild(DrawFavoriteStar("-"));
    document.getElementById("add_favorite").innerHTML = "Add to favorites";
  } else {
    for (i = 0; i < favorites.length; i++) {
      console.log(favorites[i]);
      if (
        favorites[i] == document.getElementById("current_zone_name").innerHTML
      ) {
        document.getElementById("add_favorite").innerHTML = "";
        document.getElementById("favorite_star_div").innerHTML = "";
        document
          .getElementById("favorite_star_div")
          .appendChild(DrawFavoriteStar("favorite"));
        break;
      } else {
        document.getElementById("favorite_star_div").innerHTML = "";
        document
          .getElementById("favorite_star_div")
          .appendChild(DrawFavoriteStar("-"));
        document.getElementById("add_favorite").innerHTML = "Add to favorites";
      }
    }
  }
}

function LoadFavorites() {
  try {
    favorites = [];
    storedFavorites = null;
    var storedFavorites = JSON.parse(localStorage.getItem("favorites"));

    if (storedFavorites != null) {
      favorites = storedFavorites;
      InsertFavoritesDropdown();
    }
  } catch (error) {}
}

//<comment>
// Inserts all items from the faviorite array into the
// dropdown HTML element.
//</comment>
function InsertFavoritesDropdown() {
  var dropdown = document.getElementById("ddmenu");
  dropdown.innerText = "";
  favorites.forEach((element) => {
    var favorite = document.createElement("LI");
    var favoriteNode = document.createTextNode(element);
    favorite.className = "favorite_item";
    favorite.addEventListener("click", (event) => GoToFavorite(favoriteNode));
    favorite.appendChild(favoriteNode);

    dropdown.appendChild(favorite);
  });
}

function GoToFavorite(node) {
  document.getElementById("forecast_temp").innerHTML = "";
  foreCastDiv.hidden = true;
  var favoriteValue = node.nodeValue;

  var APIstring =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    favoriteValue +
    "&units=metric&appid=b5a6a4e37d967936d274f4adc367b506";

  SetCurrentLocation(APIstring);
}

//<comment>
// Checks all tempature data on a specific date and returns
// the max temp and min temp.
//</comment>
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

function DrawFavoriteStar(marked) {
  var canvas = document.createElement("canvas");
  canvas.width = 25;
  canvas.height = 25;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "yellow";
  ctx.moveTo(12, 0);
  ctx.lineTo(9, 9);
  ctx.lineTo(0, 11);
  ctx.lineTo(7, 15);
  ctx.lineTo(3, 25);
  ctx.lineTo(12, 19);
  ctx.lineTo(22, 25);
  ctx.lineTo(17, 15);
  ctx.lineTo(25, 11);
  ctx.lineTo(16, 9);
  ctx.lineTo(12, 0);
  ctx.stroke();
  if (marked == "favorite") {
    ctx.fill();
  }
  canvas.className = "favorite";
  return canvas;
}

function CreateWeatherIcon(iconCode) {
  var iconIMG = document.createElement("img");

  iconIMG.src = "https://openweathermap.org/img/wn/" + iconCode + "@4x.png";
  iconIMG.className = "weatherIcon";

  return iconIMG;
}
