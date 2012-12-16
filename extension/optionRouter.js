var p = chrome.extension.getBackgroundPage();
if(typeof p.localSettings != 'undefined' && typeof p.localSettings.UILanguage != 'undefined')
	window.location.href = /cn/i.test(p.localSettings.UILanguage)?"option_cn.html":"option_en.html";
else
	window.location.href = /cn/i.test(window.navigator.language)?"option_cn.html":"option_en.html";