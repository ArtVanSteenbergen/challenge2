$(document).ready(function() {
  var tl = new TimelineMax();

  var timeOffset = 0,
  timeOffsetHours = 0,
  timeOffsetMinutes = 0,
  timeOffsetSeconds = 0;

  var datetime = new Date(Date.now() + timeOffset),
  h = datetime.getHours(),
  m = datetime.getMinutes(),
  s = datetime.getSeconds();

  var html = $('html'),
  pointerH = $('.clockH'),
  pointerM = $('.clockM'),
  pointerS = $('.clockS'),
  digitalClock = $('#digitalClock'),
  analogClock = $('#analogClock'),
  ripley = $('#ripley');
  ripleySpeaks = $('#ripleySpeaks');
  muteButton = $('#mute');
  unmuteButton = $('#unmute');

  var oneSecond = 60 / 60; // 1 second
  var oneHour = 60 * 60; //1 hour tween
  var twelveHours = 12 * 60 * 60; //12 hour tween
  var fullDay = 24 * 60 * 60; //24 hour tween

  var mute = true;

  TweenMax.set('.second, .hour, .minute', {
    yPercent: -50,
    transformOrigin: '50% 100%'
  });

  var timeTween = TweenMax.to(html, fullDay, {
    repeat: -1
  });

  var clockTween = TweenMax.fromTo(digitalClock, 2, {bottom: -600},{bottom: 0, ease: Elastic.easeOut});

  var hourTween = TweenMax.to(pointerH, twelveHours, {
    rotation: '360',
    ease: Linear.easeNone,
    repeat: -1,
    paused: true
  });

  var minuteTween = TweenMax.to(pointerM, oneHour, {
    rotation: '360',
    ease: Linear.easeNone,
    repeat: -1,
    paused: true
  });

  var secondsTween = TweenMax.to(pointerS, oneSecond, {
    rotation: '360',
    ease: Linear.easeNone,
    repeat: -1,
    paused: true
  });

  TweenMax.set(ripley, {top: '600px'});
  var game = 0;
  
  function hoursShow(h) {
    game=0;
    tl.fromTo(ripley, 1, {top: '600px', ease: Expo.easeOut},{top: '0px', ease: Expo.easeOut, onComplete:speak}, "ripley")
    .fromTo(ripleySpeaks,0.25,{y: '20px', x: '40px', autoAlpha: 0, ease: Expo.easeOut},{y: '0px',x: '0px',autoAlpha: 1,ease: Expo.easeOut}, "ripley +=0.1")
    .yoyo(true).paused(true);

    tl.restart().repeat(h*2-1);
  }

  function speak() {
    game++;
    if (!mute) {
      var audio = new Audio('bell.mp3');
      audio.play();
    }
    $('#ripleySpeaks').html(game);
  }

  muteButton.click(()=>{mute = true; muteButton.hide(); unmuteButton.show();});
  unmuteButton.click(()=>{mute = false; unmuteButton.hide(); muteButton.show();});

  // add time or retrects time per pointer in milliseconds
  function setTimeOffset(type, amount) {
    if (type == 'hours') {
      showTime();
      timeOffsetHours += amount;
    }
    if (type == 'minutes') {
      timeOffsetMinutes += amount;
      showTime();
    }
    if (type == 'seconds') {
      timeOffsetSeconds += amount;
      showTime();
    }
  }

  // display the clock in 6 digits in the #clock element
  function showDigitalClock(h,m,s) {
    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;
    var hms = h + ':' + m + ':' + s;
    TweenMax.set(digitalClock,{text:{value: hms}});
  }

  // interval function of the anolog clock that also calls the timeOfDay function and the showDigitalClock function
  function showTime() {
    timeOffset = timeOffsetHours * 3600000 + timeOffsetMinutes * 60000 + timeOffsetSeconds * 1000;
    datetime =  new Date(Date.now() + timeOffset);
    h = datetime.getHours();
    m = datetime.getMinutes();
    s = datetime.getSeconds();

    if (m < 1 && s < 1) {
      if (h == 0) {
        hoursShow(12);
      }
      else if (h <= 12) {
        hoursShow(h);
      } else {
        hoursShow(h-12);
      }
    }

    showDigitalClock(h,m,s);

    minutesAsSeconds = m * 60;
    hoursAsSeconds = h * 60 * 60 + minutesAsSeconds;
    secondsAsSeconds = s / 60;

    // progress from 0 to 1 per pointerTween
    hourTween.progress(hoursAsSeconds / twelveHours);
    timeTween.progress(hoursAsSeconds/ fullDay);
    minuteTween.progress(minutesAsSeconds / oneHour);
    secondsTween.progress(secondsAsSeconds / oneSecond);

    if (timeTween.progress() >= 0 && timeTween.progress() < 0.25) {
      TweenMax.to('html', 2, {backgroundColor: '#000000'});
    }
    if (timeTween.progress() >= 0.25 && timeTween.progress() < 0.5) {
      TweenMax.to('html', 2, {backgroundColor: '#e09572'});
    }
    if (timeTween.progress() >= 0.5 && timeTween.progress() < 0.75) {
      TweenMax.to('html', 2, {backgroundColor: '#e0bfb0'});
    }
    if (timeTween.progress() >= 0.75 && timeTween.progress() < 1) {
      TweenMax.to('html', 2, {backgroundColor: '#94624b'});
    }

  }

  showTime();

  setInterval(function() {
    showTime();
  }, 1000);

  $('#addHour').click(() => setTimeOffset('hours', 1));
  $('#subtractHour').click(() => setTimeOffset('hours', -1));
  $('#addMinute').click(() => setTimeOffset('minutes', 1));
  $('#subtractMinute').click(() => setTimeOffset('minutes', -1));
  $('#addTenSeconds').click(() => setTimeOffset('seconds', 10));
  $('#subtractTenSeconds').click(() => setTimeOffset('seconds', -10));
  $('#resetTimeOffset').click(() => {timeOffsetHours = 0;timeOffsetMinutes = 0;timeOffsetSeconds = 0;});
});