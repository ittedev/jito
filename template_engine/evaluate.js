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
        const func = evaluate(template.name, stack);
        if (typeof func === 'function') {
            return func(...template.params.map((param)=>evaluate(param, stack)
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
export { evaluate as evaluate };
export { evaluator as evaluator };
