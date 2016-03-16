Technical Exercise - Lightbox AKA Slack Theatre
===


Core Features
---
* Access public Flickr API and retrieve data.
* Display data as grid of photo thumbnails.
* Use of only native JavaScript.
* Update UI without refreshing.


Additional Features
---
* Responsive design
* Keyboard navigation
	- 'ESC' to close the lightbox.
	- 'Left arrow' to load previous image (when applicable).
	- 'Right arrow' to load next image (when applicable).

* Input validation
	- Search box will toggle when a query is not present

* Empty set response


Technical challenges
---
* (Bug) Portrait image behavior may sometimes cause overflow of image into margin space.


Future improvements
---
* Mobile Phone Layouts - Although the current grid layout is able to respond to changes in the browser dimensions, it currently does not properly detect a mobile phone. The current generation of mobile phones have resolution dimensions equal to desktop counterparts and would require an alternative method of indicating the user as mobile. This [article](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/) showcases a variety of CSS media queries matching various mobile phones that exemplify possible layouts. It would require additional time for implementation and testing.

* Implement Side Menu - Currently there is a non-functioning menu icon, placed in the top left corner of the layout for mock up purposes. I would like for a sidebar element to reveal itself upon clicking the button to allow for additional search options to take greater advantage of the Flickr API.


Final Thoughts
---
I enjoyed creating the lightbox from scratch. Using only native JavaScript allowed me to flex JS muscles that have atrophied from use of jQuery and other convenient frontend libraries. I would definitely appreciate any feedback on this project and am open to critiques on how I might improve my general style and use of idioms. Thank you for the opportunity to showcase my abilities and I look forward to hearing back from the team at Slack!