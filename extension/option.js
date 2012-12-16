var p = chrome.extension.getBackgroundPage();
var s;
var d = p.currencyData;

$(document)
	.on('click',".currency",currencyClick)
	.on('click',"#newTrigger",newTrigger)
	.on('click',"#saveNewTrigger",saveNewTrigger)
	.on('click',"#cancelNewTrigger",cancelNewTrigger)
	.on('click',".dellTrigger",dellTrigger)
	.on('click',"#ui2Settings",ui2Settings);

$(window).unload(ui2Settings);

$(document).ready(function() {
	settings2UI();
})

/* UI events handlers */

function dellTrigger(event) {
	//Remove the current trigger record
	var index = $(this).siblings(".index").text();
	console.log(index);
	delete s.Triggers[index];
	triggers2UI(); //Refresh ui
}

function cancelNewTrigger(event) {
	$("#newTriggerPanel").hide();
	$("#newTrigger").show();
	//Clear the value
	resetNewTriggerPanel();
}

function saveNewTrigger(event) {
	//validate the tValue
	var validated = validateTrigger();
	if(validated) {
		var trigger;
		trigger = new Object();
		trigger.TriggerCurrency = $("#tCurrency").val();
		trigger.TriggerRate = $("#tRate").val();			
		trigger.TriggerValue = $("#tValue").val();
		trigger.TriggerOperator = $("#tOperator").val();
		trigger.TriggerType = $("#tType").val();
		s.Triggers.push(trigger);
		$("#newTriggerPanel").hide();
		$("#newTrigger").show();
		triggers2UI();
		resetNewTriggerPanel();
	}
	event.preventDefault();
}

function newTrigger(event) {
	$("#newTriggerPanel").show();
	$(this).hide();
}

function currencyClick(event) {
	if($(this).hasClass('checked'))
		$(this).removeClass('checked');
	else
		$(this).addClass('checked');
	event.preventDefault();
}


/* settings to UI */

function currencies2UI() {
	//check the Currencies as the ShownCurrencies
	for(var i=0;i <s.ShownCurrencies.length;++i) {
		var q = ".currency[href="+s.ShownCurrencies[i]+"]";
		$(q).addClass('checked');
	}
}

function internal2UI() {
	//Refresh Internal
	qString = ".internal[value="+s.Tick+"]";
	$(qString).attr('checked',true);
}

function badge2UI(){
	//Select the Badge Currency
	$("#badgeCurrency").val(s.BadgeCurrency);
	//Select the Badge Currency type
	qString = ".badgetype[value="+s.BadgeRate+"]";
	$(qString).attr('checked',true);
}

function triggers2UI() {
	$("#triggerlist").html('');
	var i;
	for(i in s.Triggers) {
		trigger = s.Triggers[i];
		var currencyText = $('#tCurrency option[value='+ trigger.TriggerCurrency+']').text();
		var rateTypeText = $('#tRate option[value='+ trigger.TriggerRate +']').text();
		var operatorText = $('#tOperator option[value='+ trigger.TriggerOperator +']').text();
		var valueText = trigger.TriggerValue;
		var typeText = $('#tType option[value='+trigger.TriggerType+']').text();
		!/cn/i.test(s.UILanguage) ?
			$("#triggerlist").append(
				'<li>'+
				'<span class="index">'+i+'</span> '+
				'If <b>'+rateTypeText+'</b> of <b>'+currencyText+
				'</b> is <b>'+operatorText+'</b> than <b>'+valueText+
				'</b>, send <b>'+typeText+'</b> notice.'+
				' <a href="#" class="dellTrigger">'+
					'<img src="delete.png" alt="Delete" title="Click to delete this record."/>'+
				'</a>'+
				'</li>'
			) :
			$("#triggerlist").append(
				'<li>'+
				'<span class="index">'+i+'</span> '+
				'如果币种'+currencyText+'的'+rateTypeText+
				operatorText+valueText+
				',使用'+typeText+'通知我.'+
				' <a href="#" class="dellTrigger">'+
					'<img src="delete.png" alt="Delete" title="点此删除本条记录"/>'+
				'</a>'+
				'</li>'
			);
	}
}

/* Load settings to UI */

function settings2UI() {
	p.loadSettings(function(settings) {
		s = settings;
		//Don't use stored language setting, detect fresh new language setting.
		if($(".language.checked").attr('href') == 'option_en.html')
			s.UILanguage = 'en';
		else
			s.UILanguage = 'cn';
		currencies2UI();
		badge2UI();
		internal2UI();
		triggers2UI();
	})
}

 /* Save the new settings from UI to storage */

function ui2Settings(event) {
	//language
	if($(".language.checked").attr('href') == 'option_en.html')
		s.UILanguage = 'en';
	else
		s.UILanguage = 'cn';
	//Currencies
	var c = [];
	$(".currency.checked").each(function() {
		c.push($(this).attr('href'));
	})
	s.ShownCurrencies = c;
	//Badge
	s.BadgeCurrency = $("#badgeCurrency").val();
	s.Badgetype = $("input[name=badgetype]:radio:checked").val();
	//Internal
	s.Tick = $("input[name=internal]:radio:checked").val();
	p.localSettings = s;
	p.saveSettings(function() {
		var message;
		message = !/cn/i.test(s.UILanguage) ? 'Saved': "已保存";
		p.refresh();
		$("#message").html(message).fadeIn("fast").delay(800).fadeOut("fast");
	})
	if(event)
	event.preventDefault();
}

/* Trigger Functions */ 

function validateTrigger() {
	var rep = /(^\d+\.\d+$)|(^\d+$)/;
	var text = $("#tValue").val();
	if(rep.test(text)) {
		$("#triggerError").hide();
		$("#tValue").removeClass("error");
		return true;
	} else {
		$("#triggerError").fadeIn(800);
		$("#tValue").addClass("error");
		return false;
	}
}

function resetNewTriggerPanel() {
	$("#tRate").prop('selectedIndex',0);
	$("#tCurrency").prop('selectedIndex',0);
	$("#tValue").val("");
	$("#tOperator").prop('selectedIndex',0);
	$("#tType").prop('selectedIndex',0);
	$("#triggerError").hide();
	$("#tValue").removeClass("error");
}

/*
var localSettings = {
	BadgeCurrency:'SEK',
	BadgeRate:'SR',
	UILanguage:'en',
	ShownCurrencies:['GBP','USD','SEK'],
	Currencies:['GBP','HKD','USD','CHF','SGD','SEK','DKK','NOK','JPY','CAD','AUD','EUR','MOP','PHP','THB','NZD','KRW','RUB'],
	Tick:1800000,
	Triggers:[
		{
			TriggerCurrency:'SEK',
			TriggerRate:'SR',
			TriggerValue:93.00,
			TriggerOperator:'bigger',
			TriggerType:'message'
		},
		{
			TriggerCurrency:'SEK',
			TriggerRate:'SR',
			TriggerValue:93.00,
			TriggerOperator:'bigger',
			TriggerType:'message'
		}
	]
}

*/