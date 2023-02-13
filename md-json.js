var fs = require('fs')
var moment = require('moment')
var jsonmark = require('./json-mark.js')




//date
var m = moment().format('YY-MM-DD');
//reading file
var content = fs.readFileSync(m + ".md", 'utf8');





var json = JSON.stringify(jsonmark.parse(content), null, '  ')
var markdown = jsonmark.stringify(jsonmark.parse(content))

console.log(json)