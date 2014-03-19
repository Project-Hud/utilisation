
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , app = express()
  , getSpreadsheet = require('./lib/get-spreadsheet')
  , moment = require('moment')
  , _ = require('lodash')

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler())
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})

var utilisationOptions =
    { debug: true
    , oauth:
      { email: process.env.EMAIL_ADDRESS
      , keyFile: process.env.PRIVATE_KEY
      }
    , spreadsheetId: process.env.SPREADSHEET_ID
    , worksheetId: process.env.WORKSHEET_ID
    }
  , dateFormat = 'MMMM YYYY'

app.get('/', function (req, res) {

  getSpreadsheet(utilisationOptions, function (err, rows) {
    if (err) {
      console.error(err)
      return res.send(500, { error: err })
    }

    var prevMonths = 
        [ moment().subtract('months', 2).format(dateFormat) 
        , moment().subtract('months', 1).format(dateFormat)
        ]

    if (typeof rows['1'] !== 'undefined' && typeof rows['2'] !== 'undefined') {
      _.each(rows['1'], function (month, key) {
        if (prevMonths[0] === month) prevMonths[0] = rows['2'][key] || -1
        else if (prevMonths[1] === month) prevMonths[1] = rows['2'][key] || -1
      })
      
      res.render('index', { title: 'Utilisation', months: prevMonths })
    } else {
      console.error('Unsupported spreadsheet layout')
      return res.send(500, { error: 'Unsupported spreadsheet layout' })
    }
  })

})
