window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/zebra";
var NUM_INTERP_FRAMES = 40;

// Global arrays for images and scale values
var interp_images = [];
var scales = [];

/**
 * Preload all interpolation frames into `interp_images`.
 */
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

/**
 * Load mapping.json to fill the `scales` array with frame-specific scale values.
 */
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
      // Example mapping entry:
      // {
      //   "old_filename": "13_zebra_2.3456.png",
      //   "new_filename": "000000.jpg",
      //   "scale": "2.3456"
      // }
      for (let i = 0; i < mapping.length; i++) {
        scales[i] = mapping[i].scale; 
      }
    })
    .catch(err => {
      console.error("Error loading mapping.json:", err);
    });
}

/**
 * Display the i-th preloaded image and update the scale text.
 */
function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);

  // If we have a valid scale, parse and format it to 4 significant digits.
  var scaleValue = parseFloat(scales[i]);
  var formattedScale = !isNaN(scaleValue) ? scaleValue.toPrecision(4) : "unknown";
  
  $('#scale-info').text("Scale: " + formattedScale);
}

$(document).ready(function() {
  // 1) Preload images
  preloadInterpolationImages();

  // 2) Load mapping.json, then set the initial frame
  loadMapping().then(() => {
    setInterpolationImage(0);
  });

  // 3) Configure the slider
  $('#interpolation-slider')
    .prop('max', NUM_INTERP_FRAMES - 1)
    .on('input', function() {
      setInterpolationImage(this.value);
    });

  // Show the 0th frame in case mapping.json fails or is slow
  setInterpolationImage(0);

  // 4) Auto-cycle the slider
  var cycleSpeed = 50; // ms between frames
  setInterval(function() {
    var currentVal = Number($('#interpolation-slider').val());
    var nextVal = (currentVal + 1) % NUM_INTERP_FRAMES;
    $('#interpolation-slider').val(nextVal).trigger('input');
  }, cycleSpeed);
});
