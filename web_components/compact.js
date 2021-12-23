function instanceOfTemplate(object) {
    return typeof object === 'object' && 'type' in object;
}
var TokenField;
(function(TokenField1) {
    TokenField1[TokenField1["innerText"] = 0] = "innerText";
    TokenField1[TokenField1["script"] = 1] = "script";
    TokenField1[TokenField1["singleString"] = 2] = "singleString";
    TokenField1[TokenField1["doubleString"] = 3] = "doubleString";
    TokenField1[TokenField1["template"] = 4] = "template";
    TokenField1[TokenField1["lineComment"] = 5] = "lineComment";
    TokenField1[TokenField1["blockComment"] = 6] = "blockComment";
})(TokenField || (TokenField = {
}));
var TokenType;
(function(TokenType1) {
    TokenType1[TokenType1["none"] = 0] = "none";
    TokenType1[TokenType1["multiOpetator"] = 1] = "multiOpetator";
    TokenType1[TokenType1["unaryOpetator"] = 2] = "unaryOpetator";
    TokenType1[TokenType1["binaryOpetator"] = 3] = "binaryOpetator";
    TokenType1[TokenType1["assignOpetator"] = 4] = "assignOpetator";
    TokenType1[TokenType1["crementOpetator"] = 5] = "crementOpetator";
    TokenType1[TokenType1["chaining"] = 6] = "chaining";
    TokenType1[TokenType1["optional"] = 7] = "optional";
    TokenType1[TokenType1["leftSquare"] = 8] = "leftSquare";
    TokenType1[TokenType1["rightSquare"] = 9] = "rightSquare";
    TokenType1[TokenType1["leftRound"] = 10] = "leftRound";
    TokenType1[TokenType1["rightRound"] = 11] = "rightRound";
    TokenType1[TokenType1["leftBrace"] = 12] = "leftBrace";
    TokenType1[TokenType1["rightBrace"] = 13] = "rightBrace";
    TokenType1[TokenType1["leftMustache"] = 14] = "leftMustache";
    TokenType1[TokenType1["rightMustache"] = 15] = "rightMustache";
    TokenType1[TokenType1["leftPlaceHolder"] = 16] = "leftPlaceHolder";
    TokenType1[TokenType1["rightPlaceHolder"] = 17] = "rightPlaceHolder";
    TokenType1[TokenType1["lineComment"] = 18] = "lineComment";
    TokenType1[TokenType1["leftComment"] = 19] = "leftComment";
    TokenType1[TokenType1["rightComment"] = 20] = "rightComment";
    TokenType1[TokenType1["comma"] = 21] = "comma";
    TokenType1[TokenType1["exclamation"] = 22] = "exclamation";
    TokenType1[TokenType1["question"] = 23] = "question";
    TokenType1[TokenType1["colon"] = 24] = "colon";
    TokenType1[TokenType1["singleQuote"] = 25] = "singleQuote";
    TokenType1[TokenType1["doubleQuote"] = 26] = "doubleQuote";
    TokenType1[TokenType1["backQuote"] = 27] = "backQuote";
    TokenType1[TokenType1["spread"] = 28] = "spread";
    TokenType1[TokenType1["return"] = 29] = "return";
    TokenType1[TokenType1["null"] = 30] = "null";
    TokenType1[TokenType1["undefined"] = 31] = "undefined";
    TokenType1[TokenType1["boolean"] = 32] = "boolean";
    TokenType1[TokenType1["kwyword"] = 33] = "kwyword";
    TokenType1[TokenType1["number"] = 34] = "number";
    TokenType1[TokenType1["string"] = 35] = "string";
    TokenType1[TokenType1["word"] = 36] = "word";
    TokenType1[TokenType1["escape"] = 37] = "escape";
    TokenType1[TokenType1["partial"] = 38] = "partial";
    TokenType1[TokenType1["other"] = 39] = "other";
})(TokenType || (TokenType = {
}));
function distinguish(field, value) {
    switch(field){
        case TokenField.script:
            switch(value){
                case '+':
                case '-':
                    return TokenType.multiOpetator;
                case 'void':
                case 'typeof':
                case '~':
                case '!':
                    return TokenType.unaryOpetator;
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
                    return TokenType.binaryOpetator;
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
                    return TokenType.assignOpetator;
                case '++':
                case '--':
                    return TokenType.crementOpetator;
                case 'false':
                case 'true':
                    return TokenType.boolean;
                case 'null':
                    return TokenType.null;
                case 'undefined':
                    return TokenType.undefined;
                case '.':
                    return TokenType.chaining;
                case '?.':
                    return TokenType.optional;
                case '[':
                    return TokenType.leftSquare;
                case ']':
                    return TokenType.rightSquare;
                case '{':
                    return TokenType.leftBrace;
                case '}':
                    return TokenType.rightBrace;
                case '(':
                    return TokenType.leftRound;
                case ')':
                    return TokenType.rightRound;
                case '...':
                    return TokenType.spread;
                case '?':
                    return TokenType.question;
                case ':':
                    return TokenType.colon;
                case ',':
                    return TokenType.comma;
                case '\'':
                    return TokenType.singleQuote;
                case '\"':
                    return TokenType.doubleQuote;
                case '`':
                    return TokenType.backQuote;
            }
            switch(true){
                case /^\/\/.*$/.test(value):
                    return TokenType.lineComment;
                case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value):
                    return TokenType.word;
                case /^\d+\.?\d*$|^\.?\d+$/.test(value):
                    return TokenType.number;
            }
            break;
        case TokenField.template:
            switch(value){
                case '$':
                    return TokenType.partial;
                case '${':
                    return TokenType.leftPlaceHolder;
                case '}':
                    return TokenType.rightPlaceHolder;
                case '`':
                    return TokenType.backQuote;
                case '\r':
                case '\n':
                case '\r\n':
                    return TokenType.other;
            }
        case TokenField.singleString:
        case TokenField.doubleString:
            switch(value){
                case '\\':
                    return TokenType.partial;
                case '\r':
                case '\n':
                case '\r\n':
                    return TokenType.return;
                case '\\\r\n':
                    return TokenType.escape;
                case '\'':
                    if (field === TokenField.singleString) return TokenType.singleQuote;
                    break;
                case '\"':
                    if (field === TokenField.doubleString) return TokenType.doubleQuote;
                    break;
            }
            switch(true){
                case /^\\(x|u)$/.test(value):
                    return TokenType.partial;
                case /^\\.$/.test(value):
                    return TokenType.escape;
            }
            break;
        case TokenField.innerText:
            switch(value){
                case '{':
                case '}':
                    return TokenType.partial;
                case '{{':
                    return TokenType.leftMustache;
                case '}}':
                    return TokenType.rightMustache;
            }
            break;
    }
    return TokenType.other;
}
class Lexer {
    text;
    field;
    index = 0;
    token = null;
    constructor(text, field){
        this.text = text;
        this.field = field;
    }
    _next(start) {
        const token = {
            type: TokenType.none,
            value: ''
        };
        for(this.index = start; this.index < this.text.length; this.index++){
            const nextType = distinguish(this.field, token.value + this.text[this.index]);
            if (nextType === TokenType.other) {
                return token;
            } else {
                token.type = nextType;
                token.value = token.value + this.text[this.index];
            }
        }
        return token;
    }
    skip() {
        let value = '';
        if (!this.token) {
            for(let i = this.index; i < this.text.length; i++){
                if (distinguish(this.field, this.text[i]) === TokenType.other) {
                    value += this.text[i];
                } else {
                    this.token = this._next(i);
                    if (this.token?.type === TokenType.partial) {
                        value += this.token.value;
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
        return this.token ? this.token.type : TokenType.none;
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
            this.index -= this.token.value.length;
            this.token = null;
        }
        this.field = parent;
    }
}
function must(token, type, message = '') {
    if (!token || token.type !== type) throw Error(message);
}
function innerText(lexer) {
    const texts = [];
    texts.push(lexer.skip());
    while(lexer.nextType()){
        if (lexer.nextType() === TokenType.leftMustache) {
            lexer.pop();
            lexer.expand(TokenField.script, ()=>{
                texts.push(expression(lexer));
            });
            must(lexer.pop(), TokenType.rightMustache);
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
    return conditional(lexer);
}
function conditional(lexer) {
    let condition = arithmetic(lexer);
    while(lexer.nextType() === TokenType.question){
        lexer.pop();
        const truthy = expression(lexer);
        must(lexer.pop(), TokenType.colon);
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
    while(lexer.nextType() === TokenType.multiOpetator || lexer.nextType() === TokenType.binaryOpetator){
        list.push(lexer.pop().value);
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
        case TokenType.multiOpetator:
        case TokenType.exclamation:
            return {
                type: 'unary',
                operator: lexer.pop()?.value,
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
            case TokenType.leftRound:
                {
                    lexer.pop();
                    const params = [];
                    while(lexer.nextType() !== TokenType.rightRound){
                        params.push(expression(lexer));
                        if (lexer.nextType() === TokenType.comma) lexer.pop();
                        else break;
                    }
                    must(lexer.pop(), TokenType.rightRound);
                    template = {
                        type: 'function',
                        name: template,
                        params
                    };
                    continue;
                }
            case TokenType.chaining:
                {
                    lexer.pop();
                    const key = lexer.pop();
                    must(key, TokenType.word);
                    template = {
                        type: 'hash',
                        object: template,
                        key: {
                            type: 'literal',
                            value: key.value
                        }
                    };
                    continue;
                }
            case TokenType.leftSquare:
                {
                    lexer.pop();
                    const key = expression(lexer);
                    must(lexer.pop(), TokenType.rightSquare);
                    template = {
                        type: 'hash',
                        object: template,
                        key
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
    switch(token.type){
        case TokenType.word:
            return {
                type: 'variable',
                name: token.value
            };
        case TokenType.number:
            return {
                type: 'literal',
                value: Number(token.value)
            };
        case TokenType.boolean:
            return {
                type: 'literal',
                value: token.value === 'true' ? true : false
            };
        case TokenType.undefined:
            return {
                type: 'literal',
                value: undefined
            };
        case TokenType.null:
            return {
                type: 'literal',
                value: null
            };
        case TokenType.doubleQuote:
            return stringLiteral(lexer, TokenField.doubleString, token.type);
        case TokenType.singleQuote:
            return stringLiteral(lexer, TokenField.singleString, token.type);
        case TokenType.backQuote:
            return stringLiteral(lexer, TokenField.template, token.type);
        case TokenType.leftRound:
            {
                const node = expression(lexer);
                must(lexer.pop(), TokenType.rightRound);
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
            switch(token.type){
                case type:
                    break loop;
                case TokenType.return:
                    throw Error();
                case TokenType.escape:
                    texts[i] += token.value;
                    continue;
                case TokenType.leftPlaceHolder:
                    lexer.expand(TokenField.script, ()=>{
                        texts.push(expression(lexer));
                    });
                    must(lexer.pop(), TokenType.rightPlaceHolder);
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
    hasAttribute(attr) {
        return !!(this.node && this.node.nodeType === 1 && this.node.hasAttribute(attr));
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
                return parseEach(lexer);
            }
        default:
            return '';
    }
}
function parseText(node) {
    return innerText(new Lexer(node.data, TokenField.innerText));
}
function parseChild(lexer) {
    return parseEach(lexer);
}
function parseEach(lexer) {
    const el = lexer.node;
    if (el.hasAttribute('@for')) {
        const each = el.getAttribute('@each');
        const array = expression(new Lexer(el.getAttribute('@for'), TokenField.script));
        return {
            type: 'each',
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
        const condition = expression(new Lexer(el.getAttribute('@if'), TokenField.script));
        const truthy = parseRegion(el);
        lexer.pop();
        const falsy = lexer.hasAttribute('@else') ? parseChild(lexer) : undefined;
        return {
            type: 'if',
            condition,
            truthy,
            falsy
        };
    } else {
        return parseRegion(lexer.pop());
    }
}
function parseRegion(el) {
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
                    switch(match.groups.name){
                        case 'class':
                        case 'part':
                            {
                                if (!(match.groups.name in template)) {
                                    template[match.groups.name] = [];
                                }
                                return template[match.groups.name].push({
                                    type: 'flags',
                                    value: expression(new Lexer(value, TokenField.script))
                                });
                            }
                        case 'style':
                            {
                                return style.push(expression(new Lexer(value, TokenField.script)));
                            }
                    }
                }
            }
            {
                const match = name.match(/^(?<name>.+):$/);
                if (match?.groups) {
                    if (!('attr' in template)) {
                        template.attr = {
                        };
                    }
                    return template.attr[match.groups.name] = expression(new Lexer(value, TokenField.script));
                }
            }
            {
                const match = name.match(/^(?<name>.+)\*$/);
                if (match?.groups) {
                }
            }
            if (name.match(/^@.+$/)) return;
            if (!('attr' in template)) {
                template.attr = {
                };
            }
            if (!(name in template.attr)) {
                return template.attr[name] = value;
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
function toFlags(value) {
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
}
const evaluator = {
    literal: (template, _stack)=>template.value
    ,
    variable: (template, stack)=>{
        for(let i = stack.length - 1; i >= 0; i--){
            if (template.name in stack[i]) return stack[i][template.name];
        }
        throw Error(template.name + ' is not defined');
    },
    unary: (template, stack)=>operateUnary(template.operator, evaluate(template.operand, stack))
    ,
    binary: (template, stack)=>operateBinary(template.operator, evaluate(template.left, stack), evaluate(template.right, stack))
    ,
    ['function']: (template, stack)=>{
        const func2 = evaluate(template.name, stack);
        if (typeof func2 === 'function') {
            return func2(...template.params.map((param)=>evaluate(param, stack)
            ));
        }
        throw Error(template.name.toString() + ' is not a function');
    },
    hash: (template, stack)=>evaluate(template.object, stack)[evaluate(template.key, stack)]
    ,
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
    flags: (template, stack)=>toFlags(evaluate(template.value, stack))
    ,
    ['if']: (template, stack)=>evaluate(template.condition, stack) ? evaluate(template.truthy, stack) : template.falsy ? evaluate(template.falsy, stack) : null
    ,
    each: (template, stack)=>{
        evaluate(template.array, stack);
        return '';
    },
    element: (template, stack)=>{
        const el = evaluator.tree(template, stack);
        el.tag = template.tag;
        if (template.style) {
            el.style = typeof template.style === 'string' ? template.style : evaluate(template.style, stack);
        }
        return el;
    },
    tree: (template, stack)=>{
        let children = [];
        template.children?.forEach((child)=>{
            if (typeof child === 'string') {
                children.push(child);
            } else {
                const value = evaluate(child, stack);
                if (Array.isArray(value)) {
                    children = children.concat(value);
                } else {
                    children.push(value);
                }
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
    }
};
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
            if (name.startsWith('on')) return;
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
function compact(template1, stack1 = []) {
    const temp = typeof template1 === 'string' ? parse(template1) : template1;
    return class extends HTMLElement {
        template;
        tree;
        stack;
        attr = null;
        constructor(){
            super();
            console.log('constructor()');
            const shadow = this.attachShadow({
                mode: 'open'
            });
            this.template = temp;
            this.tree = load(shadow);
            this.stack = [
                builtin,
                ...stack1
            ];
            this.patch();
        }
        patch() {
            patch(this.tree, evaluate(this.template, this.stack));
        }
        connectedCallback() {
            console.log('connectedCallback()');
        }
        disconnectedCallback() {
            console.log('disconnectedCallback()');
        }
        adoptedCallback() {
            console.log('adoptedCallback()');
        }
        get rawAttributes() {
            return this.attr;
        }
        set rawAttributes(attr) {
            this.attr = attr;
        }
    };
}
export { compact as compact };
