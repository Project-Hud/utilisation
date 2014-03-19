module.exports = getSpreadsheet

var gspreadSheet = require('edit-google-spreadsheet')

function getSpreadsheet(options, cb) {
  options.callback = sheetReady

  gspreadSheet.load(options)

  function sheetReady(err, spreadsheet) {
    if(err) return cb(err)

    spreadsheet.receive(function(err, rows) {
      if(err) return cb(err)

      cb(null, rows)
    })
  }

}
