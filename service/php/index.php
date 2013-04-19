<?php

	function query_currency_price($currency,$type) {
		$currency = strtoupper($currency);
		$type = strtoupper($type);
		$j = file_get_contents('data.json');
		$data = json_decode($j,true);
		if(array_key_exists($currency, $data) && array_key_exists($type, $data[$currency]))
			return $data[$currency][$type];
		else
			return false;
	}

	function query_currency_full($currency) {
		$currency = strtoupper($currency);
		$j = file_get_contents('data.json');
		if($currency == 'ALL')
			return $j;
		$data = json_decode($j,true);
		if(array_key_exists($currency, $data))
			return "{\"".$currency."\":".json_encode($data[$currency])."}";
		else
			return false;
	}

if(isset($_GET['c']))
	$c = $_GET['c'];
if(isset($_GET['t']))
	$t = $_GET['t'];

if(isset($c) && isset($t))
	echo query_currency_price($c,$t);
else if(isset($c) && !isset($t))
	echo query_currency_full($c);
else
	echo query_currency_price('sek','sr');
?>