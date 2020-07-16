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

var resultMedia = ['media/win.png', 'media/loss.png'];

var slotIds = [];
var images = [];
var imagesLength;

function initialize() {
    bet = document.getElementById('bet');
    cash = document.getElementById('cash');
    target = document.getElementById('target');
    dialog = document.getElementById('dialog-dark');
    progress = document.getElementById('progress-bar');
    resultStatus = document.getElementById('result-status');
    statusImg = document.getElementById('result-status-img');
    statusText = document.getElementById('result-status-text');

    cash.innerText = cashAmount;
    bet.innerText = betSize;
    
    urls.forEach((url, index) => images.push({id: index, url: url}));
    target.src = urls[0];
    imagesLength = images.length;

    resultStatus.style.display = 'none';
}
