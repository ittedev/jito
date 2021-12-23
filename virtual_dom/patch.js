function patch(tree, newTree) {
    patchChildren(tree, newTree);
    return tree;
}
function patchElement(el, newEl) {
    if (el.tag !== newEl.tag) {
        return patchElement({
            tag: newEl.tag,
            node: document.createElement(newEl.tag)
        }, newEl);
    }
    patchClass(el, newEl);
    patchPart(el, newEl);
    patchStyle(el, newEl);
    patchAttr(el, newEl);
    patchEvent(el, newEl);
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
function patchAttr(el, newEl) {
    const currentAttr = el.attr || {
    };
    const newAttr = newEl.attr || {
    };
    const currentAttrKeys = Object.keys(currentAttr);
    const newAttrKeys = Object.keys(newAttr);
    const shortageOrUpdated = newAttrKeys.filter((key)=>!currentAttrKeys.includes(key) || currentAttr[key] !== newAttr[key]
    );
    for (const key2 of shortageOrUpdated){
        el.node.setAttribute(key2, newAttr[key2]);
    }
    const surplus = currentAttrKeys.filter((key)=>!newAttrKeys.includes(key)
    );
    for (const key1 of surplus){
        el.node.removeAttribute(key1);
    }
    if (newAttrKeys.length) {
        el.attr = {
            ...newAttr
        };
    } else {
        delete el.attr;
    }
    if ('rawAttributes' in el.node) {
        el.node.rawAttributes = el.attr || null;
    }
}
function patchEvent(tree, newTree) {
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
        console.log('result:', result);
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
