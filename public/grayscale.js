/** grayscale.js
 * Webworker script for grayscaling image data.
 * @param {Buffer} data - the data to process
 */
onmessage = function(event) {
  var data = event.data;

  // Process each pixel separately
  for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];

        // Generate the grayscale values using weights based
        // on human perception
        var value = r * 0.2989 + g * 0.5870 + b * 0.1140;

        // Set the pixel RGB values to our grayscale value
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
    }
    // Send the transformed data back to the main thread
    postMessage(data);
    // Since we're done, and won't reuse this worker,
    // close the worker to end its process and free its memory
    close();
}
