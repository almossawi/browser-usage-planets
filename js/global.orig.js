"use strict";

var max_orbits = 3,
	skipped = false,
	delayBetweenTimeTravels = 800, //how quickly can one click prev/next consecutively (due to issues in Safari if they're clicked repeatedly too quickly)
	populateSummaryBoxDelay = 150,
	bar_transition_speed = 200,
	firefox_constant_x = 1250,
	firefox_constant_y = 250,
	chrome_constant_x = 424,
	chrome_constant_y = 360,
	ie_constant_x = 715,
	ie_constant_y = 670,
	opera_constant_x = 1450,
	opera_constant_y = 550;
	
var top_countries =	["AR","AT","AU","BR","CA","CH","CN","DE","ES","FR","GB","ID","IN","IT","JP","MX","MY","NK","PH","PL","RU","SE","TR","US","VN"];

//var browser_colors = ["#5ce14f", "#ff9600", "#1b8cd5", "#ef0d2a"]
var browser_colors = ["url('#gradient_chrome')", "url('#gradient_firefox')", "url('#gradient_ie')", "url('#gradient_opera')"]

//tells us the months in which a country switches majority market share from one browser to another
//switch_data["BH"].dates
var switch_data,
	myPlayer;

/*var moonSpeedScale = d3.scale.linear()
    .domain([0, 50])
    .range([20, 60]);*/
            
var movedThroughTimeJustNow = false,
	show_all_moons = true,
	following_a_country = false,
	following_a_country_iterator = 0,
	show_country_names = false,
	shaky_shaky_done = true,
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

var countries = [
{value: "AF", label: "Afghanistan"},
{value: "AX", label: "Åland Islands"},
{value: "AL", label: "Albania"},
{value: "DZ", label: "Algeria"},
{value: "AS", label: "American Samoa"},
{value: "AD", label: "Andorra"},
{value: "AO", label: "Angola"},
{value: "AI", label: "Anguilla"},
{value: "AQ", label: "Antarctica"},
{value: "AG", label: "Antigua and Barbuda"},
{value: "AR", label: "Argentina"},
{value: "AM", label: "Armenia"},
{value: "AW", label: "Aruba"},
{value: "AU", label: "Australia"},
{value: "AT", label: "Austria"},
{value: "AZ", label: "Azerbaijan"},
{value: "BS", label: "Bahamas"},
{value: "BH", label: "Bahrain"},
{value: "BD", label: "Bangladesh"},
{value: "BB", label: "Barbados"},
{value: "BY", label: "Belarus"},
{value: "BE", label: "Belgium"},
{value: "BZ", label: "Belize"},
{value: "BJ", label: "Benin"},
{value: "BM", label: "Bermuda"},
{value: "BT", label: "Bhutan"},
{value: "BO", label: "Bolivia"},
{value: "BA", label: "Bosnia and Herzegovina"},
{value: "BW", label: "Botswana"},
//{value: "BV", label: "Bouvet Island"},
{value: "BR", label: "Brazil"},
{value: "IO", label: "British Indian Ocean Territory"},
{value: "BN", label: "Brunei Darussalam"},
{value: "BG", label: "Bulgaria"},
{value: "BF", label: "Burkina Faso"},
{value: "BI", label: "Burundi"},
{value: "KH", label: "Cambodia"},
{value: "CM", label: "Cameroon"},
{value: "CA", label: "Canada"},
{value: "CV", label: "Cape Verde"},
{value: "KY", label: "Cayman Islands"},
{value: "CF", label: "Central African Republic"},
{value: "TD", label: "Chad"},
{value: "CL", label: "Chile"},
{value: "CN", label: "China"},
//{value: "CX", label: "Christmas Island"},
//{value: "CC", label: "Cocos (Keeling) Islands"},
{value: "CO", label: "Colombia"},
{value: "KM", label: "Comoros"},
{value: "CG", label: "Congo"},
{value: "CD", label: "Congo"}, //, The Democratic Republic of The"
{value: "CK", label: "Cook Islands"},
{value: "CR", label: "Costa Rica"},
{value: "CI", label: "Cote D'ivoire"},
{value: "HR", label: "Croatia"},
{value: "CU", label: "Cuba"},
{value: "CY", label: "Cyprus"},
{value: "CZ", label: "Czech Republic"},
{value: "DK", label: "Denmark"},
{value: "DJ", label: "Djibouti"},
{value: "DM", label: "Dominica"},
{value: "DO", label: "Dominican Republic"},
{value: "EC", label: "Ecuador"},
{value: "EG", label: "Egypt"},
{value: "SV", label: "El Salvador"},
{value: "GQ", label: "Equatorial Guinea"},
{value: "ER", label: "Eritrea"},
{value: "EE", label: "Estonia"},
{value: "ET", label: "Ethiopia"},
{value: "FK", label: "Falkland Islands (Malvinas)"},
{value: "FO", label: "Faroe Islands"},
{value: "FJ", label: "Fiji"},
{value: "FI", label: "Finland"},
{value: "FR", label: "France"},
{value: "GF", label: "French Guiana"},
{value: "PF", label: "French Polynesia"},
{value: "TF", label: "French Southern Territories"},
{value: "GA", label: "Gabon"},
{value: "GM", label: "Gambia"},
{value: "GE", label: "Georgia"},
{value: "DE", label: "Germany"},
{value: "GH", label: "Ghana"},
{value: "GI", label: "Gibraltar"},
{value: "GR", label: "Greece"},
{value: "GL", label: "Greenland"},
{value: "GD", label: "Grenada"},
{value: "GP", label: "Guadeloupe"},
{value: "GU", label: "Guam"},
{value: "GT", label: "Guatemala"},
//{value: "GG", label: "Guernsey"},
{value: "GN", label: "Guinea"},
{value: "GW", label: "Guinea-bissau"},
{value: "GY", label: "Guyana"},
{value: "HT", label: "Haiti"},
//{value: "HM", label: "Heard Island and Mcdonald Islands"},
{value: "VA", label: "Holy See (Vatican City State)"},
{value: "HN", label: "Honduras"},
{value: "HK", label: "Hong Kong"},
{value: "HU", label: "Hungary"},
{value: "IS", label: "Iceland"},
{value: "IN", label: "India"},
{value: "ID", label: "Indonesia"},
{value: "IR", label: "Iran"},
{value: "IQ", label: "Iraq"},
{value: "IE", label: "Ireland"},
{value: "IM", label: "Isle of Man"},
{value: "IL", label: "Israel"},
{value: "IT", label: "Italy"},
{value: "JM", label: "Jamaica"},
{value: "JP", label: "Japan"},
{value: "JE", label: "Jersey"},
{value: "JO", label: "Jordan"},
{value: "KZ", label: "Kazakhstan"},
{value: "KE", label: "Kenya"},
{value: "KI", label: "Kiribati"},
{value: "KP", label: "Korea, DPR"},
{value: "KR", label: "Korea, Republic of"},
{value: "KW", label: "Kuwait"},
{value: "KG", label: "Kyrgyzstan"},
{value: "LA", label: "Lao People's Democratic Republic"},
{value: "LV", label: "Latvia"},
{value: "LB", label: "Lebanon"},
{value: "LS", label: "Lesotho"},
{value: "LR", label: "Liberia"},
{value: "LY", label: "Libya"},
{value: "LI", label: "Liechtenstein"},
{value: "LT", label: "Lithuania"},
{value: "LU", label: "Luxembourg"},
{value: "MO", label: "Macao"},
{value: "MK", label: "Macedonia"},
{value: "MG", label: "Madagascar"},
{value: "MW", label: "Malawi"},
{value: "MY", label: "Malaysia"},
{value: "MV", label: "Maldives"},
{value: "ML", label: "Mali"},
{value: "MT", label: "Malta"},
{value: "MH", label: "Marshall Islands"},
{value: "MQ", label: "Martinique"},
{value: "MR", label: "Mauritania"},
{value: "MU", label: "Mauritius"},
{value: "YT", label: "Mayotte"},
{value: "MX", label: "Mexico"},
{value: "FM", label: "Micronesia"},
{value: "MD", label: "Moldova"},
{value: "MC", label: "Monaco"},
{value: "MN", label: "Mongolia"},
{value: "ME", label: "Montenegro"},
{value: "MS", label: "Montserrat"},
{value: "MA", label: "Morocco"},
{value: "MZ", label: "Mozambique"},
{value: "MM", label: "Myanmar"},
{value: "NA", label: "Namibia"},
{value: "NR", label: "Nauru"},
{value: "NP", label: "Nepal"},
{value: "NL", label: "Netherlands"},
{value: "AN", label: "Netherlands Antilles"},
{value: "NC", label: "New Caledonia"},
{value: "NZ", label: "New Zealand"},
{value: "NI", label: "Nicaragua"},
{value: "NE", label: "Niger"},
{value: "NG", label: "Nigeria"},
{value: "NU", label: "Niue"},
{value: "NF", label: "Norfolk Island"},
{value: "MP", label: "Northern Mariana Islands"},
{value: "NO", label: "Norway"},
{value: "OM", label: "Oman"},
{value: "PK", label: "Pakistan"},
{value: "PW", label: "Palau"},
{value: "PS", label: "Palestine"},
{value: "PA", label: "Panama"},
//{value: "PG", label: "Papua New Guinea"},
{value: "PY", label: "Paraguay"},
{value: "PE", label: "Peru"},
{value: "PH", label: "Philippines"},
//{value: "PN", label: "Pitcairn"},
{value: "PL", label: "Poland"},
{value: "PT", label: "Portugal"},
{value: "PR", label: "Puerto Rico"},
{value: "QA", label: "Qatar"},
{value: "RE", label: "Reunion"},
{value: "RO", label: "Romania"},
{value: "RU", label: "Russian Federation"},
{value: "RW", label: "Rwanda"},
//{value: "SH", label: "Saint Helena"},
{value: "KN", label: "Saint Kitts and Nevis"},
{value: "LC", label: "Saint Lucia"},
{value: "PM", label: "Saint Pierre and Miquelon"},
{value: "VC", label: "Saint Vincent and The Grenadines"},
{value: "WS", label: "Samoa"},
{value: "SM", label: "San Marino"},
{value: "ST", label: "Sao Tome and Principe"},
{value: "SA", label: "Saudi Arabia"},
{value: "SN", label: "Senegal"},
{value: "RS", label: "Serbia"},
{value: "SC", label: "Seychelles"},
{value: "SL", label: "Sierra Leone"},
{value: "SG", label: "Singapore"},
{value: "SK", label: "Slovakia"},
{value: "SI", label: "Slovenia"},
{value: "SB", label: "Solomon Islands"},
{value: "SO", label: "Somalia"},
{value: "ZA", label: "South Africa"},
//{value: "GS", label: "South Georgia and The South Sandwich Islands"},
{value: "ES", label: "Spain"},
{value: "LK", label: "Sri Lanka"},
{value: "SD", label: "Sudan"},
{value: "SR", label: "Suriname"},
//{value: "SJ", label: "Svalbard and Jan Mayen"},
{value: "SZ", label: "Swaziland"},
{value: "SE", label: "Sweden"},
{value: "CH", label: "Switzerland"},
{value: "SY", label: "Syrian Arab Republic"},
{value: "TW", label: "Taiwan"},
{value: "TJ", label: "Tajikistan"},
{value: "TZ", label: "Tanzania"},
{value: "TH", label: "Thailand"},
{value: "TL", label: "Timor-leste"},
{value: "TG", label: "Togo"},
{value: "TK", label: "Tokelau"},
{value: "TO", label: "Tonga"},
{value: "TT", label: "Trinidad and Tobago"},
{value: "TN", label: "Tunisia"},
{value: "TR", label: "Turkey"},
{value: "TM", label: "Turkmenistan"},
{value: "TC", label: "Turks and Caicos Islands"},
{value: "TV", label: "Tuvalu"},
{value: "UG", label: "Uganda"},
{value: "UA", label: "Ukraine"},
{value: "AE", label: "United Arab Emirates"},
{value: "GB", label: "United Kingdom"},
{value: "US", label: "United States"},
{value: "UM", label: "United States Minor Outlying Islands"},
{value: "UY", label: "Uruguay"},
{value: "UZ", label: "Uzbekistan"},
{value: "VU", label: "Vanuatu"},
{value: "VE", label: "Venezuela"},
{value: "VN", label: "Viet Nam"},
{value: "VG", label: "Virgin Islands, British"},
{value: "VI", label: "Virgin Islands, U.S."},
{value: "WF", label: "Wallis and Futuna"},
//{value: "EH", label: "Western Sahara"},
{value: "YE", label: "Yemen"},
{value: "ZM", label: "Zambia"},
{value: "ZW", label: "Zimbabwe"}
];


//https://github.com/mbostock/d3/wiki/Transitions#wiki-attrTween
$(document).ready(function () {
	if(gup('skip') != "1") {
		document.getElementById("explosion").volume = 0;

		_V_("bigbang_video").ready(function(){
			myPlayer = this;
			myPlayer.options.flash.swf = "bigbang.mp4";

			myPlayer.addEvent("loadstart", function() {
				$("#and_then").show();
			})
			
			myPlayer.addEvent("loadeddata", function() {
				$("#and_then").show(0, function() {
					d3.selectAll(".intro_circle")
					.each(function(d, i) {
						d3.select(this)
						.transition()
						.delay(i*700)
						.duration(300)
							.attr("fill", function() { return browser_colors[i]; });
					});
				}).delay(2300).fadeOut("slow", function() {
					$("#dim").css("opacity", "0.7").hide();
					$("#video_container").css("opacity", 1);
					setTimeout(function() {
						if(skipped == false)
							document.getElementById("explosion").play();
					}, 3200);
					myPlayer.play();
				});
			})

			myPlayer.addEvent("timeupdate", function() {
				//console.log(myPlayer.currentTime());	
				if(myPlayer.currentTime() > 13) {
					$("#video_container").fadeOut(2000);
				}
			})

			$("#skip").on("click", function() {
				$("#video_container").fadeOut();
				$("#dim").fadeOut();
				$("#and_then").hide();
				myPlayer.pause();
				skipped = true;
			});
		});
	}
	else {
		$("#dim").css("opacity", "0.7").hide();
		$("#video_container").hide();
	}

	$("#hear_it").on("click", function() {
		document.getElementById("explosion").volume = 1;
		$("#hear_it").css("color", "#4eff00");
	});

	$("#country").autocomplete({
			appendTo: "#modal_box2",
			source: countries,
			delay: 150,
			focus: function( event, ui ) {
				$( "#country" ).val( ui.item.label );
				return false;
			},
			select: function( event, ui ) {
				$("#selected_country").val( ui.item.label );
				$("#selected_country_id").val( ui.item.value );

				return false;
			},
	});

	$("#summary_chart").attr("transform", "translate(0,40)");

	$("#slider-vertical_zoomin").on("click", function() {
		//zoom in
		var current_val = $("#slider-vertical").slider( "value");
		current_val = (current_val < 5) ? current_val+1 : 5;

		$("#slider-vertical").slider( "value", current_val);
	});

	$("#slider-vertical_zoomout").on("click", function() {
		//zoom out
		var current_val = $("#slider-vertical").slider( "value");
		current_val = (current_val > 1) ? current_val-1 : 1;

		$("#slider-vertical").slider( "value", current_val);
	});

	//zoom slider
	$( "#slider-vertical" ).slider({
			orientation: "vertical",
			range: "min",
			min: 1,
			max: 5,
			value: 3,
			slide: function( event, ui ) {
				handleZoomSlider(event, ui.value);
			},
			change: function(event, ui) {
				handleZoomSlider(event, ui.value);
			}
	});

	//social media
	/*$("#socialmedia").on("mouseenter", function() {
		$("#socialmedia span").fadeOut("fast");
		$("#sm_buttons").hide().css("right", "0px").fadeIn("slow");
	});

	$("#sm_buttons").on("mouseleave", function() {
		$("#socialmedia span").fadeIn("slow");
		$("#sm_buttons").fadeOut("fast").css("right", "-300px");
	});*/

	wobble_firefox();
	wobble_chrome();
	wobble_ie();
	wobble_opera();


	$("#show_all_moons").toggle(function(e) {
		show_all_moons = false;
		$(".market").css("display", "none");
		$("#show_all_moons .icon").css("background-image", "url('images/checked_all.png')");
		$("#show_all_moons .label").html("Show all countries");
	}, function() {
		show_all_moons = true;
		$(".market, .top_market").css("display", "block");
		$("#show_all_moons .icon").css("background-image", "url('images/checked_top.png')");
		$("#show_all_moons .label").html("Show accented countries");
	});
	
	$("#show_country_names").toggle(function(e) {
		show_country_names = true;
		$("#show_country_names").html("Hide country names");
		
		//show only text
		showOnlyCountryNames();
	}, function() {
		show_country_names = false;
		$("#show_country_names").html("Show country names");
		
		//show only moons
		showOnlyMoons();
	});
	
	//hover and click logic for footer category buttons {business, engineering, operations}
	$(".cat-button:not(.ui-state-disabled)")
		.hover(
			function(){ 
				$(this).addClass("ui-state-hover"); 
			},
			function(){ 
				$(this).removeClass("ui-state-hover"); 
			}
		)
		.mousedown(function(){
				$(this).parents('.cat-buttonset-single:first').find(".cat-button.ui-state-active").removeClass("ui-state-active");
				if( $(this).is('.ui-state-active.cat-button-toggleable, .cat-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
				else { $(this).addClass("ui-state-active"); }
		})
		.mouseup(function(){
			if(! $(this).is('.cat-button-toggleable, .cat-buttonset-single .cat-button,  .cat-buttonset-multi .cat-button') ){
				$(this).removeClass("ui-state-active");
			}
		});
	
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
	
	$("#prev_date").on("click", function(e) { left(e); });
	$("#next_date").on("click", function(e) { right(e); });
	
	$("#jump_to_date_link").on("click", function() {
		//show modal pane
		$("#dim").show();
		$("#modal_box").show();
		$("#modal_box #date_field").val("");
		$("#modal_box .error").stop().html("");
		$("#modal_box #date_field").focus();
	
		return false;
	});

	$("#pause_play_moons_animation").toggle(function(e) {
		$("#pause_play_moons_animation img").attr("src", "images/play.png");
		d3.selectAll(".animo").attr("calcMode", "discrete").attr("keyPoints", "0").attr("keyTimes", "0");
	}, function() {
		$("#pause_play_moons_animation img").attr("src", "images/pause.png");
		d3.selectAll(".animo").attr("calcMode", "paced").attr("keyPoints", "0").attr("keyTimes", "0");
	});

	$("#follow_a_country").on("click", function() {
		//reset 'follow a country'
		if($("#follow_a_country .label").html() != "Follow a country") {
			following_a_country = false;
			$("#selected_country").val("");
			$("#selected_country_id").val("");
			$("#follow_a_country .label").html("Follow a country");
			$(".market, .top_market").show();
			
			$("#arbitrary_msg_box").hide();

			//enable next and prev buttons and appropriate buttons
			$("#next_date").show();
			$("#prev_date").show();
			$("#show_all_moons").removeAttr("disabled");

			$("#show_all_moons").css("background-color", "#4e4e4e");
			$("#show_all_moons").css("border-color", "#4e4e4e");
			$("#show_all_moons").css("color", "#fff");

			return false;
		}

		//show modal pane
		$("#dim").show();
		$("#modal_box2").show();
		$("#modal_box2 #country").val("");
		$("#modal_box2 .error").stop().html("");
		$("#modal_box2 #country").focus();
	
		return false;
	});

	$("#trends_link").toggle(function(e) {
		if($("#content").is(":hidden") == false) { //if it's already displayed, hide (won't happend, but for completeness)
			//$("#content span").html("Patience, grasshopper.  In time...");
			//$("#content").hide("slide", { direction: "left" }, 200);
			$("#content").hide();

			return; 
		}
		//$("#content span").html("Patience, grasshopper.  In time...");
		//$("#content").show("slide", { direction: "left" }, 200);
		$("#content").show();
		
		return false;
	}, function() {
		if($("#content").is(":hidden")) { //if it's already hidden, show
			//$("#content span").html("Patience, grasshopper.  In time...");
			//$("#content").show("slide", { direction: "left" }, 200);
			$("#content").show();
			return; 
		}

		//$("#content span").html("Patience, grasshopper.  In time...");
		//$("#content").hide("slide", { direction: "left" }, 200);
		$("#content").hide();
		
		return false;
	});

	$(".x a").on("click", function() {
		$("#content").hide();
		
		return false;
	});
	
	$("body").bind('keydown', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 37 
				&& ($("#modal_box").is(":hidden") == true && $("#modal_box2").is(":hidden") == true)) { //left arrow
			left(e);

			return false;
		}
		else if(code == 39 
				&& ($("#modal_box").is(":hidden") == true && $("#modal_box2").is(":hidden") == true)) { //right arrow
			right(e);

			return false;
		}
		else if(code == 74 
				&& ($("#modal_box").is(":hidden") == true && $("#modal_box2").is(":hidden") == true)) { //j = jump to date
			$("#dim").show();
			$("#modal_box").show();
			$("#modal_box #date_field").val("");
			$("#modal_box .error").stop().html("");
			$("#modal_box #date_field").focus();

			return false;
		}
		else if(code == 70 
				&& ($("#modal_box").is(":hidden") == true && $("#modal_box2").is(":hidden") == true)) { //f=  follow a country
			$("#dim").show();
			$("#modal_box2").show();
			$("#modal_box2 #country").val("");
			$("#modal_box2 .error").stop().html("");
			$("#modal_box2 #country").focus();

			return false;
		}
		else if(code == 27 
				&& ($("#modal_box").is(":hidden") == false || $("#modal_box2").is(":hidden") == false)) { //escape
			$("#dim").hide();
			$("#modal_box").hide();
			$("#modal_box2").hide();
			$("#modal_box #date_field").blur();
			$("#modal_box2 #country").blur();
			$("#modal_box2 #country").autocomplete("close");

			return false;
		}
		else if (code == 13 && $("#modal_box #date_field").is(":hidden") == false) { //enter for 'jump to date'
			try {
				if(Date.parse($("#modal_box #date_field").val()).isBefore(Date.parse("July 2008"))
						|| Date.parse($("#modal_box #date_field").val()).isAfter(Date.today().add(-1).months())
					) {
					$("#modal_box .error").html("we only have data between July 2008 and last month :-)").show();
					setTimeout(function() { $("#modal_box .error").fadeOut(); }, 5000);
				
					return;
				}

				jumpToDate(Date.parse($("#modal_box #date_field").val()));

				$("#dim").hide();
				$("#modal_box").hide();
				$("#modal_box #date_field").blur();
			}
			catch(TypeError) {
				$("#modal_box .error").html("either that's not a valid date, or...yeah, it's probably just not a valid date.").show();
				setTimeout(function() { $("#modal_box .error").fadeOut(); }, 5000);
			}
			finally {
				return false;
			}
		}
		else if (code == 13 && $("#modal_box2 #country").is(":hidden") == false) { //enter for 'follow a country'
			try {
				//first, check to see if this country has ever switched
				if($("#selected_country_id").val() != "" && switch_data[$("#selected_country_id").val()].dates.length-1 == 0) {

					$("#arbitrary_msg_box").html("Since July 2008, most users in " + $("#selected_country").val() + " have been <br />using the same browser.").show();

					//disable next and prev buttons and appropriate buttons
					$("#next_date").hide();
					$("#prev_date").hide();
				}
				else {
					//make sure next and prev buttons are enabled and the msg box is hidden
					$("#next_date").show();
					$("#prev_date").show();
					//$("#show_all_moons").attr("disabled", "disabled"); //we still don't want to allow users to play with this option during 'follow a country'
					
					//$("#arbitrary_msg_box").hide();
					$("#arbitrary_msg_box").html("Since July 2008, the majority market share in " + $("#selected_country").val() + " <br />has switched " + (switch_data[$("#selected_country_id").val()].dates.length-1) + " time(s); move left and right to see them.").show();

					//if so, move to first date (July 2008) before proceeding
					var d = Date.parse("July 2008").toString("MMM yyyy");
					var d_full = Date.parse("July 2008").toString("MMMM yyyy");
					$("#current_date_top_right").html(d);
					d3.select("#current_date_top_left").text(d_full);
					updateData();
				}

				followCountry();
				
				$("#dim").hide();
				$("#modal_box2").hide();
				$("#modal_box2 #country").blur();
				$("#modal_box2 #country").autocomplete("close");
			}
			catch(TypeError) {
				$("#modal_box2 .error").html("hmm...did you select a country from the list on the left?").show();
				setTimeout(function() { $("#modal_box2 .error").fadeOut(); }, 3000);
				return;
			}
			
			//only do this if no exception thrown
			$("#show_all_moons").attr("disabled", "disabled"); //we still don't want to allow users to play with this option during 'follow a country'
			$("#show_all_moons").css("background-color", "#262626");
			$("#show_all_moons").css("border-color", "#262626");
			$("#show_all_moons").css("color", "#535353");
		}
	});
	
	$("#dim").on('click', function(e) {
		$("#dim").hide();
		$("#modal_box").hide();
		$("#modal_box2").hide();
		$("#modal_box #date_field").blur();
		$("#modal_box #country").blur();
	});
	
	//when page first loads, default to last month
	var d = Date.today().add(-1).months().toString("MMM yyyy");
	var d_full = Date.today().add(-1).months().toString("MMMM yyyy");
	$("#current_date_top_right").html(d);
	d3.select("#current_date_top_left").text(d_full);
	
	drawPlanets(["firefox","ie", "chrome", "opera"]);
	updateData();
	setSwitchData();


	//on page load, wait for 30s
	//setTimeout(function() {
	//d3.selectAll(".animo").attr("calcMode", "paced").attr("keyPoints", "0").attr("keyTimes", "0")
	//}, 1000);

	//$("animateMotion").attr("dur", function(i,d) { var d = ((d.substring(0, d.length-1))/10).toFixed(2); console.log(d); return d + "s"; });
	//$("animateMotion").attr("dur", function(i,d) { var d = ((d.substring(0, d.length-1))*10).toFixed(2); console.log(d); return d + "s"; });
});

function setSwitchData() {
	d3.json("data/switches.json", function(data) {		
		switch_data = data;
	});
}

function followCountry() {
	//if we entered an invalid country
	/*if($("#selected_country_id").val() == "") {
		$("#modal_box2 .error").html("hmm...did you select a country from the list on the left?").show();
		setTimeout(function() { $("#modal_box2 .error").fadeOut(); }, 3000);

		//return false;
	}*/

	//reset our iterator
	following_a_country_iterator = 0;

	//change button label
	$("#follow_a_country .label").html("Stop following " + $("#selected_country_id").val());

	//has chrome been born yet?
	if($("#current_date_top_left").text() == "July 2008" || $("#current_date_top_left").text() == "August 2008") {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 0);
		d3.select("#chrome_planet text").attr("opacity", 0);
	}
	else {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 50);
		d3.select("#chrome_planet text").attr("opacity", 1);
	}

	//update moons
	following_a_country = true;
	var selected_country = $("#selected_country_id").val();
	$(".market, .top_market").show();
	$(".market:not(#" + selected_country + "), .top_market:not(#" + selected_country + ")").hide();

	//log the selected country name
	//todo
}

function handleZoomSlider(event, value) {
	//zoom on each tick
	//console.log("zooming in at " + value);

				if(value == 1) {
					d3.select("svg")
						.transition()							
							.duration(700)
							.attr("viewBox", "0 100 2200 1200")
							//.style("width", "1400");

					$("#plane_container")
						.css("width", "1400")
						.css("height", "400");
				}
				else if(value == 2) {
					d3.select("svg")
						.transition()
							.duration(700)
							.attr("viewBox", "0 100 2000 1000")
							//.style("width", "1600");

					$("#plane_container")
						.css("width", "1600")
						.css("height", "600");
				}
				else if(value == 3) {
					d3.select("svg")
						.transition()
							.duration(700)
							.attr("viewBox", "0 100 1800 800")
							//.style("width", "1800");

					$("#plane_container")
						.css("width", "1800")
						.css("height", "800");
				}
				else if(value == 4) {
					d3.select("svg")
						.transition()
							.duration(700)
							.attr("viewBox", "0 100 1600 600")
							//.style("width", "2000");

					$("#plane_container")
						.css("width", "2000")
						.css("height", "1000");
				}
				else if(value == 5) {
					d3.select("svg")
						.transition()
							.duration(700)
							.attr("viewBox", "0 100 1400 400")
							//.style("width", "2000");

					$("#plane_container")
						.css("width", "2000")
						.css("height", "1000");
				}
}

function showOnlyCountryNames() {
	$(".market text, .top_market text").css("display", "block");
	$(".market .moon, .top_market .moon").css("display", "none");
}

function showOnlyMoons() {
	$(".market text, .top_market text").css("display", "none");
	$(".market .moon, .top_market .moon").css("display", "block");
}

function drawPlanets(planets) {
	$.each(planets, function(index, browser) {
			var g = d3.select("svg")
				.append("g")
				.attr("transform", "translate(" + eval(browser + "_constant_x") + "," + eval(browser + "_constant_y") + ")")
				.attr("class", "planet")
				.attr("id", browser + "_planet");
			
			g.append("circle")
				.attr("r", 50)
				.attr("transform", "translate(-20,-20)")
				//.attr("stroke", "#a4a4a4")
				.attr("filter", "url(#dropshadow)")
				.attr("fill", function() {
					return "url(#gradient_" + browser + ")";
				})
				.attr("class", "planet");

			g.append("text")
				.text(function() {
					//only because it doesn't captialize first letter in firefox
					if(browser == "ie") return "Internet Explorer";
					else if(browser == "opera") return "Opera";
					else if(browser == "chrome") return "Chrome";
					else if(browser == "firefox") return "Firefox";
					else return browser;
				})
				.attr("text-anchor", "middle")
				.attr("transform", "translate(-10,-100)")
				.attr("x", -8)
				.attr("y", 5);
	});
}

function updateData() {
	//get current date
	var mm = Date.parse($(".current_date").html()).toString("MM");
	var yyyy = Date.parse($(".current_date").html()).toString("yyyy");
	
	processData(mm, yyyy);
}

function jumpToDate(date) {
	var d = Date.parse(date).toString("MMM yyyy");
	var d_full = Date.parse(date).toString("MMMM yyyy");
	$(".current_date").html(d);
	d3.select("#current_date_top_left").text(d_full);

	//has chrome been born yet?
	if(d_full == "July 2008" || d_full == "August 2008") {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 0);
		d3.select("#chrome_planet text").attr("opacity", 0);
	}
	else {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 50);
		d3.select("#chrome_planet text").attr("opacity", 1);
	}
	
	updateData();
}

function left(e) {
	if(!movedThroughTimeJustNow) {
        movedThroughTimeJustNow = true;
        setTimeout("movedThroughTimeJustNow = false", delayBetweenTimeTravels);
    } else {
        e.preventDefault();
        return;
    }

    //are we following a country that has never switched?
    if($("#selected_country_id").val() != "" && switch_data[$("#selected_country_id").val()].dates.length-1 == 0) {
    	return;
    }

    //have we hit our left bound
	if($("#current_date_top_right").html() == "Jul 2008") {
		if(shaky_shaky_done) {
			shaky_shaky_done = false;
			$("#current_date_top_right").effect( "shake", { times:2, distance:3 }, 10, function() { shaky_shaky_done = true; } ); //shake date
		}
		return;
	}
	
	//if we're following a country, don't move to previous date, but rather to previous date in which the country switched
	if(following_a_country == true) {
		var i;
		if(following_a_country_iterator == 0) i = 0;
		//else if(following_a_country_iterator == switch_data[$("#selected_country_id").val()].dates.length) i = following_a_country_iterator;
		else i = --following_a_country_iterator;

		var prev_date = switch_data[$("#selected_country_id").val()].dates[i];
		//console.log(prev_date);

		//update dates
		var d = Date.parse(prev_date).toString("MMM yyyy");
		var d_full = Date.parse(prev_date).toString("MMMM yyyy");
		$("#current_date_top_right").html(d);
		d3.select("#current_date_top_left").text(d_full);
	}
	else {
		//update dates
		var d = Date.parse($(".current_date").html()).add(-1).month().toString("MMM yyyy");
		var d_full = Date.parse($(".current_date").html()).add(-1).month().toString("MMMM yyyy");
		$(".current_date").html(d);
		d3.select("#current_date_top_left").text(d_full);
	}

	//has chrome been born yet?
	if($("#current_date_top_left").text() == "July 2008" || $("#current_date_top_left").text() == "August 2008") {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 0);
		d3.select("#chrome_planet text").attr("opacity", 0);
	}
	else {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 50);
		d3.select("#chrome_planet text").attr("opacity", 1);
	}

	//update data
	updateData();
}

function right(e) {
	if(!movedThroughTimeJustNow) {
        movedThroughTimeJustNow = true;
        setTimeout("movedThroughTimeJustNow = false", delayBetweenTimeTravels);
    } else {
        e.preventDefault();
        return;
    }

	//are we following a country that has never switched?
    if($("#selected_country_id").val() != "" && switch_data[$("#selected_country_id").val()].dates.length-1 == 0) {
    	return;
    }

    //have we hit our right bound
	var today = Date.today().add(-1).months().toString("MMM yyyy");
	if($("#current_date_top_right").html() == today) {		
		if(shaky_shaky_done) {
			shaky_shaky_done = false;
			$("#current_date_top_right").effect( "shake", { times:2, distance:3 }, 10, function() { shaky_shaky_done = true; } ); //shake date
		}
		return;
	}
	
	//if we're following a country, don't move to next date, but rather to previous date in which the country switched
	if(following_a_country == true) {
		var i;
		//if(following_a_country_iterator == 0) i = 0;
		//console.log(following_a_country_iterator);
		//console.log(switch_data[$("#selected_country_id").val()].dates.length-1);
		if(following_a_country_iterator == switch_data[$("#selected_country_id").val()].dates.length-1) {
			//i = following_a_country_iterator;

			//shake date
			if(shaky_shaky_done) {
				shaky_shaky_done = false;
				$("#current_date_top_right").effect( "shake", { times:2, distance:3 }, 10, function() { shaky_shaky_done = true; } ); //shake date
			}

			return;
		}
		else i = ++following_a_country_iterator;

		var next_date = switch_data[$("#selected_country_id").val()].dates[i];
		//console.log(next_date);

		//update dates
		var d = Date.parse(next_date).toString("MMM yyyy");
		var d_full = Date.parse(next_date).toString("MMMM yyyy");
		$("#current_date_top_right").html(d);
		d3.select("#current_date_top_left").text(d_full);
	}
	else {
		//update dates
		var d = Date.parse($("#current_date_top_right").html()).add(1).month().toString("MMM yyyy");
		var d_full = Date.parse($(".current_date").html()).add(1).month().toString("MMMM yyyy");
		$("#current_date_top_right").html(d);
		d3.select("#current_date_top_left").text(d_full);
	}

	//has chrome been born yet?
	if($("#current_date_top_left").text() == "July 2008" || $("#current_date_top_left").text() == "August 2008") {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 0);
		d3.select("#chrome_planet text").attr("opacity", 0);
	}
	else {
		d3.select("#chrome_planet .planet").transition().duration(500).attr("r", 50);
		d3.select("#chrome_planet text").attr("opacity", 1);
	}

	//update data
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
		
		populateCounts(data);
		setTimeout(populateSummaryBox, populateSummaryBoxDelay);		
		buildMoons(data, ["firefox","ie", "chrome", "opera"]);
	});
}


function isTopMarketFirefox(e) { if($.inArray(e, top_countries) != -1) { firefox_top_countries++; } }
function isTopMarketChrome(e) { if($.inArray(e, top_countries) != -1) { chrome_top_countries++; } }
function isTopMarketIe(e) { if($.inArray(e, top_countries) != -1) { ie_top_countries++; } }
function isTopMarketOpera(e) { if($.inArray(e, top_countries) != -1) { opera_top_countries++; } }


function populateCounts(data) {
	if(data["firefox"] != undefined) $.map(data["firefox"], isTopMarketFirefox);
	if(data["chrome"] != undefined) data["chrome"].map(isTopMarketChrome);
	if(data["ie"] != undefined) data["ie"].map(isTopMarketIe);
	if(data["opera"] != undefined) data["opera"].map(isTopMarketOpera);
}

function populateSummaryBox() {
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
}

function buildMoons(data, planets) {
	//remove current moons then add new ones
	removeCurrentMoons(addNewMoons, data, planets);	
}

function removeCurrentMoons(addNewMoons, data, planets) {
	d3.selectAll(".market,.top_market")
		.transition()
			.duration(400)
			.attr("r", 0)
			.style("opacity", 0)
			.remove();

	if (typeof addNewMoons === 'function') {
        setTimeout(function() {addNewMoons(data, planets);}, 600);
    }
}

function addNewMoons(data, planets) {
	d3.selectAll("path").remove();
	
	$.each(planets, function(index, browser) {
		for(var i=1; i <= eval(browser + "_count"); i++) {
			//console.log("building " + browser + " moon " + i);
			
			//limit to max_orbits number of orbits
			if(i <= max_orbits) {
				d3.select("#" + browser + "_system")
					.append("path")
						.attr("id", browser + "_path"+i)
						.attr("d", "M" + (eval(browser + "_constant_x")+i*100) + "," + eval(browser + "_constant_y") + " h 0 a" + (30+i*100) + "," + (9+i*30) + " 0 1,0 1,1 z")
						.attr("fill", "none");
			}
			
			var g = d3.select("#" + browser + "_system")
				.append("g")
				.attr("class", function() {
					if($.inArray(data[browser][i-1], top_countries) != -1) { 
						return "top_market";
					} 
					else {
						return "market";
					}
				})
				.attr("id", function() { return data[browser][i-1]; });
			
			g.append("circle")
				.style("opacity", 0)
				.attr("r", 0)
				.attr("fill", "url('#gradient_white')")
				/*.attr("stroke", "#a4a4a4")*/
				.attr("class", "moon");

			g.append("text")
				.text(data[browser][i-1])
				.attr("x", -8)
				.attr("y", 5);

			g.append("animateMotion")
				.attr("class", "animo")
				/*.attr("calcMode", "discrete")
				.attr("keyTimes", "0;0;1")
				.attr("keyPoints", function() {
					return "0; " + randomRange(0,1, 5) + "; 1";
				})*/
				.attr("dur", function() {
					//if we're just showing one country
					if(following_a_country == true && data[browser][i-1] == $("#selected_country_id").val()) {
						return "20s";
					}
					else {
						//return randomRange(20,60) + "s";
						//return moonSpeedScale(data[browser][i-1].charCodeAt(0) + data[browser][i-1].charCodeAt(1));
						return (18 + i) + "s";
					}
				})
				.attr("repeatCount", "indefinite")
					.append("mpath")
						.attr("xlink:href", function() {
							//if it's a top market, put in largest orbit
							if($.inArray(data[browser][i-1], top_countries) != -1) { 
								var biggest_orbit = (eval(browser + "_count") < max_orbits) ? eval(browser + "_count") : max_orbits;
								return "#" + browser + "_path"+biggest_orbit;
							}
							//if we're just showing one country, put it in largest orbit
							else if(following_a_country == true && data[browser][i-1] == $("#selected_country_id").val()) {
								var biggest_orbit = (eval(browser + "_count") < max_orbits) ? eval(browser + "_count") : max_orbits;
								return "#" + browser + "_path"+biggest_orbit;
								//return "#" + browser + "_path1";
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
	
	//color top countries differently
	d3.selectAll(".top_market .moon")
		.attr("fill", "url('#gradient_red')");
		//.css("fill", "red");
		/*.attr("stroke", "#ad0000");*/

	if(show_country_names == true) {
		showOnlyCountryNames();
	}
	
	//if we're just showing top countries, then hide the markets (doesn't apply when we're following a country since the moon for that country should show up regardless)
	if(show_all_moons == false && following_a_country == false) {
		$(".market").hide();
	}

	//if we're just following one country, then hide everything else
	if(following_a_country == true) {
		$(".market:not(#" + $("#selected_country_id").val() + "), .top_market:not(#" + $("#selected_country_id").val() + ")").hide();
	}
				
	d3.selectAll(".moon")
		.transition()
			.duration(500)
			.style("opacity", 1) //0.8 was fine in chrome, but killed safari and fx; fx, why hath thou forsaken me :(
			.attr("r", 5);
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

	if(up_opera) { up_opera = false; angle = -6; }
	else { up_opera = true; angle = 6; }
	
	d3.select("#opera_system")
		.transition()
			.ease("cubic-in-out")
			.duration(13000)
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

//http://www.netlobo.com/url_query_string_javascript.html
function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\#&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}