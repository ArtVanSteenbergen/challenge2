$(document).ready(function() {
  // all the constants
  const
  HTML = $('html'),
  POINTERH = $('.clockH'),
  POINTERM = $('.clockI'),
  POINTERS = $('.clockS'),
  DIGITALCLOCK = $('#digitalClock'),
  ANALOGCLOCK = $('#analogClock'),
  DATEONSCREEN = $('#date'),
  RIPLEY = $('#ripley'),
  RIPLEYSPEAKS = $('#ripleySpeaks'),
  UTCTOGGLE = $('#UtcToggle'),
  UNMUTEBUTTON = $('#unmute'),
  MUTEBUTTON = $('#mute'),

  DAYSOFWEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  MONTHSOFYEAR = ['January','February','March','April','May','June','July','August','September','October','November','December'],
  
  ONESECOND = 1,
  ONEHOUR = 60 * 60, 
  TWELVEHOURS = 12 * 60 * 60,
  FULLDAY = 24 * 60 * 60;


  // all the variables
  var
  tl = new TimelineMax(),
  timeOffset = 0,
  timeOffsetHours = 0,
  timeOffsetMinutes = 0,
  timeOffsetSeconds = 0,

  datetime = new Date(Date.now() + timeOffset),
  h = datetime.getHours(),
  i = datetime.getMinutes(),
  s = datetime.getSeconds(),
  n = DAYSOFWEEK[datetime.getDay()],
  d = datetime.getDate(),
  m = MONTHSOFYEAR[datetime.getMonth()],
  Y = datetime.getFullYear(),
  date = '',

  ripleyCurrentHour = 0,
  his = '00:00:00',
  utc = false,

  mute = true,

  bell = new Audio('bell.mp3'),
  tick = new Audio('tick.mp3'),

  init = new TimelineMax(),

  // set rotation for every pointer and set a 24h timetween
  hourTween = TweenMax.to(POINTERH, TWELVEHOURS, {rotation: '360', ease: Linear.easeNone, repeat: -1, paused: true}),
  minuteTween = TweenMax.to(POINTERM, ONEHOUR, {rotation: '360', ease: Linear.easeNone, repeat: -1, paused: true}),
  secondsTween = TweenMax.to(POINTERS, ONESECOND, {rotation: '360', ease: Linear.easeNone, repeat: -1, paused: true}),
  timeTween = TweenMax.to(HTML, FULLDAY, {repeat: -1});

  // initial animations to set up elements in a "beautiful" way
  init.set('.second, .hour, .minute', {yPercent: -50, transformOrigin: '50% 100%'}).set(DATEONSCREEN, {y: '50%', x:'-50%', autoAlpha: 0})
  .fromTo(HTML, 2,{backgroundImage: 'url()',backgroundPosition: '0 500%', backgroundRepeat: 'no-repeat'},{backgroundImage: 'url(img/mars.png)',backgroundPosition: '0 100%', backgroundRepeat: 'no-repeat'})
  .from('footer', 2,{y: '-1000%', autoAlpha: 0,  ease: Bounce.easeOut}, '-=2')
  .from(ANALOGCLOCK, 2,{rotationX: '90deg',y: '-200px', autoAlpha: 0,  ease: Elastic.easeOut}, '-=1')
  .staggerFrom('footer div', 0.5, {x: '20px', autoAlpha: 0}, 0.1, '-=0.5')
  .fromTo(DIGITALCLOCK, 3, {y: '50%', x:'-50%', autoAlpha: 0},{y: '-50%',x: '-50%', autoAlpha: 1, ease: Elastic.easeOut}, '-=3')
  .to(DATEONSCREEN, 3, {y: '-50%',x: '-50%', autoAlpha: 1, ease: Elastic.easeOut}, '-=3')
  .to('main', 3, {backgroundColor: 'rgba(0,0,0,0.5)', ease: Elastic.easeOut}, '-=3')
  .to('main', 1.5, {backgroundColor: 'rgba(0,0,0,0.2)', ease: Linear.easeNone}, '-=1.5');


  // return st, nd, rd or th to day of month
  function nth(d) {
    if (d > 3 && d < 21)
      return d+'th'; 
    switch (d % 10) {
      case 1:  return d+"st";
      case 2:  return d+"nd";
      case 3:  return d+"rd";
      default: return d+"th";
    }
  }

  // let Ripley tell the time hourly with a 'Ding' if audio isn't muted
  function hoursShow(h) {
    ripleyCurrentHour=0;
    tl.fromTo(RIPLEY, 1, {top: '600px', ease: Expo.easeOut},{top: '0px', ease: Expo.easeOut, onComplete:speak}, 'ripley')
    .fromTo(RIPLEYSPEAKS,0.25,{y: '20px', x: '40px', autoAlpha: 0, ease: Expo.easeOut},{y: '0px',x: '0px',autoAlpha: 1,ease: Expo.easeOut}, 'ripley +0.1')
    .yoyo(true).paused(true);

    tl.restart().repeat(h*2-1);
  }

  // count hours for Ripley and make a sound
  function speak() {
    ripleyCurrentHour++;
    if (!mute) {
      bell = new Audio('bell.mp3');
      bell.play();
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

  function showDate(date) {
    if (DATEONSCREEN.html() != '') {TweenMax.fromTo(DATEONSCREEN, 3, {y: '-150%',x: '-50%', autoAlpha: 1, ease: Elastic.easeOut},{y: '-50%',x: '-50%', autoAlpha: 1, ease: Elastic.easeOut});}
    DATEONSCREEN.html(date);
  }

  // display the clock in 6 digits in the #clock element
  function showDigitalClock(h,i,s) {
    h = (h < 10) ? '0' + h : h;
    i = (i < 10) ? '0' + i : i;
    s = (s < 10) ? '0' + s : s;
    his = h + ':' + i + ':' + s;
    TweenMax.set(DIGITALCLOCK,{text:{value: his}});
    TweenMax.set('title',{text:{value: his}});
  }

  // interval function of the anolog clock that also calls the timeOfDay function and the showDigitalClock function
  function showTime() {
    timeOffset = timeOffsetHours * 3600000 + timeOffsetMinutes * 60000 + timeOffsetSeconds * 1000;
    datetime =  new Date(Date.now() + timeOffset);
    if (utc) {
      var datetimeUtc = datetime.getTime() + (datetime.getTimezoneOffset() * 60000);
      datetime = new Date(datetimeUtc);
    }
    h = datetime.getHours();
    i = datetime.getMinutes();
    s = datetime.getSeconds();
    n = DAYSOFWEEK[datetime.getDay()];
    d = datetime.getDate();
    m = MONTHSOFYEAR[datetime.getMonth()];
    Y = datetime.getFullYear();

    date = n + ', ' + m + ' ' +  nth(d) + ' ' + Y;
    if (DATEONSCREEN.html() != date) {showDate(date);}

    // convert 24 to 12 and show the time hourly
    if (i < 1 && s < 1) {
      if (h == 0) {hoursShow(12);}
      else if (h <= 12) {hoursShow(h);}
      else {hoursShow(h-12);}
    }

    // play sound on the half hour mark when audio isn't muted
    if (i == 30 && s < 1) {
      if (!mute) {
        bell = new Audio('bell.mp3');
        bell.play();
      }
    }

    // update digital clock
    showDigitalClock(h,i,s);

    // convert to seconds for TweenMax
    minutesAsSeconds = i * 60;
    hoursAsSeconds = h * 60 * 60 + minutesAsSeconds;
    secondsAsSeconds = s / 60;

    // progress from 0 to 1 per pointerTween
    hourTween.progress(hoursAsSeconds / TWELVEHOURS);
    timeTween.progress(hoursAsSeconds/ FULLDAY);
    minuteTween.progress(minutesAsSeconds / ONEHOUR);
    secondsTween.progress(secondsAsSeconds / ONESECOND);

    // change background based on time of day
    if (timeTween.progress() >= 0 && timeTween.progress() < 0.25) {TweenMax.to(HTML, 2, {backgroundColor: '#000000'});}
    if (timeTween.progress() >= 0.25 && timeTween.progress() < 0.5) {TweenMax.to(HTML, 2, {backgroundColor: '#e09572'});}
    if (timeTween.progress() >= 0.5 && timeTween.progress() < 0.75) {TweenMax.to(HTML, 2, {backgroundColor: '#e0bfb0'});}
    if (timeTween.progress() >= 0.75 && timeTween.progress() < 1) {TweenMax.to(HTML, 2, {backgroundColor: '#94624b'});}

  }

  // initial visualisaton of time
  showTime();

  // set time every second
  setInterval(function() {
    showTime();
    // play tick every second if sound isn't muted
    if (!mute) {
      tick.volume = 0.01;
      tick.play();
    }
  }, 1000);

  // onclick events and footer controls
  $('#addHour').click(() => setTimeOffset('hours', 1));
  $('#subtractHour').click(() => setTimeOffset('hours', -1));
  $('#addMinute').click(() => setTimeOffset('minutes', 1));
  $('#subtractMinute').click(() => setTimeOffset('minutes', -1));
  $('#addTenSeconds').click(() => setTimeOffset('seconds', 10));
  $('#subtractTenSeconds').click(() => setTimeOffset('seconds', -10));
  $('#resetTimeOffset').click(() => {
    timeOffsetHours = 0;
    timeOffsetMinutes = 0;
    timeOffsetSeconds = 0;
    utc = true;
  });
  MUTEBUTTON.click(()=>{
    mute = true;
    TweenMax.to(MUTEBUTTON, 0.5, {x: '-23px',autoAlpha:0});
    TweenMax.to(UNMUTEBUTTON, 0.5, {x: '0px',autoAlpha:1});
  });
  UNMUTEBUTTON.click(()=>{
    mute = false;
    TweenMax.to(UNMUTEBUTTON, 0.5, {x: '0px',autoAlpha:0});
    TweenMax.to(MUTEBUTTON, 0.5, {x: '-23px', autoAlpha:1});
  });
  UTCTOGGLE.click(()=>{
    if (!utc) {
      utc = true;
      TweenMax.to(UTCTOGGLE, 1, {color: 'green'});
    } else {
      utc = false;
      TweenMax.to(UTCTOGGLE, 1, {color: 'red'});}
    });
});