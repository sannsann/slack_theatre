// Our application object to hold variables, we don't want to polute our namespace
var slackTheatre = {
	key: "83396268239eeacdafdf592b8d16a83d",
	photos:  [],
}

var queryFlickr = function() {
	// Get the query and form URL to access Flickr API	
	var query = document.getElementById('search-query').value;
	var apiUrl = getApiUrlString(query);

	// Clear contents after each search 
	var container = document.getElementById('container');
	while(container.firstChild) {
		container.removeChild(container.firstChild); 
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
	var thumbnail;

	// Parse the response data and store into app namespace
	slackTheatre.photos = JSON.parse(data).photos.photo;

	var count = slackTheatre.photos.length

	// Create thumbnails from response data
	for(var i=0; i<count; i++) {
		photo = slackTheatre.photos[i];

		thumbnail = createThumbnail(photo);
		thumbnail.setAttribute('data-photoid', i);

		var thumbwrapper = document.createElement('div');
		thumbwrapper.setAttribute('class', 'thumbnail-wrapper');

		thumbwrapper.appendChild(thumbnail);

	    document.getElementById('container').appendChild(thumbwrapper);	
	}
}

var createThumbnail = function(photoObj) {
	var thumbnail = document.createElement("img");

	thumbnail.setAttribute('src', getImgUrl(photoObj, 'n'));
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

var getApiUrlString = function(query) {

	// Base URL for our API call
	var apiUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search";

	// Required API key to be sent with request.
	apiUrl += "&api_key=" + slackTheatre.key;

	// Specify the number of returned results.
	apiUrl += "&per_page=10";

	// Request the response to return as JSON. 
	apiUrl += "&format=json";

	// Add this option to return only the JSON (minus the function wrapper)
	apiUrl += "&nojsoncallback=1";

	// Append the search query from our input box.
	apiUrl += "&tags=" + query;

	return apiUrl;
}

var getImgUrl = function(photo, flag) {
	// URL template for retriving an image from photo object.
	// https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
	var src = '';

	src += "https://farm" + photo.farm;
	src += ".staticflickr.com/" + photo.server;
	src += "/" + photo.id + "_" + photo.secret; 

	// Append appropriate flags to src for desired image size from server
	if(flag) {
		src += "_" + flag + ".jpg";
	} else {
		src += ".jpg";
	}

	return src;
}

var clearLightbox = function() {
	var lbContent = document.getElementById('lightbox-content');
	while(lbContent.firstChild) {
		lbContent.removeChild(lbContent.firstChild); 
	}
}

var prevImg = function() {
	console.log('Loading previous image...');


	clearLightbox();

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) - 1;

	loadLbContent(photoId);
}

var nextImg = function() {
	console.log('Loading next image...');

	clearLightbox();

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) + 1;

	loadLbContent(photoId);
}


/* Loads the lightbox image as well as navigation buttons */
var loadLbContent = function(photoId) {

	// Clear any residual lb_content
	clearLightbox();

	var photoObj = slackTheatre.photos[photoId];
	console.log(photoObj);
	
	var content = document.createElement("img");
	content.setAttribute('src', getImgUrl(photoObj, 'c'));
	content.setAttribute('class', 'lightbox-img');
	content.setAttribute('data-photoid', photoId);

	var lbContent = document.getElementById('lightbox-content');
	lbContent.appendChild(content);

	var prevButton = document.getElementById('prev');
	var nextButton = document.getElementById('next');

	// Arrived at the start of array, hide previous button to prevent further back navigation
	if(photoId === 0) {
		prevButton.style.visibility = 'hidden';
	} else {
		prevButton.visibility = 'visible';
	}

	// Reached the end of array, hide the next button to prevent further forward navigation
	if(photoId === slackTheatre.photos.length - 1) {
		nextButton.style.visibility = 'hidden';
	} else {
		nextButton.style.visibility = 'visible';
	}

}