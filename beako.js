const dictionary = Symbol('Beako');
function attack(page, value) {
    const old = page.value;
    if (old !== value) {
        page.arms.forEach((arm)=>{
            switch(arm[0]){
                case 'bio':
                    arm[1]();
                    break;
                case 'bom':
                    page.arms.delete(arm);
                case 'spy':
                    arm[1](value, old);
                    break;
            }
        });
    }
    page.value = value;
}
function invade(obj, key, arm) {
    if (!(dictionary in obj)) {
        obj[dictionary] = {
        };
    }
    if (key !== undefined) {
        if (!(key in obj[dictionary])) {
            obj[dictionary][key] = {
                value: obj[key],
                arms: new Set()
            };
            Object.defineProperty(obj, key, {
                get () {
                    return this[dictionary][key].value;
                },
                set (value) {
                    attack(this[dictionary][key], value);
                }
            });
        }
        if (arm) {
            obj[dictionary][key].arms.add(arm);
        }
    }
}
function watch(data, keyOrCallback, callback) {
    if (typeof data === 'object' && data !== null) {
        const obj = data;
        invade(obj);
        if (callback === undefined) {
            const bio = keyOrCallback ? typeof keyOrCallback === 'function' ? [
                'bio',
                keyOrCallback
            ] : keyOrCallback : undefined;
            for(const key in obj){
                invade(obj, key, bio);
            }
            if (Array.isArray(obj)) {
                return obj;
            } else {
                for(const key in obj){
                    const bios = [
                        ...obj[dictionary][key].arms
                    ].filter((arm)=>arm[0] === 'bio'
                    );
                    if (bios.length) {
                        bios.forEach((arm)=>watch(obj[key], arm)
                        );
                    } else {
                        watch(obj[key]);
                    }
                }
            }
        } else {
            const spy = typeof callback === 'function' ? [
                'spy',
                callback
            ] : callback;
            if (Array.isArray(keyOrCallback)) {
                keyOrCallback.forEach((key)=>invade(obj, key, spy)
                );
            } else {
                invade(obj, keyOrCallback, spy);
            }
        }
    }
    return data;
}
export { watch as watch };
async function receive(obj1, key1) {
    const keys = Array.isArray(key1) ? key1 : [
        key1
    ];
    const values = await Promise.all(keys.map((key)=>{
        if (obj1[key] === undefined) {
            return new Promise((resolve)=>{
                invade(obj1, key, [
                    'bom',
                    resolve
                ]);
            });
        } else {
            return obj1[key];
        }
    }));
    return keys.reduce((obj, key, index)=>{
        obj[key] = values[index];
        return obj;
    }, {
    });
}
export { receive as receive };
function retreat(obj, key, callback) {
    if (key !== undefined) {
        if (dictionary in obj) {
            if (key in obj[dictionary]) {
                if (callback) {
                    obj[dictionary][key].arms.forEach((arm)=>{
                        if (arm[1] === callback) {
                            obj[dictionary][key].arms.delete(arm);
                        }
                    });
                } else {
                    obj[dictionary][key].arms.clear();
                }
                if (!obj[dictionary][key].arms.size) {
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: obj[dictionary][key].value
                    });
                    delete obj[dictionary][key];
                }
            }
        }
    } else {
        for(const key in obj[dictionary]){
            retreat(obj, key);
        }
        delete obj[dictionary];
    }
}
function unwatch(data, keyOrCallback, callback) {
    if (typeof data === 'object' && data !== null) {
        const obj = data;
        if (callback === undefined) {
            if (keyOrCallback) {
                const reactiveCallback = keyOrCallback;
                for(const key in obj){
                    retreat(obj, key, reactiveCallback);
                    unwatch(obj[key], reactiveCallback);
                }
            } else {
                for(const key in obj){
                    unwatch(obj[key]);
                }
                retreat(obj);
            }
        } else {
            if (Array.isArray(keyOrCallback)) {
                keyOrCallback.forEach((key)=>retreat(obj, key, callback)
                );
            } else {
                retreat(obj, keyOrCallback, callback);
            }
        }
    }
    return data;
}
export { unwatch as unwatch };
function reach(data, callback) {
    const bio = typeof callback === 'function' ? [
        'bio',
        callback
    ] : callback;
    if (typeof data === 'object' && data !== null) {
        const obj = data;
        if (dictionary in obj) {
            for(const key in obj[dictionary]){
                invade(obj, key, bio);
            }
        }
        for(const key in obj){
            reach(obj[key], bio);
        }
    }
    return data;
}
export { reach as reach };
function load(node) {
    const tree = {
        node
    };
    loadChildren(tree);
    return tree;
}
function loadElement(element) {
    const el = {
        tag: element.tagName.toLowerCase(),
        node: element
    };
    loadAttr(el);
    loadChildren(el);
    return el;
}
function loadAttr(el) {
    if (el.node.hasAttributes()) {
        const props = {
        };
        el.node.getAttributeNames().forEach((name)=>{
            if (name.startsWith('on')) return;
            const value = el.node.getAttribute(name);
            switch(name){
                case 'class':
                case 'part':
                    return el[name] = value.split(/\s+/);
                case 'style':
                case 'is':
                    return el[name] = value;
                default:
                    return props[name] = value;
            }
        });
        if (Object.keys(props).length) {
            el.props = props;
        }
    }
}
function loadChildren(tree) {
    if (tree.node.hasChildNodes()) {
        const nodeList = tree.node.childNodes;
        tree.children = [];
        for(let i = 0; i < nodeList.length; i++){
            switch(nodeList[i].nodeType){
                case 3:
                    tree.children.push(nodeList[i].data);
                    break;
                case 1:
                    tree.children.push(loadElement(nodeList[i]));
                    break;
            }
        }
    }
}
export { load as load };
function patch(tree, newTree) {
    patchChildren(tree, newTree);
    return tree;
}
function patchElement(el, newEl) {
    console.log('el:', el);
    console.log('el:', el.node.getAttributeNames());
    if (el.tag !== newEl.tag || el.is !== newEl.is) {
        console.log('newEl.is:', newEl.is);
        return patchElement(newEl.is ? {
            tag: newEl.tag,
            is: newEl.is,
            node: document.createElement(newEl.tag, {
                is: newEl.is
            })
        } : {
            tag: newEl.tag,
            node: document.createElement(newEl.tag)
        }, newEl);
    }
    patchClass(el, newEl);
    patchPart(el, newEl);
    patchStyle(el, newEl);
    patchProps(el, newEl);
    patchOn(el, newEl);
    patchChildren(el, newEl);
    if ('key' in newEl) {
        el.key = newEl.key;
    } else {
        delete el.key;
    }
    return el;
}
function patchClass(el, newEl) {
    const currentClass = el.class || [];
    const newClass = newEl.class || [];
    const shortage = newClass.filter((cls)=>!currentClass.includes(cls)
    );
    if (shortage.length) {
        el.node.classList.add(...shortage);
    }
    const surplus = currentClass.filter((cls)=>!newClass.includes(cls)
    );
    if (surplus.length) {
        el.node.classList.remove(...surplus);
    }
    if (newClass.length) {
        el.class = newClass.slice();
    } else {
        delete el.class;
    }
}
function patchPart(el, newEl) {
    const currentPart = el.part || [];
    const newPart = newEl.part || [];
    const shortage = newPart.filter((part)=>!currentPart.includes(part)
    );
    if (shortage.length) {
        el.node.part.add(...shortage);
    }
    const surplus = currentPart.filter((part)=>!newPart.includes(part)
    );
    if (surplus.length) {
        el.node.part.remove(...surplus);
    }
    if (newPart.length) {
        el.part = newPart.slice();
    } else {
        delete el.part;
    }
}
function patchStyle(el, newEl) {
    if (el.node instanceof HTMLElement) {
        const style = el.style || '';
        const newStyle = newEl.style || '';
        if (style != newStyle) {
            el.node.style.cssText = newStyle;
            if (newStyle != '') {
                el.style = newStyle;
            } else {
                delete el.style;
            }
        }
    }
}
function patchProps(el, newEl) {
    const currentProps = el.props || {
    };
    const newProps = newEl.props || {
    };
    const currentPropsKeys = Object.keys(currentProps);
    const newPropsKeys = Object.keys(newProps);
    const shortageOrUpdated = newPropsKeys.filter((key)=>!currentPropsKeys.includes(key) || currentProps[key] !== newProps[key]
    );
    for (const key2 of shortageOrUpdated){
        el.node.setAttribute(key2, newProps[key2]);
    }
    const surplus = currentPropsKeys.filter((key)=>!newPropsKeys.includes(key)
    );
    for (const key1 of surplus){
        el.node.removeAttribute(key1);
    }
    if (newPropsKeys.length) {
        el.props = {
            ...newProps
        };
    } else {
        delete el.props;
    }
}
function patchOn(el, newEl) {
    const currentOn = el.on || {
    };
    const newOn = newEl.on || {
    };
    const currentOnKeys = Object.keys(currentOn);
    const newOnKeys = Object.keys(newOn);
    newOnKeys.filter((type)=>!currentOnKeys.includes(type)
    ).forEach((type)=>{
        newOn[type].forEach((listener)=>{
            el.node.addEventListener(type, listener);
        });
    });
    currentOnKeys.filter((type)=>!newOnKeys.includes(type)
    ).forEach((type)=>{
        currentOn[type].forEach((listener)=>{
            el.node.removeEventListener(type, listener);
        });
    });
    newOnKeys.filter((type)=>currentOnKeys.includes(type)
    ).forEach((type)=>{
        const news = newOn[type];
        const currents = currentOn[type];
        news.filter((listener)=>!currents.includes(listener)
        ).forEach((listener)=>el.node.addEventListener(type, listener)
        );
        currents.filter((listener)=>!news.includes(listener)
        ).forEach((listener)=>el.node.removeEventListener(type, listener)
        );
    });
}
class LinkedVirtualElementPointer {
    index = 0;
    node;
    parent;
    children;
    stock;
    constructor(tree){
        this.stock = new Map();
        this.parent = tree;
        this.node = tree.node.firstChild;
        this.children = tree.children || [];
    }
    get isEnd() {
        return this.index >= this.children.length;
    }
    get ve() {
        return this.children[this.index];
    }
    next() {
        if (typeof this.children[this.index] === 'number') {
            this.index++;
        } else {
            if (this.node) {
                this.index++;
                this.node = this.node.nextSibling;
            }
        }
    }
    prev() {
        if (typeof this.children[this.index] === 'number') {
            this.index--;
        } else if (this.node) {
            this.index--;
            this.node = this.node.previousSibling;
        } else {
            this.node = this.parent.node.lastChild;
            if (this.node) {
                this.index--;
            }
        }
    }
    add(ve) {
        const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.node;
        this.node = this.parent.node.insertBefore(node, this.node || null);
        this.next();
        return ve;
    }
    replace(ve) {
        if (typeof ve === 'string' && this.node?.nodeType === 3) {
            if (this.node.data !== ve) {
                this.node.data = ve;
            }
        } else {
            const node = typeof ve === 'string' ? document.createTextNode(ve) : ve.node;
            if (this.node !== node) {
                if (typeof this.ve === 'object' && 'key' in this.ve) {
                    this.stock.set(this.ve.key, this.ve);
                }
                this.parent.node.replaceChild(node, this.node);
            }
        }
        this.next();
        return ve;
    }
    remove() {
        if (typeof this.ve === 'object' && 'key' in this.ve) {
            this.stock.set(this.ve.key, this.ve);
        }
        const node = this.node;
        this.node = node?.nextSibling || null;
        this.parent.node.removeChild(node);
    }
    removeAll() {
        if (this.node) {
            for(let node = this.node; node !== null; node = node.nextSibling){
                this.parent.node.removeChild(node);
            }
        }
    }
    has(key) {
        return this.stock.has(key);
    }
    addFromKey(key, ve) {
        const tmp = this.stock.get(key);
        this.stock.delete(key);
        return this.add(patchElement(tmp, ve));
    }
    clear() {
        this.stock.clear();
    }
    search(cond) {
        if (this.isEnd) {
            return false;
        }
        const result = cond();
        if (typeof result === 'boolean') {
            return result;
        } else {
            this.next();
            const result = this.search(cond);
            this.prev();
            if (result) {
                this.remove();
                this.index++;
            }
            return result;
        }
    }
}
function patchChildren(tree, newTree) {
    const newChildren = newTree.children || [];
    const pointer = new LinkedVirtualElementPointer(tree);
    const numbers = newChildren.filter((ve)=>typeof ve === 'number'
    ).reverse();
    let number = numbers.pop();
    const tmp1 = newChildren.map((ve)=>{
        switch(typeof ve){
            case 'string':
                {
                    if (!pointer.isEnd && typeof pointer.ve === 'string') {
                        return pointer.replace(ve);
                    } else {
                        return pointer.add(ve);
                    }
                }
            case 'object':
                {
                    if ('key' in ve) {
                        if (pointer.has(ve.key)) {
                            return pointer.addFromKey(ve.key, ve);
                        } else {
                            if (typeof pointer.ve === 'object') {
                                const isMatched = pointer.search(()=>{
                                    if (typeof pointer.ve === 'object' && ve.key === pointer.ve.key) {
                                        return true;
                                    } else if (typeof pointer.ve === 'number' && number != undefined && pointer.ve === number) {
                                        return false;
                                    }
                                });
                                if (isMatched) {
                                    return pointer.replace(patchElement(pointer.ve, ve));
                                }
                            }
                        }
                    }
                    if (typeof pointer.ve === 'object') {
                        const tmp = 'key' in pointer.ve ? {
                            tag: ve.tag,
                            node: document.createElement(ve.tag)
                        } : pointer.ve;
                        return pointer.replace(patchElement(tmp, ve));
                    } else {
                        return pointer.add(patchElement({
                            tag: ve.tag,
                            node: document.createElement(ve.tag)
                        }, ve));
                    }
                }
            case 'number':
                {
                    const isMatched = pointer.search(()=>{
                        if (typeof pointer.ve === 'number' && ve === pointer.ve) {
                            return true;
                        }
                    });
                    number = numbers.pop();
                    if (isMatched) {
                        pointer.next();
                    }
                    pointer.clear();
                    return ve;
                }
        }
    });
    pointer.removeAll();
    if (tmp1.length) {
        tree.children = tmp1;
    } else {
        delete tree.children;
    }
}
export { patch as patch };
export { patchElement as patchElement };
function distinguish(field, value) {
    switch(field){
        case 'script':
            switch(value){
                case '+':
                case '-':
                    return 'multi';
                case 'void':
                case 'typeof':
                case '~':
                case '!':
                    return 'unary';
                case '/':
                case '*':
                case '%':
                case '**':
                case 'in':
                case 'instanceof':
                case '<':
                case '>':
                case '<=':
                case '>=':
                case '==':
                case '!=':
                case '===':
                case '!==':
                case '<<':
                case '>>':
                case '>>>':
                case '&':
                case '|':
                case '^':
                case '&&':
                case '||':
                case '??':
                    return 'binary';
                case '=':
                case '*=':
                case '**=':
                case '/=':
                case '%=':
                case '+=':
                case '-=':
                case '<<=':
                case '>>=':
                case '>>>=':
                case '&=':
                case '^=':
                case '|=':
                case '&&=':
                case '||=':
                case '??=':
                    return 'assign';
                case '++':
                case '--':
                    return 'crement';
                case 'false':
                case 'true':
                    return 'boolean';
                case 'null':
                case 'undefined':
                case '.':
                case '?.':
                case '[':
                case ']':
                case '{':
                case '}':
                case '(':
                case ')':
                case '...':
                case '?':
                case ':':
                case ',':
                case "'":
                case '"':
                case '`':
                    return value;
            }
            switch(true){
                case /^\/\/.*$/.test(value):
                    return 'lineComment';
                case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value):
                    return 'word';
                case /^\d+\.?\d*$|^\.?\d+$/.test(value):
                    return 'number';
            }
            break;
        case 'template':
            switch(value){
                case '$':
                    return 'partial';
                case '${':
                    return value;
                case '}':
                    return value;
                case '`':
                    return '`';
                case '\r':
                case '\n':
                case '\r\n':
                    return 'other';
            }
        case 'singleString':
        case 'doubleString':
            switch(value){
                case '\\':
                    return 'partial';
                case '\r':
                case '\n':
                case '\r\n':
                    return 'return';
                case '\\\r\n':
                    return 'escape';
                case '\'':
                    if (field === 'singleString') return value;
                    break;
                case '\"':
                    if (field === 'doubleString') return value;
                    break;
            }
            switch(true){
                case /^\\(x|u)$/.test(value):
                    return 'partial';
                case /^\\.$/.test(value):
                    return 'escape';
            }
            break;
        case 'innerText':
            switch(value){
                case '{':
                case '}':
                    return 'partial';
                case '{{':
                case '}}':
                    return value;
            }
            break;
    }
    return 'other';
}
class Lexer {
    text;
    field;
    index;
    token;
    constructor(text, field, index = 0, token = null){
        this.text = text;
        this.field = field;
        this.index = index;
        this.token = token;
    }
    _next(start) {
        const token = [
            '',
            ''
        ];
        for(this.index = start; this.index < this.text.length; this.index++){
            const nextType = distinguish(this.field, token[1] + this.text[this.index]);
            if (nextType === 'other') {
                return token;
            } else {
                token[0] = nextType;
                token[1] = token[1] + this.text[this.index];
            }
        }
        return token;
    }
    skip() {
        let value = '';
        if (!this.token) {
            for(let i = this.index; i < this.text.length; i++){
                if (distinguish(this.field, this.text[i]) === 'other') {
                    value += this.text[i];
                } else {
                    this.token = this._next(i);
                    if (this.token && this.token[0] === 'partial') {
                        value += this.token[1];
                        this.token = null;
                    } else {
                        return value;
                    }
                }
            }
        }
        return value;
    }
    nextType() {
        this.skip();
        return this.token ? this.token[0] : '';
    }
    pop() {
        this.skip();
        const token = this.token;
        this.token = null;
        return token ? token : null;
    }
    expand(field, func1) {
        const parent = this.field;
        this.field = field;
        func1();
        if (this.token) {
            this.index -= this.token[1].length;
            this.token = null;
        }
        this.field = parent;
    }
}
export { Lexer as Lexer };
function must(token, type, message = '') {
    if (!token || token[0] !== type) throw Error(message);
}
function innerText(lexer) {
    const texts = [];
    texts.push(lexer.skip());
    while(lexer.nextType()){
        if (lexer.nextType() === '{{') {
            lexer.pop();
            lexer.expand('script', ()=>{
                texts.push(expression(lexer));
            });
            must(lexer.pop(), '}}');
            texts.push(lexer.skip());
        } else {
            lexer.pop();
        }
    }
    const values = texts.filter((value)=>value !== ''
    );
    if (values.length === 1 && typeof values[0] === 'string') {
        return values[0];
    } else {
        return {
            type: 'join',
            values,
            separator: ''
        };
    }
}
function expression(lexer) {
    return assignment(lexer);
}
function assignment(lexer) {
    const left = conditional(lexer);
    if (lexer.nextType() === 'assign') {
        if (left.type !== 'get') {
            throw Error('The left operand is not variable');
        }
        const operator = lexer.pop()[1];
        const right = expression(lexer);
        return {
            type: 'assign',
            operator,
            left: left.value,
            right
        };
    } else {
        return left;
    }
}
function conditional(lexer) {
    let condition = arithmetic(lexer);
    while(lexer.nextType() === '?'){
        lexer.pop();
        const truthy = expression(lexer);
        must(lexer.pop(), ':');
        const falsy = arithmetic(lexer);
        condition = {
            type: 'if',
            condition,
            truthy,
            falsy
        };
    }
    return condition;
}
function arithmetic(lexer) {
    const list = new Array();
    list.push(unary(lexer));
    while(lexer.nextType() === 'multi' || lexer.nextType() === 'binary'){
        list.push(lexer.pop()[1]);
        list.push(unary(lexer));
    }
    while(list.length > 1){
        for(let index = 0; index + 1 < list.length; index += 2){
            if (index + 3 >= list.length || precedence(list[index + 1]) > precedence(list[index + 3])) {
                const node = {
                    type: 'binary',
                    operator: list[index + 1],
                    left: list[index],
                    right: list[index + 2]
                };
                list.splice(index, 3, node);
            }
        }
    }
    return typeof list[0] === 'string' ? {
        type: 'variable',
        name: list[0]
    } : list[0];
}
function precedence(operator) {
    switch(operator){
        default:
            return 0;
        case '||':
        case '??':
            return 4;
        case '&&':
            return 5;
        case '|':
            return 6;
        case '^':
            return 7;
        case '&':
            return 8;
        case '==':
        case '!=':
        case '===':
        case '!==':
            return 9;
        case 'in':
        case 'instanceof':
        case '<':
        case '>':
        case '<=':
        case '>=':
            return 10;
        case '<<':
        case '>>':
        case '>>>':
            return 11;
        case '+':
        case '-':
            return 12;
        case '*':
        case '/':
        case '%':
            return 13;
        case '**':
            return 14;
    }
}
function unary(lexer) {
    switch(lexer.nextType()){
        case 'multi':
        case 'unary':
            return {
                type: 'unary',
                operator: lexer.pop()[1],
                operand: unary(lexer)
            };
        default:
            return func(lexer);
    }
}
function func(lexer) {
    let template = term(lexer);
    while(true){
        switch(lexer.nextType()){
            case '(':
                {
                    lexer.pop();
                    const params = [];
                    while(lexer.nextType() !== ')'){
                        params.push(expression(lexer));
                        if (lexer.nextType() === ',') lexer.pop();
                        else break;
                    }
                    must(lexer.pop(), ')');
                    template = {
                        type: 'function',
                        name: template,
                        params
                    };
                    continue;
                }
            case '.':
                {
                    lexer.pop();
                    const key = lexer.pop();
                    must(key, 'word');
                    template = {
                        type: 'get',
                        value: {
                            type: 'hash',
                            object: template,
                            key: {
                                type: 'literal',
                                value: key[1]
                            }
                        }
                    };
                    continue;
                }
            case '[':
                {
                    lexer.pop();
                    const key = expression(lexer);
                    must(lexer.pop(), ']');
                    template = {
                        type: 'get',
                        value: {
                            type: 'hash',
                            object: template,
                            key
                        }
                    };
                    continue;
                }
        }
        break;
    }
    return template;
}
function term(lexer) {
    const token = lexer.pop();
    switch(token[0]){
        case 'word':
            return {
                type: 'get',
                value: {
                    type: 'variable',
                    name: token[1]
                }
            };
        case 'number':
            return {
                type: 'literal',
                value: Number(token[1])
            };
        case 'boolean':
            return {
                type: 'literal',
                value: token[1] === 'true' ? true : false
            };
        case 'undefined':
            return {
                type: 'literal',
                value: undefined
            };
        case 'null':
            return {
                type: 'literal',
                value: null
            };
        case '"':
            return stringLiteral(lexer, 'doubleString', token[0]);
        case "'":
            return stringLiteral(lexer, 'singleString', token[0]);
        case '`':
            return stringLiteral(lexer, 'template', token[0]);
        case '(':
            {
                const node = expression(lexer);
                must(lexer.pop(), ')');
                return node;
            }
        default:
            throw new Error(JSON.stringify(token));
    }
}
function stringLiteral(lexer, field, type) {
    const texts = [
        ''
    ];
    let i = 0;
    lexer.expand(field, ()=>{
        loop: while(true){
            texts[i] += lexer.skip();
            const token = lexer.pop();
            switch(token[0]){
                case type:
                    break loop;
                case 'return':
                    throw Error();
                case 'escape':
                    texts[i] += token[1];
                    continue;
                case '${':
                    lexer.expand('script', ()=>{
                        texts.push(expression(lexer));
                    });
                    must(lexer.pop(), '}');
                    texts.push(lexer.skip());
                    i += 2;
            }
        }
    });
    if (i === 0) {
        return {
            type: 'literal',
            value: texts[0]
        };
    } else {
        return {
            type: 'join',
            values: texts.filter((value)=>value !== ''
            ),
            separator: ''
        };
    }
}
export { innerText as innerText };
export { expression as expression };
const parser = new DOMParser();
function parse(html) {
    if (typeof html === 'string') {
        const doc = parser.parseFromString(html, 'text/html');
        return {
            type: 'tree',
            children: parseChildren(doc.head).concat(parseChildren(doc.body))
        };
    } else {
        const node = html.content;
        return {
            type: 'tree',
            children: parseChildren(node)
        };
    }
}
class DomLexer {
    node;
    constructor(node){
        this.node = node;
    }
    hasAttribute(props) {
        return !!(this.node && this.node.nodeType === 1 && this.node.hasAttribute(props));
    }
    pop() {
        const node = this.node;
        this.node = this.node ? this.node.nextSibling : null;
        return node;
    }
}
function parseChildren(node) {
    const lexer = new DomLexer(node.firstChild);
    const children = [];
    while(lexer.node){
        children.push(parseNode(lexer));
    }
    return children;
}
function parseNode(lexer) {
    switch(lexer.node.nodeType){
        case 3:
            return parseText(lexer.pop());
        case 1:
            {
                return parseFor(lexer);
            }
        default:
            return '';
    }
}
function parseText(node) {
    return innerText(new Lexer(node.data, 'innerText'));
}
function parseChild(lexer) {
    return parseFor(lexer);
}
function parseFor(lexer) {
    const el = lexer.node;
    if (el.hasAttribute('@for')) {
        const each = el.getAttribute('@each') || undefined;
        const array = expression(new Lexer(el.getAttribute('@for'), 'script'));
        return {
            type: 'for',
            each,
            array,
            value: parseIf(lexer)
        };
    } else {
        return parseIf(lexer);
    }
}
function parseIf(lexer) {
    const el = lexer.node;
    if (el.hasAttribute('@if')) {
        const condition = expression(new Lexer(el.getAttribute('@if'), 'script'));
        const truthy = parseExpand(el);
        lexer.pop();
        const falsy = lexer.hasAttribute('@else') ? parseChild(lexer) : undefined;
        return {
            type: 'if',
            condition,
            truthy,
            falsy
        };
    } else {
        return parseExpand(lexer.pop());
    }
}
function parseExpand(el) {
    if (el.hasAttribute('@expand')) {
        const template = expression(new Lexer(el.getAttribute('@expand'), 'script'));
        const def = parseGroup(el);
        return {
            type: 'expand',
            template,
            default: def
        };
    } else {
        return parseGroup(el);
    }
}
function parseGroup(el) {
    return parseElement(el);
}
function parseElement(el) {
    const template = {
        type: 'element',
        tag: el.tagName.toLowerCase()
    };
    if (el.hasAttributes()) {
        const style = [];
        el.getAttributeNames().forEach((name)=>{
            const value = el.getAttribute(name);
            switch(name){
                case 'is':
                    {
                        if (!(name in template)) {
                            template.is = value;
                        }
                        return;
                    }
                case 'class':
                case 'part':
                    {
                        if (!(name in template)) {
                            template[name] = [];
                        }
                        return template[name].push(value.split(/\s+/));
                    }
                case 'style':
                    {
                        return style.push(value);
                    }
            }
            {
                const match = name.match(/^(?<name>.+)(\+.*)$/);
                if (match?.groups) {
                    const name = match.groups.name;
                    const exp = expression(new Lexer(value, 'script'));
                    switch(name){
                        case 'is':
                            {
                                return template.is = exp;
                            }
                        case 'class':
                        case 'part':
                            {
                                if (!(name in template)) {
                                    template[name] = [];
                                }
                                return template[name].push({
                                    type: 'flags',
                                    value: exp
                                });
                            }
                        case 'style':
                            {
                                return style.push(exp);
                            }
                    }
                }
            }
            {
                const match = name.match(/^(?<name>.+):$/);
                if (match?.groups) {
                    if (!('props' in template)) {
                        template.props = {
                        };
                    }
                    return template.props[match.groups.name] = expression(new Lexer(value, 'script'));
                }
            }
            {
                const match = name.match(/^(?<name>.+)\*$/);
                if (match?.groups) {
                }
            }
            if (name.match(/^@(if|else|for|each|expand)$/)) return;
            if (!('props' in template)) {
                template.props = {
                };
            }
            if (!(name in template.props)) {
                return template.props[name] = value;
            }
            return;
        });
        if (style.length) {
            if (style.length === 1 && typeof style[0] === 'string') {
                template.style = style[0];
            } else {
                template.style = {
                    type: 'join',
                    values: style.filter((value)=>value !== ''
                    ),
                    separator: ';'
                };
            }
        }
    }
    if (el.hasChildNodes()) {
        template.children = parseChildren(el);
    }
    return template;
}
export { parse as parse };
function instanceOfTemplate(object) {
    return typeof object === 'object' && 'type' in object;
}
function pickup(stack, name, start = stack.length - 1) {
    for(let i = start; i >= 0; i--){
        if (name in stack[i]) return [
            stack[i][name],
            i
        ];
    }
    return [
        undefined,
        0
    ];
}
class Loop {
    _key;
    _value;
    _index;
    _entries;
    _stack;
    constructor(_key, _value, _index, _entries, _stack){
        this._key = _key;
        this._value = _value;
        this._index = _index;
        this._entries = _entries;
        this._stack = _stack;
    }
    get key() {
        return this._key;
    }
    get value() {
        return this._value;
    }
    get index() {
        return this._index;
    }
    get size() {
        return this._entries.length;
    }
    get isFirst() {
        return this._index === 1;
    }
    get isLast() {
        return this._index === this._entries.length - 1;
    }
    get parent() {
        return pickup(this._stack, 'loop')[0];
    }
}
function operateUnary(operator, operand) {
    switch(operator){
        case 'void':
            return void operand;
        case 'typeof':
            return typeof operand;
        case '+':
            return +operand;
        case '-':
            return -operand;
        case '~':
            return ~operand;
        case '!':
            return !operand;
        default:
            throw Error(operator + ' does not exist');
    }
}
function operateBinary(operator, left, right) {
    switch(operator){
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '/':
            return left / right;
        case '*':
            return left * right;
        case '%':
            return left % right;
        case '**':
            return left ** right;
        case 'in':
            return left in right;
        case 'instanceof':
            return left instanceof right;
        case '<':
            return left < right;
        case '>':
            return left > right;
        case '<=':
            return left <= right;
        case '>=':
            return left >= right;
        case '==':
            return left == right;
        case '!=':
            return left != right;
        case '===':
            return left === right;
        case '!==':
            return left !== right;
        case '<<':
            return left << right;
        case '>>':
            return left >> right;
        case '>>>':
            return left >>> right;
        case '&':
            return left & right;
        case '|':
            return left | right;
        case '^':
            return left ^ right;
        case '&&':
            return left && right;
        case '||':
            return left || right;
        case '??':
            return left ?? right;
        default:
            throw Error(operator + ' does not exist');
    }
}
function evaluate(template, stack = []) {
    return evaluator[template.type](template, stack);
}
const evaluator = {
    literal: (template, _stack)=>template.value
    ,
    variable: (template, stack)=>{
        const [value, index] = pickup(stack, template.name);
        if (value) {
            return [
                stack[index],
                template.name
            ];
        }
        throw Error(template.name + ' is not defined');
    },
    unary: (template, stack)=>operateUnary(template.operator, evaluate(template.operand, stack))
    ,
    binary: (template, stack)=>operateBinary(template.operator, evaluate(template.left, stack), evaluate(template.right, stack))
    ,
    assign: (template, stack)=>{
        const [object, key] = evaluate(template.left, stack);
        const right = evaluate(template.right, stack);
        return object[key] = template.operator.length > 1 ? operateBinary(template.operator.slice(0, -1), object[key], right) : right;
    },
    ['function']: (template, stack)=>{
        const func2 = evaluate(template.name, stack);
        if (typeof func2 === 'function') {
            return func2(...template.params.map((param)=>evaluate(param, stack)
            ));
        }
        throw Error(template.name.toString() + ' is not a function');
    },
    hash: (template, stack)=>[
            evaluate(template.object, stack),
            evaluate(template.key, stack)
        ]
    ,
    get: (template, stack)=>{
        const [object, key] = evaluate(template.value, stack);
        return object[key];
    },
    join: (template, stack)=>{
        return template.values.reduce((result, value, index)=>{
            if (instanceOfTemplate(value)) {
                const text = evaluate(value, stack);
                return result + (index ? template.separator : '') + (typeof text === 'object' ? JSON.stringify(text) : text);
            } else {
                return result + (index ? template.separator : '') + value;
            }
        }, '');
    },
    flags: (template, stack)=>{
        const value = evaluate(template.value, stack);
        if (typeof value === 'string') {
            return value.split(/\s+/);
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value;
            } else if (value) {
                return Object.keys(value).filter((key)=>value[key]
                );
            }
        }
        return [];
    },
    ['if']: (template, stack)=>evaluate(template.condition, stack) ? evaluate(template.truthy, stack) : template.falsy ? evaluate(template.falsy, stack) : null
    ,
    for: (template, stack)=>{
        const array = evaluate(template.array, stack);
        let entries;
        if (typeof array === 'object' && array !== null) {
            if (Symbol.iterator in array) {
                if ('entries' in array) {
                    entries = [
                        ...array.entries()
                    ];
                } else {
                    let i = 0;
                    entries = [];
                    for (const value of array){
                        entries.push([
                            i++,
                            value
                        ]);
                    }
                }
            } else {
                entries = Object.entries(array);
            }
        } else {
            entries = [
                [
                    0,
                    array
                ]
            ];
        }
        return entries.map(([key, value], index)=>{
            const loop = new Loop(key, value, index, entries, stack);
            const result = evaluate(template.value, stack.concat([
                template.each ? {
                    [template.each]: value,
                    loop
                } : {
                    loop
                }
            ]));
            return result;
        });
    },
    element: (template, stack)=>{
        const el = evaluator.tree(template, stack);
        el.tag = template.tag;
        if (template.is) {
            el.is = typeof template.is === 'string' ? template.is : evaluate(template.is, stack);
        }
        evaluateProps(template, stack, el);
        return el;
    },
    tree: (template, stack)=>{
        const children = (template.children || [])?.flatMap((child)=>{
            if (typeof child === 'string') {
                return [
                    child
                ];
            } else {
                const value = evaluate(child, stack);
                return Array.isArray(value) ? value : [
                    value
                ];
            }
        });
        if (children.length) {
            return {
                children
            };
        } else {
            return {
            };
        }
    },
    expand: (template, stack)=>{
        const result = evaluate(template.template, stack);
        if (instanceOfTemplate(result)) {
            return {
            };
        } else {
            return evaluate(template.default, stack);
        }
    },
    group: (template, stack)=>template.values.map((value)=>instanceOfTemplate(value) ? evaluate(value, stack) : value
        )
    ,
    listener: (template, stack)=>{
        if (!template.cache) {
            template.cache = [];
        }
        for (const cache of template.cache){
            if (compareCache(cache[0], stack)) {
                return cache[1];
            }
        }
        const listener = ()=>evaluate(template.value, stack)
        ;
        template.cache.push([
            stack,
            listener
        ]);
        return listener;
    }
};
function evaluateProps(template, stack, el) {
    if (template.style) {
        el.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack);
    }
    if (template.props) {
        el.props = {
        };
        for(const key in template.props){
            const props = template.props[key];
            el.props[key] = typeof props === 'string' ? props : evaluate(props, stack);
        }
    }
    if (template.on) {
        el.on = {
        };
        for(const type in template.on){
            el.on[type] = template.on[type].map((listener)=>evaluate(listener, stack)
            );
        }
    }
}
function compareCache(cache, stack, cacheIndex = cache.length - 1, stackIndex = stack.length - 1) {
    const [cacheLoop, newCacheIndex] = pickup(cache, 'loop', cacheIndex);
    const [stackLoop, newStackIndex] = pickup(stack, 'loop', stackIndex);
    if (!cacheLoop && !stackLoop) return true;
    if (!cacheLoop || !stackLoop) return false;
    return cacheLoop.index === stackLoop.index && cacheLoop.key === stackLoop.key && cacheLoop.value === stackLoop.value && compareCache(cache, stack, newCacheIndex, newStackIndex);
}
export { evaluate as evaluate };
export { evaluator as evaluator };
export { evaluateProps as evaluateProps };
const builtin = {
    console,
    Object,
    Number,
    Math,
    Date,
    Array,
    JSON,
    String,
    isNaN,
    isFinite,
    location
};
class Entity {
    stack;
    _component;
    _el;
    _tree;
    _props = {
    };
    constructor(component, el, tree){
        this._component = component;
        this._el = el;
        this._tree = tree;
        if (typeof this.component.stack === 'function') {
            (async ()=>{
                const stack = await this.component.stack(this);
                this.stack = stack ? Array.isArray(stack) ? [
                    builtin,
                    ...stack
                ] : [
                    builtin,
                    stack
                ] : [
                    builtin
                ];
                this.patch();
                reach(stack, this.patch);
            })().then();
        } else {
            reach(this.component.stack, this.patch);
            this.stack = [
                builtin,
                ...this.component.stack
            ];
            this.patch();
        }
    }
    patch() {
        if (this.stack && this._tree && this.component.template) {
            patch(this._tree, evaluate(this.component.template, this.stack));
        }
    }
    setProp(name, value) {
        console.log('setProp()', name, value);
        switch(name){
            case 'class':
            case 'part':
            case 'style':
                return;
            default:
                this._props[name] = value;
        }
        this.patch();
    }
    get component() {
        return this._component;
    }
    get el() {
        return this._el;
    }
    get root() {
        return this._tree.node;
    }
    get props() {
        return this._props;
    }
}
function instanceOfComponent(object) {
    return typeof object === 'object' && object.template && object.stack;
}
const localComponentElementTag = 'beako-entity';
function proxyAttr(attr, setProp) {
    return new Proxy(attr, {
        set (target, prop, value) {
            setProp(prop, value);
            if (prop === 'value') {
                return target.value = value;
            }
        }
    });
}
function proxyNamedNodeMap(attrs, setProp) {
    return new Proxy(attrs, {
        get: function(target, prop) {
            if (prop === 'length') {
                return target[prop];
            } else {
                return proxyAttr(target[prop], setProp);
            }
        }
    });
}
class ComponentElement extends HTMLElement {
    tree;
    entity;
    constructor(){
        super();
        this.tree = load(this.attachShadow({
            mode: 'open'
        }));
    }
    static get observedAttributes() {
        return [
            'class',
            'part',
            'style'
        ];
    }
    setProp(name, value) {
        console.log('this.entity', this.entity);
        this.entity?.setProp(name, value);
    }
    static getComponent() {
        return undefined;
    }
    loadProps() {
        if (this.hasAttributes()) {
            this.getAttributeNames().forEach((name)=>{
                console.log('name :', name);
                this.setProp(name, this.getAttribute(name));
            });
        }
    }
    get attributes() {
        return proxyNamedNodeMap(super.attributes, this.setProp);
    }
    setAttribute(name, value) {
        this.setProp(name, value);
        super.setAttribute(name, value);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback()', name, oldValue, newValue);
    }
    getAttributeNode(name) {
        const attr = super.getAttributeNode(name);
        return attr ? proxyAttr(attr, this.setProp) : attr;
    }
    removeAttribute(name) {
        this.setProp(name, undefined);
        return super.removeAttribute(name);
    }
    removeAttributeNode(attr) {
        this.setProp(attr.name, undefined);
        return super.removeAttributeNode(attr);
    }
}
class LocalComponentElement extends ComponentElement {
    constructor(){
        super();
    }
    setProp(name, value) {
        if (name === 'component') {
            switch(typeof value){
                case 'string':
                    {
                        const def = customElements.get(value);
                        if (def && ComponentElement.isPrototypeOf(def)) {
                            const component = def.getComponent();
                            if (component) {
                                this.entity = new Entity(component, this, this.tree);
                            }
                        }
                        break;
                    }
                case 'object':
                    if (instanceOfComponent(value)) {
                        this.entity = new Entity(value, this, this.tree);
                    }
                    break;
            }
        }
        super.setProp(name, value);
    }
}
customElements.define(localComponentElementTag, LocalComponentElement);
evaluator.evaluation = (template, stack)=>evaluate(template.template, template.stack ? template.stack.concat(stack) : stack)
;
evaluator.custom = (template1, stack)=>{
    const el = {
        tag: template1.tag
    };
    if (template1.is) {
        el.is = typeof template1.is === 'string' ? template1.is : evaluate(template1.is, stack);
    }
    let isComponent;
    if (isPrimitive(template1)) {
        isComponent = customElements.get(el.is) instanceof ComponentElement;
    } else {
        let element;
        for(let i = stack.length - 1; i >= 0; i--){
            if (template1.tag in stack[i]) {
                element = stack[i][template1.tag];
                break;
            }
        }
        if (instanceOfComponent(ComponentElement)) {
            el.tag = localComponentElementTag;
            el.props = {
                component: element
            };
            isComponent = true;
        } else {
            isComponent = customElements.get(template1.tag) instanceof ComponentElement;
        }
    }
    if (isComponent) {
        const values = [];
        const contents = [];
        const children = (template1.children || [])?.flatMap((child)=>{
            if (!(typeof child === 'string')) {
                const temp = child;
                if (temp.props) {
                    if (temp.props['@as']) {
                        contents.push([
                            temp.props['@as'],
                            temp
                        ]);
                        delete temp.props['@as'];
                        return [];
                    } else if (temp.props.slot) {
                        return [
                            evaluate(child, stack)
                        ];
                    }
                }
            }
            values.push(child);
            return [];
        });
        if (values.length) {
            contents.push([
                'content',
                {
                    type: 'group',
                    values
                }
            ]);
        }
        if (contents.length && !template1.props) {
            el.props = {
            };
            contents.forEach(([name, template])=>{
                el.props[name] = {
                    type: 'evaluation',
                    template,
                    stack
                };
            });
        }
        if (children.length) {
            el.children = children;
        }
        evaluateProps(template1, stack, el);
        return el;
    } else {
        return evaluator.element(template1, stack);
    }
};
function extend(template) {
    if (instanceOfTemplate(template)) {
        switch(template.type){
            case 'element':
                if (!(isPrimitive(template) && 'is' in template)) {
                    template.type = 'custom';
                }
            case 'tree':
                template.children?.forEach(extend);
                break;
            case 'if':
                {
                    extend(template.truthy);
                    extend(template.falsy);
                    break;
                }
            case 'for':
                {
                    extend(template.value);
                    break;
                }
        }
    }
    return template;
}
function isPrimitive(template) {
    switch(template.tag){
        case 'html':
        case 'base':
        case 'head':
        case 'link':
        case 'meta':
        case 'style':
        case 'title':
        case 'body':
        case 'address':
        case 'article':
        case 'aside':
        case 'footer':
        case 'header':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'main':
        case 'nav':
        case 'section':
        case 'blockquote':
        case 'dd':
        case 'div':
        case 'dl':
        case 'dt':
        case 'figcaption':
        case 'figure':
        case 'hr':
        case 'li':
        case 'ol':
        case 'p':
        case 'pre':
        case 'ul':
        case 'a':
        case 'abbr':
        case 'b':
        case 'bdi':
        case 'bdo':
        case 'br':
        case 'cite':
        case 'code':
        case 'data':
        case 'dfn':
        case 'em':
        case 'i':
        case 'kbd':
        case 'mark':
        case 'q':
        case 'rp':
        case 'rt':
        case 'ruby':
        case 's':
        case 'samp':
        case 'small':
        case 'span':
        case 'strong':
        case 'sub':
        case 'sup':
        case 'time':
        case 'u':
        case 'var':
        case 'wbr':
        case 'area':
        case 'audio':
        case 'img':
        case 'map':
        case 'track':
        case 'video':
        case 'embed':
        case 'iframe':
        case 'object':
        case 'param':
        case 'picture':
        case 'portal':
        case 'source':
        case 'svg':
        case 'math':
        case 'canvas':
        case 'noscript':
        case 'script':
        case 'del':
        case 'ins':
        case 'caption':
        case 'col':
        case 'colgroup':
        case 'table':
        case 'tbody':
        case 'td':
        case 'tfoot':
        case 'th':
        case 'thead':
        case 'tr':
        case 'button':
        case 'datalist':
        case 'fieldset':
        case 'form':
        case 'input':
        case 'label':
        case 'legend':
        case 'meter':
        case 'optgroup':
        case 'option':
        case 'output':
        case 'progress':
        case 'select':
        case 'textarea':
        case 'details':
        case 'dialog':
        case 'menu':
        case 'summary':
        case 'slot':
        case 'template':
            return true;
    }
    return false;
}
export { extend as extend };
function compact(template, stack = []) {
    return {
        template: extend(typeof template === 'string' ? parse(template) : template),
        stack: typeof stack === 'function' || Array.isArray(stack) ? stack : [
            stack
        ]
    };
}
export { compact as compact };
function define(name, template, stack) {
    const component = instanceOfComponent(template) ? template : compact(template, stack);
    customElements.define(name, class extends ComponentElement {
        constructor(){
            super();
            this.entity = new Entity(component, this, this.tree);
            this.loadProps();
        }
        static getComponent() {
            return component;
        }
    });
}
export { define as define };
function hack(element, template, stack) {
    const root = typeof element === 'string' ? document.querySelector(element) : element.nodeType === 9 ? element.body : element;
    const tree = load(root.attachShadow({
        mode: 'open'
    }));
    const component = instanceOfComponent(template) ? template : compact(template, stack);
    new Entity(component, root, tree);
}
export { hack as hack };

