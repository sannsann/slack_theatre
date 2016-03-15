// Our application object to hold variables, we don't want to polute our namespace
var slackTheatre = {
	key: "83396268239eeacdafdf592b8d16a83d",
	photos:  [],
	emptyResultsResponses: [
		"Our image sniffing hogs couldn't find any images you asked for. <br>In other news we'll be having bacon tonight!",
		"The union robots are on lunch break. <br>That might explain our lack of image results...",
		"I find the lack of image responses... <br>Disturbing...",
		"What in tarnation happened to all the pretty pictures? <br>Guess we'll have to try some other terms to search."
	]
}

var queryFlickr = function() {
	// Clear contents after each search 
	clearLightbox();
	clearContainer();

	// Get the query and form URL to access Flickr API	
	var apiUrl; 

	var queryBox = document.getElementById('search-query');
	

	// Validate that a search query was received.
	if(queryBox.value == undefined || queryBox.value == '') {
		console.log('undefined query value. We will not be searching');
		// queryBox.style.backgroundColor = '#FFFF99';
		lengthenQuerybox();
		return;
	} else {
		shortenQuerybox();
		apiUrl = getApiUrlString(queryBox.value);
	}

	xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            createThumbnails(xhr.responseText);
        }
    }

    // Open the request for a GET, to the apiUrl, make it async 
    xhr.open("GET", apiUrl, true);
    xhr.send();
}

var createThumbnails = function(data) {
	// Variables for our images
	var photo;
	var thumbnailImg;

	// Parse the response data and store into app namespace
	slackTheatre.photos = JSON.parse(data).photos.photo;
	console.log(slackTheatre.photos);

	var count = slackTheatre.photos.length

	// Search may have not returned any items. In that case, we need to tell the user
	if (count == 0) {
		// Results came up empty, let's give the user something entertaining to read instead.
		var emptyResponseContainer = document.createElement('div');
		emptyResponseContainer.setAttribute('class', 'empty');

		emptyResponseContainer.style.border = '8px dashed #eee';
		emptyResponseContainer.style.textAlign = 'center';
		emptyResponseContainer.style.height = '50%';


		var emptyResponseText = document.createElement('p');
		emptyResponseText.setAttribute('class', 'empty');
		var randomInt = Math.floor((Math.random() * slackTheatre.emptyResultsResponses.length));
		emptyResponseText.innerHTML = slackTheatre.emptyResultsResponses[randomInt];

		emptyResponseContainer.appendChild(emptyResponseText);

		document.getElementById('container').appendChild(emptyResponseContainer);	
	} else {
		// Create thumbnails from response data
		for(var i=0; i<count; i++) {
			photo = slackTheatre.photos[i];

			// Create the img thumbnail
			thumbnailImg = createThumbnailImg(photo);
			thumbnailImg.setAttribute('data-photoid', i);
			thumbnailImg.addEventListener('mouseover', showThumbTitle);
			thumbnailImg.addEventListener('mouseout', hideThumbTitle);

			// Create the text title
			var thumbTitle = document.createElement('p');
			thumbTitle.setAttribute('class', 'thumbnail-title bottom');		

			if(photo.title.length > 20) {
				thumbTitle.innerHTML = photo.title.substring(0, 16) + "...";
			} else {
				thumbTitle.innerHTML = photo.title;
			}

			var thumbwrapper = document.createElement('div');
			thumbwrapper.setAttribute('class', 'thumbnail-wrapper');

			thumbwrapper.appendChild(thumbnailImg);
			thumbwrapper.appendChild(thumbTitle);

		    document.getElementById('container').appendChild(thumbwrapper);	
		}
	}
	
}

var createThumbnailImg = function(photoObj) {
	var thumbnail = document.createElement('img');

	thumbnail.setAttribute('src', getImgUrlString(photoObj, 'n'));
	thumbnail.setAttribute('alt', photoObj.title);
	thumbnail.setAttribute('class', 'thumbnail');

	thumbnail.addEventListener('click', lightbox);

	return thumbnail;
}

var lightbox = function() {
	document.getElementById('light').style.display = 'block';
	document.getElementById('fade').style.display = 'block';

	var photoId = Number(this.getAttribute('data-photoid'));
	console.log(photoId);

	loadLbContent(photoId);

	var prevButton = document.getElementById('prev');
	prevButton.addEventListener('click', prevImg);

	var nextButton = document.getElementById('next');
	nextButton.addEventListener('click', nextImg);
}

var closeLightbox = function() {
	console.log("Closing lightbox...");

	clearLightbox();

	document.getElementById('light').style.display = 'none';
	document.getElementById('fade').style.display = 'none';
}

var clearContainer = function () {
	var container = document.getElementsByClassName('container')[0];
	while(container.firstChild) {
		container.removeChild(container.firstChild);
	}
}

var clearLightbox = function() {
	var lbContent = document.getElementById('lightbox-content');
	while(lbContent.firstChild) {
		lbContent.removeChild(lbContent.firstChild); 
	}
}

var prevImg = function() {
	console.log('Loading previous image...');

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) - 1;

	clearLightbox();
	loadLbContent(photoId);
}

var nextImg = function() {
	console.log('Loading next image...');

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) + 1;

	clearLightbox();
	loadLbContent(photoId);
}


/* Loads the lightbox image as well as navigation buttons */
var loadLbContent = function(photoId) {

	// Clear any residual lb_content
	clearLightbox();

	var photoObj = slackTheatre.photos[photoId];
	console.log(photoObj);

	// Create the lightbox content
	var lbTitle = document.createElement('p');
	lbTitle.setAttribute('class', 'lb-title center-horizontal');
	lbTitle.innerHTML = photoObj.title;

	var content = document.createElement('img');
	content.setAttribute('src', getImgUrlString(photoObj, 'z'));
	content.setAttribute('class', 'lightbox-img');
	content.setAttribute('data-photoid', photoId);

	var lbContent = document.getElementById('lightbox-content');
	lbContent.appendChild(content);
	lbContent.appendChild(lbTitle);

	// Navigation of lightbox
	var prevButton = document.getElementById('prev');
	var nextButton = document.getElementById('next');

	// Arrived at the start of array, hide previous button to prevent further back navigation
	if(photoId === 0) {
		prevButton.style.visibility = 'hidden';
	} else {
		prevButton.style.visibility = 'visible';
	}

	// Reached the end of array, hide the next button to prevent further forward navigation
	if(photoId === slackTheatre.photos.length - 1) {
		nextButton.style.visibility = 'hidden';
	} else {
		nextButton.style.visibility = 'visible';
	}
}

var showThumbTitle = function() {
	var myTitle = document.getElementsByClassName('thumbnail-title')[this.getAttribute('data-photoid')];
	myTitle.style.visibility = 'visible';
}

var hideThumbTitle = function() {
	var myTitle = document.getElementsByClassName('thumbnail-title')[this.getAttribute('data-photoid')];
	myTitle.style.visibility = 'hidden';
}

var lengthenQuerybox = function() {
	var queryBox = document.getElementById('search-query');
	var pos = 200;
	var id = setInterval(frame, 5);
	function frame() {
	  if (pos == 250) {
	    clearInterval(id);
	  } else {
	    pos++; 
	    queryBox.style.width = pos + 'px'; 
	  }
	}

	queryBox.style.backgroundColor = '#FFFF99';
}

var shortenQuerybox = function() {
	var queryBox = document.getElementById('search-query');
	var pos = Number(queryBox.offsetWidth);
	console.log(pos);
	if (pos == 200) {
		return;
	}

	var id = setInterval(frame, 5);
	function frame() {
	  if (pos == 200) {
	    clearInterval(id);
	  } else {
	    pos--; 
	    queryBox.style.width = pos + 'px'; 
	  }
	}

	queryBox.style.backgroundColor = 'white';
}