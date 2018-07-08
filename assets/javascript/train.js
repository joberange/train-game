// Linking to firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGjcw7xvzKvTAXSlIz8Wav11OffqPHWgo",
    authDomain: "train-game-57a6e.firebaseapp.com",
    databaseURL: "https://train-game-57a6e.firebaseio.com",
    projectId: "train-game-57a6e",
    storageBucket: "",
    messagingSenderId: "584142133419"
  };
  firebase.initializeApp(config);

var database = firebase.database();
// Need time to "get" at current and interval per second
function clock() {
    $("#currentTime").text(moment().format("D MMM HH:mm:ss"));
}
setInterval(clock, 1000);

// Variables needed for train interval functions and for adding new trains, inputting train name, destination, frequency 
var now = moment().format("HH:mm");
var tName = "";
var destination = "";
var firstTrain = "";
var freq = 0;
var timeDiff;
var minsToNextTrain;
var nextTrainTime;
var formattedNextTrainTime;

// Button click to capture values for train
$("#submit").on("click", function (event) {
    event.preventDefault();

    tName = $("#trainInput").val().trim();
    destination = $("#destinationInput").val().trim();
    firstTrain = $("#firstTrainInput").val().trim();
    freq = $("#frequencyInput").val().trim();

    // Calculate minutes until next train   
    var convertedTime = moment(firstTrain, "HH:mm")

    timeDiff = moment().diff(moment(convertedTime), "minutes");
    timeRemainder = timeDiff % freq;

    // Convert time unitl next train into minutes
    minsToNextTrain = freq - timeRemainder;

    // Calculate time until next train comes
    nextTrainTime = moment().add(minsToNextTrain, "minutes");
    formattedNextTrainTime = moment(nextTrainTime).format("hh:mm A");

    // Code to push values into firebase

    database.ref().push({
        name: tName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq,
        nextTrainMins: minsToNextTrain,
        nextTime: formattedNextTrainTime

    })

    // Emptying forms once submitted
    $("#trainInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    return false;
})

// When something new goes to firebase, function to capture values
database.ref().on("child_added", function (childSnapshot) {

    // Variable for database input values/objects
    var trainName = childSnapshot.val().name;
    var dest = childSnapshot.val().destination;
    var train1 = childSnapshot.val().nextTime;
    var fQ = childSnapshot.val().frequency;
    var mins = childSnapshot.val().nextTrainMins;

    // Add table dats for new row of input info

    $("tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + "Every " + fQ + " mins" + "</td><td>" + train1 + "</td><td>" + mins + " mins" + "</td></tr>");

    // Error Handling
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});