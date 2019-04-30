$( document ).ready(function() {

	/* VIDEO DATA */
	var count = 0;
	var totalTime = 0;
	var timeRemaining = 0;
	var totalExercises = 0;
	var videoLoaded = false;
	var lessonData = [];
	var vars = {};
	var currentExercise = $('.current-exercise p');
	var nextExercise = $('.next-exercise p');
	var modUp = $('.mod-up p');
	var modDown = $('.mod-down p');
	var timeText = $('.time-text');
	var exerciseTracker = $('.exercise-tracker .fill');
	var lessonTracker = $('.current-progress');
	var progressFill = $('.TEST')

	/* JSON DATA */
	$.getJSON("data/video.json", function(data) {
		console.log('data loaded!');
		lessonData = data.exercise;

		$.each(data.exercise, function(key, val) {
			totalTime += Number(val.length);
			totalExercises++;

			// vars['ex-' + key] = '<div class="el-' + key + '"' + '></div>';
			vars['ex-' + key] = $('<div />', { "class": 'el-' + key})
			initExerciseProgress(vars['ex-' + key])

		});

		loadVideo();

	})

	/* VIDEO PLAYER */
	var progressPercent;
	var trackerPercent = 0;
	var trackerMod = 0.6;
	var trackerTime;

	const player = new Plyr('#player');
	window.player = player;

	function loadVideo() {
		console.log('loadVideo')
		player.source = {
			type: 'video',
			title: 'title',
			sources: [
			{
				src: lessonData[count].source,
				type: 'video/mp4',
				size: 720,
			},
			{
				src: '/path/to/movie.webm',
				type: 'video/webm',
				size: 1080,
			},
			],
			poster: '/path/to/poster.jpg',

		};

		player.on('loadedmetadata', event => {
			if(!videoLoaded) {
				if(player.duration > 0) {
					videoLoaded = true;
				}

				setVideoData();
				player.play();
			}
		});

		player.on('ended', event => {
			// console.log('ENDED')

		});

		function setVideoData() {
			timeText.text(secondsToMinutes(totalTime));
			timeRemaining = totalTime;

			player.on('timeupdate', event => {
				updateTime();
			})
		}

		// Set exercise info
		currentExercise.text(lessonData[count].name);
		nextExercise.text(lessonData[count].next);
		modUp.text(lessonData[count].modup);
		modDown.text(lessonData[count].moddown);

		var pos = Math.round(100 / totalExercises);

		for(var i = 0; i < totalExercises; i++) {
			vars['ex-' + i].css('width', pos + '%');
			$( ".current-progress" ).append( vars['ex-' + i]);
		}
	}

	function initExerciseProgress(el) {
		el.css('display', 'inline-block');
		el.css('position', 'relative');
		el.css('height', '20px');
		el.css('width', '1px');
		el.css('border-right', '1px solid #000');

		el.append($('<div />', { "class": 'progress-fill'}));

	}

	// player.on('loadedmetadata', event => {
	// 		console.log(player.duration)
	// 	});

	




	// vid.onloadedmetadata = function() {
	// 	console.log('metadata loaded!');

	// 	$('.time-text').text(secondsToMinutes(vid.duration));

	// vid.addEventListener('timeupdate', event => {
	// 	updateTime();
	// });

	// };

	// vid.addEventListener('ended', event => {
	// 	nextVideo();
	// });

	function updateTime() {

		timeRemaining = Number(totalTime - player.currentTime);
		// console.log(timeRemaining)
		timeText.text(secondsToMinutes(timeRemaining));

		updateTracker();
		// progressPercent = (vid.currentTime / vid.duration) * 100;
		// console.log(progressPercent)
		// $('.current-progress').css('width', progressPercent + '%');
	}

	function updateTracker() {
		// top right exercise tracker
		trackerPercent = (player.currentTime / player.duration) * 80;
		
		exerciseTracker.css('width', trackerPercent + '%');

		// overall tracker

		lessonTrackerPercent = (player.currentTime / player.duration) * 100;
		console.log(lessonTrackerPercent )
		// vars['ex-' + count]['.progress-fill'].css('width', lessonTrackerPercent + '%')
		// console.log(vars['ex-' + count].children())
		vars['ex-' + count].children().css('width', lessonTrackerPercent + '%')

	}

	function nextVideo() {
		var next = "../motiv/assets/video2.mp4";
		vid.src = next;
		vid.play();
	}


	function secondsToMinutes(d) {
		d = Number(d);
		var mins = Math.floor(d % 3600 / 60);
		var secs = Math.floor(d % 3600 % 60);

		return minTwoDigits(mins) + ":" + minTwoDigits(secs);
	}

	function minTwoDigits(n) {
		return (n < 10 ? '0' : '') + n;
	}


});