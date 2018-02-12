$(document).ready(function () {

    //array of gif searches
    var movies = ["Super Troopers", "Anchorman", "The Big Lebowski", "The Princess Bride", "Zoolander", "Dirty Rotten Scoundrels", "Spaceballs", "The Goonies", "One Crazy Summer", "PCU", "Three Amigos", "Coming to America", "Planes, Trains & Automobiles", "Wet Hot American Summer", "Young Frankenstein"]


    //displays gifs in #gif-area
    function displayGifs() {

        var offset = Math.floor(Math.random()*101);

        //prevents reloading the page
        event.preventDefault();

        //clears the gif area when a new button is pressed
        $("#gif-area").empty();

        //name of movie for gif
        var movie = $(this).attr("data-name");

        //url to search for gifs
        var searchURL = "https://api.giphy.com/v1/gifs/search?api_key=PXx2NWiLxK8Qi22QECzaOYGnX95Rj30c&q=" + movie + "&limit=10&offset=" + offset;

        //call to gihpy api
        $.ajax({
            url: searchURL,
            method: "GET"
        }).then(function (response) {

            //for loop to diplay gifs and their ratings
            for (var i = 0; i < response.data.length; i++) {

                //container for gif and rating
                var gifDiv = $("<div>")

                //gif image tag
                var gif = $("<img>");

                //gif rating
                var rating = $("<p>").text("Rating: " + response.data[i].rating);

                //class for css to make each gifDiv inline block
                gifDiv.addClass("gif-container");

                //adding attributes and class to gifs
                gif.attr("src", response.data[i].images.fixed_width_still.url);
                gif.addClass("gif-image");

                //appending gif and rating to gifDiv
                gifDiv.append(gif);
                gifDiv.append(rating);

                //appending gifDiv to #gif-area
                $("#gif-area").append(gifDiv);
            }
        });

    }

    //create buttons from search term array in #button-area
    function createButtons() {

        //clear buttons to prevent duplicates
        $("#button-area").empty();

        //create buttons from movies array
        for (var i = 0; i < movies.length; i++) {

            //button tag variable
            var movieButton = $("<button>");

            //add classes to button
            movieButton.addClass("movie btn btn-default btn-small");

            //add data attribute to reference in ajax call
            movieButton.attr("data-name", movies[i]);

            //text of button
            movieButton.text(movies[i]);

            //append button to #button-area
            $("#button-area").append(movieButton);
        }
    }

    //add new movie buttons from search box
    $("#add-movie").on("click", function (event) {

        //prevents page reload
        event.preventDefault();

        //variable for text input
        var movie = $("#movie-input").val().trim();

        //checks for blank text box
        if (movie === "") {
            $("#error-messages").text("Enter a movie before submitting.");

        } 
        
        //checks if movie was already added
        else if (movies.includes(movie)) {

            $("#error-messages").text(movie + " is already included");

        } else {

            //call to omdb to see if text input is a comedy movie
            var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=1c195626";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                //create variabel to store boolean value
                var isComedy;

                //gets the string of genres for the movie
                var genres = response.Genre;

                //checks if its a movie
                var type = response.Type;

                //splits string into an array
                var genreArr = genres.split(", ");

                //checks if Comedy is one of the genres
                if (genreArr.includes("Comedy")) {
                    isComedy = true;
                } else {
                    isComedy = false;
                }

                //checks to see if input was a comedy
                if (!isComedy) {
                    $("#error-messages").text(movie + " is not a comedy.")
                }

                //checks to make sure input is a movie
                else if (type !== "movie") {
                    $("#error-messages").text(movie + " is not a movie.")
                }

                //checks to make sure input area is not blank
                else {
                    movies.push(movie);

                    createButtons();

                    $("#error-messages").text("");
                    $("#search-form").each(function () {
                        this.reset();
                    });
                }

            });
        }
    });

    //click handlers for buttons and gifs
    $(document).on("click", ".movie", displayGifs);

    $(document).on("click", ".gif-image", function () {
        
        var src = $(this).attr("src");

        //plays and stops the gifs by adding/removing clicked class and replacing _s.gif with .gif and vice versa
        if ($(this).hasClass("clicked")) {
            $(this).attr("src", src.replace(".gif", "_s.gif"));
            $(this).removeClass("clicked");
        } else {
            $(this).addClass("clicked");
            $(this).attr("src", src.replace("_s.gif", ".gif"));
        }
    });

    createButtons();
});