export function makeId() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function getRandom(upper) {
    return ~~(Math.random() * upper);
}

export function getUsers() {
    let userStr = window.localStorage.getItem('users') || '';
    if(userStr.length > 0) {
        return JSON.parse(userStr);
    }

    let users = [
        { id: makeId(), name: 'Alice', balance: 2000 },
        { id: makeId(), name: 'Bob', balance: 3000 },
        { id: makeId(), name: 'Carl', balance: 500 }
    ];

    window.localStorage.setItem('users', JSON.stringify(users));

    return users;
}

export function getEvents() {
    let eventStr = window.localStorage.getItem('events') || '';
    if(eventStr.length > 0) {
        return JSON.parse(eventStr);
    }

    let events = [];
    window.localStorage.setItem('events', JSON.stringify(events));

    return events;
}

export function makeSendRecPair() {
    let sender = getRandom(users.length);
    let reciever = getRandom(users.length);
    if(sender === reciever) {
        let [s, r] = makeSendRecPair();
        sender = s;
        reciever = r;
    }

    return [sender, reciever];
}


export function formatDate(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();

    const hr = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();

    return `${day}/${m}/${y}|${hr}:${min}:${sec}`;
}