const CurrentLoc = document.getElementById("demo");
alert(CurrentLoc);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        CurrentLoc.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    CurrentLoc.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}