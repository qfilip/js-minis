function getSlots() {
    return document.querySelectorAll('.slot');
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function spin() {
    resultStatus.style.display = 'none';

    if(spinDisabled) return;

    if (cashAmount - betSize >= 0) {
        spinDisabled = true;
        cashAmount -= betSize;
        cash.innerText = cashAmount;
        changeProgressBar(0, true);
        let slots = getSlots();
        
        spinSlots(slots, 0)
        .then(x => spinSlots(slots, 1))
        .then(x => spinSlots(slots, 2));
        updateProgressBar(0);
    }
    else {
        dialog.showModal();
    }
}

function spinSlots(slots, slotIndex) {
    return new Promise((resolve, _) => {
        setTimeout(() => {
            console.log('spinning', slotIndex)
            const rotation = [
                { transform: 'rotateX(0deg)', filter: 'blur(0)' },
                { transform: 'rotateX(3600deg)', filter: 'blur(3px)' }
            ];
            slots[slotIndex].animate(rotation, {
                easing: 'ease-in-out',
                playbackRate: 1,
                duration: 3000
            });
            
            const random = getRandom();
            slotIds.push(images[random].id);
            slots[slotIndex].src = images[random].url;

            resolve(slotIndex + 1);
        }, 300);
    });
}

function computeWinnings() {
    spinDisabled = false;
    let counter = 0;
    slotIds.forEach(x => {
        if (targetId === x) counter++;
    });
    cashAmount += betSize * counter;
    cash.innerText = cashAmount;
    slotIds = [];

    const won = counter > 0;

    resultStatus.style.display = 'block';
    statusImg.src = resultMedia[won ? 0 : 1];
    statusText.innerText = 
        won ? `You win ${betSize * counter} credits!!!` : 'Better luck next time';
}

function updateProgressBar(time) {
    sleep(35).then(() => {
        if (time < 900) {
            changeProgressBar(1);
            updateProgressBar(time + 9);
        } else {
            computeWinnings();
        }
    });
}

function changeProgressBar(value, reset = null) {
    (!!reset) ? progress.value = 0 : progress.value += value;
}

function changeBet(value) {
    const control = betSize + value;
    if (control > 0 && control <= cashAmount) {
        betSize = control;
        bet.innerText = betSize;
    }
}

function changeTarget(value) {
    const control = targetId + value
    if (control < 0) {
        targetId = imagesLength;
    }
    else if (control > imagesLength) {
        targetId = 0;
    }
    else {
        targetId = control;
    }

    target.src = images[targetId].url;
}

function getRandom() {
    return Math.floor(Math.random() * imagesLength);  
}