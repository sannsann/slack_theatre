var prevImg = function() {
	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) - 1;

	clearLightbox();
	loadLbContent(photoId);
}

var nextImg = function() {
	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid')) + 1;

	clearLightbox();
	loadLbContent(photoId);
}

var keyListenerNav = function(e) {
	var lbContent = document.getElementsByClassName('lightbox-img')[0];
	var photoId = Number(lbContent.getAttribute('data-photoid'));

	// Esc keycode
	if(e.keyCode == 27) {
		closeLightbox();
	}

	// Left arrow keycode
	if(e.keyCode == 37) {
		console.log("left key detected");
		if(photoId == 0) {
			return;
		} else {
			prevImg();	
		}
	}

	// Right arrow keycode
	if(e.keyCode == 39) {
		if(photoId == slackTheatre.photos.length -1){
			return;
		} else {
			nextImg();
		}
	}
}