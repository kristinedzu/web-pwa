// getting the location
for (const button of document.querySelectorAll("button[id]")) {
  button.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      var latitude = position.coords.latitude;
      var longtitude = position.coords.longitude;
      
      url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longtitude + "&localityLanguage=en";

      async function getLocation() {
        var data = await fetch(url);
        var location = await data.json();
        document.getElementById("geolocation").innerHTML = location.locality + ',' + ' ' + location.countryName;
      }
      getLocation();
    });
  });
}

// checking the connection status
if (navigator.onLine) {
  document.getElementById("network-status").innerHTML = "online";
}

window.addEventListener('offline', function(e) { 
  document.getElementById("network-status").innerHTML = "offline";
});

window.addEventListener('online', function(e) {
  document.getElementById("network-status").innerHTML = "online";
});



//copy to clipboard
var copyButton = document.getElementById("copy-to-clipboard");

copyButton.addEventListener("click", () => {
  var inputText = document.getElementById("text-content").value;

  navigator.clipboard.writeText(inputText).then(function() {
    console.log("clipboard successfully set");
  }, function() {
    console.log("clipboard write failed");
  });
});


// share to other platforms
var shareButton = document.getElementById("share");

shareButton.addEventListener('click', async () => {
  var shareData = {
    text: document.getElementById("text-content").value
  }
  try {
    await navigator.share(shareData)
    console.log('MDN shared successfully');
  } catch(err) {
    console.log(err);
  }
});

