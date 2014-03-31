var Widget = new require('hud-widget')
  , widget = new Widget()
  , getSpreadsheet = require('./lib/get-spreadsheet')
  , moment = require('moment')
  , _ = require('lodash')

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

widget.get('/', function (req, res) {

  getSpreadsheet(utilisationOptions, function (err, rows) {
    if (err) {
      console.error(err)
      return res.send(500, { error: err })
    }

    var monthTitle
      , prevMonths =
        [ moment().subtract('months', 2).format(dateFormat)
        , moment().subtract('months', 1).format(dateFormat)
        ]

    if (typeof rows['1'] !== 'undefined' && typeof rows['2'] !== 'undefined') {

      _.each(rows['1'], function (month, key) {
        if (prevMonths[0] === month) {
          prevMonths[0] = rows['2'][key] || -1
        }
        else if (prevMonths[1] === month) {
          monthTitle = month.substr(0,3)
          prevMonths[1] = rows['2'][key] || -1
        }
      })

      res.render('index', { title: 'Utilisation', months: prevMonths, monthTitle: monthTitle })

    } else {

      console.error('Unsupported spreadsheet layout')
      return res.send(500, { error: 'Unsupported spreadsheet layout' })

    }

  })

})
