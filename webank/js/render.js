var userdiv;
var eventdiv;

function renderLists() {
    userdiv = document.getElementById('users');
    eventdiv = document.getElementById('events');
    renderUsers();
    renderEvents();
    document
        .querySelector('#scroll-target')
        .scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}


function renderUsers() {
    let innerhtml = '';
    users.forEach(x => {
        innerhtml += `<div>Name: ${x.name}, Balance: ${x.balance}</div>`;
    });
    userdiv.innerHTML = innerhtml;
}


function renderEvents() {
    let innerhtml = '';
    events.forEach(x => {
        let d = JSON.parse(x.details);
        const color = x.sourceId || x.id;
        const statusColor =
            x.status === 'pending' ? 'blue'
            : x.status === 'resolved' ? 'green'
            : 'red';

        innerhtml += 
        `
            <tr style="background-color: ${color}">
                <td>${users[d.sender].name} -> ${users[d.reciever].name}: ${d.amount}</td>
                <td style="background-color: ${statusColor}">${x.status}</td>
            </tr>
        `;
    });
    eventdiv.innerHTML = innerhtml;
}

