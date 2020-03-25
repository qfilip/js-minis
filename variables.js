var progress;
var dialog;
var cash;
var bet;

var cashAmount = 200;
var betSize = 20;

var images = [
    { name: 'banana', url: 'media/banana.png'},
    { name: 'cherry', url: 'media/cherry.png'},
    { name: 'kumquat', url: 'media/kumquat.png'},
    { name: 'lemon', url: 'media/lemon.png'},
    { name: 'lime', url: 'media/lime.png'},
    { name: 'pineapple', url: 'media/pineapple.png'}
];

function loadDomElements() {
    progress = document.getElementById('progress-bar');
    dialog = document.getElementById('dialog-dark');
    cash = document.getElementById('cash');
    bet = document.getElementById('bet');

    cash.innerText = cashAmount;
    bet.innerText = betSize;
}
