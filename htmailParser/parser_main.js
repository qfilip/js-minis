var expressionMode = false;
var expressionMark = '|c#|';
var indentation = [];
var indentationSize = 4;
const varSepar = /{([^}]*)}/;
const lineSepar = /[^\r\n]+/g;
const classRegex = /class=".*"/g;
var origin;
var destination;
var styleContent = [{ name: '', cssProps: []}];

function f() {
    resetData();

    const allLines = origin.match(lineSepar);
    let lines = processStyleTag(allLines);
    lines.forEach(line => parseLine(line));
}

function parseLine(line) {
    const exprToggle = line.trim().startsWith(expressionMark);
    
    if(exprToggle) {
        expressionMode = !expressionMode;
        return;
    }
    
    expressionMode ? appendExpression(line) : processLine(line);
}

function processLine(line) {
    line = classToInlineStyle(line);
    const trimmed = line.trim().replace(/"/g, '\\"');
    const newLines = trimmed.split(varSepar);

    newLines.forEach(x => {
        const val = x[0] === '_' ? `builder.Append(${x.substr(1)});` : `builder.Append("${x}");`;
        
        if(val !== 'builder.Append("");') {
            destination.value += val;
            destination.value += '\n';
        }
    })
}

function processStyleTag(allLines) {
    styleContent = [];
    const startIndex = allLines.findIndex(l => l.trim().startsWith('<style>'));
    const endIndex = allLines.findIndex(l => l.trim().startsWith('</style>'));

    if(startIndex === -1 || endIndex === -1) {
        return allLines;
    }

    let styleTagContent = allLines.slice(startIndex + 1, endIndex);
    let currentIndex = -1;
    
    styleTagContent.forEach(l => {
        let trimmed = l.trim();
        if(trimmed.startsWith('.')) {
            const className = filterClassName(trimmed.trim());
            styleContent.push({ name: className, cssProps: []});
            currentIndex++;
        }
        else {
            const isValidProp = 
                !trimmed.includes('{') &&
                !trimmed.includes('}') &&
                trimmed.length > 0;

            isValidProp ?
                styleContent[currentIndex].cssProps.push(trimmed) :
                () => {}
        }
    });

    allLines.splice(startIndex, endIndex - startIndex + 1);
    
    return allLines;
}

function filterClassName(txt) {
    const start = txt.indexOf('.') + 1;
    const end = txt.indexOf('{');
    
    return txt.substring(start, end).trim();
}

function classToInlineStyle(txt) {
    const hasClassAttr = classRegex.test(txt);
    if(!hasClassAttr) {
        return txt;
    }

    const noStyleTag = !styleContent.cssProps || styleContent.cssProps.length === 0;
    if(noStyleTag) {
        alert('Some elements have css classes, but no <style> tag was found to resolve class properties');
        return;
    }
    
    let classMatchString = txt.match(classRegex)[0];
    let classAttr = classMatchString.match(/"([^"]*)"/g)[0];
    const classes = classAttr.substring(1, classAttr.length-1).split(' ');
    
    let styleString = 'style="';
    classes.forEach(c => {
        const classMatch = styleContent.find(x => x.name === c);
        if(!classMatch) {
            const errorMsg = `Css class '${c}' not present in style tag`;
            alert(errorMsg);
            throw new Error(errorMsg);
        }
        const propString = classMatch.cssProps.join(' ');
        styleString += propString;
    });
    styleString += '"';

    return txt.replace(classRegex, styleString);
}

function appendExpression(line) {
    const toAppend = line.trim();
    const isleftBracket = toAppend === '{';
    const isRightBracket = toAppend === '}';
    
    isRightBracket ? decrementIndentation() : () => {};
    indentation.forEach(x => destination.value += x);
    isleftBracket ? incrementIndentation() : () => {};

    destination.value += toAppend;
    destination.value += '\n';
}

function incrementIndentation() {
    for(let i = 0; i < indentationSize; i++) {
        indentation.push(' ');
    }
}

function decrementIndentation() {
    for(let i = 0; i < indentationSize; i++) {
        indentation.pop();
    }
}

function resetData() {
    origin = document.getElementById('origin').value;
    destination = document.getElementById('destination');
    indentation = [];
    classes = [];
    expressionMode = false;
    destination.value = '';
}

function showReadme(show) {
    const display = show ? 'block' : 'none';
    document.getElementById('modal').style.display = display;
}