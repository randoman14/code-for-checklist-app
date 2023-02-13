//how this regex works
// ^ asserts position at start of a line
//regex finding charcter #
var header = /^#/


//this regex works like this
// ^ asserts position at start of a line
// # matches the character # with index 3510 (2316 or 438) literally (case sensitive)
// + matches the previous token between one and unlimited times, as many times as possible, giving back as needed (greedy)
// \s matches any whitespace character (equivalent to [\r\n\t\f\v ])
// * matches the previous token between zero and unlimited times, as many times as possible, giving back as needed (greedy)
// 1st Capturing Group (.+)
// . matches any character (except for line terminators)
// + matches the previous token between one and unlimited times, as many times as possible, giving back as needed (greedy)
// \s matches any whitespace character (equivalent to [\r\n\t\f\v ])
// * matches the previous token between zero and unlimited times, as many times as possible, giving back as needed (greedy)
// $ asserts position at the end of a line
// Global pattern flags 
// g modifier: global. All matches (don't return after first match)
// m modifier: multi line. Causes ^ and $ to match the begin/end of each line (not only begin/end of string)
  , HEADER_STRING = /^#+\s*(.+)\s*$/


  //module.exports alowes you to use functions in other parts of your appliactions like to read markdown to json i dont have to have all the code there i can export this code and use it there
module.exports = {
  //matchig the regex
    _getHeader: function(row) {
      return row.match(HEADER_STRING)[1]
    }
    //parseing the content 
  , _parseContent: function(rows) {
    //headerObj is an object with the value content, self, and a function strinfybody.
      var headerObj
        , content = {}
        , self = this
        , stringifyBody = function(bodyObj) {
            return bodyObj.join('\n').trim()
          }

      rows.forEach(function(row) {
        //testing the regex header
        if (header.test(row)) {
          if (headerObj)
            headerObj.body = stringifyBody(headerObj.body)
// add ing to the headerObj
          headerObj = {
              head: row
            , body: []
          }

          content[self._getHeader(row)] = headerObj
        } else {
          headerObj.body.push(row)
        }
      })

      headerObj.body = stringifyBody(headerObj.body)

      return content
    }
  , _parseOrder: function(rows) {
      var self = this

      return rows
        .filter(function(row) {
          return row[0] === '#'
        })
        .map(function(row) {
          return self._getHeader(row)
        })
    }
  , parse: function(markdown) {
      var rows = markdown.split('\n')

      if (markdown.trim() === '')
        return {
            order: []
          , content: {}
        }

      return {
            order: this._parseOrder(rows)
          , content: this._parseContent(rows)
        }
    }
  , stringify: function(json) {
    //object json.order
      var order = json.order
        , content = json.content

      return order.map(function(key) {
        var str = content[key].head

        if (content[key].body.length > 0)
          str = str + '\n\n' + content[key].body

        return str
      }).join('\n\n')
    }
}

