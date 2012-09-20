<?php

$year = "2008";
//$countries = array("DZ","AO","BH","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CI","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","IR","IQ","IL","JO","KE","KW","LB","LS","LR","LY","MG","MW","ML","MR","MU","YT","MA","MZ","NA","NE","NG","OM","PS","QA","RW","RE","SH","ST","SA","SN","SC","SL","SO","ZA","SD","SZ","SY","TZ","TG","TN","UG","AE","EH","YE","ZM","ZW","AS","AU","BV","IO","BN","KH","CN","CX","CC","CK","FJ","PF","TF","GU","HM","HK","CN","ID","JP","KI","LA","MO","MY","MH","FM","NR","NC","NZ","NU","NF","MP","KP","PW","GN","PH","PN","WS","SG","SB","GS","KR","TW","TH","TL","TO","TK","TV","UM","VU","VN","WF","AL","AD","AT","BY","BE","BA","BG","HR","CY","CZ","DK","EE","FO","FI","FR","GE","GI","GR","GG","HU","IS","IE","IM","IT","JE","LV","LI","LT","LU","MK","MT","FR","MD","MC","ME","NL","NO","PL","PT","RO","RU","SM","RS","ME","SK","SI","ES","SJ","SE","CH","TR","UA","GB","VA","AX","AR","BO","BR","CL","CO","EC","FK","GF","GY","PY","PE","SR","UY","VE","AI","AG","AW","BS","BB","BZ","BM","VG","CA","KY","CR","CU","DM","DO","SV","GL","GD","GP","GT","HT","HN","JM","MQ","MS","MX","AN","NI","PA","PR","KN","LC","PM","VC","TT","TC","US","VI","AF","AM","AZ","BD","BT","MM","IN","KZ","KG","MV","MN","NP","PK","LK","TJ","TM","UZ");
  $countries = array("AD","AE","AF","AG","AI","AL","AM","AN","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CS","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SK","SL","SM","SN","SO","SR","ST","SV","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW");

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