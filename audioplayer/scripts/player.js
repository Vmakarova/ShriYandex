var playing = false;
var source = null;
var ac = new ( window.AudioContext || webkitAudioContext )();
var canvasCtx = null;
var buffer = [];
var pos = 0;
var startTime = 0;
var analyser = ac.createAnalyser();
analyser.fftSize = 2048;

function visualization(){
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	var width = $('canvas').width();
	var height = $('canvas').height();
	canvasCtx.clearRect(0, 0, width, height);
	drawVisual = requestAnimationFrame(visualization);
	analyser.getByteTimeDomainData(dataArray);

	canvasCtx.fillStyle = 'rgb(200, 200, 200)';
	canvasCtx.fillRect(0, 0, width, height);
	canvasCtx.lineWidth = 2;
	canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
	canvasCtx.beginPath();
	var sliceWidth = width * 1.0 / bufferLength;
	var x = 0;
	for(var i = 0; i < bufferLength; i++) {
		var v = dataArray[i] / 128.0;
		var y = v * height/2;
		if(i === 0) {
			canvasCtx.moveTo(x, y);
		} else {
			canvasCtx.lineTo(x, y);
		}
		x += sliceWidth;
	}
	canvasCtx.lineTo(width, height/2);
	canvasCtx.stroke();
};

function stop() {
	if (source) {
	    source.stop(0);
	   	source = null;
	    pos = ac.currentTime - startTime;
	    playing = false;
	}
}

function connect() {
	if (playing) {
		stop();
	}
  source = ac.createBufferSource();
  source.buffer = buffer;
  source.connect(ac.destination);
  source.connect(analyser);
  visualization();
};

function play(position) {
	connect();
	pos = typeof position === 'number' ? position : pos || 0;
	startTime = ac.currentTime - ( pos || 0 );
	source.start(ac.currentTime, pos);
	playing = true;
};

function decode(arrayBuffer) {
	ac.decodeAudioData(arrayBuffer, function( audioBuffer ) {
		buffer = audioBuffer;
		play(0);
	});
};



$(document).ready(function() {
	canvasCtx = $('canvas')[0].getContext("2d");
	$('#drag').on('dragenter', function (e) {
	    e.stopPropagation();
	    e.preventDefault();
	    $(this).css('border', '2px solid #0B85A1');
	});
	$('#drag').on('dragover', function (e) {
	     e.stopPropagation();
	     e.preventDefault();
	});
	$(document).on('dragenter', function (e) {
	    e.stopPropagation();
	    e.preventDefault();
	});
	$(document).on('dragover', function (e) {
	  e.stopPropagation();
	  e.preventDefault();
	  $('.dragndrop').css('border', '2px dotted #0B85A1');
	});
	$(document).on('drop', function (e) {
	    e.stopPropagation();
	    e.preventDefault();
	});
	$('#play').click(function(){
		play(pos);
	});
	$('#stop').click(function(){
		stop();
	});
	$('#drag').on('drop', function(e){

		$(this).css('border', '2px dotted #0B85A1');
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		var fileName = files[0].name;
		$('#filename').html(fileName);
		var url = URL.createObjectURL(files[0]);
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
    		decode(xhr.response);
  		}.bind(this);
  		xhr.send();
	});
});

