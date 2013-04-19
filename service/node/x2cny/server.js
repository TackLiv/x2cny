var express = require('express')
var app = express()
var fs = require('fs')
var dataJSON  = ""

app.get('/data.json', function(req,res) {
	if(dataJSON)
		res.send(dataJSON)
	else
		res.send("")
})

app.listen(process.env.VCAP_APP_PORT || 80)

//requires
var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var url = 'http://www.boc.cn/sourcedb/whpj/enindex.html'
var dataObj = {}

//scrapper
var job = setInterval(
request(url, function(err, resp, body) {
	if(err) { throw err }

	$ = cheerio.load(body)

	$('tr[align=center]').each(function(index, element){
		var tds = $(this).children('td')
		if(tds.length == 0)
			return
		var currency = tds.eq(0).text()
	    if(currency == "") return
	    var tempObj = {}
		tempObj.BR = /\s/.test(tds.eq(1).text()) ? "": tds.eq(1).text()
		tempObj.CBR = /\s/.test(tds.eq(2).text()) ? "": tds.eq(2).text()
		tempObj.SR = /\s/.test(tds.eq(3).text()) ? "": tds.eq(3).text()
		tempObj.CSR = /\s/.test(tds.eq(4).text()) ? "": tds.eq(4).text()
		var n = tds.eq(6).text().match(/(\d{4}-\d{2}-\d{2})\s*(\d{2}:\d{2}:\d{2})/)
		tempObj.DATETIME = n[1]+'-'+n[2]
	    dataObj[currency] = tempObj
	    
	})
	dataJSON = JSON.stringify(dataObj)
//	fs.writeFile("data.json", JSON.stringify(dataObj), function(err){
//		!err||console.log(err)
//	})
}), 30*60*1000)