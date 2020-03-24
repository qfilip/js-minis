function getSlots() {
    return document.querySelectorAll('.slot');
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function spin() {
    changeProgressBar(0, true);
    let slots = getSlots();
    const length = slots.length;
    spinSlots(slots, 0, length);
    updateProgressBar(0);
}

function spinSlots(slots, slotIndex, numOfSlots) {
    if(slotIndex < numOfSlots) {
        sleep(300).then(() => {
            const rotation = [
                { transform: 'rotateX(0deg)', filter: 'blur(0)' },
                { transform: 'rotateX(3600deg)', filter: 'blur(3px)' }
            ];
            slots[slotIndex].animate(rotation, {
                easing: 'ease-in-out',
                playbackRate: 1,
                duration: 3000
            });
            
            sleep(1000).then(() => {
                slots[slotIndex].src = images[3].url;
                // sleep(300).then(changeProgressBar(33));
            });
            spinSlots(slots, slotIndex + 1, numOfSlots);
        });
    }
}

function updateProgressBar(time) {
    sleep(35).then(() => {
        if (time < 900) {
            changeProgressBar(1);
            updateProgressBar(time + 9);
        }
    });
}

function changeProgressBar(value, reset = null) {
    (!!reset) ? progress.value = 0 : progress.value += value;
}