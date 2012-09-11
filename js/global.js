"use strict";

var max_orbits = 3,
	bar_transition_speed = 200,
	firefox_constant_x = 1250,
	firefox_constant_y = 220,
	chrome_constant_x = 424,
	chrome_constant_y = 360,
	ie_constant_x = 845,
	ie_constant_y = 640,
	opera_constant_x = 1450,
	opera_constant_y = 510;
	
var top_countries =	["AR","AT","AU","BR","CA","CH","CN","DE","ES","FR","GB","ID","IN","IT","JP","MX","MY","NK","PH","PL","RU","SE","TR","US","VN"];

var shaky_shaky_done = true,
	up_firefox = false,
	up_chrome = false,
	up_ie = false,
	up_opera = false,
	firefox_count=0,
	ie_count=0,
	chrome_count=0,
	opera_count=0,
	firefox_top_countries=0,
	ie_top_countries=0,
	chrome_top_countries=0,
	opera_top_countries=0;

//https://github.com/mbostock/d3/wiki/Transitions#wiki-attrTween
$(document).ready(function () {
	wobble_firefox();
	wobble_chrome();
	wobble_ie();
	wobble_opera();
	
	$("#play_pause").toggle(function(e) {
		var currentTime = document.getElementById("audio").currentTime;
		
		document.getElementById("audio").play();
		$("#play_pause_icon").attr("src", "images/audio_playing.png");

		document.getElementById("audio").play();
		document.getElementById("audio").volume = 1;
	}, function() {
		$("#play_pause_icon").attr("src", "images/audio_paused.png");
		
		$("audio").volumizer([600,.0001])
		setTimeout(function() {
			//document.getElementById("audio").pause();
		}, 900);
	});
	
	$("#prev_date").on("click", function() { left(); });
	$("#next_date").on("click", function() { right(); });
	
	$("body").bind('keyup', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 37) { //left arrow
			left();	
			return false;
		}
		else if(code == 39) { //right arrow
			right();	
			return false;
		}
	});
	
	//when page first loads, default to last month
	var d = Date.today().add(-1).months().toString("MMM yyyy");
	var d_full = Date.today().add(-1).months().toString("MMMM yyyy");
	$("#current_date_top_right").html(d);
	d3.select("#current_date_top_left").text(d_full);
	
	updateData();
});

function updateData() {
	//get current date
	var mm = Date.parse($(".current_date").html()).toString("MM");
	var yyyy = Date.parse($(".current_date").html()).toString("yyyy");
	
	processData(mm, yyyy);
}

function left() {
	if($("#current_date_top_right").html() == "Jul 2008") {
		if(shaky_shaky_done) {
			shaky_shaky_done = false;
			$("#current_date_top_right").effect( "shake", { times:2, distance:3 }, 10, function() { shaky_shaky_done = true; } ); //shake date
		}
		return;
	}
	
	var d = Date.parse($(".current_date").html()).add(-1).month().toString("MMM yyyy");
	var d_full = Date.parse($(".current_date").html()).add(-1).month().toString("MMMM yyyy");
	$(".current_date").html(d);
	d3.select("#current_date_top_left").text(d_full);
	
	updateData();
}

function right() {
	var today = Date.today().add(-1).months().toString("MMM yyyy");
	if($("#current_date_top_right").html() == today) {		
		if(shaky_shaky_done) {
			shaky_shaky_done = false;
			$("#current_date_top_right").effect( "shake", { times:2, distance:3 }, 10, function() { shaky_shaky_done = true; } ); //shake date
		}
		return;
	}
		
	var d = Date.parse($("#current_date_top_right").html()).add(1).month().toString("MMM yyyy");
	var d_full = Date.parse($(".current_date").html()).add(1).month().toString("MMMM yyyy");
	$("#current_date_top_right").html(d);
	d3.select("#current_date_top_left").text(d_full);
	
	updateData();
}

function processData(month, year) {
	//clear existing counts
	firefox_count=0,
	ie_count=0,
	chrome_count=0,
	opera_count=0,
	firefox_top_countries=0,
	ie_top_countries=0,
	chrome_top_countries=0,
	opera_top_countries=0;
	
	//load new data
	d3.json("data/" + year + "-" + month + ".json", function(data) {		
		//create moons for firefox (we just need the count for now)
		firefox_count = (data["firefox"]) ? data["firefox"].length : "";
		ie_count = (data["ie"]) ? data["ie"].length : "";
		chrome_count = (data["chrome"]) ? data["chrome"].length : "";
		opera_count = (data["opera"]) ? data["opera"].length : "";
		
		buildMoons(data, ["firefox","ie", "chrome", "opera"]);
		
		//how many top markets do we have
		if(data["firefox"] != undefined) data["firefox"].map(isTopMarketFirefox);
		if(data["chrome"] != undefined) data["chrome"].map(isTopMarketChrome);
		if(data["ie"] != undefined) data["ie"].map(isTopMarketIe);
		if(data["opera"] != undefined) data["opera"].map(isTopMarketOpera);
		
		//build the summary chart
		var sumbox = d3.select("#summary_chart");
					
		//firefox
		d3.select("#firefox_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return firefox_count * 2; });
				
		d3.select("#firefox_top_markets_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return firefox_top_countries * 2; });
				
		d3.select("#firefox_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return firefox_count; })
				.attr("x", function() { return 106 + firefox_count * 2; });
				
		d3.select("#firefox_top_markets_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return (firefox_top_countries == 0) ? "" : firefox_top_countries; })
				.attr("x", function() { return 102 + firefox_top_countries * 2; });		
				
		//chrome
		d3.select("#chrome_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return chrome_count * 2; });
				
		d3.select("#chrome_top_markets_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return chrome_top_countries * 2; });
		
		d3.select("#chrome_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return chrome_count; })
				.attr("x", function() { return 106 + chrome_count * 2; });
				
		d3.select("#chrome_top_markets_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return (chrome_top_countries == 0) ? "" : chrome_top_countries; })
				.attr("x", function() { return 102 + chrome_top_countries * 2; });
					
		//internet explorer
		d3.select("#ie_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return ie_count * 2; });
				
		d3.select("#ie_top_markets_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return ie_top_countries * 2; });
				
		d3.select("#ie_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return ie_count; })
				.attr("x", function() { return 106 + ie_count * 2; });
				
		d3.select("#ie_top_markets_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return (ie_top_countries == 0) ? "" : ie_top_countries; })
				.attr("x", function() { return 102 + ie_top_countries * 2; });
				
		//opera		
		d3.select("#opera_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return opera_count * 2; });
				
		d3.select("#opera_top_markets_plurality")
			.transition()
				.duration(bar_transition_speed)
				.attr("width", function() { return opera_top_countries * 2; });
				
		d3.select("#opera_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return opera_count; })
				.attr("x", function() { return 106 + opera_count * 2; });
				
		d3.select("#opera_top_markets_plurality_text")
			.transition()
				.duration(bar_transition_speed)
				.text(function() { return (opera_top_countries == 0) ? "" : opera_top_countries; })
				.attr("x", function() { return 102 + opera_top_countries * 2; });

		$("#summary_chart").attr("transform", "translate(0,0)");
	});
}


function isTopMarketFirefox(e) { if($.inArray(e, top_countries) != -1) { firefox_top_countries++; } }
function isTopMarketChrome(e) { if($.inArray(e, top_countries) != -1) { chrome_top_countries++; } }
function isTopMarketIe(e) { if($.inArray(e, top_countries) != -1) { ie_top_countries++; } }
function isTopMarketOpera(e) { if($.inArray(e, top_countries) != -1) { opera_top_countries++; } }


function buildMoons(data, planets) {
	d3.selectAll(".moon").remove();
	d3.selectAll("path").remove();
	
	$.each(planets, function(index, browser) {
		for(var i=1; i <= eval(browser + "_count"); i++) {
			//console.log("building " + browser + " moon " + i);
			
			//limit to max_orbits number of orbits
			if(i <= max_orbits) {
				d3.select("#" + browser + "_system").append("path")
					.attr("id", browser + "_path"+i)
					.attr("d", "M" + (eval(browser + "_constant_x")+i*100) + "," + eval(browser + "_constant_y") + " h 0 a" + (30+i*100) + "," + (9+i*30) + " 0 1,0 1,1 z")
					.attr("fill", "none");
				}
				
				d3.select("#" + browser + "_system").append("circle")
					.attr("class", function() {
						if($.inArray(data[browser][i], top_countries) != -1) { 
							return "top_market moon";
						} 
						else { return "moon"; }
					})
					.attr("id", function() { return data[browser][i]; })
						.append("animateMotion")
							.attr("calcmode", "spline")
							.attr("dur", randomRange(20,60) + "s")
							.attr("repeatCount", "indefinite")
							.append("mpath")
								.attr("xlink:href", function() {
									//if it's a top market, put in largest orbit
									if($.inArray(data[browser][i], top_countries) != -1) { 
										return "#" + browser + "_path"+max_orbits;
									}
									else if(i <= max_orbits) {
										return "#" + browser + "_path"+i;
									}
									else {
										return "#" + browser + "_path"+randomRange(1,max_orbits);
									}
								});
		}
	});
	
	//set moon attribs
	$(".moon")
		//.attr("cx", 0)
		//.attr("cy", 0)
		.css("opacity", 0.8)
		.attr("r", 6);
		
	//color top countries differently
	$(".top_market")
		.css("fill", "red");
}


function wobble_firefox() {
	var angle;
	
	if(up_firefox) { up_firefox = false; angle = -6; }
	else { up_firefox = true; angle = 6; }
	
	d3.select("#firefox_system")
		.transition()
			.ease("cubic-in-out")
			.duration(12000)
			//.attr("cx", 50);
			.attr("transform", "rotate(" + angle + "," + firefox_constant_x + "," + firefox_constant_y + ")")
		.each("end", wobble_firefox);
}

function wobble_chrome() {
	var angle;

	if(up_chrome) { up_chrome = false; angle = -5; }
	else { up_chrome = true; angle = 5; }
	
	d3.select("#chrome_system")
		.transition()
			.ease("cubic-in-out")
			.duration(11000)
			.attr("transform", "rotate(" + angle + "," + chrome_constant_x + "," + chrome_constant_y + ")")
		.each("end", wobble_chrome);
}

function wobble_ie() {
	var angle;

	if(up_ie) { up_ie = false; angle = -6; }
	else { up_ie = true; angle = 6; }
	
	d3.select("#ie_system")
		.transition()
			.ease("cubic-in-out")
			.duration(10000)
			.attr("transform", "rotate(" + angle + "," + ie_constant_x + "," + ie_constant_y + ")")
		.each("end", wobble_ie);
}

function wobble_opera() {
	var angle;

	if(up_ie) { up_ie = false; angle = -6; }
	else { up_ie = true; angle = 6; }
	
	d3.select("#opera_system")
		.transition()
			.ease("cubic-in-out")
			.duration(10000)
			.attr("transform", "rotate(" + angle + "," + opera_constant_x + "," + opera_constant_y + ")")
		.each("end", wobble_opera);
}



//http://forum.jquery.com/topic/jqery-html5-audio-file-fade-out
$.fn.volumizer=function(o){ // assumes the user has no controls!
		return this.each(function(){
			var lastSeconds=-1,
				media=this

				var rule=o,
					aniSeconds=o[0],
					volume=this.volume,
					finalVolume=rule[1]*volume,
					stepVolume=(finalVolume-volume)/aniSeconds

				for(var second=0;second<aniSeconds+1;second++)
					(function(tVolume){
						setTimeout(function(){
							media.volume=tVolume
						},second)
					})(volume+(stepVolume*second))
		})
}

function randomRange(minVal,maxVal,floatVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}