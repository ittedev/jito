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
        const attr = {
        };
        el.node.getAttributeNames().forEach((name)=>{
            const value = el.node.getAttribute(name);
            switch(name){
                case 'class':
                case 'part':
                    return el[name] = value.split(/\s+/);
                case 'style':
                    return el.style = value;
                default:
                    return attr[name] = value;
            }
        });
        if (Object.keys(attr).length) {
            el.attr = attr;
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
