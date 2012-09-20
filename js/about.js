"use strict";

$(document).ready(function () {
    //float hawking in
    if($("#hawking").length == 1) {console.log("howa");
        $("#hawking").delay(2000).animate({
            left: '+=100'
        }, 8000, function() {
            $(this).delay(2000).animate({
                opacity: 0,
                left: '-=100'
            }, 8000)
        });
    }

    $("#hawking").on("mouseenter", function() {
        $(this).stop().animate({
            opacity: 0,
            left: '-=150'
        }, 500)
    })

    $("#cosmos_logo_top").delay(1200).animate(
        { top: '-=20' }, // what we are animating
        600, // how fast we are animating
        'swing', // the type of easing
        function() { // the callback
            //console.log('done');
        });
        
    $("#cosmos_logo_bottom").delay(1200).animate(
        { top: '+=47' }, // what we are animating
        600, // how fast we are animating
        'swing', // the type of easing
        function() { // the callback
            //console.log('done');
        });
});
