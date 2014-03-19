(function () {

  function calculateUtilisation(lastMonth, thisMonth) {

  var monthDelta = thisMonth - lastMonth
    , width = $('.utilisation-container').width()
    , height = $('.utilisation-container').height()

  //
  // Calculate the top offset
  //

  var monthAverage = (lastMonth + thisMonth) / 2
  var topOffset = 100 - monthAverage

  //
  // Calculate the rotation needed
  //

  var percentageHeight = (-monthDelta / 100) * height
    , rotationRadians = Math.atan2(percentageHeight, width)
    , rotationDegrees = rotationRadians * (180 / Math.PI)


  //
  // Apply colour based on month delta
  //

  var color
    , tolerance = 10
  if (monthDelta >= -tolerance && monthDelta <= tolerance) color = '#1E8BF0'
  else if (monthDelta > tolerance) color = '#bada55'
  else if (monthDelta < -tolerance)color = '#F0591E'

  //
  // Apply values to the `.utilisation` element
  //

  $('.js-utilisation').css(
    { "transform": "rotate(" + rotationDegrees + "deg)"
    , "top": topOffset + "%"
    , "background-color": color
  })

  //
  // Add Text
  //

  $('.js-utilisation-title').html(monthDelta + '%')
  $('.js-last-month').html(lastMonth + '%')
  $('.js-this-month').html(thisMonth + '%')

}

//
// Initialise for the first time
//

var first = $('.js-utilisation').attr('data-first-month')
  , last = $('.js-utilisation').attr('data-last-month')

calculateUtilisation(Math.round(first), Math.round(last))

//
// Fake new data on button click
//

// $('.js-randomise').on('click', function(){
//   var fakeLastMonth = Math.floor(Math.random() * 100)
//     , fakeThisMonth = Math.floor(Math.random() * 100)

//   calculateUtilisation(fakeLastMonth, fakeThisMonth)
// })

//
// TODO
// ====
// Refactor to be dynamic – percentage widths in Stylus and
// a JS resize listener to update variables and recalculate.
//
})()
