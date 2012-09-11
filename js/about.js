"use strict";

$(document).ready(function () {
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
