/** grayscale.js
 * Webworker script for computing permutations of n size.
 */
onmessage = function(event) {
  // Get the permutations using the permutations function
  var perms = permutations(event.data);
  // Send our results back to the main thread
  postMessage(perms);
  // Close the worker since we create a
  // new worker with each permutation request.
  // Alternatively, we could re-use the same
  // worker.
  close();
}

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
