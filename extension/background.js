
/* Default Settings */
chrome.browserAction.setBadgeBackgroundColor({color:"#36C"});

/* Regist Listeners*/
//chrome.browserAction.onClicked.addListener(Dosomething);

/* The variables*/
var currencyData;
var localSettings;

var defaultSettings = {
	BadgeCurrency:'SEK',
	BadgeRate:'SR',
	UILanguage:window.navigator.language,
	ShownCurrencies:['SEK'],
	Tick:1800000,
	Triggers:[]
};

var intv;

function getData(success) {
		$.get('http://boc.globle.tk/data.json')
		.success(
			function(data) {
				currencyData = $.parseJSON(data);
				console.log("Retrieve data successfully.")
				if(success && typeof(success) == 'function') {
					success();
				}
			}
		);
}

function setBadge() {
	if(typeof(currencyData) == 'undefined')
		return;
	var s = currencyData[localSettings.BadgeCurrency][localSettings.BadgeRate];
	s = s.replace(".","");
	var t = currencyData['SEK']['DATETIME'];
	chrome.browserAction.setTitle({title:t});
	chrome.browserAction.setBadgeText({text:s});
	console.log("Badge are configured.")
}

function loadSettings(success) {
	//If exist, go through. If not exist, save the default.
	chrome.storage.local.get(
		'localSettings', 
		function(items) {
			if(typeof(items.localSettings) == 'undefined') {
				window.localSettings = window.defaultSettings;
				localStorage.firstRun = true;
				console.log("Stored settings no exist, default loaded. ");
			} else {
				window.localSettings = items.localSettings;
				localStorage.firstRun = false;
				console.log("Settings are loaded.");
			}

			if(success && typeof(success) == 'function') {
				success(window.localSettings);
			}
		}
	);
}

function saveSettings(success) {
	chrome.storage.local.set(
		{'localSettings': localSettings}, 
		function() {
			console.log("The localSettings are saved");
			if(success && typeof(success) == 'function') {
				success();
			}
		}
	);
}

function mapCurrency(c) {
	var fullName;
	switch(c) {
		case 'GBP':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'British Pound':'英镑';
		break;
		case 'HKD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Hong Kong Dollar':'港币';
		break;
		case 'USD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'US Dollar':'美元';
		break;
		case 'CHF':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Swiss Franc':'瑞士法郎';
		break;
		case 'SGD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Singapore Dollar':'新加坡元';
		break;
		case 'SEK':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Swedish Krona':'瑞典克朗';
		break;
		case 'DKK':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Danish Krone':'丹麦克朗';
		break;
		case 'NOK':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Norwegian Krone':'挪威克朗';
		break;
		case 'JPY':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Japanese Yen':'日元';
		break;
		case 'CAD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Canadian Dollar':'加拿大元';
		break;
		case 'AUD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Australian Dollar':'澳大利亚元';
		break;
		case 'EUR':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Euro':'欧元';
		break;
		case 'MOP':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Macau Pataca':'澳门元';
		break;
		case 'PHP':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Philippine Peso':'菲律宾比索';
		break;
		case 'THB':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Thai Baht':'泰国铢';
		break;
		case 'NZD':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'New Zealand Dollar':'新西兰元';
		break;
		case 'KRW':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'South Korean Won':'韩国元';
		break;
		case 'RUB':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Russian Ruble':'卢布';
		break;
		default:
		break;
	}
	return fullName;
}

function mapRateType(r) {
	var fullName;
	switch(r) {
		case 'BR':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Buying Rate':'现汇买入价';
		break;
		case 'CBR':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Cash Buying Rate':'现钞买入价';
		break;
		case 'SR':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Selling Rate':'现汇卖出价';
		break;
		case 'CSR':
			fullName = !/cn/i.test(localSettings.UILanguage) ? 'Cash Selling Rate':'现钞卖出价';
		break;
		default:
		break;
	}
	return fullName;
}

function showMessage(currency,msg) {
	var notification = webkitNotifications.createNotification('boc48.png',currency,msg);
	notification.show();
	setTimeout(function() {
    	notification.cancel();
	}, 3000);
}

function doVoice(msg) {
	chrome.tts.speak(msg,{'enqueue':true});
}

function doTriggerType(trigger) {
	var currency = mapCurrency(trigger.TriggerCurrency);
	var rateType = mapRateType(trigger.TriggerRate);
	var msg = 
		!/cn/i.test(localSettings.UILanguage) ? 
		'The triggered '+rateType+' of '+currency+' is '+currencyData[trigger.TriggerCurrency][trigger.TriggerRate] :
		currency+'的'+rateType+'是'+currencyData[trigger.TriggerCurrency][trigger.TriggerRate];

	switch(trigger.TriggerType) {
		case 'm' :
			showMessage(currency,msg);
		break;
		case 'v':
			doVoice(msg);
		break;
		case 'mv':
			showMessage(currency,msg);
			doVoice(msg);
		break;
		default:
		break;
	}
}


function translateTrigger(trigger) {
	switch(trigger.TriggerOperator) {
		case 'bigger':
			if(currencyData[trigger.TriggerCurrency][trigger.TriggerRate] > trigger.TriggerValue) {
				doTriggerType(trigger);
			}
		break;
		case 'smaller':
			if(currencyData[trigger.TriggerCurrency][trigger.TriggerRate] < trigger.TriggerValue) {
				doTriggerType(trigger);
			}
		break;
		case 'equal':
			if(currencyData[trigger.TriggerCurrency][trigger.TriggerRate] == trigger.TriggerValue) {
				doTriggerType(trigger);
			}
		break;
		default:
		break;
	}
}

function doWork(success) {
	resetBadge();
	getData(function() {
		setBadge();
		//Triggers
		var i;
		for(i in localSettings.Triggers) {
			var t = localSettings.Triggers[i];
			translateTrigger(t);
		}
		if(success && typeof(success) == 'function') {
			success();
		}
	})
}

function resetBadge() {
	var t;
	var s = '';
	if(typeof localStorage.firstRun == 'undefined') {
		t = !/cn/i.test(localSettings.UILanguage) ?'请配置选项。':'Please save options.';
	} else {
		t = !/cn/i.test(localSettings.UILanguage) ?'无数据':'No Data';
	}
	chrome.browserAction.setTitle({title:t});
	chrome.browserAction.setBadgeText({text:s});
}

function resetInterval() {
	var tick = 1800000;
	if(typeof(localSettings.Tick)!= 'undefined' && localSettings.Tick > 500000)
		tick = localSettings.Tick;
	if(intv)
		clearInterval(intv);
	intv = setInterval(doWork,tick);
	console.log("The Tick is set.");
}

function refresh(success) {
	if(typeof localStorage.firstRun == 'undefined') {
		chrome.tabs.create({url:"optionRouter.html"});
	} else {
		loadSettings(function() {
			doWork(function() {
				if(success && typeof(success) == 'function') {
					success();
				}
			});
			resetInterval();
		});
	}

}

//The first run
refresh();