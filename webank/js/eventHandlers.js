function makePaymentRequest() {
    [sender, reciever] = makeSendRecPair();
    const amount = getRandom(users[sender].balance + 400);
    const details = {
        sender: sender,
        reciever: reciever,
        amount: getRandom(users[sender].balance + 400)
    };

    const event = {
        id: makeId(),
        sourceId: null,
        status: 'pending',
        details: JSON.stringify(details)
    }
    events.push(event);
    window.localStorage.setItem('events', JSON.stringify(events));
    renderLists();
}

function resolvePendingRequests() {
    const pendingIds = events.filter(x => x.sourceId === null).map(x => x.id);
    const processedIds = events.filter(x => x.sourceId !== null).map(x => x.sourceId);
    const unprocessedIds = pendingIds.filter(x => !processedIds.includes(x));
    const unprocessed = events.filter(x => unprocessedIds.includes(x.id));

    unprocessed.forEach(x => resolveRequest(x));
}

function resolveRequest(ev) {
    let details = JSON.parse(ev.details);
    let result = {
        id: makeId(),
        sourceId: ev.id,
        status: null,
        details: ev.details
    };
    if(users[details.sender].balance < details.amount) {
        result.status = 'failed';
    }
    else {
        users[details.sender].balance -= details.amount;
        users[details.reciever].balance += details.amount;
        result.status = 'resolved';
    }
    events.push(result);
    
    window.localStorage.setItem('events', JSON.stringify(events));
    window.localStorage.setItem('users', JSON.stringify(users));

    renderLists();
}