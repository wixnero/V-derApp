
const currentLocation = {long:"", lat:"", temp:0, city:""};
GetGeoLocation();
function GetGeoLocation()
{
    navigator.geolocation.getCurrentPosition(setLongLangAPI)
}

function setLongLangAPI(pos)
{

    currentLocation.long = pos.coords.longitude;
    currentLocation.lat = pos.coords.latitude;
    console.log(currentLocation.long);
    console.log(currentLocation.lat);
    var APIstring = 'https://api.openweathermap.org/data/2.5/weather?lat='+ currentLocation.lat +'&lon='+ currentLocation.long +'&units=metric&appid=b5a6a4e37d967936d274f4adc367b506';

    SetCurrentLocation(APIstring);
}

function SetCurrentLocation(APIstring)
{
    console.log(APIstring);
    try {
        fetch(APIstring)
       .then(function(response){
        return response.json();
         })
        .then(function(obj){
        currentLocation.city = obj.name;
        currentLocation.temp = obj.main.feels_like;
        document.getElementById("current_temp").innerHTML = currentLocation.temp + "°C";
        document.getElementById("current_zone_name").innerHTML = currentLocation.city;
        console.log(obj.main.feels_like);
    });      
    } catch (error) {
        console.log(error);
    }
    
}


        

