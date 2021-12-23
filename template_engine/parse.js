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
export { parse as parse };
