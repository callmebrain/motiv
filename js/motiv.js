$( document ).ready(function() {

	/* VIDEO DATA */
	let count = 0;
	let totalTime = 0;
	let timeRemaining = 0;
	let totalExercises = 0;
	let videoLoaded = false;
	let lessonData = [];
	let lets = {};
	let currentExercise = $('.current-exercise p');
	let nextExercise = $('.next-exercise p');
	let modUp = $('.mod-up p');
	let modDown = $('.mod-down p');
	let timeText = $('.time-text');
	let exerciseTracker = $('.exercise-tracker .fill');
	let lessonTracker = $('.current-progress');
	let totalReps = $('.total-reps');
	let timerBar = $('.timer-box span');


	/* JSON DATA */
	$.getJSON("data/video.json", function(data) {
		console.log('data loaded!');
		lessonData = data.exercise;

		$.each(data.exercise, function(key, val) {
			totalTime += Number(val.length);
			totalExercises++;

			lets['ex-' + key] = $('<div />', { "class": 'el-' + key})
			initExerciseProgress(lets['ex-' + key])

		});

		initButtons();
		loadVideo();

	})

	/* VIDEO PLAYER */
	let progressPercent;
	let trackerPercent = 0;
	let trackerMod = 0.6;
	let trackerTime;

	const player = new Plyr('#player');
	window.player = player;

	function initButtons() {
		console.log('initButtons');

		$('.btn-play').on('click', function() {
			console.log('play')
			toggleVideo();
		});
		$('.btn-prev').on('click', function() {
			console.log('previous');
			loadPreviousVideo();
		});
		$('.btn-next').on('click', function() {
			console.log('next');
			loadNextVideo();
		});
	}

	function updateButtons() {

		if(count == 0) {
			$('.btn-prev').addClass('disabled');
			$('.btn-next').removeClass('disabled');
		} else if(count > 0 && count < Number(totalExercises -1)) {
			$('.btn-prev').removeClass('disabled');
			$('.btn-next').removeClass('disabled');
		} else if(count >= Number(totalExercises - 1)) {
			$('.btn-next').addClass('disabled');
			$('.btn-prev').removeClass('disabled');

		}

	}

	function loadVideo() {
		console.log('loadVideo ' + totalTime)
		console.log('video count ' + count)
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
					updateButtons();
					setVideoData();
					// player.play();
					isPlaying = true;
				}
			}
		});

		player.on('ended', event => {
			console.log('ENDED')
			loadNextVideo();

		});


		function setVideoData() {
			timeText.text(secondsToMinutes(totalTime));
			timeRemaining = totalTime;

			player.on('timeupdate', event => {
				updateTime();
			});
		}

		// Set exercise info
		currentExercise.text(lessonData[count].name);
		nextExercise.text(lessonData[count].next);
		modUp.text(lessonData[count].modup);
		modDown.text(lessonData[count].moddown);
		totalReps.text(lessonData[count].reps);

		let pos = Math.round(100 / totalExercises);

		for(let i = 0; i < totalExercises; i++) {
			lets['ex-' + i].css('width', pos + '%');
			$( ".current-progress" ).append( lets['ex-' + i]);
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

	}

	function updateTracker() {
		// top right exercise tracker
		trackerPercent = (player.currentTime / player.duration) * 80;
		
		exerciseTracker.css('width', trackerPercent + '%');

		// overall tracker

		lessonTrackerPercent = (player.currentTime / player.duration) * 100;
		// console.log(lessonTrackerPercent )
		// lets['ex-' + count]['.progress-fill'].css('width', lessonTrackerPercent + '%')
		// console.log(lets['ex-' + count].children())
		lets['ex-' + count].children().css('width', lessonTrackerPercent + '%')

		timerBar.css('width', lessonTrackerPercent + '%')

	}

	function toggleVideo() {
		if(isPlaying) {
			player.pause();
			isPlaying = false;
			$('.btn-play span').html('>');
		} else {
			// player.play();
			isPlaying = true;
			$('.btn-play span').html('||');
		}
	}
	function loadNextVideo() {
		console.log('loadNextVideo')
		lets['ex-' + count].children().css('width', '100%');
		totalTime -= Number(lessonData[count].length);
		count++;
		videoLoaded = false;
		isPlaying = false;
		toggleVideo();
		loadVideo();
		player.off('ended', event)
	}
	function loadPreviousVideo() {
		lets['ex-' + count].children().css('width', '0%');
		totalTime += Number(lessonData[count].length);
		count--;
		videoLoaded = false;
		isPlaying = false;
		toggleVideo();
		loadVideo();
	}


	function secondsToMinutes(d) {
		d = Number(d);
		let mins = Math.floor(d % 3600 / 60);
		let secs = Math.floor(d % 3600 % 60);

		return minTwoDigits(mins) + ":" + minTwoDigits(secs);
	}

	function minTwoDigits(n) {
		return (n < 10 ? '0' : '') + n;
	}


});