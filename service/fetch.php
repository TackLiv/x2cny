<?php

	include_once("simple_html_dom.php");

	function do_scraping($url) {

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$html = curl_exec($ch);
	    $dom = str_get_html($html);
	    $trs = $dom->find('tr[align=center]');

	    $res = array();
	    foreach ($trs as $item) {
	    	if(is_null($item->find('td',0)))
	    		continue;
	    	$name = $item->find('td',0)->innertext;
	    	switch ($name) {
	    		case '瑞典克朗':
	    			$cur = 'SEK';
	    			break;
	    		case '英镑':
	    			$cur = 'GBP';
	    			break;
	    		case '港币':
	    			$cur = 'HKD';
	    			break;
	    		case '美元':
	    			$cur = 'USD';
	    			break;
	    		case '瑞士法郎':
	    			$cur = 'CHF';
	    			break;
	    		case '新加坡元':
	    			$cur = 'SGD';
	    			break;
	    		case '丹麦克朗':
	    			$cur = 'DKK';
	    			break;
	    		case '挪威克朗':
	    			$cur = 'NOK';
	    			break;
	    		case '日元':
	    			$cur = 'JPY';
	    			break;
	    		case '加拿大元':
	    			$cur = 'CAD';
	    			break;
	    		case '澳大利亚元':
	    			$cur = 'AUD';
	    			break;
	    		case '欧元':
	    			$cur = 'EUR';
	    			break;
	    		case '澳门元':
	    			$cur = 'MOP';
	    			break;
	    		case '菲律宾比索':
	    			$cur = 'PHP';
	    			break;
	    		case '泰国铢':
	    			$cur = 'THB';
	    			break;
	    		case '新西兰元':
	    			$cur = 'NZD';
	    			break;
	    		case '韩国元':
	    			$cur = 'KRW';
	    			break;
	    		case '卢布':
	    			$cur = 'RUB';
	    			break;
	    		default:
	    			break;
	    	}
	    	if(is_null($cur))
	    		continue;
		    $res[$cur]['BR'] = $item->find('td',1)->innertext;
			$res[$cur]['CBR'] = $item->find('td',2)->innertext;
			$res[$cur]['SR'] = $item->find('td',3)->innertext;
			$res[$cur]['CSR'] = $item->find('td',4)->innertext;
			$res[$cur]['datetime'] = $item->find('td',7)->innertext.'|'.$item->find('td',8)->innertext;
	    }
	    // clean up memory
	    $dom->clear();
	    unset($dom);

	   	$json = json_encode($res);
	   	$json = strtoupper($json);
		file_put_contents('data.json', $json);
	}

	do_scraping('http://www.boc.cn/sourcedb/whpj/index.html');
?>

