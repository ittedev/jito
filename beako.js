const dictionary = Symbol('Beako');
const reactiveKey = Symbol('Reactive');
const arrayKey = Symbol('Array');
const isLocked = Symbol('Beako-lock');
function watch(data, keyOrCallback, callback1) {
    if (typeof data === 'object' && data !== null && (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))) {
        const obj = data;
        if (!obj[isLocked]) {
            invade(obj);
            if (callback1 === undefined) {
                const callbacks = obj[dictionary][reactiveKey][1];
                if (typeof keyOrCallback === 'function') {
                    callbacks.add(keyOrCallback);
                }
                for(const key in obj){
                    invade(obj, key, obj[dictionary][reactiveKey][0]);
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        if (callbacks.size) {
                            callbacks.forEach((callback)=>{
                                if (!(dictionary in value) || !value[dictionary][reactiveKey][1].has(callback)) {
                                    watch(value, callback);
                                }
                            });
                        } else {
                            if (!(dictionary in value)) {
                                watch(value);
                            }
                        }
                    }
                }
                if (Array.isArray(obj)) {
                    const len = obj[dictionary][arrayKey].length;
                    if (obj.length < len) {
                        for(let index = obj.length; index < len; index++){
                            invade(obj, index);
                        }
                    }
                    obj.length = len;
                }
            } else {
                const spy = typeof callback1 === 'function' ? [
                    'spy',
                    callback1
                ] : callback1;
                if (Array.isArray(keyOrCallback)) {
                    keyOrCallback.forEach((key)=>invade(obj, key, spy)
                    );
                } else {
                    invade(obj, keyOrCallback, spy);
                }
            }
        }
    }
    return data;
}
function invade(obj, key, arm) {
    if (!obj[isLocked]) {
        if (!(dictionary in obj)) {
            const reactiveCallback = ()=>{
                obj[dictionary][reactiveKey][1].forEach((callback)=>callback()
                );
            };
            obj[dictionary] = {
                [reactiveKey]: [
                    [
                        'bio',
                        reactiveCallback
                    ],
                    new Set()
                ]
            };
            if (Array.isArray(obj)) {
                const array = obj[dictionary][arrayKey] = obj.slice();
                const reactive = (value)=>{
                    reactiveCallback();
                    return value;
                };
                const rewatch = (value)=>{
                    watch(obj);
                    reactiveCallback();
                    return value;
                };
                Object.defineProperties(obj, {
                    unshift: {
                        get () {
                            return (...items)=>rewatch(Array.prototype['unshift'].call(array, ...items))
                            ;
                        }
                    },
                    push: {
                        get () {
                            return (...items)=>rewatch(Array.prototype['push'].call(array, ...items))
                            ;
                        }
                    },
                    splice: {
                        get () {
                            return (start, deleteCount, ...items)=>rewatch(deleteCount === undefined ? Array.prototype['splice'].call(array, start, array.length - start) : Array.prototype['splice'].apply(array, [
                                    start,
                                    deleteCount,
                                    ...items
                                ]))
                            ;
                        }
                    },
                    pop: {
                        get () {
                            return ()=>rewatch(Array.prototype['pop'].call(array))
                            ;
                        }
                    },
                    shift: {
                        get () {
                            return ()=>rewatch(Array.prototype['shift'].call(array))
                            ;
                        }
                    },
                    sort: {
                        get () {
                            return (compareFn)=>reactive(compareFn === undefined ? Array.prototype['sort'].call(array) : Array.prototype['sort'].call(array, compareFn))
                            ;
                        }
                    },
                    reverse: {
                        get () {
                            return ()=>reactive(Array.prototype['reverse'].call(array))
                            ;
                        }
                    },
                    copyWithin: {
                        get () {
                            return (target, start, end)=>reactive(Array.prototype['copyWithin'].call(array, target, start !== undefined ? start : 0, end !== undefined ? end : array.length))
                            ;
                        }
                    }
                });
            }
        }
        if (key !== undefined) {
            if (typeof key !== 'number' && isNaN(key)) {
                if (!(key in obj[dictionary])) {
                    obj[dictionary][key] = [
                        obj[key],
                        new Set()
                    ];
                    Object.defineProperty(obj, key, {
                        get () {
                            return this[dictionary][key][0];
                        },
                        set (value) {
                            obj[dictionary][reactiveKey][1].forEach((callback)=>watch(value, callback)
                            );
                            attack(this[dictionary][key], value);
                        }
                    });
                }
                if (arm) {
                    for (const item of obj[dictionary][key][1]){
                        if (item[1] === arm[1]) return;
                    }
                    obj[dictionary][key][1].add(arm);
                }
            } else {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (!descriptor || 'value' in descriptor) {
                    if (key in obj[dictionary][arrayKey]) {
                        Object.defineProperty(obj, key, {
                            get () {
                                return this[dictionary][arrayKey][key];
                            },
                            set (value) {
                                obj[dictionary][reactiveKey][1].forEach((callback)=>watch(value, callback)
                                );
                                const old = this[dictionary][arrayKey][key];
                                this[dictionary][arrayKey][key] = value;
                                if (old !== value) {
                                    obj[dictionary][reactiveKey][0][1]();
                                }
                            },
                            configurable: true,
                            enumerable: true
                        });
                    }
                }
            }
        }
    }
}
function attack(page, value) {
    const old = page[0];
    page[0] = value;
    if (old !== value) {
        page[1].forEach((arm)=>{
            switch(arm[0]){
                case 'bio':
                    arm[1]();
                    break;
                case 'bom':
                    page[1].delete(arm);
                case 'spy':
                    arm[1](value, old);
                    break;
            }
        });
    }
}
async function receive(obj1, key1) {
    if (!obj1[isLocked]) {
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
        }, {});
    }
    return {};
}
function retreat(obj, key, callback) {
    if (key !== undefined) {
        if (dictionary in obj) {
            if (key in obj[dictionary]) {
                if (callback) {
                    obj[dictionary][key][1].forEach((arm)=>{
                        if (arm[1] === callback) {
                            obj[dictionary][key][1].delete(arm);
                        }
                    });
                } else {
                    obj[dictionary][key][1].clear();
                }
            }
        }
    } else {
        for(const key in obj[dictionary]){
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: obj[dictionary][key][0]
            });
            delete obj[dictionary][key];
        }
        if (Array.isArray(obj)) {
            delete obj.push;
            delete obj.sort;
            delete obj.splice;
        }
        delete obj[dictionary];
    }
}
function unwatch(data, keyOrCallback, callback) {
    if (typeof data === 'object' && data !== null) {
        const obj = data;
        if (!obj[isLocked]) {
            if (callback === undefined) {
                if (keyOrCallback) {
                    const reactiveCallback = keyOrCallback;
                    if (obj[dictionary]) {
                        obj[dictionary][reactiveKey][1].delete(reactiveCallback);
                    }
                    for(const key in obj){
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
    }
    return data;
}
function reach(data, callback) {
    if (typeof data === 'object' && data !== null) {
        const obj = data;
        if (!obj[isLocked]) {
            if (dictionary in obj) {
                obj[dictionary][reactiveKey][1].add(callback);
            }
            for(const key in obj){
                reach(obj[key], callback);
            }
        }
    }
    return data;
}
function lock(obj) {
    obj[isLocked] = true;
    return obj;
}
function unlock(obj) {
    delete obj[isLocked];
    return obj;
}
export { watch as watch };
export { receive as receive };
export { unwatch as unwatch };
export { reach as reach };
export { lock as lock };
export { unlock as unlock };
let destroy = 'destroy';
let patch = 'patch';
const eventTypes = Object.seal({
    get destroy () {
        return destroy;
    },
    set destroy (value){
        if (typeof value === 'string' && value !== '') {
            destroy = value;
        } else {
            throw Error('Event type must be string');
        }
    },
    get patch () {
        return patch;
    },
    set patch (value){
        if (typeof value === 'string' && value !== '') {
            patch = value;
        } else {
            throw Error('Event type must be string');
        }
    }
});
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
        const props = {};
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
                case 1:
                    if (nodeList[i].tagName === 'SCRIPT') {
                        break;
                    }
                    tree.children.push(loadElement(nodeList[i]));
                    break;
                case 3:
                    tree.children.push(nodeList[i].data);
                    break;
            }
        }
    }
}
function clone(tree) {
    const cloneTree = {};
    if ('tag' in tree) {
        const cloneElement = cloneTree;
        const ve = tree;
        cloneElement.tag = ve.tag;
        if ('is' in ve) {
            cloneElement.is = ve.tag;
        }
        if (ve.class) {
            cloneElement.class = ve.class.slice();
        }
        if (ve.part) {
            cloneElement.part = ve.part.slice();
        }
        if ('style' in ve) {
            cloneElement.style = ve.style;
        }
        if (ve.props) {
            cloneElement.props = {
                ...ve.props
            };
        }
        if (ve.on) {
            cloneElement.on = {};
            for(const type in ve.on){
                cloneElement.on[type] = ve.on[type].slice();
            }
        }
    }
    if (tree.children) {
        cloneTree.children = tree.children.map((child)=>typeof child === 'object' ? clone(child) : child
        );
    }
    if ('node' in tree) {
        cloneTree.node = tree.node;
    }
    return cloneTree;
}
function destroy1(tree) {
    tree.children?.forEach((child)=>typeof child === 'object' && destroy1(child)
    );
    tree.node.dispatchEvent(new CustomEvent(eventTypes.destroy, {
        bubbles: false,
        detail: {
            ve: tree
        }
    }));
}
function patch1(tree, newTree) {
    patchChildren(tree, newTree);
    tree.node.dispatchEvent(new CustomEvent(eventTypes.patch, {
        bubbles: true,
        composed: true,
        detail: {
            tree: clone(tree)
        }
    }));
    return tree;
}
function patchElement(ve, newVe) {
    if (ve.tag !== newVe.tag || ve.is !== newVe.is || newVe.new) {
        ve = newVe.is ? {
            tag: newVe.tag,
            is: newVe.is,
            node: document.createElement(newVe.tag, {
                is: newVe.is
            })
        } : {
            tag: newVe.tag,
            node: document.createElement(newVe.tag)
        };
    }
    patchClass(ve, newVe);
    patchPart(ve, newVe);
    patchStyle(ve, newVe);
    patchProps(ve, newVe);
    patchOn(ve, newVe);
    patchChildren(ve, newVe);
    patchForm(ve, newVe);
    if ('key' in newVe) {
        ve.key = newVe.key;
    } else {
        delete ve.key;
    }
    return ve;
}
function patchClass(ve, newVe) {
    const currentClass = (ve.class || []).join(' ');
    const newClass = (newVe.class || []).join(' ');
    if (currentClass !== newClass) {
        ve.node.className = newClass;
    }
    if (newClass.length) {
        ve.class = (newVe.class || []).slice();
    } else {
        delete ve.class;
    }
}
function patchPart(ve, newVe) {
    const currentPart = ve.part || [];
    const newPart = newVe.part || [];
    const shortage = newPart.filter((part)=>!currentPart.includes(part)
    );
    if (shortage.length) {
        ve.node.part.add(...shortage);
    }
    const surplus = currentPart.filter((part)=>!newPart.includes(part)
    );
    if (surplus.length) {
        ve.node.part.remove(...surplus);
    }
    if (newPart.length) {
        ve.part = newPart.slice();
    } else {
        delete ve.part;
    }
}
function patchStyle(ve, newVe) {
    if (ve.node instanceof HTMLElement) {
        const style = ve.style || '';
        const newStyle = newVe.style || '';
        if (style != newStyle) {
            ve.node.style.cssText = newStyle;
            if (newStyle != '') {
                ve.style = newStyle;
            } else {
                delete ve.style;
            }
        }
    }
}
function patchProps(ve, newVe) {
    const currentProps = ve.props || {};
    const newProps = newVe.props || {};
    const currentPropsKeys = Object.keys(currentProps);
    const newPropsKeys = Object.keys(newProps);
    newPropsKeys.filter((key)=>!currentPropsKeys.includes(key) || currentProps[key] !== newProps[key]
    ).forEach((key)=>ve.node.setAttribute(key, newProps[key])
    );
    currentPropsKeys.filter((key)=>!newPropsKeys.includes(key)
    ).forEach((key)=>ve.node.removeAttribute(key)
    );
    if (newPropsKeys.length) {
        ve.props = {
            ...newProps
        };
    } else {
        delete ve.props;
    }
}
function patchOn(ve, newVe) {
    const currentOn = ve.on || {};
    const newOn = newVe.on || {};
    const currentOnKeys = Object.keys(currentOn);
    const newOnKeys = Object.keys(newOn);
    newOnKeys.filter((type)=>!currentOnKeys.includes(type)
    ).forEach((type)=>{
        newOn[type].forEach((listener)=>{
            ve.node.addEventListener(type, listener);
        });
    });
    currentOnKeys.filter((type)=>!newOnKeys.includes(type)
    ).forEach((type)=>{
        currentOn[type].forEach((listener)=>{
            ve.node.removeEventListener(type, listener);
        });
    });
    newOnKeys.filter((type)=>currentOnKeys.includes(type)
    ).forEach((type)=>{
        const news = newOn[type];
        const currents = currentOn[type];
        news.filter((listener)=>!currents.includes(listener)
        ).forEach((listener)=>ve.node.addEventListener(type, listener)
        );
        currents.filter((listener)=>!news.includes(listener)
        ).forEach((listener)=>ve.node.removeEventListener(type, listener)
        );
    });
    if (newOnKeys.length) {
        ve.on = newOnKeys.reduce((on, type)=>{
            on[type] = [
                ...newOn[type]
            ];
            return on;
        }, {});
    } else {
        delete ve.on;
    }
}
function patchForm(ve, newVe) {
    if (Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype, ve.node)) {
        const input = ve.node;
        if (input.value !== newVe.props?.value) {
            if (newVe.props && 'value' in newVe.props) {
                if (input.value !== newVe.props?.value.toString()) {
                    input.value = newVe.props.value;
                }
            } else {
                if (ve.node.value !== '') {
                    ve.node.value = '';
                }
            }
        }
        if (!input.checked && newVe.props && 'checked' in newVe.props) {
            input.checked = true;
        } else if (input.checked && !(newVe.props && 'checked' in newVe.props)) {
            input.checked = false;
        }
    }
    if (Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype, ve.node)) {
        const option = ve.node;
        if (!option.selected && newVe.props && 'selected' in newVe.props) {
            option.selected = true;
        } else if (option.selected && !(newVe.props && 'selected' in newVe.props)) {
            option.selected = false;
        }
    }
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
    get vNode() {
        return this.children[this.index];
    }
    next(indexStep = 1) {
        if (typeof this.children[this.index] === 'number') {
            this.index += indexStep;
        } else {
            if (this.node) {
                this.index += indexStep;
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
    add(vNode) {
        const node = typeof vNode === 'string' ? document.createTextNode(vNode) : vNode.node;
        const next = this.node;
        this.node = this.parent.node.insertBefore(node, this.node || null);
        this.next(next ? 0 : 1);
        return vNode;
    }
    replace(vNode) {
        if (typeof vNode === 'string' && this.node?.nodeType === 3) {
            if (this.node.data !== vNode) {
                this.node.data = vNode;
            }
        } else {
            const node = typeof vNode === 'string' ? document.createTextNode(vNode) : vNode.node;
            if (this.node !== node) {
                if (typeof this.vNode === 'object') {
                    if ('key' in this.vNode) {
                        this.stock.set(this.vNode.key, this.vNode);
                    } else if (this.node?.nodeType === 1) {
                        destroy1(this.vNode);
                    }
                }
                this.parent.node.replaceChild(node, this.node);
                this.node = node;
            }
        }
        this.next();
        return vNode;
    }
    remove() {
        if (typeof this.vNode === 'object') {
            if ('key' in this.vNode) {
                this.stock.set(this.vNode.key, this.vNode);
            }
            if (this.node?.nodeType === 1) {
                destroy1(this.vNode);
            }
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
        while(!this.isEnd){
            if (typeof this.vNode === 'object') {
                destroy1(this.vNode);
            }
            this.index++;
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
        this.stock.forEach((ve)=>destroy1(ve)
        );
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
    const numbers = newChildren.filter((vNode)=>typeof vNode === 'number'
    ).reverse();
    let number = numbers.pop();
    const tmp1 = newChildren.map((vNode)=>{
        switch(typeof vNode){
            case 'string':
                {
                    if (!pointer.isEnd && typeof pointer.vNode === 'string') {
                        return pointer.replace(vNode);
                    } else {
                        return pointer.add(vNode);
                    }
                }
            case 'object':
                {
                    if ('key' in vNode) {
                        if (pointer.has(vNode.key)) {
                            return pointer.addFromKey(vNode.key, vNode);
                        } else {
                            if (typeof pointer.vNode === 'object') {
                                const isMatched = pointer.search(()=>{
                                    if (typeof pointer.vNode === 'object' && vNode.key === pointer.vNode.key) {
                                        return true;
                                    } else if (typeof pointer.vNode === 'number' && number != undefined && pointer.vNode === number) {
                                        return false;
                                    }
                                });
                                if (isMatched) {
                                    return pointer.replace(patchElement(pointer.vNode, vNode));
                                }
                            }
                        }
                    }
                    if (typeof pointer.vNode === 'object') {
                        const tmp = 'key' in pointer.vNode ? {
                            tag: vNode.tag,
                            node: document.createElement(vNode.tag)
                        } : pointer.vNode;
                        return pointer.replace(patchElement(tmp, vNode));
                    } else {
                        return pointer.add(patchElement({
                            tag: vNode.tag,
                            node: document.createElement(vNode.tag)
                        }, vNode));
                    }
                }
            case 'number':
                {
                    const isMatched = pointer.search(()=>{
                        if (typeof pointer.vNode === 'number' && vNode === pointer.vNode) {
                            return true;
                        }
                    });
                    number = numbers.pop();
                    if (isMatched) {
                        pointer.next();
                    }
                    pointer.clear();
                    return vNode;
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
function find(tree, callback) {
    for (const child of tree.children || []){
        if (typeof child === 'object') {
            if (callback(child)) {
                return child;
            } else {
                const result = find(child, callback);
                if (result) {
                    return result;
                }
            }
        }
    }
    return null;
}
function trace(tree, callback) {
    tree.children?.forEach((child)=>{
        if (typeof child === 'object') {
            callback(child);
            trace(child, callback);
        }
    });
}
export { eventTypes as eventTypes };
export { load as load };
export { patch1 as patch };
export { find as find };
export { trace as trace };
export { clone as clone };
export { destroy1 as destroy };
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
        case 'text':
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
        case '[':
            {
                const values = [];
                while(lexer.nextType() !== ']'){
                    values.push(expression(lexer));
                    if (lexer.nextType() === ',') {
                        lexer.pop();
                    } else if (lexer.nextType() === ']') {
                        lexer.pop();
                        break;
                    } else {
                        throw Error("']' is required");
                    }
                }
                return {
                    type: 'array',
                    values
                };
            }
        case '{':
            {
                const entries = [];
                while(lexer.nextType() !== '}'){
                    const entry = Array(2);
                    const token = lexer.pop();
                    if (token[0] === 'word') {
                        entry[0] = {
                            type: 'literal',
                            value: token[1]
                        };
                    } else if (token[0] === '[') {
                        entry[0] = expression(lexer);
                        must(lexer.pop(), ']');
                    }
                    must(lexer.pop(), ':');
                    entry[1] = expression(lexer);
                    entries.push(entry);
                    if (lexer.nextType() === ',') {
                        lexer.pop();
                    } else if (lexer.nextType() === '}') {
                        lexer.pop();
                        break;
                    } else {
                        throw Error("'}' is required");
                    }
                }
                return {
                    type: 'object',
                    entries
                };
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
function must(token, type, message = '') {
    if (!token || token[0] !== type) throw Error(message);
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
        -1
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
        return this._index === 0;
    }
    get isLast() {
        return this._index === this._entries.length - 1;
    }
    get parent() {
        return pickup(this._stack, 'loop')[0];
    }
}
const parser = new DOMParser();
function parse(html, field = 'tree') {
    switch(field){
        case 'tree':
            if (typeof html === 'string') {
                const doc = parser.parseFromString(html, 'text/html');
                return {
                    type: 'tree',
                    children: parseChildren(doc.head).concat(parseChildren(doc.body))
                };
            } else if (html.nodeType === 11) {
                return {
                    type: 'tree',
                    children: parseChildren(html)
                };
            } else {
                return parseElement(html);
            }
        case 'text':
            return innerText(new Lexer(html, field));
        case 'script':
            return expression(new Lexer(html, field));
    }
}
class DomLexer {
    node;
    constructor(node){
        this.node = node;
    }
    isSkippable(props) {
        for(let node = this.node; node; node = node.nextSibling){
            switch(node.nodeType){
                default:
                    return false;
                case 1:
                    return node.hasAttribute(props);
                case 3:
                    if (!/^\s*$/.test(node.data)) {
                        return false;
                    }
            }
        }
        return false;
    }
    skip() {
        while(true){
            if (this.node.nodeType === 1) {
                return this;
            }
            this.node = this.node.nextSibling;
        }
    }
    pop() {
        const node = this.node;
        do {
            this.node = this.node ? this.node.nextSibling : null;
        }while (this.node && this.node.nodeType === 1 && this.node.tagName === 'SCRIPT')
        return node;
    }
}
function parseChildren(node) {
    let firstChild = node.firstChild;
    while(firstChild && firstChild.nodeType === 1 && firstChild.tagName === 'SCRIPT'){
        firstChild = firstChild.nextSibling;
    }
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
            return parse(lexer.pop().data, 'text');
        case 1:
            {
                return parseFor(lexer);
            }
        default:
            return '';
    }
}
function parseChild(lexer) {
    return parseFor(lexer);
}
function parseFor(lexer) {
    const el = lexer.node;
    if (el.hasAttribute('@for')) {
        const each = el.getAttribute('@each') || undefined;
        const array = parse(el.getAttribute('@for'), 'script');
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
        const condition = parse(el.getAttribute('@if'), 'script');
        const truthy = parseExpand(el);
        lexer.pop();
        const falsy = lexer.isSkippable('@else') ? parseChild(lexer.skip()) : undefined;
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
        const template = parse(el.getAttribute('@expand'), 'script');
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
    if (el.tagName.toLowerCase() === 'group') {
        const template = {
            type: 'group'
        };
        if (el.hasAttributes()) {
            el.getAttributeNames().forEach((name)=>{
                if (name.match(/^@(if|else|for|each|expand)$/)) return;
                if (name.match(/^@.*$/)) {
                    if (!template.props) {
                        template.props = {};
                    }
                    template.props[name] = el.getAttribute(name);
                }
            });
        }
        if (el.hasChildNodes()) {
            template.children = parseChildren(el);
        }
        return template;
    } else {
        return parseElement(el);
    }
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
                        return (template[name] ?? (template[name] = [])).push(value.split(/\s+/));
                    }
                case 'style':
                    {
                        return style.push(value);
                    }
                case 'is:':
                    return template.is = parse(value, 'script');
                case 'class:':
                case 'part:':
                    {
                        const n = name.slice(0, -1);
                        return (template[n] ?? (template[n] = [])).push({
                            type: 'flags',
                            value: parse(value, 'script')
                        });
                    }
                case 'style:':
                    {
                        return style.push(parse(value, 'script'));
                    }
            }
            {
                const match = name.match(/^on(?<type>.+?):?$/);
                if (match?.groups) {
                    const type = match.groups.type;
                    const handler = {
                        type: 'handler',
                        value: parse(value, 'script')
                    };
                    return ((template.on ?? (template.on = {}))[type] ?? (template.on[type] = [])).push(handler);
                }
            }
            {
                const match = name.match(/^(?<name>.+):$/);
                if (match?.groups) {
                    return (template.props ?? (template.props = {}))[match.groups.name] = parse(value, 'script');
                }
            }
            {
                const match = name.match(/^(?<name>.+)\*$/);
                if (match?.groups) {
                    return;
                }
            }
            if (name.match(/^@(if|else|for|each|expand)$/)) return;
            if (!(name in (template.props ?? (template.props = {})))) {
                return template.props[name] = value;
            }
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
        if (template.props) {
            for(const key in template.props){
                const match = key.match(/^(?<name>.+)&$/);
                if (match?.groups) {
                    const name = match.groups.name;
                    (template.bools ?? (template.bools = {}))[name] = parse(template.props[key], 'script');
                    delete template.props[name];
                    delete template.props[key];
                    delete template.props[name + ':'];
                }
            }
            if (!Object.keys(template.props).length) {
                delete template.props;
            }
        }
    }
    if (el.hasChildNodes()) {
        template.children = parseChildren(el);
    }
    return template;
}
function instanceOfTemplate(object) {
    return typeof object === 'object' && 'type' in object;
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
    array: (template, stack)=>template.values.map((value)=>evaluate(value, stack)
        )
    ,
    object: (template, stack)=>template.entries.map((entry)=>entry.map((value)=>evaluate(value, stack)
            )
        ).reduce((obj, [key, value])=>{
            obj[key] = value;
            return obj;
        }, {})
    ,
    variable: (template, stack)=>{
        const [, index] = pickup(stack, template.name);
        if (index >= 0) {
            return [
                stack[index],
                template.name
            ];
        }
        return undefined;
    },
    unary: (template, stack)=>operateUnary(template.operator, evaluate(template.operand, stack))
    ,
    binary: (template, stack)=>operateBinary(template.operator, evaluate(template.left, stack), evaluate(template.right, stack))
    ,
    assign: (template, stack)=>{
        const value = evaluate(template.left, stack);
        if (!value) {
            throw Error(template.left ? template.left.name : 'key' + ' is not defined');
        }
        const [object, key] = value;
        const right = evaluate(template.right, stack);
        return object[key] = template.operator.length > 1 ? operateBinary(template.operator.slice(0, -1), object[key], right) : right;
    },
    ['function']: (template, stack)=>{
        if (template.name.type === 'get' && template.name.value.type === 'hash') {
            const value = evaluate(template.name.value, stack);
            if (!value) {
                throw Error(evaluate(template.name.value.key) + ' is not defined');
            }
            const f = value[0][value[1]];
            if (typeof f === 'function') {
                return f.apply(value[0], template.params.map((param)=>evaluate(param, stack)
                ));
            }
        } else {
            const f = evaluate(template.name, stack);
            if (typeof f === 'function') {
                return f(...template.params.map((param)=>evaluate(param, stack)
                ));
            }
        }
        throw Error(template.name.toString() + ' is not a function');
    },
    hash: (template, stack)=>[
            evaluate(template.object, stack),
            evaluate(template.key, stack)
        ]
    ,
    get: (template, stack)=>{
        const value = evaluate(template.value, stack);
        return value ? value[0][value[1]] : value;
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
        return entries.flatMap(([key, value], index)=>{
            const loop = new Loop(key, value, index, entries, stack);
            return flatwrap(evaluate(template.value, stack.concat([
                template.each ? {
                    [template.each]: value,
                    loop
                } : {
                    loop
                }
            ])));
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
                return flatwrap(evaluate(child, stack));
            }
        });
        if (children.length) {
            return {
                children
            };
        } else {
            return {};
        }
    },
    expand: (template, stack)=>{
        const result = evaluate(template.template, stack);
        if (instanceOfTemplate(result)) {
            if (result.type === 'tree') {
                result.type = 'group';
            }
            return evaluate(result, stack);
        } else {
            return evaluate(template.default, stack);
        }
    },
    group: (template, stack)=>template.children ? template.children.flatMap((child)=>flatwrap(instanceOfTemplate(child) ? evaluate(child, stack) : child)
        ) : []
    ,
    handler: (template, stack)=>{
        if (!template.cache) {
            template.cache = [];
        }
        for (const cache of template.cache){
            if (compareCache(cache[0], stack)) {
                return cache[1];
            }
        }
        const handler = (event)=>evaluate(template.value, [
                ...stack,
                {
                    event
                }
            ])
        ;
        template.cache.push([
            stack,
            handler
        ]);
        return handler;
    }
};
function evaluateProps(template, stack, ve) {
    if (template.style) {
        ve.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack);
    }
    if (template.bools) {
        for(const key in template.bools){
            const value = template.bools[key];
            const result = typeof value === 'string' ? value : evaluate(value, stack);
            if (result) {
                (ve.props ?? (ve.props = {}))[key] = result;
            }
        }
    }
    if (template.props) {
        if (!ve.props) {
            ve.props = {};
        }
        for(const key in template.props){
            if (!key.startsWith('@')) {
                const value = template.props[key];
                ve.props[key] = typeof value === 'string' ? value : evaluate(value, stack);
            }
        }
    }
    if (template.class) {
        template.class.forEach((value)=>ve.class = (ve.class || []).concat(Array.isArray(value) ? value : evaluate(value, stack))
        );
    }
    if (template.part) {
        template.part.forEach((value)=>ve.part = (ve.part || []).concat(Array.isArray(value) ? value : evaluate(value, stack))
        );
    }
    if (template.on) {
        if (!ve.on) {
            ve.on = {};
        }
        for(const type in template.on){
            ve.on[type] = template.on[type].map((listener)=>evaluate(listener, stack)
            );
        }
    }
}
function compareCache(cache, stack, cacheIndex = cache.length - 1, stackIndex = stack.length - 1) {
    const [cacheLoop, newCacheIndex] = pickup(cache, 'loop', cacheIndex);
    const [stackLoop, newStackIndex] = pickup(stack, 'loop', stackIndex);
    if (!cacheLoop && !stackLoop) return true;
    if (!cacheLoop || !stackLoop) return false;
    return cacheLoop.index === stackLoop.index && cacheLoop.key === stackLoop.key && cacheLoop.value === stackLoop.value && compareCache(cache, stack, newCacheIndex - 1, newStackIndex - 1);
}
function flatwrap(value) {
    return value === null || value === undefined ? [] : Array.isArray(value) ? value : [
        value
    ];
}
export { Lexer as Lexer };
export { innerText as innerText, expression as expression };
export { Loop as Loop };
export { parse as parse };
export { evaluate as evaluate };
const builtin = lock({
    alert,
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
    location,
    history,
    navigator
});
class Entity {
    _stack;
    _component;
    _el;
    _tree;
    _props = {};
    _constructor;
    constructor(component, el, tree){
        this._component = component;
        this._el = el;
        this._tree = tree;
        this._patch = this._patch.bind(this);
        this._on = this._on.bind(this);
        this._off = this._off.bind(this);
        const data1 = typeof this._component.data === 'function' ? this._component.data(this) : this._component.data;
        this._constructor = (async ()=>{
            const result = await data1;
            const stack = result ? Array.isArray(result) ? result : [
                result
            ] : [];
            this._stack = [
                builtin,
                this._props,
                ...stack
            ];
            reach(stack, this._patch);
            this._patch();
            stack.forEach((data)=>{
                if (typeof data === 'object' && data !== null) {
                    for(const name in data){
                        if (typeof data[name] === 'function' && isNaN(name) && !(name in this._el)) {
                            const method = data[name].bind(this);
                            Object.defineProperty(this._el, name, {
                                get () {
                                    return method;
                                }
                            });
                        }
                    }
                }
            });
        })().then();
    }
    setProp(name, value) {
        switch(name){
            case 'is':
            case 'class':
            case 'part':
            case 'style':
                return;
            default:
                {
                    const old = this._props[name];
                    if (old !== value) {
                        unwatch(old, this._patch);
                        this._props[name] = value;
                        reach(this._props[name], this._patch);
                        this._patch();
                    }
                }
        }
    }
    _unwatch() {
        unwatch(this._stack, this._patch);
    }
    get component() {
        return this._component;
    }
    get node() {
        return this._el;
    }
    get root() {
        return this._tree.node;
    }
    get props() {
        return this._props;
    }
    get patch() {
        return this._patch;
    }
    get on() {
        return this._on;
    }
    get off() {
        return this._off;
    }
    get whenConstructed() {
        return ()=>this._constructor
        ;
    }
    _patch() {
        if (this._stack && this._tree && this._component.template) {
            const tree = evaluate(this._component.template, this._stack);
            patch1(this._tree, tree);
        }
    }
    _on(type, listener, options = false) {
        this._el.addEventListener(type, listener, options);
    }
    _off(type, listener, options = false) {
        this._el.removeEventListener(type, listener, options);
    }
}
function instanceOfComponent(object) {
    return typeof object === 'object' && object.template && object.data && object.options;
}
const localComponentElementTag = 'beako-entity';
class ComponentElement extends HTMLElement {
    entity;
    constructor(){
        super();
    }
    setProp(name, value) {
        this.entity?.setProp(name, value);
    }
    static getComponent() {
        return undefined;
    }
    loadProps() {
        if (this.hasAttributes()) {
            this.getAttributeNames().forEach((name)=>{
                this.setProp(name, this.getAttribute(name));
            });
        }
    }
    whenConstructed() {
        return this.entity?.whenConstructed() || null;
    }
    get attributes() {
        return proxyNamedNodeMap(super.attributes, this.setProp);
    }
    setAttribute(name, value) {
        this.setProp(name, value);
        super.setAttribute(name, value);
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
                                const tree = load(this.attachShadow({
                                    mode: component.options.mode,
                                    delegatesFocus: component.options.delegatesFocus
                                }));
                                this.entity = new Entity(component, this, tree);
                            }
                        } else {
                            throw Error(value + ' is not a component.');
                        }
                        break;
                    }
                case 'object':
                    if (instanceOfComponent(value)) {
                        const tree = load(this.attachShadow({
                            mode: value.options.mode,
                            delegatesFocus: value.options.delegatesFocus
                        }));
                        this.entity = new Entity(value, this, tree);
                    } else {
                        throw Error('The object is not a component.');
                    }
                    break;
            }
        }
        super.setProp(name, value);
    }
}
customElements.define(localComponentElementTag, LocalComponentElement);
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
function extend(template) {
    if (instanceOfTemplate(template)) {
        switch(template.type){
            case 'element':
                if (!isPrimitive(template) || 'is' in template) {
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
    if (!template1.isForce) {
        if (isPrimitive(template1)) {
            const Type = customElements.get(el.is);
            isComponent = Type !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, Type);
        } else {
            let element;
            for(let i = stack.length - 1; i >= 0; i--){
                if (template1.tag in stack[i]) {
                    element = stack[i][template1.tag];
                    break;
                }
            }
            if (instanceOfComponent(element)) {
                el.tag = localComponentElementTag;
                el.props = {
                    component: element
                };
                isComponent = true;
            } else {
                const Type = customElements.get(template1.tag);
                isComponent = Type !== undefined && Object.prototype.isPrototypeOf.call(ComponentElement, Type);
            }
        }
    } else {
        isComponent = true;
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
                    children: values
                }
            ]);
        }
        if (contents.length) {
            if (!el.props) {
                el.props = {};
            }
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
        if (template1.cache && template1.cache !== el.props?.component) {
            el.new = true;
        }
        if (el.props?.component) {
            template1.cache = el.props.component;
        } else {
            delete template1.cache;
        }
        return el;
    } else {
        return evaluator.element(template1, stack);
    }
};
function compact(template, data = []) {
    return lock({
        template: extend(typeof template === 'string' ? parse(template) : template),
        data: typeof data === 'function' || Array.isArray(data) ? data : [
            data
        ],
        options: {
            mode: 'open',
            delegatesFocus: true
        }
    });
}
function define(name, template, data = []) {
    const component = instanceOfComponent(template) ? template : compact(template, data);
    if (component.options.localeOnly) {
        throw Error('This componet is local only.');
    }
    customElements.define(name, class extends ComponentElement {
        constructor(){
            super();
            const tree = load(this.attachShadow({
                mode: component.options.mode,
                delegatesFocus: component.options.delegatesFocus
            }));
            this.entity = new Entity(component, this, tree);
            if (this.innerHTML) {
                const ve = evaluate(extend(parse(this)));
                for(const key in ve.props){
                    this.setProp(key, ve.props[key]);
                }
            } else {
                this.loadProps();
            }
        }
        static getComponent() {
            return component;
        }
    });
}
function hack(target, template, data = []) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    const component = instanceOfComponent(template) ? template : compact(template, data);
    if (component.options.localeOnly) {
        throw Error('This componet is local only.');
    }
    const tree = load(element.attachShadow({
        mode: component.options.mode,
        delegatesFocus: component.options.delegatesFocus
    }));
    const entity = new Entity(component, element, tree);
    const temp = parse(element);
    temp.type = 'custom';
    temp.isForce = true;
    const ve = evaluate(temp);
    for(const key in ve.props){
        entity.setProp(key, ve.props[key]);
    }
}
function seal(component, options = {}) {
    component.options = Object.freeze({
        mode: 'closed',
        delegatesFocus: true,
        ...options
    });
    return Object.freeze(component);
}
export { builtin as builtin };
export { Entity as Entity };
export { ComponentElement as ComponentElement };
export { extend as extend };
export { compact as compact };
export { define as define };
export { hack as hack };
export { seal as seal };

