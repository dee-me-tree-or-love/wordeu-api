module.exports = {

  levensteinDistance: (text, search) => {
    // aliases for the two strings
    const sa = text;
    const sb = search;
    // initialize the two dimensional array
    let dist = []
    // populate the array
    for (let i = 0; i <= sa.length; i++) {
      dist[i] = [i]; // define array 
    }
    for (let i = 0; i <= sb.length; i++) {
      dist[0][i] = i;
    }
    // the bottom up computation of the matrix
    for (let i = 1; i <= sa.length; i++) {
      for (let j = 1; j <= sb.length; j++) {
        if (sa.charAt(i - 1) == sb.charAt(j - 1)) {
          dist[i][j] = dist[i - 1][j - 1];
        } else {
          dist[i][j] = Math.min(dist[i - 1][j - 1] + 1, // substitution
            Math.min(dist[i][j - 1] + 1, // insertion
              dist[i - 1][j] + 1)); // deletion
        }
      }
    }

    return dist[sa.length][sb.length];
  }


}