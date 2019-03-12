$(document).ready(function() {
  var tl = new TimelineMax(),
  timeOffset = 0,
  timeOffsetHours = 0,
  timeOffsetMinutes = 0,
  timeOffsetSeconds = 0,

  datetime = new Date(Date.now() + timeOffset),
  h = datetime.getHours(),
  m = datetime.getMinutes(),
  s = datetime.getSeconds(),

  html = $('html'),
  pointerH = $('.clockH'),
  pointerM = $('.clockM'),
  pointerS = $('.clockS'),
  digitalClock = $('#digitalClock'),
  analogClock = $('#analogClock'),
  ripley = $('#ripley'),
  ripleySpeaks = $('#ripleySpeaks'),
  unmuteButton = $('#unmute'),
  muteButton = $('#mute'),

  ripleyCurrentHour = 0,
  hms = '00:00:00',

  oneSecond = 60 / 60, // 1 second
  oneHour = 60 * 60, //1 hour tween
  twelveHours = 12 * 60 * 60, //12 hour tween
  fullDay = 24 * 60 * 60, //24 hour tween
  
  mute = true,
  audio = new Audio();

  TweenMax.set('.second, .hour, .minute', {
    yPercent: -50,
    transformOrigin: '50% 100%'
  });

  var timeTween = TweenMax.to(html, fullDay, {
    repeat: -1
  });
  var init = new TimelineMax();

  init.fromTo('html', 2,{backgroundImage: 'url()',backgroundPosition: '0 500%', backgroundRepeat: 'no-repeat'},{backgroundImage: 'url(img/mars.png)',backgroundPosition: '0 110%', backgroundRepeat: 'no-repeat'})
  .from('footer', 2,{y: '-1000%', autoAlpha: 0,  ease: Bounce.easeOut}, '-=1')
  .from(analogClock, 2,{rotationX: '90deg',y: '-200px', autoAlpha: 0,  ease: Elastic.easeOut}, '-=1')
  .staggerFrom('footer div', 0.5, {x: '20px', autoAlpha: 0}, 0.1, '-=0.5')
  .fromTo(digitalClock, 2, {top: '50%',y: '50%', x:'-50%', autoAlpha: 0},{top: '50%',y: '-50%',x: '-50%', autoAlpha: 1, ease: Elastic.easeOut}, '-=1');


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

  // let Ripley tell the time hourly with a "Ding" if audio isn't muted
  function hoursShow(h) {
    ripleyCurrentHour=0;
    tl.fromTo(ripley, 1, {top: '600px', ease: Expo.easeOut},{top: '0px', ease: Expo.easeOut, onComplete:speak}, "ripley")
    .fromTo(ripleySpeaks,0.25,{y: '20px', x: '40px', autoAlpha: 0, ease: Expo.easeOut},{y: '0px',x: '0px',autoAlpha: 1,ease: Expo.easeOut}, "ripley +0.1")
    .yoyo(true).paused(true);

    tl.restart().repeat(h*2-1);
  }

  // count hours for Ripley and make a sound
  function speak() {
    ripleyCurrentHour++;
    if (!mute) {
      audio = new Audio('bell.mp3');
      audio.play();
    }
    $('#ripleySpeaks').html(ripleyCurrentHour);
  }


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
    hms = h + ':' + m + ':' + s;
    TweenMax.set(digitalClock,{text:{value: hms}});
    TweenMax.set('title',{text:{value: hms}});
  }

  // interval function of the anolog clock that also calls the timeOfDay function and the showDigitalClock function
  function showTime() {
    timeOffset = timeOffsetHours * 3600000 + timeOffsetMinutes * 60000 + timeOffsetSeconds * 1000;
    console.log(timeOffsetHours + ':' + timeOffsetMinutes + ':'  + timeOffsetSeconds);
    datetime =  new Date(Date.now() + timeOffset);
    h = datetime.getHours();
    m = datetime.getMinutes();
    s = datetime.getSeconds();

    // convert 24 to 12 and show the time hourly
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

    // play sound on the half hour mark when audio isn't muted
    if (m == 30 && s < 1) {
      if (!mute) {
        audio = new Audio('bell.mp3');
        audio.play();
      }
    }

    // update digital clock
    showDigitalClock(h,m,s);

    // convert to seconds for TweenMax
    minutesAsSeconds = m * 60;
    hoursAsSeconds = h * 60 * 60 + minutesAsSeconds;
    secondsAsSeconds = s / 60;

    // progress from 0 to 1 per pointerTween
    hourTween.progress(hoursAsSeconds / twelveHours);
    timeTween.progress(hoursAsSeconds/ fullDay);
    minuteTween.progress(minutesAsSeconds / oneHour);
    secondsTween.progress(secondsAsSeconds / oneSecond);

    // change background based on time of day
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

  // initial visualisaton of time
  showTime();

  // set time every second
  setInterval(function() {
    showTime();


  }, 1000);

  // onclick events for footer controls
  $('#addHour').click(() => setTimeOffset('hours', 1));
  $('#subtractHour').click(() => setTimeOffset('hours', -1));
  $('#addMinute').click(() => setTimeOffset('minutes', 1));
  $('#subtractMinute').click(() => setTimeOffset('minutes', -1));
  $('#addTenSeconds').click(() => setTimeOffset('seconds', 10));
  $('#subtractTenSeconds').click(() => setTimeOffset('seconds', -10));
  $('#resetTimeOffset').click(() => {timeOffsetHours = 0;timeOffsetMinutes = 0;timeOffsetSeconds = 0;});
  muteButton.click(()=>{mute = true; TweenMax.to(muteButton, 0.5, {x: '-23px',autoAlpha:0});  TweenMax.to(unmuteButton, 0.5, {x: '0px',autoAlpha:1}); });
  unmuteButton.click(()=>{mute = false; TweenMax.to(unmuteButton, 0.5, {x: '0px',autoAlpha:0});  TweenMax.to(muteButton, 0.5, {x: '-23px', autoAlpha:1}); });
});