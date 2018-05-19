require("dotenv").config();

var command = process.argv[2];
var action = process.argv[3];
var Twitter = require('twitter');
var params = {
    screen_name: '@_katecodes',
    count: 20
    };
var keys = require('./keys');
var client = new Twitter(keys.twitterKeys);
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: 'ad9cd0f443ed4e6e8e13df8ad8382781',
    secret: 'ee01c627d21347fe9e1829dbe622a28a'
    });
var request = require('request');
var fs = require("fs");
var filename = './log.txt';
var log = require('simple-node-logger').createSimpleFileLogger(filename);

log.setLevel('all');

//Switch break statements
switch (command) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThis(action);
        break;
    case 'movie-this':
        movieThis(action);
        break;
    case 'do-what-it-says':
        random();
        break;
}

//Twitter Things
function myTweets() {
    
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var number = i + 1;
               
                console.log([i + 1] + '. ' + tweets[i].text);
                console.log('Tweeted on: ' + tweets[i].created_at);
               
            }
        }
    });
}


//Spotify Stuff
function spotifyThis(action) {
   
     if (action == null) {
        action = 'The Sign';
    }
    spotify.search({
    	type: 'action',
    	query: action 
    }, function(error, data) {
        if (error) {
        	console.log('Error occurred: ' + error);
        	return;
			}
           
            logOutput('Artist: ' + data.actions.items[0].artists[0].name);
            logOutput('Song: ' + data.actions.items[0].name);
            logOutput('Spotify Preview: ' + data.actions.items[0].preview_url);
            logOutput('Albu Name: ' + data.actions.items[0].album.name);
           
    });
}


//OMDB 
function movieThis(action) {
   
    if (action == null) {
        action = 'Mr. Nobody';
    }
    request("http://www.omdbapi.com/?t="+action+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
           
            logOutput('Movie Title: ' + JSON.parse(body).Title);
            logOutput('Release Year: ' + JSON.parse(body).Year);
            logOutput('IMDb Rating: ' + JSON.parse(body).imdbRating);
            logOutput('Country: ' + JSON.parse(body).Country);
            logOutput('Language: ' + JSON.parse(body).Language);
            logOutput('Plot: ' + JSON.parse(body).Plot);
            logOutput('Lead Actors: ' + JSON.parse(body).Actors);
           
        }
    });
}


function random() {
  
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {
           
            spotifyThis(data[3]);
        }

    });
}
function logOutput(logText) {
    log.info(logText);
    console.log(logText);
}