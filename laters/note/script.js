// Function to start background music
function playMusic() {
  const music = document.getElementById('background-music');
  music.loop = true; // Make the music loop
  music.play();
}

// Play music when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
  playMusic();
});

// Play music once when user clicks anywhere
document.body.addEventListener('click', playMusic, { once: true });

const content = document.getElementById('content');
const footer = document.getElementsByTagName('footer')[0];
const timer = document.getElementById('timer');

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

let countDown = new Date('Oct 22, 2023 00:00:00').getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;

    document.getElementById('hours').innerText = Math.floor(distance / hour);
    document.getElementById('minutes').innerText = Math.floor((distance % hour) / minute);
    document.getElementById('seconds').innerText = Math.floor((distance % minute) / second);

    if (distance < 0) {
      timer.classList.add('d-none'); // Hide timer
      confetti(); // Trigger confetti animation
      clearInterval(x);
      _slideOne(); // Start first slide
    }
  }, second);

// Slide functions
const _slideOne = function () {
  const tap = document.getElementById('tap');
  const slideOne = document.getElementById('slideSatu');
  slideOne.classList.remove('d-none');

  setTimeout(function () {
    tap.classList.remove('d-none');
    document.body.addEventListener('click', function () {
      _slideTwo();
    });
  }, 7000);
};

const _slideTwo = function () {
  const slideOne = document.getElementById('slideSatu');
  const tap = document.getElementById('tap');
  const slideTwo = document.getElementById('slideDua');

  setTimeout(function () {
    slideOne.classList.replace('animate__slideInDown', 'animate__backOutDown');
    tap.classList.add('d-none');
    setTimeout(function () {
      slideOne.classList.add('d-none');
    }, 1000);
  }, 1000);

  slideTwo.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    document.body.addEventListener('click', function () {
      slideTwo.classList.replace('animate__zoomInDown', 'animate__fadeOutLeft');
      slideTwo.classList.remove('animate__delay-2s', 'animate__slow');
      tap.classList.add('d-none');
      setTimeout(function () {
        slideTwo.remove();
        _slideThree();
      }, 1000);
    });
  }, 40000);
};

const _slideThree = function () {
  const tap = document.getElementById('tap');
  const slideThree = document.getElementById('slideTiga');

  slideThree.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    document.body.addEventListener('click', function () {
      slideThree.classList.remove('animate__delay-2s', 'animate__slow');
      slideThree.classList.replace('animate__fadeInRight', 'animate__fadeOut');
      tap.remove();
      setTimeout(function () {
        slideThree.remove();
        _slideFour();
      }, 1000);
    });
  }, 43000);
}

// Get a random position for an element
function getRandomPosition(element) {
  var x = document.body.offsetHeight - element.clientHeight;
  var y = document.body.offsetWidth - element.clientWidth;
  var randomX = Math.floor(Math.random() * 500);
  var randomY = Math.floor(Math.random() * y);
  return [randomX, randomY];
}

const _slideFour = function () {
  const slideFour = document.getElementById('slideEmpat');
  const btn = document.getElementsByTagName('button');
  slideFour.classList.remove('d-none');

  btn[0].addEventListener('click', function () {
    var xy = getRandomPosition(slideFour);
    slideFour.style.top = xy[0] + 'px';
    // slideFour.style.left = xy[1] + 'px';
  });

  btn[1].addEventListener('click', function () {
    slideFour.classList.replace('animate__fadeInDown', 'animate__bounceOut');
    slideFour.classList.remove('animate__delay-2s');
    setTimeout(function () {
      slideFour.remove()
      setTimeout(() => {
        _slideFive();
      }, 500);
    }, 1000);
  });
};

const _slideFive = function () {
  const slideFive = document.getElementById('slideLima');
  slideFive.classList.remove('d-none');
  const thanks = document.getElementById('trims');

  setTimeout(() => {
    thanks.classList.remove('d-none');
  }, 1000);

  slideFive.addEventListener('animationend', () => {
    slideFive.classList.add('animate__delay-3s');
    slideFive.classList.replace('animate__bounceIn', 'animate__fadeOut');
    thanks.classList.add('animate__animated', 'animate__fadeOut', 'animate__delay-3s');
    setTimeout(() => {
      thanks.remove();
      setTimeout(() => {
        slideFive.remove();
        _slideSix();
      }, 1000);
    }, 6000);
  });
};

const _slideSix = function () {
  const slideSix = document.getElementById('slideEnam');
  slideSix.classList.remove('d-none');
};

// TypeIt animations (translated to English)
new TypeIt("#teks1", {
  strings: [
"Hey, I hope life doesn't totally screw you over today.",
"May all the crap that tries to break you somehow make you slightly stronger… or at least less annoyed.",
"May the world not be a total jerk to you, wherever you are.",
"May you somehow 'find people (like me) who actualy loves you', 'or snacks', 'or whatever makes you happy.'",
"May your steps not trip over too much stuff on the way to getting what you want."
  ],
  startDelay: 4000,
  speed: 75,
  waitUntilVisible: true
}).go();

new TypeIt("#teks2", {
  strings: [
    "With or without me, may the universe always make you happy in any way.",
    " ",
    " Hoping and rooting for your success this year as well ;), thank you for staying strong until now.",
    " ",
    "- Wishing you all the best"
  ],
  startDelay: 2000,
  speed: 75,
  waitUntilVisible: true
}).go();

new TypeIt("#trims", {
  strings: ["Thank you."],
  startDelay: 2000,
  speed: 150,
  loop: false,
  waitUntilVisible: true,
}).go();

// Confetti animation function
'use strict';

var onlyOnKonami = false;

function confetti() {
  // Globals
  var $window = $(window),
    random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];

  var runFor = 2000;
  var isRunning = true;

  setTimeout(() => {
    isRunning = false;
  }, runFor);

  // Konami code sequence
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    pointer = 0;

  var particles = 150,
    spread = 20,
    sizeMin = 5,
    sizeMax = 12 - sizeMin,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -.1,
    dxThetaMax = -dxThetaMin - dxThetaMin,
    dyMin = .13,
    dyMax = .18,
    dThetaMin = .4,
    dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function () { return color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0); },
    function () { var black = 200 * random() | 0; return color(200, black, black); },
    function () { var black = 200 * random() | 0; return color(black, 200, black); },
    function () { var black = 200 * random() | 0; return color(black, black, 200); },
    function () { return color(200, 100, 200 * random() | 0); },
    function () { return color(200 * random() | 0, 200, 200); },
    function () { var black = 256 * random() | 0; return color(black, black, black); },
    function () { return colorThemes[random() < .5 ? 1 : 2](); },
    function () { return colorThemes[random() < .5 ? 3 : 5](); },
    function () { return colorThemes[random() < .5 ? 2 : 4](); }
  ];

  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1 - cos(PI * t)) / 2 * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1 / eccentricity,
    radius2 = radius + radius;

  function createPoisson() {
    var domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      var dart = measure * random(), i, l, interval, a, b, c, d;

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i + 1], interval = b - a;
        if (dart < measure + interval) {
          spline.push(dart += a - measure);
          break;
        }
        measure += interval;
      }
      c = dart - radius, d = dart + radius;

      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1, a = domain[l], b = domain[i];
        if (a >= c && a < d)
          if (b > d) domain[l] = d;
          else domain.splice(l, 2);
        else if (a < c && b > c)
          if (b <= d) domain[i] = c;
          else domain.splice(i, 0, c, d);
      }

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.overflow = 'visible';
  container.style.zIndex = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = $window.width() * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top = this.y + 'px';

    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      var phi = this.frame % 7777 / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height + deviation;
    };
  }

  function poof() {
    if (!frame) {
      document.body.appendChild(container);

      var theme = colorThemes[onlyOnKonami ? colorThemes.length * random() | 0 : 0],
        count = 0;

      (function addConfetto() {
        if (onlyOnKonami && ++count > particles)
          return timer = undefined;

        if (isRunning) {
          var confetto = new Confetto(theme);
          confetti.push(confetto);

          container.appendChild(confetto.outer);
          timer = setTimeout(addConfetto, spread * random());
        }
      })(0);

      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = $window.height();

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  $window.keydown(function (event) {
    pointer = konami[pointer] === event.which ?
      pointer + 1 :
      +(event.which === konami[0]);
    if (pointer === konami.length) {
      pointer = 0;
      poof();
    }
  });

  if (!onlyOnKonami) poof();
};
