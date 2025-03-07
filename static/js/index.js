window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/zebra";
var NUM_INTERP_FRAMES = 40;

// Declare scales globally!
var interp_images = [];
var scales = [];  // <-- You need this variable

function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

// This function will load the JSON mapping
function loadMapping() {
  var mappingPath = INTERP_BASE + '/mapping.json';
  return fetch(mappingPath)
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not load mapping.json: " + response.statusText);
      }
      return response.json();
    })
    .then(mapping => {
      // mapping is an array of objects like:
      // [
      //   { "old_filename": "13_zebra_2.3456.png", "new_filename": "000000.jpg", "scale": "2.3456" },
      //   { ... },
      //   ...
      // ]
      // We'll assume the i-th entry's "new_filename" is i-th frame.
      for (let i = 0; i < mapping.length; i++) {
        scales[i] = mapping[i].scale;
      }
    })
    .catch(err => {
      console.error("Error loading mapping.json:", err);
    });
}


function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);

  // Also set the scale text
  // e.g. "Scale = 2.3456"
  // If we haven’t loaded the mapping yet or no scale for i, show something else
  var scaleText = scales[i] || "Scale unknown";
  $('#scale-info').text("Scale: " + scaleText);
}


$(document).ready(function() {
  // ... your existing code ...

  // 1) Preload images immediately
  preloadInterpolationImages();

  // 2) Load mapping (returns a promise)
  loadMapping().then(() => {
    // Once the mapping is loaded, set the default image & scale
    setInterpolationImage(0);
  });

  // 3) Configure slider
  $('#interpolation-slider')
    .prop('max', NUM_INTERP_FRAMES - 1)
    .on('input', function(event) {
      setInterpolationImage(this.value);
    });

  // Make sure we show at least the 0th frame if JSON fails or not loaded yet
  setInterpolationImage(0);

  // ... the rest of your setup code ...
});




// $(document).ready(function() {
//     // Check for click events on the navbar burger icon
//     $(".navbar-burger").click(function() {
//       // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
//       $(".navbar-burger").toggleClass("is-active");
//       $(".navbar-menu").toggleClass("is-active");

//     });

//     var options = {
// 			slidesToScroll: 1,
// 			slidesToShow: 3,
// 			loop: true,
// 			infinite: true,
// 			autoplay: false,
// 			autoplaySpeed: 3000,
//     }

// 		// Initialize all div with carousel class
//     var carousels = bulmaCarousel.attach('.carousel', options);

//     // Loop on each carousel initialized
//     for(var i = 0; i < carousels.length; i++) {
//     	// Add listener to  event
//     	carousels[i].on('before:show', state => {
//     		console.log(state);
//     	});
//     }

//     // Access to bulmaCarousel instance of an element
//     var element = document.querySelector('#my-element');
//     if (element && element.bulmaCarousel) {
//     	// bulmaCarousel instance is available as element.bulmaCarousel
//     	element.bulmaCarousel.on('before-show', function(state) {
//     		console.log(state);
//     	});
//     }

//     /*var player = document.getElementById('interpolation-video');
//     player.addEventListener('loadedmetadata', function() {
//       $('#interpolation-slider').on('input', function(event) {
//         console.log(this.value, player.duration);
//         player.currentTime = player.duration / 100 * this.value;
//       })
//     }, false);*/
//     preloadInterpolationImages();

//     $('#interpolation-slider').on('input', function(event) {
//       setInterpolationImage(this.value);
//     });
//     setInterpolationImage(0);
//     $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

//     bulmaSlider.attach();

// })
