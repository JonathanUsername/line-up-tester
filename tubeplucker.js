// ------------------------------------------------------------------------
// ---------------      Line up tester     -----------------------
// ------------------------------------------------------------------------
// This is badly written. I'm sorry. I did originally write it just as I
// began to learn web development, so there is an unholy preponderance of
// jQuery and lazy/naive programming. I could tidy it up, but it's such a
// simple application. And youtube will probably break their API sooner or
// later...


var items = [];
var randomArr = items[Math.floor(Math.random()*items.length)];
var played = false;
var started = false;

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '',
        playerVars: { 
            'autoplay': 0, 
            'controls': 1 
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    if (started){
        player.playVideo();
    }
}

// What to do when the state changes - the tricky part. 
// Occasionally the video will appear as cued but not unstarted 
// and won't fire ended when in a playlist
function onPlayerStateChange(event) {
    var unstarted = "-1";
    var ended = "0";
    var playing = "1";
    var paused = "2";
    var buffering = "3";
    var cued = "5";
    console.log("player state: " + player.getPlayerState());
    if (player.getPlayerState() == unstarted && played == false){
        console.log("autoplay from unstarted.");
        player.playVideo();
        seekTimer();
    } else if (player.getPlayerState() == cued && played == false){
        console.log("autoplay from cued.");
        player.playVideo();
        seekTimer();
    } else if (player.getPlayerState() == unstarted && played == true){
        console.log("auto random from unstarted. played = false");
        goRandom();
    } else if (player.getPlayerState() == ended){
        console.log("auto random from ended. played = false");
        goRandom();
    }
}

// Button event handlers
$(document).ready(function(e) {
    $("#ranbut").click( function() {
        var data = $("#listbox").val()
        if (data){
            items = data.split(",");
            goRandom();
            $("#ranbut").text("Next!")
        } else {
            $('#ranp').html("Put a comma-separated list of artists in the box!");
        }
    });
});

// Randomly select a song from the csv and pass it to youtube as a search term
function goRandom(){   
    played = false;
    started = true;
    var randy = Math.floor(Math.random()*items.length);
    var search1 = items[randy];
    $('#ranp').html(search1);
    $("#ranp").attr("href", "https://www.google.co.uk/search?q='" + search1 + "'%20Music&tbm=vid");
    player.cuePlaylist({
        listType:"search",
        list:search1,
        playerVars: {
            'autoplay': 1, 
            'controls': 1 
        }
    });
};

// Youtube will sometimes fire two "unstarted" events followed by a cued one. Sometimes.
// This function means that no matter what events are fired it won't skip to a random 
// song on "unstarted" or "cued" until 3 seconds have elapsed. Change this if necessary.

function seekTimer(){
    setTimeout(function(){
        played = true;
    }, 4000);
}