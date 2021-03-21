function preload() {
    let inputs = document.querySelectorAll('input');
    for (let i = 0; inputs[i]; i++) {
        inputs[i].addEventListener('input', onChange);
        const o = getValues(inputs[i]);
        inputs[i].value = o.value;
    }
}

function getValues(inputElement) {
    const varname = `--${inputElement.id}`;
    const varval = getStyle(varname).trim();

    return { name: varname, value: varval };
}

function onChange(e) {
    console.log(e.srcElement.id);
    const varname = `--${e.srcElement.id}`;
    const varval = e.srcElement.value;
    setStyle(varname, varval);
}

function getStyle(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
}

function setStyle(varName, varVal) {
    document.documentElement.style.setProperty(varName, varVal);
}

function exportColors() {
    debugger
    const get = (id) => document.getElementById(id);
    let modal = get('modal');
    let exporter = get('exporter');

    let html = '';
    let inputs = document.querySelectorAll('input');
    for (let i = 0; inputs[i]; i++) {
        const o = getValues(inputs[i]);
        html += `<div>${o.name}: ${o.value}</div>`;
    }
    exporter.innerHTML = html;
    modal.classList.add('modal-visible');
}

function closeModal() {
    const get = (id) => document.getElementById(id);
    let modal = get('modal');
    modal.classList.remove('modal-visible');
}