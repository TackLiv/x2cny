var p = chrome.extension.getBackgroundPage();
var s = p.localSettings;
var d = p.currencyData;

$(document)
	.on('click',".control a",chartTimeSpan)
	.on('click',"li .title",toggleListItem)
	.on('click',"#refresh",refreshData)
	.on('click',"a#option",openOption);

$(document).ready(function() {
	buildUI();
})


function openOption(event) {
	chrome.tabs.create({url:"optionRouter.html"});
	event.preventDefault;
}

function refreshData(event) {
	$("#loader").show();
	t = setTimeout(resetUI,6000);
	p.refresh(function() {
		clearTimeout(t);
		buildUI();
		$("#loader").hide();
	});

	event.preventDefault();
}

function toggleListItem(event) {
	if($(this).parent().hasClass("expand")) {
		$(this).parent().removeClass("expand");
	} else {
		$(".expand").removeClass("expand");
		$(this).parent().addClass("expand");
	}
	event.preventDefault();
}



function chartTimeSpan(event) {
	var range = $(this).attr('href').slice(1);
	var name = $(this).siblings(".cname").text();
	var newsrc="";
	if(range == 'w') {
		newsrc = 'http://chart.finance.yahoo.com/w?s='+name+'CNY=X'
	} else {
		newsrc = 'http://chart.finance.yahoo.com/'+range+'?'+name+'CNY=X'
	}
	$(this).parent().siblings("img").attr('src',newsrc);

	event.preventDefault();
}

function resetUI() {
	//Reset ui
	$("#list").html('');
	$("#loader").hide();
	/cn/i.test(s.UILanguage) ? $("#refresh").html('立即刷新'):$("#refresh").html('Refresh Now');
	/cn/i.test(s.UILanguage) ? $('#top').html(' 暂无数据 '): $('#top').html(' No Data ');
	/cn/i.test(s.UILanguage) ? $("a#option").html('选项'): $("a#option").html('Option');
}


function buildUI(success) {
	resetUI();
	if(typeof(d) == 'undefined')
		return;
	var c;
	for(c in s.ShownCurrencies) {
		var name = s.ShownCurrencies[c];
		makeList(d[name],name);
	}
	//Update the Datetime
	s.UILanguage == 'cn' ?
		$("#top").html(
			'<a href="http://www.boc.cn/sourcedb/whpj/index.html" target="_blank">中国银行</a>'+
			 ' '+d['SEK']['DATETIME']):
		$("#top").html(
			'From '+ 
			'<a href="http://www.boc.cn/sourcedb/whpj/enindex.html" target="_blank">Bank of China</a>'+
			 ' at '+d['SEK']['DATETIME']);
							
	if(success && typeof(success) == 'function') {
		success();
	}
}


function makeList(cobject,name) {
	var i;
	for(i in cobject) {
		cobject[i] = cobject[i].replace("&NBSP;","NULL")
	}
	if(s.UILanguage == 'en') {
		$("#list").append(
			'<li class="item">'+
				'<a href="#" class="title">'+
					'<div class="cname">'+name+'</div>'+
					'<div class="cvalue br" title="Buying Rate">'+cobject.BR+'</div>'+
					'<div class="cvalue cbr" title="Cash Buying Rate">'+cobject.CBR+'</div>'+
					'<div class="cvalue sr" title="Selling Rate">'+cobject.SR+'</div>'+
					'<div class="cvalue csr" title="Cash Selling Rate">'+cobject.CSR+'</div>'+
				'</a>'+
				'<div class="chart">'+
					'<div class="control">'+
						'Show chart in:'+
						'<a href="#w">1 week</a> /'+
						'<a href="#3m">3 month</a> /'+
						'<a href="#1y">1 year</a>'+
						'<span class="hidden cname">'+name+'</span>'+
					'</div>'+
					'<img src="http://chart.finance.yahoo.com/w?s='+name+'CNY%3dX"/>'+
				'</div>'+
			'</li>'
		);
	} else {
		$("#list").append(
			'<li class="item">'+
				'<a href="#" class="title">'+
					'<div class="cname">'+name+'</div>'+
					'<div class="cvalue br" title="现汇买入价">'+cobject.BR+'</div>'+
					'<div class="cvalue cbr" title="现钞买入价">'+cobject.CBR+'</div>'+
					'<div class="cvalue sr" title="现汇卖出价">'+cobject.SR+'</div>'+
					'<div class="cvalue csr" title="现钞卖出价">'+cobject.CSR+'</div>'+
				'</a>'+
				'<div class="chart">'+
					'<div class="control">'+
						'数据时间段:'+
						'<a href="#w"> 一周</a> /'+
						'<a href="#3m"> 三月</a> /'+
						'<a href="#1y"> 一年</a>'+
						'<span class="hidden cname">'+name+'</span>'+
					'</div>'+
					'<img src="http://chart.finance.yahoo.com/w?s='+name+'CNY%3dX"/>'+
				'</div>'+
			'</li>'
		);
	}

}

//Todo User click badge -> dowork and when finished -> update the ui