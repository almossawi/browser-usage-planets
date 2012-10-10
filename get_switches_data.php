<?php

//$countries = array("AD","AE","AF","AG","AI","AL","AM","AN","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CS","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SK","SL","SM","SN","SO","SR","ST","SV","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW");
  $countries = array("AD","AE","AF","AG","AI","AL","AM","AN","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BR","BS","BT","BW","BY","BZ","CA","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CS","CU","CV","CW","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GH","GI","GL","GM","GN","GP","GQ","GR","GT","GU","GW","GY","HK","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PH","PK","PL","PM","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SI","SK","SL","SM","SN","SO","SR","ST","SV","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW");
  
$switches = "{";

foreach($countries as $country) {
	//$switches = array();
	$switches .= '"' . $country . '": {"dates":["2008-07",';

	//echo $country;
	
	$handle_dir = opendir('data');
	$i=0;
	$last_browser="";
	
	while (false !== ($file = readdir($handle_dir))){
		if($file == "." || $file == ".." || $file == ".DS_Store" || $file == "switches.json") continue;
		
		//echo $file;
		
		$handle = file_get_contents("data/" . $file);
		$json_contents=json_decode($handle,true);
		if($json_contents['ie'] != null && in_array($country, $json_contents['ie']))
			$browser = "ie";
		else if($json_contents['chrome'] != null && in_array($country, $json_contents['chrome']))
			$browser = "chrome";
		else if($json_contents['opera'] != null && in_array($country, $json_contents['opera']))
			$browser = "opera";
		else if($json_contents['firefox'] != null && in_array($country, $json_contents['firefox']))
			$browser = "firefox";

		//first iteration
		if($last_browser == "")
			$last_browser = $browser;
			
		if($last_browser != $browser) {
			//$switches[] = substr($file, 0, -5);
			$switches .= '"' . substr($file, 0, -5) . '",';
		}
		
		$last_browser = $browser;
		
		$i++;
	}

	//print_r($switches);
	$switches = substr($switches, 0, -1);
	$switches .= "]},";
	
}

$switches = substr($switches, 0, -1);
//$switches = str_replace(' ', '', $switches)

$file = "data/switches.json";
file_put_contents($file, $switches . "}");
//file_put_contents($file, json_encode($switches));

?>