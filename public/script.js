/** @function permutations
 * Computes a list of all permutations of [1,2,...,size].
 * This is a brute-force approach with exponential complexity
 * on the size of n.
 * @param {integer} size, a non-negative integer
 * @returns {Array} answer, an array of all permutations
 */
function permutations(size) {
  if(size >= 0) { // Sanity check - we can't create negative permutations.
    if(size == 0) { // Base case for recursion
      // only 1 permuation for a 0-element array - an empty array
      return [[]];
    } else { // Reduction case for recursion
      // compute permutations of a list one size smaller
      var sublist = permutations(size - 1);
      var answer = [];
      sublist.forEach(function(permutation) {
        // insert size in all possible positions in permutation
        for(var i = 0; i < permutation.length + 1; i++) {
          answer.push(
            // use Array.prototype.slice to create two shallow
            // copies of the array before and after position i.
            // Then concatenate these back together with i in the
            // middle, and store them as a parital answer.
            permutation.slice(0, i).concat(size, permutation.slice(i))
          );
        }
      });
      // return the permutations
      return answer;
    }
  }
}

/**
 * When the clear-permutations button is clicked, empty
 * the list of permutations.
 */
$('#clear-permutations').on('click', function(event){
  event.preventDefault();
  $('#permutation-results').empty();
})

/**
 * When the calculate-in-main button is clicked,
 * calculate the permutations in the main thread.
 */
$('#permute-in-main').on('click', function(event) {
  event.preventDefault();
  var n = $('#n').val();

  // Prepare for permutations
  $('#permutation-message').text("Calculating in main...");
  $('#permutation-results').empty();

  // Perform permutatations
  permutations(n).forEach(function(perm) {
    $('<li>').text(perm).appendTo('#permutation-results');
  });

  // Finish by clearing the processing message
  $('#permutation-message').text('');
});

/**
 * When the calculate-in-web-worker button is clicked,
 * calculcate the permutations in a web worker.
 */
$('#permute-in-web-worker').on('click', function(event){
  event.preventDefault();

  // Perform preparations
  $('#permutation-results').empty();
  $('#permutation-message').text("Calculating in web worker...");

  // Calculate permutations using our web worker
  var worker = new Worker('permutations.js');
  worker.postMessage($('#n').val());
  worker.onmessage = function(event){
    console.log(event);
    event.data.forEach(function(perm) {
      $('<li>').text(perm).appendTo('#permutation-results');
    });
  }
})


$('#image-list > img').on('click', function(event){
  event.preventDefault();
  var image = this;
  // Create a canvas the same size as the image
  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  // Create a 2D context
  var ctx = canvas.getContext('2d');
  // Draw the image into it
  ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
  // Get the image pixel data
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Create the worker thread to tranform the image
  var worker = new Worker("grayscale.js");
  // Send the worker the data.
  worker.postMessage(imageData.data);
  // When the worker finishes, it will send us the
  // converted image data back.
  worker.onmessage = function(event){
    // The data comes back as an Uint8ClampedArray view
    // (corresponding to how pixels are stored)
    // Create an ImageData around the Uint8ClampedArray data
    var imageData = new ImageData(event.data, canvas.width, canvas.height);
    //imageData.data = event.data;
    // Put the imageData into our canvas
    ctx.putImageData(imageData, 0, 0);
    // Convert the canvas to a DataURL, and set that
    // as the source of our image - effectively replacing
    // the image's old data with our grayscale data.
    image.src = canvas.toDataURL();
  };
})
