var config = {
  apiKey: "AIzaSyDK4nSK8EemwrjHiUpFH9KpTRaixDzYC6w",
  authDomain: "beatblocks-5d080.firebaseapp.com",
  databaseURL: "https://beatblocks-5d080.firebaseio.com",
  projectId: "beatblocks-5d080",
  storageBucket: "beatblocks-5d080.appspot.com",
  messagingSenderId: "685231677796"
};

// Initialize your Firebase app
firebase.initializeApp(config);

// Reference to the recommendations object in your Firebase database
var songs = firebase.database().ref("songs");
var locations = firebase.database().ref("locations");

// File to upload
var selectedFile;

// Image to upload
var selectedFileImage;

// Google maps vars

var infoPanel;
var map;
var marker;

function geocode_result_handler(result, status) {
  if (status != google.maps.GeocoderStatus.OK) {
    alert('Geocoding failed. ' + status);
  } else {
    map.fitBounds(result[0].geometry.viewport);
    infoPanel.innerHTML += '<p>1st result for geocoding is <em>' +
      result[0].geometry.location_type.toLowerCase() +
      '</em> to <em>' +
      result[0].formatted_address + '</em> of types <em>' +
      result[0].types.join('</em>, <em>').replace(/_/, ' ') +
      '</em> at <tt>' + result[0].geometry.location +
      '</tt></p>';
    var marker_title = result[0].formatted_address +
      ' at ' + latlng;
    if (marker) {
      marker.setPosition(result[0].geometry.location);
      marker.setTitle(marker_title);
    } else {
      marker = new google.maps.Marker({
        position: result[0].geometry.location,
        title: marker_title,
        map: map
      });
    }
  }
}

function geocode_address() {
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('input-text').value;
  infoPanel.innerHTML = '<p>Original address: ' + address + '</p>';
  geocoder.geocode({ 'address': address }, geocode_result_handler);
}

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(31.970039, 34.773404),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  google.maps.event.addListener(map, 'click', function(event) {
    placeFirstMarker(event.latLng);
    google.maps.event.clearListeners(map, 'click')
    google.maps.event.addListener(map, 'click', function(event) {
      placeSecondMarker(event.latLng);
      google.maps.event.clearListeners(map, 'click')
    });
  });
}

// TODO: NEED TO SET THE LAT LON AGAIN IF DRAGGED
function placeFirstMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    label: "Start",
    title: "Drag me!"
  });
  document.getElementById('startLatitude').value = location.lat()
  document.getElementById('startLongitude').value = location.lng()
  marker.addListener('dragend', function(event) {
    location = event.latLng
    document.getElementById('startLatitude').value = location.lat()
    document.getElementById('startLongitude').value = location.lng()
  });
  //map.setCenter(location);
}

function placeSecondMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    label: "End",
    title: "Drag me!"
  });
  document.getElementById('endLatitude').value = location.lat()
  document.getElementById('endLongitude').value = location.lng()
  marker.addListener('dragend', function(event) {
    location = event.latLng
    document.getElementById('endLatitude').value = location.lat()
    document.getElementById('endLongitude').value = location.lng()
  });
  //map.setCenter(location);
}

// Save a new recommendation to the database, using the input in the form
var submitRecommendation = function() {

  // Get input values from each of the form elements
  var name = $("#Name").val();
  var artistId = $("#artistId").val();
  var startLatitude = $("#startLatitude").val();
  var startLongitude = $("#startLongitude").val();
  var endLatitude = $("#endLatitude").val();
  var endLongitude = $("#endLongitude").val();
  var length = $("#length").val();
  var songImage = $("#songImage").val();
  var album = $("#album").val();
  var numOfListens = Math.floor(Math.random()*1000)+1;// returns a number between 1 and 1000
  localStorage.setItem("image", songImage);

  // Push a new recommendation to the database using those values
  const key = songs.push({
    "name": name,
    "artistId": artistId,
    "length": length.toString(),
    "album": album,
    "songImage": songImage,
    "sid": "",
    "lastUpdate": "",
    //"url": "",
    "listens": numOfListens.toString()
  }).key

  var d = new Date();
  var lastUpdate = d.getTime();

  songs.child(key).update({
    "sid": key,
    "lastUpdate": lastUpdate
  })
  localStorage.setItem("sid", key);

  var songKey = locations.child(key);

  songKey.set({
    "startLatitude": startLatitude,
    "startLongitude": startLongitude,
    "endLatitude": endLatitude,
    "endLongitude": endLongitude,
    "sid": key,
    "lastUpdate": lastUpdate
  })

  window.alert("Now you can upload the song!");
};


// When the window is fully loaded, call this function.
// Note: because we are attaching an event listener to a particular HTML element
// in this function, we can't do that until the HTML element in question has
// been loaded. Otherwise, we're attaching our listener to nothing, and no code
// will run when the submit button is clicked.
$(window).load(function() {
  // Find the HTML element with the id recommendationForm, and when the submit
  // event is triggered on that element, call submitRecommendation.
  $("#recommendationForm").submit(submitRecommendation);
  $("#file").on("change", function(event) {
    selectedFile = event.target.files[0];
  })
  $("#image").on("change", function(event) {
    selectedFileImage = event.target.files[0];
  })
});


var addlocation = function() {
  var count = 1;
  var path = "";
  var songKey = $("#songKey").val();
  var startLatitude = $("#startLatitude2").val();
  var startLongitude = $("#startLongitude2").val();
  var endLatitude = $("#endLatitude2").val();
  var endLongitude = $("#endLongitude2").val();
  window.alert(songKey);

  var songlocation = locations.child(songKey);

  songlocation.once("value").then(function(snapshot) {
    window.alert('Count: ' + snapshot.numChildren());
    count = snapshot.numChildren() + 1;
  }).then(function() {
    path = "path" + count;
    window.alert(path);
  }).then(function() {
    songlocation.child(path).set({
      "startLatitude": startLatitude,
      "startLongitude": startLongitude,
      "endLatitude": endLatitude,
      "endLongitude": endLongitude
    })
  })
};

$(window).load(function() {

  $("#addlocation").submit(addlocation);

});

function uploadSongToFirebase() {
  const songKey = localStorage.getItem("sid")
  const storage = firebase.storage().ref();
  const name = songKey + ".mp3";
  const jpgName = songKey + ".jpg";
  const metadata = {
    contentType: selectedFile.type
  };
  console.log(name);
  const task = storage.child(name).put(selectedFile);
  task.then((snapshot) => {
    //console.log("uploaded song!");
    //const url = snapshot.downloadURL;
    alert("The file was uploaded successfully!");
    //songs.child(songKey).update({
    //  "url": url
    //})
  }).catch((error) => {
    console.error(error);
  });
  const task2 = storage.child('SongImages/'+jpgName).put(selectedFileImage);
  task2.then((snapshot) => {
    //console.log("uploaded song!");
    const url = snapshot.downloadURL;
    alert("The song's image was uploaded successfully!");
    songs.child(songKey).update({
      "songImage": url
    })
  }).catch((error) => {
    console.error(error);
  });
}

function getCoor() {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    "address": inputAddress
  }, function(results) {
    console.log(results[0].geometry.location); //LatLng
  });
}
