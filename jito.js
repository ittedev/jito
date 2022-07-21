var c=Symbol.for("Jito Reactive"),H=Symbol.for("Jito Lock"),h=Symbol.for("Jito Recursive"),A=Symbol.for("Jito Array");function k(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Array.isArray(t))&&!t[H]}function de(t,e){return O(t,[],!1,e),t}function O(t,e,r,n){if(k(t)&&!e.includes(t)){e.push(t),r&&q(t),n&&c in t&&t[c][h][1].add(n);for(let a in t)O(t[a],e,r,n);e.pop()}return t}function Z(t,e,r){return k(t)&&(e===void 0?I(t,[],!0):r?(Ye(t,e,r),he(t)):I(t,[],!0,e)),t}function he(t){if(c in t){let e=t;if(!e[c][h][1].size){let r=!1;for(let n in e)e[c][n][1].size>1&&(r=!0);if(!r){for(let n in e[c])Object.defineProperty(e,n,{enumerable:!0,configurable:!0,writable:!0,value:e[c][n][0]}),delete e[c][n];Array.isArray(e)&&(delete e.unshift,delete e.push,delete e.splice,delete e.pop,delete e.shift,delete e.sort,delete e.reverse,delete e.copyWithin),delete e[c]}}}}function Ye(t,e,r){e in t[c]&&t[c][e][1].forEach(n=>{n[1]===r&&t[c][e][1].delete(n)})}function N(t,e){return I(t,[],!1,e)}function I(t,e,r,n){if(k(t)&&!e.includes(t)){if(e.push(t),t[c]){let a=t;if(n)a[c][h][1].delete(n);else{a[c][h][1].clear();for(let i in a)a[c][i][1].clear()}}for(let a in t)I(t[a],e,r,n);r&&he(t),e.pop()}return t}function P(t,e,r){return k(t)&&(e===void 0?O(t,[],!0):r?(O(t,[],!0),C(t,e,["spy",r])):O(t,[],!0,e)),t}function q(t){if(!(c in t)){let e=new Set,r=()=>{e.forEach(a=>a())},n=["bio",r];if(t[c]={[h]:[n,e]},Array.isArray(t)){let a=t[c][A]=t.slice(),i=o=>(r(),o),s=o=>{let l=t[c][A].length;if(t.length<l)for(let u=t.length;u<l;u++)C(t,u);return t.length=l,i(o)};Object.defineProperties(t,{unshift:{get(){return(...o)=>s(Array.prototype.unshift.call(a,...o.map(l=>$(t,l))))}},push:{get(){return(...o)=>s(Array.prototype.push.call(a,...o.map(l=>$(t,l))))}},splice:{get(){return(o,l,...u)=>s(l===void 0?Array.prototype.splice.call(a,o,a.length-o):Array.prototype.splice.apply(a,[o,l,...u.map(b=>$(t,b))]))}},pop:{get(){return()=>s(Array.prototype.pop.call(a))}},shift:{get(){return()=>s(Array.prototype.shift.call(a))}},sort:{get(){return o=>i(o===void 0?Array.prototype.sort.call(a):Array.prototype.sort.call(a,o))}},reverse:{get(){return()=>i(Array.prototype.reverse.call(a))}},copyWithin:{get(){return(o,l,u)=>i(Array.prototype.copyWithin.call(a,o,l!==void 0?l:0,u!==void 0?u:a.length))}}})}}if(c in t){let e=t[c][h][0];for(let r in t)C(t,r,e)}}function C(t,e,r){if(!Array.isArray(t)||typeof e!="number"&&isNaN(e)){if(e in t[c]||(t[c][e]=[t[e],new Set],Object.defineProperty(t,e,{get(){return this[c][e][0]},set(n){et(this,this[c][e],n)}})),r){for(let n of t[c][e][1])if(n[1]===r[1])return;t[c][e][1].add(r)}}else{let n=Object.getOwnPropertyDescriptor(t,e);(!n||"value"in n)&&e in t[c][A]&&Object.defineProperty(t,e,{get(){return this[c][A][e]},set(a){let i=this[c][A][e];i!==a&&($(this,a),Ce(this,i),this[c][A][e]=a,t[c][h][0][1]())},configurable:!0,enumerable:!0})}}function $(t,e){return t[c][h][1].forEach(r=>P(e,r)),e}function Ce(t,e){return t[c][h][1].forEach(r=>N(e,r)),e}function et(t,e,r){let n=e[0];e[0]=r,n!==r&&($(t,r),Ce(t,n),e[1].forEach(a=>{switch(a[0]){case"bio":a[1]();break;case"bom":e[1].delete(a);case"spy":a[1](r,n);break}}))}async function tt(t,...e){if(k(t)){q(t);let r=Array.isArray(e[0])?e.flatMap(a=>a):e,n=await Promise.all(r.map(a=>t[a]===void 0?new Promise(i=>{C(t,a,["bom",i])}):t[a]));return Object.fromEntries(r.map((a,i)=>[a,n[i]]))}return{}}function Q(t,e,r){if(typeof t=="object"&&t!==null){if(!(e in t)&&c in t){let n=t;n[e]=void 0,C(n,e,n[c][h][0])}t[e]=r}return r}function z(t){return t[H]=!0,t}function rt(t){return delete t[H],t}var X=Symbol.for("Jito Event Types");var Le="destroy",Se="patch";X in window||Object.defineProperty(window,X,{value:Object.seal({get destroy(){return Le},set destroy(t){Le=t},get patch(){return Se},set patch(t){Se=t}})});var R=window[X];function w(t){let e={el:t};return _e(e),e}function nt(t){let e={tag:t.tagName.toLowerCase(),el:t};return at(e),_e(e),e}function at(t){if(t.el.hasAttributes()){let e={};t.el.getAttributeNames().forEach(r=>{if(r.startsWith("on"))return;let n=t.el.getAttribute(r);switch(r){case"class":case"part":return t[r]=n.split(/\s+/);case"style":case"is":return t[r]=n;default:return e[r]=n}}),Object.keys(e).length&&(t.attrs=e)}}function _e(t){if(t.el.hasChildNodes()){let e=t.el.childNodes;t.children=[];for(let r=0;r<e.length;r++)switch(e[r].nodeType){case 1:if(e[r].tagName==="SCRIPT")break;t.children.push(nt(e[r]));break;case 3:t.children.push(e[r].data);break}}}function L(t,e=!0){if(!t.invalid?.children&&t.el instanceof Node){t.children?.forEach(n=>typeof n=="object"&&L(n,e));let r=t.el;for(;r.firstChild;)r.removeChild(r.firstChild)}e&&t.tag&&t.el.dispatchEvent(new CustomEvent(R.destroy,{bubbles:!1})),t.invalid?.on||ne(t,{}),!t.invalid?.attrs&&t.el instanceof Element&&(Y(t,{}),ee(t,{}),te(t,{}),re(t,{}),ae(t,{}))}function G(t,e,r=!0){return ge(t,e,r),r&&t.el.dispatchEvent(new CustomEvent(R.patch,{bubbles:!0,composed:!0})),t}function Te(t,e,r){return(!t||t.tag!==e.tag||t.is!==e.is||e.new)&&(t=e.is?{tag:e.tag,is:e.is,el:document.createElement(e.tag,{is:e.is})}:{tag:e.tag,el:document.createElement(e.tag)}),Y(t,e),ee(t,e),te(t,e),re(t,e),ae(t,e),ne(t,e),ge(t,e,r),"key"in e?t.key=e.key:delete t.key,t}function Oe(t,e,r){return(!t||t.el!==e.el)&&(t={el:e.el},"override"in e&&(t.override=e.override),"invalid"in e&&(t.invalid={...e.invalid})),!t.invalid?.attrs&&t.el instanceof Element&&(Y(t,e),ee(t,e),te(t,e),re(t,e),ae(t,e)),t.invalid?.on||ne(t,e),!t.invalid?.children&&t.el instanceof Node&&ge(t,e,r),t}function Y(t,e){let r=(t.class||[]).join(" "),n=(e.class||[]).join(" ");r!==n&&(t.el.className=n),n.length?t.class=(e.class||[]).slice():delete t.class}function ee(t,e){let r=t.part||[],n=e.part||[],a=n.filter(s=>!r.includes(s));a.length&&t.el.part.add(...a);let i=r.filter(s=>!n.includes(s));i.length&&t.el.part.remove(...i),n.length?t.part=n.slice():delete t.part}function te(t,e){if(t.el instanceof HTMLElement){let r=t.style||"",n=e.style||"";r!=n&&(t.el.style.cssText=n,n!=""?t.style=n:delete t.style)}}function re(t,e){let r=t.attrs||{},n=e.attrs||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)||r[s]!==n[s]).forEach(s=>t.el.setAttribute(s,n[s])),a.filter(s=>!i.includes(s)).forEach(s=>t.el.removeAttribute(s)),i.length?t.attrs={...n}:delete t.attrs}function ne(t,e){let r=t.on||{},n=e.on||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)).forEach(s=>{n[s].forEach(o=>{t.el.addEventListener(s,o)})}),a.filter(s=>!i.includes(s)).forEach(s=>{r[s].forEach(o=>{t.el.removeEventListener(s,o)})}),i.filter(s=>a.includes(s)).forEach(s=>{let o=n[s],l=r[s];o.filter(u=>!l.includes(u)).forEach(u=>t.el.addEventListener(s,u)),l.filter(u=>!o.includes(u)).forEach(u=>t.el.removeEventListener(s,u))}),i.length?t.on=i.reduce((s,o)=>(s[o]=[...n[o]],s),{}):delete t.on}function ae(t,e){if(Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype,t.el)){let r=t.el;r.value!==e.attrs?.value&&(e.attrs&&"value"in e.attrs?r.value!==(e.attrs?.value).toString()&&(r.value=e.attrs.value):t.el.value!==""&&(t.el.value="")),!r.checked&&e.attrs&&"checked"in e.attrs?r.checked=!0:r.checked&&!(e.attrs&&"checked"in e.attrs)&&(r.checked=!1)}if(Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype,t.el)){let r=t.el;!r.selected&&e.attrs&&"selected"in e.attrs?r.selected=!0:r.selected&&!(e.attrs&&"selected"in e.attrs)&&(r.selected=!1)}}var Pe=class{constructor(){this.stock=new Map}has(e){return this.stock.get(e)?.length}push(e,r){this.stock.has(e)?this.stock.get(e).push(r):this.stock.set(e,[r])}shift(e){return this.stock.get(e).shift()}};function ge(t,e,r){let n=t.children||[],a=e.children||[];if(n.length===0&&a.length===0||n.length===0&&t.el.hasChildNodes())return;let i=n.length===0&&a.length>1?new DocumentFragment:t.el,s=new Pe,o=0,l=i.firstChild,u=a.filter(f=>typeof f=="number").reverse(),b=u.pop(),v=f=>{let m=Te(null,f,r);return i.insertBefore(m.el,l||null),m},we=f=>{let m=Te(n[o],f,r);return m!==n[o]&&(L(n[o],r),i.replaceChild(m.el,n[o].el)),l=m.el.nextSibling,o++,m},fe=(f=!1)=>{let m=n[o];if(typeof m!="number"){if(typeof m=="object"){if(l!==m.el){L(m,r),o++;return}f&&"key"in m?s.push(m.key,m):L(m,r)}if(typeof m=="string"||typeof m=="object"&&!m.override){let W=l;l=W.nextSibling,i.removeChild(W)}}o++},Ae=a.map(f=>{switch(typeof f){case"string":return typeof n[o]=="string"?(l.data!==f&&(l.data=f),l=l.nextSibling,o++):i.insertBefore(document.createTextNode(f),l||null),f;case"object":{if("el"in f)if(typeof n[o]=="object"&&f.el===n[o].el){let m=Oe(n[o],f,r);return!m.override&&m.el===l&&m.el instanceof Element&&m.el.getRootNode()===l.getRootNode()&&(l=l.nextSibling),o++,m}else{let m=Oe(null,f,r);return!m.override&&m.el instanceof Element&&m.el.parentNode===null&&i.insertBefore(m.el,l||null),m}if("key"in f)if(s.has(f.key)){let m=Te(s.shift(f.key),f,r);return i.insertBefore(m.el,l||null),m}else{for(;o<n.length&&n[o]!==b;){if(typeof n[o]=="object"&&f.key===n[o].key)return we(f);fe(!0)}return v(f)}else return typeof n[o]=="object"&&!("el"in f)&&!("key"in n[o])?we(f):v(f)}case"number":{for(;o<n.length&&n[o]!==f;)fe();return o++,b=u.pop(),s.stock.forEach(m=>m.forEach(W=>L(W,r))),s.stock.clear(),f}}});for(;o<n.length;)fe();Ae.length?t.children=Ae:delete t.children,n.length===0&&a.length>1&&t.el.append(i)}function T(t,e){return D(t,e)[0]}function D(t,e,r=t.length-1){for(let n=r;n>=0;n--)if(e in t[n])return[t[n][e],n];return[void 0,-1]}var ie=class{constructor(e,r,n,a,i){this._key=e;this._value=r;this._index=n;this._entries=a;this._stack=i}get key(){return this._key}get value(){return this._value}get index(){return this._index}get size(){return this._entries.length}get isFirst(){return this._index===0}get isLast(){return this._index===this._entries.length-1}get parent(){return T(this._stack,"loop")}toJSON(){return{key:this._key,value:this._value,_index:this._index,size:this._entries.length,isFirst:this._index===0,isLast:this._index===this._entries.length-1}}};var se=Symbol.for("Jito Ref");function V(t){return typeof t=="object"&&t!==null&&typeof t.type=="string"}function ye(t){return typeof t=="object"&&t!==null&&t[se]===!0}function j(t){return"tag"in t}var S=class{constructor(e,r,n=0,a=null){this.text=e;this.field=r;this.index=n;this.token=a}_next(e){let r=["",""];for(this.index=e;this.index<this.text.length;this.index++){let n=Ve(this.field,r[1]+this.text[this.index]);if(n==="other")return r;r[0]=n,r[1]=r[1]+this.text[this.index]}return r}skip(e=[]){e.unshift("other");let r="";if(!this.token)for(let n=this.index;n<this.text.length;n++)if(e.includes(Ve(this.field,this.text[n])))r+=this.text[n];else if(this.token=this._next(n),this.token&&this.token[0]==="partial")r+=this.token[1],this.token=null;else return r;return r}nextIs(e){return this.skip(),this.token?e?this.token[0]===e:this.token[0]:!1}pop(){this.skip();let e=this.token;return this.token=null,e||null}expand(e,r){let n=this.field;this.field=e,r(),this.token&&(this.index-=this.token[1].length,this.token=null),this.field=n}must(e){let r=this.pop();if(!r||r[0]!==e)throw Error(e+" is required.");return r}};function Ve(t,e){switch(t){case"html":switch(e){case">":case"<!--":case"/":return e;case"<":case"</":case"<!":case"<!-":return"partial"}switch(!0){case/^\/\/.*$/.test(e):return"//";case/^<[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(e):return"start";case/^<\/[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(e):return"end"}break;case"attr":switch(e){case"@if":case"@else":case"@for":case"@each":return"@";case"=":case":=":case"&=":case"*=":return"assign";case">":case"/":case"'":case'"':return e;case":":case"&":case"*":return"partial"}switch(!0){case/^on[_\$\-a-zA-Z0-9]+$/.test(e):return"on";case/^[_\$\-@a-zA-Z0-9]+$/.test(e):return"name"}break;case"comment":switch(e){case"-->":return e;case"-":case"--":return"partial"}break;case"script":switch(e){case"+":case"-":return"multi";case"void":case"typeof":case"~":case"!":return"unary";case"/":case"*":case"%":case"**":case"in":case"instanceof":case"<":case">":case"<=":case">=":case"==":case"!=":case"===":case"!==":case"<<":case">>":case">>>":case"&":case"|":case"^":case"&&":case"||":case"??":return"binary";case"=":case"*=":case"**=":case"/=":case"%=":case"+=":case"-=":case"<<=":case">>=":case">>>=":case"&=":case"^=":case"|=":case"&&=":case"||=":case"??=":return"assign";case"++":case"--":return"crement";case"false":case"true":return"boolean";case"null":case"undefined":case".":case"?.":case"[":case"]":case"{":case"}":case"(":case")":case"...":case"?":case":":case",":case"'":case'"':case"`":return e}switch(!0){case/^\/\/.*$/.test(e):return"//";case/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(e):return"word";case/^\d+\.?\d*$|^\.?\d+$/.test(e):return"number"}break;case"template":switch(e){case"$":return"partial";case"${":return e;case"}":return e;case"`":return"`";case"\r":case`
`:case`\r
`:return"other"}case"single":case"double":switch(e){case"\\":return"partial";case"\r":case`
`:case`\r
`:return"return";case`\\\r
`:return"escape";case"'":if(t==="single")return e;break;case'"':if(t==="double")return e;break}switch(!0){case/^\\u[0-9a-fA-F]{0,3}$/.test(e):case/^\\x[0-9a-fA-F]{0,1}$/.test(e):case/^\\u\{(0?[0-9a-fA-F]{0,5}|10[0-9a-fA-F]{0,4})$/.test(e):return"partial";case/^\\.$/.test(e):case/^\\u[0-9a-fA-F]{4}$/.test(e):case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(e):case/^\\x[0-9a-fA-F]{2}$/.test(e):return"escape"}break;case"text":switch(e){case"{":case"}":return"partial";case"{{":case"}}":return e}break}return"other"}function oe(t){switch(t){case"\\n":return`
`;case"\\r":return"\r";case"\\v":return"\v";case"\\t":return"	";case"\\b":return"\b";case"\\f":return"\f"}switch(!0){case/^\\u[0-9a-fA-F]{4}$/.test(t):case/^\\x[0-9a-fA-F]{2}$/.test(t):return String.fromCodePoint(parseInt(t.slice(2),16));case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(t):return String.fromCodePoint(parseInt(t.slice(3,-1),16))}return t.slice(1)}function d(t){let e=typeof t=="string"?new S(t,"script"):t;return it(e)}function it(t){let e=st(t);if(t.nextIs("assign")){if(e.type!=="get")throw Error("The left operand is not variable");let r=t.pop()[1],n=d(t);return{type:"assign",operator:r,left:e.value,right:n}}else return e}function st(t){let e=je(t);for(;t.nextIs("?");){t.pop();let r=d(t);t.must(":");let n=je(t);e={type:"if",condition:e,truthy:r,falsy:n}}return e}function je(t){let e=new Array;for(e.push(le(t));t.nextIs("multi")||t.nextIs("binary");)e.push(t.pop()[1]),e.push(le(t));for(;e.length>1;)for(let r=0;r+1<e.length;r+=2)if(r+3>=e.length||Me(e[r+1])>Me(e[r+3])){let n={type:"binary",operator:e[r+1],left:e[r],right:e[r+2]};e.splice(r,3,n)}return typeof e[0]=="string"?{type:"variable",name:e[0]}:e[0]}function Me(t){switch(t){default:return 0;case"||":case"??":return 4;case"&&":return 5;case"|":return 6;case"^":return 7;case"&":return 8;case"==":case"!=":case"===":case"!==":return 9;case"in":case"instanceof":case"<":case">":case"<=":case">=":return 10;case"<<":case">>":case">>>":return 11;case"+":case"-":return 12;case"*":case"/":case"%":return 13;case"**":return 14}}function le(t){switch(t.nextIs()){case"multi":case"unary":return{type:"unary",operator:t.pop()[1],operand:le(t)};case"crement":return{type:"assign",operator:t.pop()[1].charAt(0)+"=",left:le(t).value,right:{type:"literal",value:1}};default:return ot(t)}}function ot(t){let e=lt(t);return t.nextIs("crement")?{type:"assign",operator:t.pop()[1].charAt(0)+"=",left:e.value,right:{type:"literal",value:1},prevalue:!0}:e}function lt(t){let e=pt(t);for(;;){switch(t.nextIs()){case"(":{t.pop();let r=[];for(;!t.nextIs(")")&&(r.push(d(t)),t.nextIs(","));)t.pop();t.must(")"),e={type:"function",name:e,params:r};continue}case".":{t.pop();let r=t.must("word");e={type:"get",value:{type:"hash",object:e,key:{type:"literal",value:r[1]}}};continue}case"[":{t.pop();let r=d(t);t.must("]"),e={type:"get",value:{type:"hash",object:e,key:r}};continue}}break}return e}function pt(t){let e=t.pop();switch(e[0]){case"word":return{type:"get",value:{type:"variable",name:e[1]}};case"number":return{type:"literal",value:Number(e[1])};case"boolean":return{type:"literal",value:e[1]==="true"};case"undefined":return{type:"literal",value:void 0};case"null":return{type:"literal",value:null};case'"':return K(t,"double",e[0]);case"'":return K(t,"single",e[0]);case"`":return K(t,"template",e[0]);case"(":{let r=d(t);return t.must(")"),r}case"[":{let r=[];for(;!t.nextIs("]");)if(r.push(d(t)),t.nextIs(","))t.pop();else if(t.nextIs("]")){t.pop();break}else throw Error("']' is required");return{type:"array",values:r}}case"{":{let r=[];for(;!t.nextIs("}");){let n=Array(2),a=t.pop();if(a[0]==="word"?n[0]={type:"literal",value:a[1]}:a[0]==='"'?n[0]=K(t,"double",a[0]):a[0]==="'"?n[0]=K(t,"single",a[0]):a[0]==="["&&(n[0]=d(t),t.must("]")),a[0]==="word"&&(t.nextIs(",")||t.nextIs("}"))?n[1]={type:"get",value:{type:"variable",name:a[1]}}:(t.must(":"),n[1]=d(t)),r.push(n),t.nextIs(","))t.pop();else if(t.nextIs("}")){t.pop();break}else throw Error("'}' is required")}return{type:"object",entries:r}}default:throw new Error(e[0]+" is invalid")}}function K(t,e,r){let n=[""],a=0;return t.expand(e,()=>{e:for(;;){n[a]+=t.skip();let i=t.pop();switch(i[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n[a]+=oe(i[1]);continue;case"${":t.expand("script",()=>{n.push(d(t))}),t.must("}"),n.push(t.skip()),a+=2}}}),a===0?{type:"literal",value:n[0]}:{type:"join",values:n.filter(i=>i!==""),separator:""}}function M(t){switch(t){case"html":case"base":case"head":case"link":case"meta":case"style":case"title":case"body":case"address":case"article":case"aside":case"footer":case"header":case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":case"main":case"nav":case"section":case"blockquote":case"dd":case"div":case"dl":case"dt":case"figcaption":case"figure":case"hr":case"li":case"ol":case"p":case"pre":case"ul":case"a":case"abbr":case"b":case"bdi":case"bdo":case"br":case"cite":case"code":case"data":case"dfn":case"em":case"i":case"kbd":case"mark":case"q":case"rp":case"rt":case"ruby":case"s":case"samp":case"small":case"span":case"strong":case"sub":case"sup":case"time":case"u":case"var":case"wbr":case"area":case"audio":case"img":case"map":case"track":case"video":case"embed":case"iframe":case"object":case"param":case"picture":case"portal":case"source":case"svg":case"math":case"canvas":case"noscript":case"script":case"del":case"ins":case"caption":case"col":case"colgroup":case"table":case"tbody":case"td":case"tfoot":case"th":case"thead":case"tr":case"button":case"datalist":case"fieldset":case"form":case"input":case"label":case"legend":case"meter":case"optgroup":case"option":case"output":case"progress":case"select":case"textarea":case"details":case"dialog":case"menu":case"summary":case"slot":case"template":return!0}return!1}function Fe(t){switch(t){case"br":case"hr":case"img":case"input":case"meta":case"area":case"base":case"col":case"embed":case"keygen":case"link":case"param":case"source":return!0}return!1}function pe(t){let e=typeof t=="string"?new S(t,"html"):t,r={text:e.skip([">","/"])};for(;e.nextIs("<!--");)e.pop(),e.expand("comment",()=>e.must("-->")),r.text+=e.skip([">","/"]);if(e.nextIs("start")){let n=ct(e);n&&(j(n)?r.next=n:(r.text=n.text,n.next&&(r.next=n.next)))}return r.text?r:r.next?r.next:void 0}function ct(t){let e={tag:t.pop()[1].slice(1).toLocaleLowerCase()},r=ut(t);if(r.length&&(e.attrs=r),t.nextIs("/"))t.pop(),t.must(">");else if(Fe(e.tag))t.must(">");else{t.must(">");let a=pe(t);if(a&&(e.child=a),t.must("end")[1].slice(2)!==e.tag)throw Error(`end tag <${e.tag}> is required.`);t.must(">")}let n=pe(t);return n&&(e.next=n),e.tag==="script"&&e.next?e.next:e}function ut(t){let e=[];return t.expand("attr",()=>{for(t.skip();t.nextIs()&&!t.nextIs(">");){let r=new Array(3);if(t.nextIs("name"))if(r[0]=t.pop()[1],t.nextIs("assign"))r[1]=t.must("assign")[1];else if(t.nextIs("name")||t.nextIs(">")||t.nextIs("/"))r[1]="=",r[2]=r[0];else throw Error("assign is required.");else{if(t.nextIs("on"))r[0]=t.pop()[1],r[1]="on";else if(t.nextIs("@"))r[0]=t.pop()[1],r[1]="@";else break;if(r[0]==="@else")r[2]=r[0];else if(t.must("assign")[1]!=="=")throw Error("= is required.")}r[2]===void 0&&(t.nextIs('"')?r[2]=He(t,"double",t.pop()[0]):t.nextIs("'")&&(r[2]=He(t,"single",t.pop()[0]))),e.push(r),t.skip()}}),e}function He(t,e,r){let n="";return t.expand(e,()=>{e:for(;;){n+=t.skip();let a=t.pop();switch(a[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n+=oe(a[1]);continue}}}),n}function U(t){let e=pe(t),r=e?be(e):[];return r.length?{type:"tree",children:r}:{type:"tree"}}var $e=class{constructor(e){this.node=e}isSkippable(e){for(let r=this.node;r;r=r.next){if(j(r))return Ee(r,e);if(!/^\s*$/.test(r.text))return!1}return!1}skip(){for(;;){if(j(this.node))return this;this.node=this.node.next}}pop(){let e=this.node;return this.node=this.node?.next,e}};function be(t){let e=new $e(t),r=[];for(;e.node;){let n=mt(e);n!==void 0&&r.push(n)}return r}function mt(t){if(!t.node)t.pop();else return j(t.node)?ze(t):ht(new S(t.pop().text,"text"))}function ft(t){return ze(t)}function ze(t){let e=t.node;if(Ee(e,"@for")){let r=ke(e,"@each")||void 0,n=d(ke(e,"@for"));return{type:"for",each:r,array:n,value:Ie(t)}}else return Ie(t)}function Ie(t){let e=t.node;if(Ee(e,"@if")){let r=d(ke(e,"@if")),n=Ne(e);t.pop();let a={type:"if",condition:r,truthy:n};return t.isSkippable("@else")&&(a.falsy=ft(t.skip())),a}else return Ne(t.pop())}function Ne(t){if(t.tag==="group"){let e={type:"group"};if(t.attrs?.forEach(([r,,n])=>{r.match(/^@(if|else|for|each)$/)||r.match(/^@.*$/)&&(e.attrs||(e.attrs={}),e.attrs[r]=n)}),t.child){let r=be(t.child);r.length&&(e.children=r)}return e}else return dt(t)}function dt(t){let e={type:"element",tag:t.tag};{let r=[];t.attrs?.forEach(([n,a,i])=>{switch(a){case"=":{switch(n){case"is":{n in e||(e.is=i);return}case"class":case"part":return(e[n]??=[]).push(i.split(/\s+/));case"style":return r.push(i)}return n in(e.attrs??={})?void 0:e.attrs[n]=i}case":=":{switch(n){case"is":return e.is=d(i);case"class":case"part":return(e[n]??=[]).push({type:"flags",value:d(i)});case"style":return r.push(d(i))}return(e.attrs??={})[n]=d(i)}case"*=":{let s=d(i);return V(s)&&s.type==="get"&&(s=s.value),(e.attrs??={})[n]=s}case"on":{let s=n.slice(2),o={type:"handler",value:d(i)};return((e.on??={})[s]??=[]).push(o)}}}),r.length&&(r.length===1&&typeof r[0]=="string"?e.style=r[0]:e.style={type:"join",values:r.filter(n=>n!==""),separator:";"}),t.attrs?.forEach(([n,a,i])=>{a==="&="&&((e.bools??={})[n]=d(i),e.attrs&&(delete e.attrs[n],Object.keys(e.attrs).length||delete e.attrs))})}if(t.child){let r=be(t.child);r.length&&(e.children=r)}return(!M(e.tag)||e.is)&&(e.type="custom"),e}function Ee(t,e){return t.attrs?.some(r=>r[0]===e)}function ke(t,e){let r=t.attrs?.find(n=>n[0]===e);return r?r[2]:""}function ht(t){let e=[];for(e.push(t.skip());t.nextIs();)t.nextIs("{{")?(t.pop(),t.expand("script",()=>{e.push({type:"draw",value:d(t)})}),t.must("}}"),e.push(t.skip())):t.pop();return e.length===1&&typeof e[0]=="string"?e[0]:{type:"flat",values:e}}var xe=new Array,p=function(t,e=[],r={}){let n=t;switch(n.type){case"literal":return n.value;case"array":return n.values.map(a=>p(a,e,r));case"object":return Object.fromEntries(n.entries.map(a=>a.map(i=>p(i,e))));case"variable":{let[,a]=D(e,n.name);return a>=0?{record:e[a],key:n.name,[se]:!0}:void 0}case"unary":return gt(n.operator,p(n.operand,e,r));case"binary":{let a=p(n.left,e,r);return Ge(n.operator,a)?De(n.operator,a,p(n.right,e,r)):a}case"assign":{let a=p(n.left,e,r);if(!a)throw Error(n.left?n.left.name:"key is not defined");let{record:i,key:s}=a,o=i[s],l=p(n.right,e,r);if(n.operator.length>1){let u=n.operator.slice(0,-1);Ge(u,o)&&(i[s]=De(u,o,l))}else i[s]=l;return n.prevalue?o:i[s]}case"function":{if(n.name.type==="get"&&n.name.value.type==="hash"){let a=p(n.name.value,e,r);if(!a)throw Error(p(n.name.value.key,e,r)+" is not defined");let i=a.record[a.key];if(typeof i=="function")return i.apply(a.record,n.params.map(s=>p(s,e,r)))}else{let a=p(n.name,e,r);if(typeof a=="function")return a(...n.params.map(i=>p(i,e,r)))}throw Error(n.name.toString()+" is not a function")}case"hash":return{record:p(n.object,e,r),key:p(n.key,e,r),[se]:!0};case"get":{let a=p(n.value,e,r);return a&&a.record[a.key]}case"flat":{let a=n.values.flatMap(i=>typeof i=="string"?[i]:ve(p(i,e,r))).filter(i=>i!=="").reduce((i,s)=>{let o=i.length;return o&&typeof s=="string"&&typeof i[o-1]=="string"?i[o-1]+=s:i.push(s),i},[]);return a.length===1&&typeof a[0]=="string"?a[0]:a}case"draw":{let a=p(n.value,e,r);if(typeof a=="object")if(V(a))if(a.type==="tree"){a.type="group";let i=p(a,e,r);return a.type="tree",i}else return p(a,e,r);else return Object.getPrototypeOf(a)===Object.prototype?JSON.stringify(a):"";else return a==null?"":a+""}case"join":return n.values.reduce((a,i,s)=>{if(V(i)){let o=p(i,e,r);return a+(s?n.separator:"")+(typeof o=="object"?"":o)}else return a+(s?n.separator:"")+i},"");case"flags":{let a=p(n.value,e,r);if(typeof a=="string")return a.split(/\s+/);if(typeof a=="object"){if(Array.isArray(a))return a;if(a)return Object.keys(a).filter(i=>a[i])}return[]}case"if":return p(n.condition,e,r)?p(n.truthy,e,r):n.falsy?p(n.falsy,e,r):null;case"for":{let a=p(n.array,e,r),i;if(typeof a=="object"&&a!==null)if(Symbol.iterator in a)if("entries"in a)i=[...a.entries()];else{let s=0;i=[];for(let o of a)i.push([s++,o])}else i=Object.entries(a);else i=[[0,a]];return i.flatMap(([s,o],l)=>{let u=new ie(s,o,l,i,e),b=ve(p(n.value,e.concat([n.each?{[n.each]:o,loop:u}:{loop:u}]),r)).filter(v=>typeof v!="number");return typeof u.value=="object"&&b.filter(v=>typeof v=="object").forEach(v=>v.key=u.value),b})}case"tree":{let a=F(n,e,r);return a.length?{children:a}:{}}case"custom":{let a=xe.find(i=>i.match(n,e,r))?.exec(n,e,r);if(a)return a}case"element":{let a=F(n,e,r),s=a.length?{children:a}:{};return s.tag=n.tag,n.is&&(s.is=typeof n.is=="string"?n.is:p(n.is,e,r)),_(n,e,r,s),s}case"group":return F(n,e,r);case"handler":{r.handler||(r.handler=new WeakMap),r.handler.has(n)||r.handler.set(n,[]);let a=r.handler.get(n);for(let s of a)if(Ke(s[0],e))return s[1];let i=s=>p(n.value,[...e,{event:s}],r);return a.push([e,i]),i}case"evaluation":return p(n.value,e,r);default:return xe.find(a=>a.match(t,e,r))?.exec(t,e,r)}};p.plugin=t=>{xe.unshift(t)};var Tt={match(t,e,r){if(t.type==="custom"){let n=t;if(!M(n.tag))return n.tag==="window"||T(e,n.tag)instanceof EventTarget}return!1},exec(t,e,r){let n=t;if(t.tag==="window"){let s={el:window,override:!0,invalid:{attrs:!0,children:!0}};return _(n,e,r,s),s}let a=T(e,n.tag),i={el:a};return _(n,e,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),(a instanceof Element||a instanceof DocumentFragment||a instanceof ShadowRoot)&&n.children&&n.children.length?i.children=F(n,e,r):i.invalid={children:!0},i}};p.plugin(Tt);function F(t,e,r){let n=t.children||[],a=0;n.length&&((r.groups??(r.groups=[new WeakMap,0]))[0].has(t)?a=r.groups[0].get(t):(a=r.groups[1]=r.groups[1]+n.length,r.groups[0].set(t,a)));let i=n.flatMap((s,o)=>{if(V(s)){let l=ve(p(s,e,r));switch(s.type){case"if":case"for":case"group":l.push(a-o)}return l}else return[s]});return typeof i[i.length-1]=="number"&&i.pop(),i}function _(t,e,r,n){if(t.style&&(n.style=typeof t.style=="string"?t.style:p(t.style,e,r)),t.bools){for(let a in t.bools)if(!a.startsWith("@")){let i=t.bools[a],s=typeof i=="string"?i:p(i,e,r);s&&((n.attrs??(n.attrs={}))[a]=s)}}if(t.attrs){for(let a in t.attrs)if(!a.startsWith("@")){let i=t.attrs[a];(n.attrs??(n.attrs={}))[a]=typeof i=="string"?i:p(i,e,r)}}if(t.class&&t.class.forEach(a=>n.class=(n.class||[]).concat(Array.isArray(a)?a:p(a,e,r))),t.part&&t.part.forEach(a=>n.part=(n.part||[]).concat(Array.isArray(a)?a:p(a,e,r))),t.on){n.on||(n.on={});for(let a in t.on)n.on[a]=t.on[a].map(i=>p(i,e,r))}}function Ke(t,e,r=t.length-1,n=e.length-1){let[a,i]=D(t,"loop",r),[s,o]=D(e,"loop",n);return!a&&!s?!0:!a||!s?!1:a.index===s.index&&a.key===s.key&&a.value===s.value&&Ke(t,e,i-1,o-1)}function ve(t){return t==null?[]:Array.isArray(t)?t:[t]}function gt(t,e){switch(t){case"void":return;case"typeof":return typeof e;case"+":return+e;case"-":return-e;case"~":return~e;case"!":return!e;default:throw Error(t+" does not exist")}}function Ge(t,e){switch(t){case"&&":return!!e;case"||":return!e;case"??":return e==null;default:return!0}}function De(t,e,r){switch(t){case"+":return e+r;case"-":return e-r;case"/":return e/r;case"*":return e*r;case"%":return e%r;case"**":return e**r;case"in":return e in r;case"instanceof":return e instanceof r;case"<":return e<r;case">":return e>r;case"<=":return e<=r;case">=":return e>=r;case"==":return e==r;case"!=":return e!=r;case"===":return e===r;case"!==":return e!==r;case"<<":return e<<r;case">>":return e>>r;case">>>":return e>>>r;case"&":return e&r;case"|":return e|r;case"^":return e^r;case"&&":return e&&r;case"||":return e||r;case"??":return e??r;default:throw Error(t+" does not exist")}}var Re=z({alert,console,Object,Number,Math,Date,Array,JSON,String,isNaN,isFinite,location,history,navigator,setTimeout,setInterval});var B=Symbol.for("Jito Special");function g(t){return typeof t=="object"&&t!==null&&(t.template||t.patcher)&&t.main&&t.options}function ce(t){return typeof t=="object"&&t!==null&&"default"in t&&t[Symbol.toStringTag]==="Module"}function ue(t,e,r={children:[]}){return t.children&&(t.children=t.children.filter(n=>{if(typeof n=="object"){if(e(n))return r.children.push(n),!1;"tag"in n&&ue(n,e,r)}return!0}),t.children.length||delete t.children),r.children.length?r:{}}function me(...t){let e={children:[]};return t.forEach(r=>{r&&r.children&&(e.children=e.children.concat(r.children))}),e.children.length?e:{}}var E=class{constructor(e,r,n){this._attrs={};this._refs={};this._requirePatch=!1;let a=n.el;this._component=e,this._template=e.template,this._patcher=e.patcher,this._host=r,this._tree=n,this._updater=new Be(n),this.patch=this.patch.bind(this),this.dispatch=this.dispatch.bind(this),this._cache={[B]:[r,a]},this._component.options.mode==="closed"&&a.addEventListener(R.patch,s=>s.stopPropagation()),r.addEventListener(R.destroy,()=>{this.patch({type:"tree"}),N(this._stack,this.patch)});let i=typeof this._component.main=="function"?this._component.main(this):this._component.main;this._ready=(async()=>{let s=await i,o=s?Array.isArray(s)?s:[s]:[];this._stack=[Re,{host:r,root:a},P(this._attrs),...o],de(this._stack,this.patch),this.patch(),o.forEach(l=>{if(typeof l=="object"&&l!==null){for(let u in l)if((typeof l[u]=="function"||l[u]instanceof Element)&&isNaN(u)&&!(u in this._host)){let b=typeof l[u]=="function"?l[u].bind(this):l[u];Object.defineProperty(this._host,u,{get(){return b}})}}})})()}setAttr(e,r){switch(e){case"is":case"class":case"part":case"style":return;default:if(this._attrs[e]!==r){if(e in this._refs){let a=this._refs[e][0];if(ye(r)&&r.record===a.record)return;Z(this._attrs,e,this._refs[e][1]),Z(a.record,a.key,this._refs[e][2]),delete this._refs[e]}if(ye(r)){let a=s=>{r.record[r.key]=s},i=s=>{this._attrs[e]=s};this._refs[e]=[r,a,i],P(this._attrs,e,a),P(r.record,r.key,i),Q(this._attrs,e,r.record[r.key])}else Q(this._attrs,e,r)}}}get component(){return this._component}get host(){return this._host}get root(){return this._tree.el}get attrs(){return this._attrs}get ready(){return()=>this._ready}patch(e){e&&(typeof e=="function"?(this._patcher=e,this._template=void 0):(this._patcher=void 0,this._template=typeof e=="string"?U(e):e)),this._requirePatch||(this._requirePatch=!0,setTimeout(()=>{if(this._requirePatch=!1,this._stack){let r=this._patcher?this._patcher(this._stack):this._template?p(this._template,this._stack,this._cache):this._tree&&this._component.template?p(this._component.template,this._stack,this._cache):void 0;r&&this._updater.patch(r)}}))}dispatch(e,r=null){this._host.dispatchEvent(new CustomEvent(e,{detail:r}))}toJSON(){return{component:this._component,attrs:this._attrs,tree:this._tree}}};function yt(t){return"tag"in t&&(t.tag==="style"||t.tag==="link")}function Ue(t){return t.tag==="link"&&t.attrs?.href!==""&&(t.attrs?.rel).toLocaleLowerCase()==="stylesheet"}var Be=class{constructor(e){this.tree=e;this._waitUrls=new Set;this.loaded=e=>{this.removeWaitUrl(e.target.getAttribute("href"))}}patch(e){let r=ue(e,yt),n=e,a=this.header?.children?.filter(Ue)||[],i=r.children?.filter(Ue)||[],s=i.filter(l=>a.every(u=>u.attrs?.href!==l.attrs?.href)),o=a.filter(l=>i.every(u=>u.attrs?.href!==l.attrs?.href));i.forEach(l=>{((l.on??={}).load??=[]).includes(this.loaded)||l.on.load.push(this.loaded),(l.on.error??=[]).includes(this.loaded)||l.on.error.push(this.loaded)}),s.forEach(l=>{this.addWaitUrl(l.attrs?.href),l.new=!0}),o.forEach(l=>this.removeWaitUrl(l.attrs?.href)),o.length?G(this.tree,me(this.header,r,this.body),!1):G(this.tree,me(r,this.body),!1),s.forEach(l=>l.new=!1),this.header=r,this.update=()=>{G(this.tree,me(this.header,n)),ue(n,l=>(delete l.new,!1)),this.body=n}}set update(e){this._update=e,this._executeUpdate()}addWaitUrl(e){this._waitUrls.add(e)}removeWaitUrl(e){this._waitUrls.delete(e),this._executeUpdate()}_executeUpdate(){!this._waitUrls.size&&this._update&&(this._update(),this._update=void 0)}};var x="jito-element",y=class extends HTMLElement{constructor(){super()}setAttr(e,r){this._entity?.setAttr(e,r)}static getComponent(){}loadAttrs(){this.hasAttributes()&&this.getAttributeNames().forEach(e=>{this.setAttr(e,this.getAttribute(e))})}ready(){return this._entity?this._entity.ready():new Promise(e=>{this._run=e})}_setEntity(e){this._entity=e,this._run&&this._entity.ready().then(this._run)}get entity(){return this._entity}get attributes(){return kt(super.attributes,this.setAttr)}setAttribute(e,r){this.setAttr(e,r),super.setAttribute(e,r)}getAttributeNode(e){let r=super.getAttributeNode(e);return r&&We(r,this.setAttr)}removeAttribute(e){return this.setAttr(e,void 0),super.removeAttribute(e)}removeAttributeNode(e){return this.setAttr(e.name,void 0),super.removeAttributeNode(e)}toJSON(){return{entity:this._entity}}},Je=class extends y{constructor(){super()}setAttr(e,r){if(e==="component")switch(typeof r){case"string":{let n=customElements.get(r);if(n&&y.isPrototypeOf(n)){let a=n.getComponent();if(a){let i=w(this.attachShadow(a.options));this._setEntity(new E(a,this,i))}}else throw Error(r+" is not a component.");break}case"object":if(g(r)){let n=w(this.attachShadow(r.options));this._setEntity(new E(r,this,n))}else if(r!==null)throw Error("The object is not a component.");break}super.setAttr(e,r)}};customElements.get(x)||customElements.define(x,Je);function We(t,e){return new Proxy(t,{set(r,n,a){if(e(n,a),n==="value")return r.value=a}})}function kt(t,e){return new Proxy(t,{get:function(r,n){return n==="length"?r[n]:We(r[n],e)}})}async function bt(t,e){let r;if(typeof t=="string")r=document.createElement(t);else{r=document.createElement(x);let n=await Promise.resolve(t),a=ce(n)&&g(n.default)?n.default:n;r.setAttribute("component",a)}if(e)for(let n in e)r.setAttribute(n,e[n]);if(typeof t=="string"){let n=customElements.get(t);n!==void 0&&Object.prototype.isPrototypeOf.call(y,n)&&await r.ready()}else await r.ready();return r}var qe={match(t,e,r){if(t.type==="custom"){if(t.tag===x)return!0;let n=t,a=T(e,n.tag);if(typeof a=="object"&&a!==null&&(g(a)||ce(a)&&g(a.default)))return!0;{let i=customElements.get(n.tag);return i!==void 0&&Object.prototype.isPrototypeOf.call(y,i)}}return!1},exec(t,e,r){let n=t,a={tag:x},i;return n.tag!==x&&(i=T(e,n.tag),i?(a.attrs??={}).component=i:a.tag=n.tag),Xe(n,e,r,a),_(n,e,r,a),n.tag===x&&(i=a.attrs?.component,(a.attrs??={}).component=i),typeof i=="object"&&i!==null&&"default"in i&&i[Symbol.toStringTag]==="Module"&&g(i.default)&&(i=i.default,(a.attrs??={}).component=i),n.cache!==i&&(a.new=!0),n.cache=i,a}},Ze={match(t,e,r){if(t.type==="custom"){let n=T(e,t.tag);return typeof n=="object"&&n!==null&&n instanceof y}return!1},exec(t,e,r){let n=t,a=T(e,n.tag),i={el:a};return Xe(n,e,r,i),_(n,e,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),n.children&&n.children.length?i.children=F(n,e,r):i.invalid={children:!0},i}},Qe={match(t,e,r){if(t.type==="custom"&&B in r&&!M(t.tag)){let n=T(e,t.tag);return r[B].some(a=>a===n)}return!1},exec(t,e,r){let a={el:T(e,t.tag)||ShadowRoot,override:!0,invalid:{attrs:!0,children:!0}};return _(t,e,r,a),a}};function Xe(t,e,r,n){let a=[],i=[],s=(t.children||[])?.flatMap(o=>{if(typeof o!="string"){let l=o;if(l.attrs){if(l.attrs["@as"])return i.push([l.attrs["@as"],l]),[];if(l.attrs.slot)return[p(o,e,r)]}}return a.push(o),[]});a.length&&i.push(["content",{type:"group",children:a}]),i.length&&(n.attrs||(n.attrs={}),i.forEach(([o,l])=>{n.attrs[o]={type:"evaluation",value:l,stack:e}})),s.length&&(n.children=s)}p.plugin(qe);p.plugin(Qe);p.plugin(Ze);function J(t,e=[]){let r={main:typeof e=="function"||Array.isArray(e)?e:[e],options:{mode:"open"}};return typeof t=="function"?r.patcher=t:r.template=typeof t=="string"?U(t):t,z(r)}function Et(t,e,r=[]){let n=g(e)?e:J(e,r);if(n.options.localeOnly)throw Error("This componet is local only.");customElements.define(t,class extends y{constructor(){super();let a=w(this.attachShadow(n.options));this._setEntity(new E(n,this,a)),this.innerHTML&&this.entity.setAttr("content",this.innerHTML),this.loadAttrs()}static getComponent(){return n}})}function xt(t,e,r=[]){let n=typeof t=="string"?document.querySelector(t):t,a=g(e)?e:J(e,r);if(a.options.localeOnly)throw Error("This componet is local only.");let i=w(n.attachShadow(a.options)),s=new E(a,n,i);n.innerHTML&&s.setAttr("content",n.innerHTML),n.hasAttributes()&&n.getAttributeNames().forEach(o=>{s.setAttr(o,n.getAttribute(o))})}function vt(t,e={}){return t.options=Object.freeze({mode:"closed",...e}),Object.freeze(t)}export{y as ComponentElement,E as Entity,ie as Loop,Re as builtin,Q as change,J as compact,Et as define,L as destroy,bt as elementize,p as evaluate,R as eventTypes,d as expression,w as load,z as lock,xt as mount,U as parse,G as patch,T as pickup,de as reach,tt as receive,vt as seal,rt as unlock,N as unreach,Z as unwatch,P as watch};
