<?php

$year = "2008";
$countries = array("DZ","AO","BH","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CI","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","IR","IQ","IL","JO","KE","KW","LB","LS","LR","LY","MG","MW","ML","MR","MU","YT","MA","MZ","NA","NE","NG","OM","PS","QA","RW","RE","SH","ST","SA","SN","SC","SL","SO","ZA","SD","SZ","SY","TZ","TG","TN","UG","AE","EH","YE","ZM","ZW", "AS","AU","BV","IO","BN","KH","CN","CX","CC","CK","FJ","PF","TF","GU","HM","HK","CN","ID","JP","KI","LA","MO","MY","MH","FM","NR","NC","NZ","NU","NF","MP","KP","PW","GN","PH","PN","WS","SG","SB","GS","KR","TW","TH","TL","TO","TK","TV","UM","VU","VN","WF","AL","AD","AT","BY","BE","BA","BG","HR","CY","CZ","DK","DE","EE","FO","FI","FR","GE","DE","GI","GR","GG","HU","IS","IE","IM","IT","JE","LV","LI","LT","LU","MK","MT","FR","MD","MC","ME","NL","NO","PL","PT","RO","RU","SM","RS","ME","SK","SI","ES","SJ","SE","CH","TR","UA","GB","VA","AX","AR","BO","BR","CL","CO","EC","FK","GF","GY","PY","PE","SR","UY","VE","AI","AG","AW","BS","BB","BZ","BM","VG","CA","KY","CR","CU","DM","DO","SV","GL","GD","GP","GT","HT","HN","JM","MQ","MS","MX","AN","NI","PA","PR","KN","LC","PM","VC","TT","TC","US","VI","AF","AM","AZ","BD","BT","MM","IN","KZ","KG","MV","MN","NP","PK","LK","TJ","TM","UZ");

for($month=1;$month<=12;$month++) {
	$top_market_share_owner = array();
	$data = "";
	
	if($month < 10) $month_str = "0" . $month;
	else $month_str = $month;

	for($i=0;$i<sizeof($countries);$i++) {	
		$row = 1;

		//$get_url = "http://gs.statcounter.com/chart.php?bar=1&statType_hidden=browser&region_hidden=" . $countries[$i] . "&granularity=daily&statType=Browser&fromMonthYear=2012-08&fromDay=31&toMonthYear=2012-08&toDay=31&csv=1";
		$get_url = "http://gs.statcounter.com/chart.php?bar=1&statType_hidden=browser&region_hidden=" . $countries[$i] . "&granularity=monthly&statType=Browser&fromMonthYear=" . $year . "-" . $month_str . "&toMonthYear=" . $year . "-" . $month_str . "&csv=1";

		if(($handle = fopen($get_url, "r")) !== FALSE) {
    		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
				//skip first line
				if($row == 1) { $row++; continue; }

	    		//2nd line in the csv file is what we want, so we add that country to the set of the particular browser that it's mapped to
    	    	//$top_market_share_owner[$data[0]] = $data[1]; //data[1] is the percentage; might need it in a future iteration
	        	$top_market_share_owner[strtolower($data[0])][] = $countries[$i];

    	    	break;
		    }
    		fclose($handle);
		}

		usleep(100+rand(100,1100));
	}
		
	$data = json_encode($top_market_share_owner);
	//echo $data;
	print_r($top_market_share_owner);

	$file = "data/" . $year . "-" . $month_str . ".json";
	file_put_contents($file, $data);
}

?>