import * as utils from './utils.js';

function loadRenderJsGlobals() {
    userTable = document.getElementById('users');
    eventTable = document.getElementById('events');

    selectedUser = document.getElementById('selected-user');
    eventDates = document.getElementById('event-dates');

    cfgScrollBtn = document.getElementById('cfg-scroll');
    
    const scrollString = window.localStorage.getItem('cfgScroll') || 'true';
    const stringToBool = (str) => str.toLowerCase() === 'true';
    cfgEventAutoScroll = stringToBool(scrollString); 
}

export function renderAll() {
    loadRenderJsGlobals();
    renderUsers();
    renderEvents();
    renderCfgScrollBtnText();

    if(!cfgEventAutoScroll) {
        return;
    }
    document
        .querySelector('#scroll-target')
        .scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}


export function renderUsers() {
    let innerhtml = '';
    users.forEach(x => {
        innerhtml +=
        `
        <tr onclick="loadUser('${x.id}')" class="clickable">
            <td>${x.name}</td>
            <td>${x.balance}</td>
        </tr>
        `
    });
    userTable.innerHTML = innerhtml;
}


export function renderEvents() {
    let innerhtml = '';
    events.forEach(x => {
        const d = x.details;
        const color = x.sourceId || x.id;
        const statusColor =
            x.status === 'pending' ? 'blue'
            : x.status === 'resolved' ? 'green'
            : 'red';

        innerhtml += 
        `
            <tr style="background-color: ${color}">
                <td>${d.sender.name} -> ${d.reciever.name}: ${d.amount}</td>
                <td style="background-color: ${statusColor}">${x.status}</td>
            </tr>
        `;
    });
    eventTable.innerHTML = innerhtml;
}

export function loadUser(userId) {
    const user = users.find(x => x.id === userId);
    const dates = events.map(x => x.createdOn);

    let innerhtml = '';
    innerhtml += `<div>|${user.name}| Check balance for specific time</div>`;
    innerhtml += `<select id="event-dates">`;
    dates.forEach(x => innerhtml += `<option value="${x}">${utils.formatDate(x)}</option>`);
    innerhtml += `</select>`;

    selectedUser.innerHTML = innerhtml;
}

export function renderCfgScrollBtnText() {
    const text = cfgEventAutoScroll ? 'Auto Scroll On' : 'Auto Scroll Off';
    const [ addClass, removeClass ] = 
        cfgEventAutoScroll ? [ 'w3-green', 'w3-red' ] : [ 'w3-red', 'w3-green' ];
    
    cfgScrollBtn.innerText = text;
    cfgScrollBtn.classList.add(addClass);
    cfgScrollBtn.classList.remove(removeClass);
}

