var lengthenQuerybox = function() {
	var queryBox = document.getElementById('search-query');
	var width = 200;
	var id = setInterval(frame, 5);

	function frame() {
	  if (width == 250) {
	    clearInterval(id);
	  } else {
	    width++; 
	    queryBox.style.width = width + 'px'; 
	  }
	}

	queryBox.style.backgroundColor = '#FFFF99';
}

var shortenQuerybox = function() {
	var queryBox = document.getElementById('search-query');
	var width = Number(queryBox.offsetWidth);

	// The box is already len
	if (width == 200) {
		return;
	}

	var id = setInterval(frame, 5);

	function frame() {
	  if (width == 200) {
	    clearInterval(id);
	  } else {
	    width--; 
	    queryBox.style.width = width + 'px'; 
	  }
	}

	queryBox.style.backgroundColor = 'white';
}