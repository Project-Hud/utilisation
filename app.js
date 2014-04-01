var Widget = new require('hud-widget')
  , widget = new Widget()
  , getSpreadsheet = require('./lib/get-spreadsheet')

var utilisationOptions =
    { debug: true
    , oauth:
      { email: process.env.EMAIL_ADDRESS
      , keyFile: process.env.PRIVATE_KEY
      }
    , spreadsheetId: process.env.SPREADSHEET_ID
    , worksheetId: process.env.WORKSHEET_ID
    }

widget.get('/', function (req, res) {

  getSpreadsheet(utilisationOptions, function (err, rows) {
    if (err) {
      console.error(err)
      return res.send(500, { error: err })
    }

    var dataCount = Object.keys(rows['2']).length
      , monthTitle = rows['1'][dataCount].substr(0, 3)
      , prevMonths =
        [ rows['2'][dataCount - 1]
        , rows['2'][dataCount]
        ]

    if (prevMonths.length === 2) {
      res.render('index', { title: 'Utilisation', months: prevMonths, monthTitle: monthTitle })

    } else {
      console.error('Unsupported spreadsheet layout')
      return res.send(500, { error: 'Unsupported spreadsheet layout' })

    }

  })

})
