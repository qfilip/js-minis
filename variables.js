var progress;
var dialog;
var target;
var cash;
var bet;

var cashAmount = 200;
var betSize = 20;
var targetId = 0;

var spinDisabled = false;

var urls = [
    'media/banana.png',
    'media/cherry.png',
    'media/kumquat.png',
    'media/lemon.png',
    'media/lime.png',
    'media/pineapple.png'
];

var slotIds = [];
var images = [];
var imagesLength;

function initialize() {
    progress = document.getElementById('progress-bar');
    dialog = document.getElementById('dialog-dark');
    target = document.getElementById('target');
    cash = document.getElementById('cash');
    bet = document.getElementById('bet');

    target.src = urls[0];
    cash.innerText = cashAmount;
    bet.innerText = betSize;

    urls.forEach((url, index) => images.push({id: index, url: url}));
    imagesLength = images.length;
}
