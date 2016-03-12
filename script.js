// Our application object to hold variables, we don't want to polute our namespace
var slackTheatre = {
	key: "83396268239eeacdafdf592b8d16a83d",
	photos:  [],
}

var queryFlickr = function() {
	// Get the query and form URL to access Flickr API	
	var query = document.getElementById('query').value;
	var apiUrl = getApiUrlString(query);
	// console.log(query);

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

	// Parse the response data
	slackTheatre.photos = JSON.parse(data).photos.photo;
	// var obj = JSON.parse(data);
	var count = slackTheatre.photos.length
	// var count = obj.photos.photo.length
	// console.log(slackTheatre.photos);
	// console.log(obj);

	// Create thumbnails from response data
	for(var i=0; i<count; i++) {
		photo = slackTheatre.photos[i];
		// photoObj = obj.photos.photo[i];
		thumbnail = createThumbnail(photo);
		thumbnail.setAttribute('data-photoid', i);
	    document.getElementById('container').appendChild(thumbnail);	
	}
}

var createThumbnail = function(photoObj) {
	var thumbnail = document.createElement("img");

	thumbnail.setAttribute('src', getImgUrl(photoObj, 'q'));
	thumbnail.setAttribute('alt', photoObj.title);
	thumbnail.setAttribute('class', 'thumbnail');

	thumbnail.addEventListener('click', lightbox);

	return thumbnail;
}

var lightbox = function() {
	document.getElementById('light').style.display='block';
	document.getElementById('fade').style.display='block';

	photoId = Number(this.getAttribute('data-photoid'));
	console.log(photoId);

	// var photoObj = slackTheatre.photos[photoId];
	// console.log(photoObj);

	// var lb = document.getElementById('light');

	// var content = document.createElement("img");
	// content.setAttribute('src', getImgUrl(photoObj));
	// content.setAttribute('class', 'lightbox-img');
	// content.setAttribute('data-photoid', photoId);
	// // content.setAttribute('onmouseover', 'displayNav()');
	// // content.setAttribute('onmouseout', 'unfade()');

	// var lbContent = document.getElementById('lightbox-content');
	// lbContent.appendChild(content);

	// var rect = lbContent.getBoundingClientRect();
	// console.log("top: "+ rect.top + " right: " + rect.right + " bottom: " + rect.bottom + " left: " + rect.left);

	loadLbContent(photoId);
	
	var prevButton = document.getElementById('prev');
	prevButton.addEventListener('click', prevImg);

	var nextButton = document.getElementById('next');
	nextButton.addEventListener('click', nextImg);

}

var closeLightbox = function() {
	console.log("Closing lightbox...");

	document.getElementById('light').style.display='none';
	document.getElementById('fade').style.display='none';

	clearLightbox();
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

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	console.log(lbContent);

	var photoId = Number(lbContent.getAttribute('data-photoid')) - 1;
	console.log(photoId);

	clearLightbox();

	loadLbContent(photoId);

}

var nextImg = function() {
	console.log('Loading next image...');

	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	console.log(lbContent);

	var photoId = Number(lbContent.getAttribute('data-photoid')) + 1;
	console.log(photoId);

	clearLightbox();

	loadLbContent(photoId);
}

var loadLbContent = function(photoId) {

	var photoObj = slackTheatre.photos[photoId];
	console.log(photoObj);
	var content = document.createElement("img");
	content.setAttribute('src', getImgUrl(photoObj));
	content.setAttribute('class', 'lightbox-img');
	content.setAttribute('data-photoid', photoId);

	var lbContent = document.getElementById('lightbox-content');
	lbContent.appendChild(content);
}

var fade = function() {
	console.log("We're fading...");
}

var unfade = function() {
	console.log("And now we're unfading!");
}

var displayNav = function() {
	// Create a span to overlay on top
	// var arrow = document.createElement("img");

	// arrow.setAttribute('src', 'right.png');
	// arrow.setAttribute('id', 'nav');

	// document.getElementsByClassName('lightbox-img')[0].appendChild(arrow);
}

var hideNav = function() {
	var nav = document.getElementById('nav');

	if (nav != null) {
		nav.parentElement.removeChild(0);
	}
}


var imgHeight;
var imgWidth;

var findHHandWW = function() {
	imgHeight = this.height;
	imgWidth = this.width;
	return true;
}

var showImage = function(imgPath) {
	var myImage = new Image();

	myImage.name = imgPath;
	myImage.onload = findHHandWW;
	myImage.src = imgPath;
}