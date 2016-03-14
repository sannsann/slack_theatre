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

var getImgUrlString = function(photo, flag) {
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