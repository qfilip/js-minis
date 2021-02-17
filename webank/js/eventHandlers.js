import * as utils from './utils.js';
import * as renderer from './render.js';

export function makePaymentRequest() {
    let [sender, reciever] = utils.makeSendRecPair();
    const details = {
        sender: Object.assign({}, users[sender]),
        reciever: Object.assign({}, users[reciever]),
        amount: utils.getRandom(users[sender].balance + 400)
    };

    const event = {
        id: utils.makeId(),
        sourceId: null,
        status: 'pending',
        details: details,
        createdOn: new Date()
    }
    events.push(event);
    window.localStorage.setItem('events', JSON.stringify(events));
    renderer.renderAll();
}

export function resolvePendingRequests() {
    const pendingIds = events.filter(x => x.sourceId === null).map(x => x.id);
    const processedIds = events.filter(x => x.sourceId !== null).map(x => x.sourceId);
    const unprocessedIds = pendingIds.filter(x => !processedIds.includes(x));
    const unprocessed = events.filter(x => unprocessedIds.includes(x.id));

    unprocessed.forEach(x => resolveRequest(x));
    renderer.renderAll();
}

export function resolveRequest(ev) {
    let result = {
        id: utils.makeId(),
        sourceId: ev.id,
        status: null,
        details: ev.details,
        createdOn: new Date()
    };
    const sender = users.find(x => x.id === ev.details.sender.id);
    const reciever = users.find(x => x.id === ev.details.reciever.id);
    if(sender.balance < ev.details.amount) {
        result.status = 'failed';
    }
    else {
        sender.balance -= ev.details.amount;
        reciever.balance += ev.details.amount;
        result.status = 'resolved';
    }
    events.push(result);
    
    window.localStorage.setItem('events', JSON.stringify(events));
    window.localStorage.setItem('users', JSON.stringify(users));
}