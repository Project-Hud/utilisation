(function () {

  function calculateUtilisation(thisMonth, lastMonth, monthDelta) {

    var width = $('.utilisation-container').width()
      , height = $('.utilisation-container').height()

    //
    // Calculate the top offset
    //

    var monthAverage = (lastMonth + thisMonth) / 2
    var topOffset = 100 - monthAverage


    var rotationDegrees = calculateRotation(monthDelta, width, height)

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
    if (monthDelta > 0) $('.js-utilisation-title').html('+' + monthDelta.toString() + '%')
    else if (monthDelta < 0) $('.js-utilisation-title').html( monthDelta.toString() + '%')
    else $('.js-utilisation-title').html('0%')
    $('.js-last-month').html(lastMonth + '%')
    $('.js-this-month').html(thisMonth + '%')


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
      , lastMonthTitle = months[(new Date()).getMonth()-1]
      , twoMonthTitle = months[new Date().getMonth()-2]
    $('.js-last-month-title').html(lastMonthTitle)
    $('.js-two-month-title').html(twoMonthTitle)

  }

  function calculateRotation(monthDelta, width, height) {
    //
    // Calculate the rotation needed
    //

    var percentageHeight = (-monthDelta / 100) * height
      , rotationRadians = Math.atan2(percentageHeight, width)
      , rotationDegrees = rotationRadians * (180 / Math.PI)

    return rotationDegrees
  }

  //
  // Initialise for the first time
  //


  var lastMonth = Math.round($('.js-utilisation').data('first-month'))
    , thisMonth = Math.round($('.js-utilisation').data('last-month'))
    , monthDelta = thisMonth - lastMonth

  calculateUtilisation(thisMonth, lastMonth, monthDelta)

  $(window).on('resize', function(){
    var newWidth = $('.utilisation-container').width()
      , newHeight = $('.utilisation-container').height()

    var newRotation = calculateRotation(monthDelta, newWidth, newHeight)
      $('.js-utilisation').css(
      { "transform": "rotate(" + newRotation + "deg)"
    })

  })


//
// TODO
// ====
// Refactor to be dynamic – percentage widths in Stylus and
// a JS resize listener to update variables and recalculate.
//
})()
