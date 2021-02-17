function makeId() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function getRandom(upper) {
    return ~~(Math.random() * upper);
}

function getUsers() {
    let userStr = window.localStorage.getItem('users') || '';
    if(userStr.length > 0) {
        return JSON.parse(userStr);
    }

    let users = [
        { name: 'Alice', balance: 2000 },
        { name: 'Bob', balance: 3000 },
        { name: 'Carl', balance: 500 }
    ];

    window.localStorage.setItem('users', JSON.stringify(users));

    return users;
}

function getEvents() {
    let eventStr = window.localStorage.getItem('events') || '';
    if(eventStr.length > 0) {
        return JSON.parse(eventStr);
    }

    let events = [];
    window.localStorage.setItem('events', JSON.stringify(events));

    return events;
}

function makeSendRecPair() {
    let sender = getRandom(users.length);
    let reciever = getRandom(users.length);
    if(sender === reciever) {
        [s, r] = makeSendRecPair();
        sender = s;
        reciever = r;
    }

    return [sender, reciever];
}