var u=Symbol.for("Jito Reactive"),I=Symbol.for("Jito Lock"),h=Symbol.for("Jito Recursive"),L=Symbol.for("Jito Array");function k(e){return typeof e=="object"&&e!==null&&(Object.getPrototypeOf(e)===Object.prototype||Array.isArray(e))&&!Object.isFrozen(e)&&!e[I]}function de(e,t){return V(e,[],!1,t),e}function V(e,t,r,n){if(k(e)&&!t.includes(e)){t.push(e),r&&B(e),n&&u in e&&e[u][h][1].add(n);for(let a in e)V(e[a],t,r,n);t.pop()}return e}function Z(e,t,r){return k(e)&&(t===void 0?N(e,[],!0):r?(tt(e,t,r),he(e)):N(e,[],!0,t)),e}function he(e){if(u in e){let t=e;if(!t[u][h][1].size){let r=!1;for(let n in t)t[u][n][1].size>1&&(r=!0);if(!r){for(let n in t[u])Object.defineProperty(t,n,{enumerable:!0,configurable:!0,writable:!0,value:t[u][n][0]}),delete t[u][n];Array.isArray(t)&&(delete t.unshift,delete t.push,delete t.splice,delete t.pop,delete t.shift,delete t.sort,delete t.reverse,delete t.copyWithin),delete t[u]}}}}function tt(e,t,r){t in e[u]&&e[u][t][1].forEach(n=>{n[1]===r&&e[u][t][1].delete(n)})}function $(e,t){return N(e,[],!1,t)}function N(e,t,r,n){if(k(e)&&!t.includes(e)){if(t.push(e),e[u]){let a=e;if(n)a[u][h][1].delete(n);else{a[u][h][1].clear();for(let i in a)a[u][i][1].clear()}}for(let a in e)N(e[a],t,r,n);r&&he(e),t.pop()}return e}function S(e,t,r){return k(e)&&(t===void 0?V(e,[],!0):r?(V(e,[],!0),_(e,t,["spy",r])):V(e,[],!0,t)),e}function B(e){if(!(u in e)){let t=new Set,r=()=>{t.forEach(a=>a())},n=["bio",r];if(e[u]={[h]:[n,t]},Array.isArray(e)){let a=e[u][L]=e.slice(),i=o=>(r(),o),s=o=>{let l=e[u][L].length;if(e.length<l)for(let c=e.length;c<l;c++)_(e,c);return e.length=l,i(o)};Object.defineProperties(e,{unshift:{get(){return(...o)=>s(Array.prototype.unshift.call(a,...o.map(l=>z(e,l))))}},push:{get(){return(...o)=>s(Array.prototype.push.call(a,...o.map(l=>z(e,l))))}},splice:{get(){return(o,l,...c)=>s(l===void 0?Array.prototype.splice.call(a,o,a.length-o):Array.prototype.splice.apply(a,[o,l,...c.map(E=>z(e,E))]))}},pop:{get(){return()=>s(Array.prototype.pop.call(a))}},shift:{get(){return()=>s(Array.prototype.shift.call(a))}},sort:{get(){return o=>i(o===void 0?Array.prototype.sort.call(a):Array.prototype.sort.call(a,o))}},reverse:{get(){return()=>i(Array.prototype.reverse.call(a))}},copyWithin:{get(){return(o,l,c)=>i(Array.prototype.copyWithin.call(a,o,l!==void 0?l:0,c!==void 0?c:a.length))}}})}}if(u in e){let t=e[u][h][0];for(let r in e)_(e,r,t)}}function _(e,t,r){if(!Array.isArray(e)||typeof t!="number"&&isNaN(t)){if(t in e[u]||(e[u][t]=[e[t],new Set],Object.defineProperty(e,t,{get(){return this[u][t][0]},set(n){rt(this,this[u][t],n)}})),r){for(let n of e[u][t][1])if(n[1]===r[1])return;e[u][t][1].add(r)}}else{let n=Object.getOwnPropertyDescriptor(e,t);(!n||"value"in n)&&t in e[u][L]&&Object.defineProperty(e,t,{get(){return this[u][L][t]},set(a){let i=this[u][L][t];i!==a&&(z(this,a),Pe(this,i),this[u][L][t]=a,e[u][h][0][1]())},configurable:!0,enumerable:!0})}}function z(e,t){return S(t),e[u][h][1].forEach(r=>S(t,r)),t}function Pe(e,t){return e[u][h][1].forEach(r=>$(t,r)),t}function rt(e,t,r){let n=t[0];t[0]=r,n!==r&&(z(e,r),Pe(e,n),t[1].forEach(a=>{switch(a[0]){case"bio":a[1]();break;case"bom":t[1].delete(a);case"spy":a[1](r,n);break}}))}async function nt(e,...t){if(k(e)){B(e);let r=Array.isArray(t[0])?t.flatMap(a=>a):t,n=await Promise.all(r.map(a=>e[a]===void 0?new Promise(i=>{_(e,a,["bom",i])}):e[a]));return Object.fromEntries(r.map((a,i)=>[a,n[i]]))}return{}}function Q(e,t,r){if(typeof e=="object"&&e!==null){if(!(t in e)&&u in e){let n=e;n[t]=void 0,_(n,t,n[u][h][0])}e[t]=r}return r}function Te(e){return e[I]=!0,e}function at(e){return delete e[I],e}var X=Symbol.for("Jito Event Types");var je="destroy",Ve="patch";X in window||Object.defineProperty(window,X,{value:Object.seal({get destroy(){return je},set destroy(e){je=e},get patch(){return Ve},set patch(e){Ve=e}})});var w=window[X];function C(e){let t={el:e};return Me(t),t}function it(e){let t={tag:e.tagName.toLowerCase(),el:e};return st(t),Me(t),t}function st(e){if(e.el.hasAttributes()){let t={};e.el.getAttributeNames().forEach(r=>{if(r.startsWith("on"))return;let n=e.el.getAttribute(r);switch(r){case"class":case"part":return e[r]=n.split(/\s+/);case"style":case"is":return e[r]=n;default:return t[r]=n}}),Object.keys(t).length&&(e.attrs=t)}}function Me(e){if(e.el.hasChildNodes()){let t=e.el.childNodes;e.children=[];for(let r=0;r<t.length;r++)switch(t[r].nodeType){case 1:if(t[r].tagName==="SCRIPT")break;e.children.push(it(t[r]));break;case 3:e.children.push(t[r].data);break}}}function O(e,t=!0){if(!e.invalid?.children&&e.el instanceof Node){e.children?.forEach(n=>typeof n=="object"&&O(n,t));let r=e.el;for(;r.firstChild;)r.removeChild(r.firstChild)}t&&e.tag&&e.el.dispatchEvent(new CustomEvent(w.destroy,{bubbles:!1})),e.invalid?.on||ne(e,{}),!e.invalid?.attrs&&e.el instanceof Element&&(Y(e,{}),ee(e,{}),te(e,{}),re(e,{}),ae(e,{}))}function G(e,t,r=!0){return ke(e,t,r),r&&e.el.dispatchEvent(new CustomEvent(w.patch,{bubbles:!0,composed:!0})),e}function ge(e,t,r){return(!e||e.tag!==t.tag||e.is!==t.is||t.new)&&(e=t.is?{tag:t.tag,is:t.is,el:document.createElement(t.tag,{is:t.is})}:{tag:t.tag,el:document.createElement(t.tag)}),Y(e,t),ee(e,t),te(e,t),ae(e,t),re(e,t),ne(e,t),ke(e,t,r),"key"in t?e.key=t.key:delete e.key,e}function Fe(e,t,r){return(!e||e.el!==t.el)&&(e={el:t.el},"override"in t&&(e.override=t.override),"invalid"in t&&(e.invalid={...t.invalid})),!e.invalid?.attrs&&e.el instanceof Element&&(Y(e,t),ee(e,t),te(e,t),ae(e,t),re(e,t)),e.invalid?.on||ne(e,t),!e.invalid?.children&&e.el instanceof Node&&ke(e,t,r),e}function Y(e,t){let r=(e.class||[]).join(" "),n=(t.class||[]).join(" ");r!==n&&(e.el.className=n),n.length?e.class=(t.class||[]).slice():delete e.class}function ee(e,t){let r=e.part||[],n=t.part||[],a=n.filter(s=>!r.includes(s));a.length&&e.el.part.add(...a);let i=r.filter(s=>!n.includes(s));i.length&&e.el.part.remove(...i),n.length?e.part=n.slice():delete e.part}function te(e,t){if(e.el instanceof HTMLElement){let r=e.style||"",n=t.style||"";r!=n&&(e.el.style.cssText=n,n!=""?e.style=n:delete e.style)}}function re(e,t){let r=e.attrs||{},n=t.attrs||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)||r[s]!==n[s]).forEach(s=>e.el.setAttribute(s,n[s])),a.filter(s=>!i.includes(s)).forEach(s=>e.el.removeAttribute(s)),i.length?e.attrs={...n}:delete e.attrs}function ne(e,t){let r=e.on||{},n=t.on||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)).forEach(s=>{n[s].forEach(o=>{e.el.addEventListener(s,o)})}),a.filter(s=>!i.includes(s)).forEach(s=>{r[s].forEach(o=>{e.el.removeEventListener(s,o)})}),i.filter(s=>a.includes(s)).forEach(s=>{let o=n[s],l=r[s];o.filter(c=>!l.includes(c)).forEach(c=>e.el.addEventListener(s,c)),l.filter(c=>!o.includes(c)).forEach(c=>e.el.removeEventListener(s,c))}),i.length?e.on=i.reduce((s,o)=>(s[o]=[...n[o]],s),{}):delete e.on}function ae(e,t){if(Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype,e.el)){let r=e.el;e.attrs?.value!==t.attrs?.value&&r.value!==t.attrs?.value&&(t.attrs&&"value"in t.attrs?r.value!==(t.attrs?.value).toString()&&(r.value=t.attrs.value):e.el.value!==""&&(e.el.value="")),!r.checked&&t.attrs&&"checked"in t.attrs?r.checked=!0:r.checked&&!(t.attrs&&"checked"in t.attrs)&&(r.checked=!1)}if(Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype,e.el)){let r=e.el;!r.selected&&t.attrs&&"selected"in t.attrs?r.selected=!0:r.selected&&!(t.attrs&&"selected"in t.attrs)&&(r.selected=!1)}}var ye=class{constructor(){this.stock=new Map}has(t){return this.stock.get(t)?.length}push(t,r){this.stock.has(t)?this.stock.get(t).push(r):this.stock.set(t,[r])}shift(t){return this.stock.get(t).shift()}};function ke(e,t,r){let n=e.children||[],a=t.children||[];if(n.length===0&&a.length===0||n.length===0&&e.el.hasChildNodes())return;let i=n.length===0&&a.length>1?new DocumentFragment:e.el,s=new ye,o=0,l=i.firstChild,c=a.filter(f=>typeof f=="number").reverse(),E=c.pop(),R=f=>{let m=ge(null,f,r);return i.insertBefore(m.el,l||null),m},_e=f=>{let m=ge(n[o],f,r);return m!==n[o]&&(O(n[o],r),i.replaceChild(m.el,n[o].el)),l=m.el.nextSibling,o++,m},fe=(f=!1)=>{let m=n[o];if(typeof m!="number"){if(typeof m=="object"){if(l!==m.el){O(m,r),o++;return}f&&"key"in m?s.push(m.key,m):O(m,r)}if(typeof m=="string"||typeof m=="object"&&!m.override){let W=l;l=W.nextSibling,i.removeChild(W)}}o++},Oe=a.map(f=>{switch(typeof f){case"string":return typeof n[o]=="string"?(l.data!==f&&(l.data=f),l=l.nextSibling,o++):i.insertBefore(document.createTextNode(f),l||null),f;case"object":{if("el"in f)if(typeof n[o]=="object"&&f.el===n[o].el){let m=Fe(n[o],f,r);return!m.override&&m.el===l&&m.el instanceof Element&&m.el.getRootNode()===l.getRootNode()&&(l=l.nextSibling),o++,m}else{let m=Fe(null,f,r);return!m.override&&m.el instanceof Element&&m.el.parentNode===null&&i.insertBefore(m.el,l||null),m}if("key"in f)if(s.has(f.key)){let m=ge(s.shift(f.key),f,r);return i.insertBefore(m.el,l||null),m}else{for(;o<n.length&&n[o]!==E;){if(typeof n[o]=="object"&&f.key===n[o].key)return _e(f);fe(!0)}return R(f)}else return typeof n[o]=="object"&&!("el"in f)&&!("key"in n[o])?_e(f):R(f)}case"number":{for(;o<n.length&&n[o]!==f;)fe();return o++,E=c.pop(),s.stock.forEach(m=>m.forEach(W=>O(W,r))),s.stock.clear(),f}}});for(;o<n.length;)fe();Oe.length?e.children=Oe:delete e.children,n.length===0&&a.length>1&&e.el.append(i)}function T(e,t){return J(e,t)[0]}function J(e,t,r=e.length-1){for(let n=r;n>=0;n--)if(t in e[n])return[e[n][t],n];return[void 0,-1]}var D=class{constructor(t,r,n,a,i){this._key=t;this._value=r;this._index=n;this._entries=a;this._stack=i}get key(){return this._key}get value(){return this._value}get index(){return this._index}get size(){return this._entries.length}get isFirst(){return this._index===0}get isLast(){return this._index===this._entries.length-1}get parent(){return T(this._stack,"loop")}toJSON(){return{key:this._key,value:this._value,_index:this._index,size:this._entries.length,isFirst:this._index===0,isLast:this._index===this._entries.length-1}}};var ie=Symbol.for("Jito Ref");function M(e){return typeof e=="object"&&e!==null&&typeof e.type=="string"}function be(e){return typeof e=="object"&&e!==null&&e[ie]===!0}function se(e){return"tag"in e}var A=class{constructor(t,r,n=0,a=null){this.text=t;this.field=r;this.index=n;this.token=a}_next(t){let r=["",""];for(this.index=t;this.index<this.text.length;this.index++){let n=He(this.field,r[1]+this.text[this.index]);if(n==="other")return r;r[0]=n,r[1]=r[1]+this.text[this.index]}return r}skip(t=[]){t.unshift("other");let r="";if(!this.token)for(let n=this.index;n<this.text.length;n++)if(t.includes(He(this.field,this.text[n])))r+=this.text[n];else if(this.token=this._next(n),this.token&&this.token[0]==="partial")r+=this.token[1],n=this.index-1,this.token=null;else return r;return r}nextIs(t){return this.skip(),this.token?t?this.token[0]===t:this.token[0]:!1}pop(){this.skip();let t=this.token;return this.token=null,t||null}expand(t,r){let n=this.field;this.field=t,r(),this.token&&(this.index-=this.token[1].length,this.token=null),this.field=n}must(t){let r=this.pop();if(!r||r[0]!==t)throw Error(t+" is required.");return r}};function He(e,t){switch(e){case"html":switch(t){case">":case"<!--":case"/":case"{{":return t;case"&":case"&a":case"&am":case"&amp":case"&l":case"&lt":case"&g":case"&gt":case"&q":case"&qu":case"&quo":case"&quot":case"<":case"</":case"<!":case"<!-":case"{":return"partial";case"&amp;":case"&lt;":case"&gt;":case"&quot;":return"entity"}switch(!0){case/^\/\/.*$/.test(t):return"//";case/^<[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(t):return"start";case/^<\/[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(t):return"end"}break;case"attr":switch(t){case"@if":case"@else":case"@for":case"@each":return"@";case"=":case":=":case"&=":case"*=":return"assign";case">":case"/":case"'":case'"':return t;case":":case"&":case"*":return"partial"}switch(!0){case/^on[_\$\-a-zA-Z0-9]+$/.test(t):return"on";case/^[_\$\-@a-zA-Z0-9]+$/.test(t):return"name"}break;case"comment":switch(t){case"-->":return t;case"-":case"--":return"partial"}break;case"plane":switch(t){case"<":case"</":case"</s":case"</sc":case"</scr":case"</scri":case"</scrip":case"<\/script":return"partial";case"<\/script>":return"end"}break;case"script":switch(t){case"+":case"-":return"multi";case"void":case"typeof":case"~":case"!":return"unary";case"/":case"*":case"%":case"**":case"in":case"instanceof":case"<":case">":case"<=":case">=":case"==":case"!=":case"===":case"!==":case"<<":case">>":case">>>":case"&":case"|":case"^":case"&&":case"||":case"??":return"binary";case"=":case"*=":case"**=":case"/=":case"%=":case"+=":case"-=":case"<<=":case">>=":case">>>=":case"&=":case"^=":case"|=":case"&&=":case"||=":case"??=":return"assign";case"++":case"--":return"crement";case"false":case"true":return"boolean";case"null":case"undefined":case".":case"?.":case"[":case"]":case"{":case"}":case"(":case")":case"...":case"?":case":":case",":case"'":case'"':case"`":return t}switch(!0){case/^\/\/.*$/.test(t):return"//";case/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(t):return"word";case/^\d+\.?\d*$|^\.?\d+$/.test(t):return"number"}break;case"template":switch(t){case"$":return"partial";case"${":return t;case"}":return t;case"`":return"`";case"\r":case`
`:case`\r
`:return"other"}case"single":case"double":switch(t){case"\\":return"partial";case"\r":case`
`:case`\r
`:return"return";case`\\\r
`:return"escape";case"'":if(e==="single")return t;break;case'"':if(e==="double")return t;break}switch(!0){case/^\\u[0-9a-fA-F]{0,3}$/.test(t):case/^\\x[0-9a-fA-F]{0,1}$/.test(t):case/^\\u\{(0?[0-9a-fA-F]{0,5}|10[0-9a-fA-F]{0,4})$/.test(t):return"partial";case/^\\.$/.test(t):case/^\\u[0-9a-fA-F]{4}$/.test(t):case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(t):case/^\\x[0-9a-fA-F]{2}$/.test(t):return"escape"}break;case"text":switch(t){case"{":case"}":return"partial";case"{{":case"}}":return t}break}return"other"}function oe(e){switch(e){case"\\n":return`
`;case"\\r":return"\r";case"\\v":return"\v";case"\\t":return"	";case"\\b":return"\b";case"\\f":return"\f"}switch(!0){case/^\\u[0-9a-fA-F]{4}$/.test(e):case/^\\x[0-9a-fA-F]{2}$/.test(e):return String.fromCodePoint(parseInt(e.slice(2),16));case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(e):return String.fromCodePoint(parseInt(e.slice(3,-1),16))}return e.slice(1)}function d(e){let t=typeof e=="string"?new A(e,"script"):e;return ot(t)}function ot(e){let t=lt(e);if(e.nextIs("assign")){if(t.type!=="get")throw Error("The left operand is not variable");let r=e.pop()[1],n=d(e);return{type:"assign",operator:r,left:t.value,right:n}}else return t}function lt(e){let t=Ie(e);for(;e.nextIs("?");){e.pop();let r=d(e);e.must(":");let n=Ie(e);t={type:"if",condition:t,truthy:r,falsy:n}}return t}function Ie(e){let t=new Array;for(t.push(le(e));e.nextIs("multi")||e.nextIs("binary");)t.push(e.pop()[1]),t.push(le(e));for(;t.length>1;)for(let r=0;r+1<t.length;r+=2)if(r+3>=t.length||Ne(t[r+1])>Ne(t[r+3])){let n={type:"binary",operator:t[r+1],left:t[r],right:t[r+2]};t.splice(r,3,n)}return typeof t[0]=="string"?{type:"variable",name:t[0]}:t[0]}function Ne(e){switch(e){default:return 0;case"||":case"??":return 4;case"&&":return 5;case"|":return 6;case"^":return 7;case"&":return 8;case"==":case"!=":case"===":case"!==":return 9;case"in":case"instanceof":case"<":case">":case"<=":case">=":return 10;case"<<":case">>":case">>>":return 11;case"+":case"-":return 12;case"*":case"/":case"%":return 13;case"**":return 14}}function le(e){switch(e.nextIs()){case"multi":case"unary":return{type:"unary",operator:e.pop()[1],operand:le(e)};case"crement":return{type:"assign",operator:e.pop()[1].charAt(0)+"=",left:le(e).value,right:{type:"literal",value:1}};default:return pt(e)}}function pt(e){let t=ct(e);return e.nextIs("crement")?{type:"assign",operator:e.pop()[1].charAt(0)+"=",left:t.value,right:{type:"literal",value:1},prevalue:!0}:t}function ct(e){let t=ut(e);for(;;){switch(e.nextIs()){case"(":{e.pop();let r=[];for(;!e.nextIs(")")&&(r.push(d(e)),e.nextIs(","));)e.pop();e.must(")"),t={type:"function",name:t,params:r};continue}case".":{e.pop();let r=e.must("word");t={type:"get",value:{type:"hash",object:t,key:{type:"literal",value:r[1]}}};continue}case"[":{e.pop();let r=d(e);e.must("]"),t={type:"get",value:{type:"hash",object:t,key:r}};continue}}break}return t}function ut(e){let t=e.pop();switch(t[0]){case"word":return{type:"get",value:{type:"variable",name:t[1]}};case"number":return{type:"literal",value:Number(t[1])};case"boolean":return{type:"literal",value:t[1]==="true"};case"undefined":return{type:"literal",value:void 0};case"null":return{type:"literal",value:null};case'"':return K(e,"double",t[0]);case"'":return K(e,"single",t[0]);case"`":return K(e,"template",t[0]);case"(":{let r=d(e);return e.must(")"),r}case"[":{let r=[];for(;!e.nextIs("]");)if(r.push(d(e)),e.nextIs(","))e.pop();else if(e.nextIs("]")){e.pop();break}else throw Error("']' is required");return{type:"array",values:r}}case"{":{let r=[];for(;!e.nextIs("}");){let n=Array(2),a=e.pop();if(a[0]==="word"?n[0]={type:"literal",value:a[1]}:a[0]==='"'?n[0]=K(e,"double",a[0]):a[0]==="'"?n[0]=K(e,"single",a[0]):a[0]==="["&&(n[0]=d(e),e.must("]")),a[0]==="word"&&(e.nextIs(",")||e.nextIs("}"))?n[1]={type:"get",value:{type:"variable",name:a[1]}}:(e.must(":"),n[1]=d(e)),r.push(n),e.nextIs(","))e.pop();else if(e.nextIs("}")){e.pop();break}else throw Error("'}' is required")}return{type:"object",entries:r}}default:throw new Error(t[0]+" is invalid")}}function K(e,t,r){let n=[""],a=0;return e.expand(t,()=>{e:for(;;){n[a]+=e.skip();let i=e.pop();switch(i[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n[a]+=oe(i[1]);continue;case"${":e.expand("script",()=>{n.push(d(e))}),e.must("}"),n.push(e.skip()),a+=2}}}),a===0?{type:"literal",value:n[0]}:{type:"join",values:n.filter(i=>i!==""),separator:""}}function F(e){switch(e){case"html":case"base":case"head":case"link":case"meta":case"style":case"title":case"body":case"address":case"article":case"aside":case"footer":case"header":case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":case"main":case"nav":case"section":case"blockquote":case"dd":case"div":case"dl":case"dt":case"figcaption":case"figure":case"hr":case"li":case"ol":case"p":case"pre":case"ul":case"a":case"abbr":case"b":case"bdi":case"bdo":case"br":case"cite":case"code":case"data":case"dfn":case"em":case"i":case"kbd":case"mark":case"q":case"rp":case"rt":case"ruby":case"s":case"samp":case"small":case"span":case"strong":case"sub":case"sup":case"time":case"u":case"var":case"wbr":case"area":case"audio":case"img":case"map":case"track":case"video":case"embed":case"iframe":case"object":case"param":case"picture":case"portal":case"source":case"svg":case"math":case"canvas":case"noscript":case"script":case"del":case"ins":case"caption":case"col":case"colgroup":case"table":case"tbody":case"td":case"tfoot":case"th":case"thead":case"tr":case"button":case"datalist":case"fieldset":case"form":case"input":case"label":case"legend":case"meter":case"optgroup":case"option":case"output":case"progress":case"select":case"textarea":case"details":case"dialog":case"menu":case"summary":case"slot":case"template":return!0}return!1}function $e(e){switch(e){case"br":case"hr":case"img":case"input":case"meta":case"area":case"base":case"col":case"embed":case"keygen":case"link":case"param":case"source":return!0}return!1}function pe(e){let t=typeof e=="string"?new A(e,"html"):e,r={text:P(t)};for(;t.nextIs("<!--");)t.pop(),t.expand("comment",()=>t.must("-->")),r.text+=P(t);return t.nextIs("start")&&(r.next=mt(t)),r.text?r:r.next?r.next:void 0}function P(e){let t=e.skip([">","/","}}"]);if(e.nextIs("entity"))switch(e.pop()[1]){case"&amp;":return t+"&"+P(e);case"&lt;":return t+"<"+P(e);case"&gt;":return t+">"+P(e);case"&quot;":return t+'"'+P(e)}return e.nextIs("{{")?(t+=e.pop()[1],e.expand("text",()=>{t+=e.skip(["{{"]),t+=e.must("}}")[1]}),t+P(e)):t}function mt(e){let t={tag:e.pop()[1].slice(1).toLocaleLowerCase()},r=ft(e);if(r.length&&(t.attrs=r),e.nextIs("/"))e.pop(),e.must(">");else if($e(t.tag))e.must(">");else{if(e.must(">"),t.tag!=="script"){let a=pe(e);a&&(t.child=a)}else e.expand("plane",()=>e.nextIs("end"));if(e.must("end")[1].slice(2)!==t.tag)throw Error(`end tag <${t.tag}> is required.`);e.must(">")}let n=pe(e);return n&&(t.next=n),t.tag==="script"?t.next?t.next:void 0:t}function ft(e){let t=[];return e.expand("attr",()=>{for(e.skip();e.nextIs()&&!e.nextIs(">");){let r=new Array(3);if(e.nextIs("name"))if(r[0]=e.pop()[1],e.nextIs("assign"))r[1]=e.must("assign")[1];else if(e.nextIs("name")||e.nextIs(">")||e.nextIs("/"))r[1]="=",r[2]=r[0];else throw Error("assign is required.");else{if(e.nextIs("on"))r[0]=e.pop()[1],r[1]="on";else if(e.nextIs("@"))r[0]=e.pop()[1],r[1]="@";else break;if(r[0]==="@else")r[2]=r[0];else if(e.must("assign")[1]!=="=")throw Error("= is required.")}r[2]===void 0&&(e.nextIs('"')?r[2]=ze(e,"double",e.pop()[0]):e.nextIs("'")&&(r[2]=ze(e,"single",e.pop()[0]))),t.push(r),e.skip()}}),t}function ze(e,t,r){let n="";return e.expand(t,()=>{e:for(;;){n+=e.skip();let a=e.pop();switch(a[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n+=oe(a[1]);continue}}}),n}function x(e){let t=pe(e),r=t?ve(t):[];return r.length?{type:"tree",children:r}:{type:"tree"}}var Ee=class{constructor(t){this.node=t}isSkippable(t){for(let r=this.node;r;r=r.next){if(se(r))return Re(r,t);if(!/^\s*$/.test(r.text))return!1}return!1}skip(){for(;;){if(se(this.node))return this;this.node=this.node.next}}pop(){let t=this.node;return this.node=this.node?.next,t}};function ve(e){let t=new Ee(e),r=[];for(;t.node;){let n=dt(t);n!==void 0&&r.push(n)}return r}function dt(e){if(!e.node)e.pop();else return se(e.node)?De(e):gt(new A(e.pop().text,"text"))}function ht(e){return De(e)}function De(e){let t=e.node;if(Re(t,"@for")){let r=xe(t,"@each")||void 0,n=d(xe(t,"@for"));return{type:"for",each:r,array:n,value:Ge(e)}}else return Ge(e)}function Ge(e){let t=e.node;if(Re(t,"@if")){let r=d(xe(t,"@if")),n=Je(t);e.pop();let a={type:"if",condition:r,truthy:n};return e.isSkippable("@else")&&(a.falsy=ht(e.skip())),a}else return Je(e.pop())}function Je(e){if(e.tag==="group"){let t={type:"group"};if(e.attrs?.forEach(([r,,n])=>{r.match(/^@(if|else|for|each)$/)||r.match(/^@.*$/)&&(t.attrs||(t.attrs={}),t.attrs[r]=n)}),e.child){let r=ve(e.child);r.length&&(t.children=r)}return t}else return Tt(e)}function Tt(e){let t={type:"element",tag:e.tag};{let r=[];e.attrs?.forEach(([n,a,i])=>{switch(a){case"=":{switch(n){case"is":{n in t||(t.is=i);return}case"class":case"part":return(t[n]??=[]).push(i.split(/\s+/));case"style":return r.push(i)}return n in(t.attrs??={})?void 0:t.attrs[n]=i}case":=":{switch(n){case"is":return t.is=d(i);case"class":case"part":return(t[n]??=[]).push({type:"flags",value:d(i)});case"style":return r.push(d(i))}return(t.attrs??={})[n]=d(i)}case"*=":{let s=d(i);return M(s)&&s.type==="get"&&(s=s.value),(t.attrs??={})[n]=s}case"on":{let s=n.slice(2),o={type:"handler",value:d(i)};return((t.on??={})[s]??=[]).push(o)}}}),r.length&&(r.length===1&&typeof r[0]=="string"?t.style=r[0]:t.style={type:"join",values:r.filter(n=>n!==""),separator:";"}),e.attrs?.forEach(([n,a,i])=>{a==="&="&&((t.bools??={})[n]=d(i),t.attrs&&(delete t.attrs[n],Object.keys(t.attrs).length||delete t.attrs))})}if(e.child){let r=ve(e.child);r.length&&(t.children=r)}return(!F(t.tag)||t.is)&&(t.type="custom"),t}function Re(e,t){return e.attrs?.some(r=>r[0]===t)}function xe(e,t){let r=e.attrs?.find(n=>n[0]===t);return r?r[2]:""}function gt(e){let t=[];for(t.push(e.skip());e.nextIs();)e.nextIs("{{")?(e.pop(),e.expand("script",()=>{t.push({type:"draw",value:d(e)})}),e.must("}}"),t.push(e.skip())):e.pop();return t.length===1&&typeof t[0]=="string"?t[0]:{type:"flat",values:t}}var we=new Array,p=function(e,t=[],r={}){let n=e;switch(n.type){case"literal":return n.value;case"array":return n.values.map(a=>p(a,t,r));case"object":return Object.fromEntries(n.entries.map(a=>a.map(i=>p(i,t))));case"variable":{let[,a]=J(t,n.name);return a>=0?{record:t[a],key:n.name,[ie]:!0}:void 0}case"unary":return kt(n.operator,p(n.operand,t,r));case"binary":{let a=p(n.left,t,r);return Ke(n.operator,a)?qe(n.operator,a,p(n.right,t,r)):a}case"assign":{let a=p(n.left,t,r);if(!a)throw Error(n.left?n.left.name:"key is not defined");let{record:i,key:s}=a;if(typeof i=="function"||i===Object)throw Error("Cannot assign to this object");if(s==="__proto__")throw Error("Cannot assign to "+s);let o=i[s];if(typeof o=="function")throw Error("Cannot assign to function");let l=p(n.right,t,r);if(n.operator.length>1){let c=n.operator.slice(0,-1);Ke(c,o)&&(i[s]=qe(c,o,l))}else i[s]=l;return n.prevalue?o:i[s]}case"function":{if(n.name.type==="get"&&n.name.value.type==="hash"){let a=p(n.name.value,t,r);if(!a)throw Error(p(n.name.value.key,t,r)+" is not defined");switch(a.key){case"__defineGetter__":case"__defineSetter__":throw Error("Cannot get "+a.key)}let i=a.record[a.key];if(typeof i=="function")return i.apply(a.record,n.params.map(s=>p(s,t,r)))}else{let a=p(n.name,t,r);if(typeof a=="function")return a(...n.params.map(i=>p(i,t,r)))}throw Error(n.name.toString()+" is not a function")}case"hash":return{record:p(n.object,t,r),key:p(n.key,t,r),[ie]:!0};case"get":{let a=p(n.value,t,r);if(a){if(a.key==="__proto__")throw Error("Cannot get "+a.key);return a.record[a.key]}else return a}case"flat":{let a=n.values.flatMap(i=>typeof i=="string"?[i]:Ce(p(i,t,r))).filter(i=>i!=="").reduce((i,s)=>{let o=i.length;return o&&typeof s=="string"&&typeof i[o-1]=="string"?i[o-1]+=s:i.push(s),i},[]);return a.length===1&&typeof a[0]=="string"?a[0]:a}case"draw":{let a=p(n.value,t,r);if(typeof a=="object")if(M(a))if(a.type==="tree"){a.type="group";let i=p(a,t,r);return a.type="tree",i}else return p(a,t,r);else return Object.getPrototypeOf(a)===Object.prototype?JSON.stringify(a):"";else return a==null?"":a+""}case"join":return n.values.reduce((a,i,s)=>{if(M(i)){let o=p(i,t,r);return a+(s?n.separator:"")+(typeof o=="object"?"":o)}else return a+(s?n.separator:"")+i},"");case"flags":{let a=p(n.value,t,r);if(typeof a=="string")return a.split(/\s+/);if(typeof a=="object"){if(Array.isArray(a))return a;if(a)return Object.keys(a).filter(i=>a[i])}return[]}case"if":return p(n.condition,t,r)?p(n.truthy,t,r):n.falsy?p(n.falsy,t,r):null;case"for":{let a=p(n.array,t,r),i;if(typeof a=="object"&&a!==null)if(Symbol.iterator in a)if("entries"in a)i=[...a.entries()];else{let s=0;i=[];for(let o of a)i.push([s++,o])}else i=Object.entries(a);else i=[[0,a]];return i.flatMap(([s,o],l)=>{let c=new D(s,o,l,i,t),E=Ce(p(n.value,t.concat([n.each?{[n.each]:o,loop:c}:{loop:c}]),r)).filter(R=>typeof R!="number");return typeof c.value=="object"&&E.filter(R=>typeof R=="object").forEach(R=>R.key=c.value),E})}case"tree":{let a=H(n,t,r);return a.length?{children:a}:{}}case"custom":{let a=we.find(i=>i.match(n,t,r))?.exec(n,t,r);if(a)return a}case"element":{let a=H(n,t,r),s=a.length?{children:a}:{};return s.tag=n.tag,n.is&&(s.is=typeof n.is=="string"?n.is:p(n.is,t,r)),j(n,t,r,s),s}case"group":return H(n,t,r);case"handler":{r.handler||(r.handler=new WeakMap),r.handler.has(n)||r.handler.set(n,[]);let a=r.handler.get(n);for(let s of a)if(Ue(s[0],t))return s[1];let i=s=>p(n.value,[...t,{event:s}],r);return a.push([t,i]),i}case"evaluation":return p(n.value,t,r);default:return we.find(a=>a.match(e,t,r))?.exec(e,t,r)}};p.plugin=e=>{we.unshift(e)};var yt={match(e,t,r){if(e.type==="custom"){let n=e;if(!F(n.tag))return n.tag==="window"||T(t,n.tag)instanceof EventTarget}return!1},exec(e,t,r){let n=e;if(e.tag==="window"){let s={el:window,override:!0,invalid:{attrs:!0,children:!0}};return j(n,t,r,s),s}let a=T(t,n.tag),i={el:a};return j(n,t,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),(a instanceof Element||a instanceof DocumentFragment||a instanceof ShadowRoot)&&n.children&&n.children.length?i.children=H(n,t,r):i.invalid={children:!0},i}};p.plugin(yt);function H(e,t,r){let n=e.children||[],a=0;n.length&&((r.groups??(r.groups=[new WeakMap,0]))[0].has(e)?a=r.groups[0].get(e):(a=r.groups[1]=r.groups[1]+n.length,r.groups[0].set(e,a)));let i=n.flatMap((s,o)=>{if(M(s)){let l=Ce(p(s,t,r));switch(s.type){case"if":case"for":case"group":l.push(a-o)}return l}else return[s]});return typeof i[i.length-1]=="number"&&i.pop(),i}function j(e,t,r,n){if(e.style&&(n.style=typeof e.style=="string"?e.style:p(e.style,t,r)),e.bools){for(let a in e.bools)if(!a.startsWith("@")){let i=e.bools[a],s=typeof i=="string"?i:p(i,t,r);s&&((n.attrs??(n.attrs={}))[a]=s)}}if(e.attrs){for(let a in e.attrs)if(!a.startsWith("@")){let i=e.attrs[a];(n.attrs??(n.attrs={}))[a]=typeof i=="string"?i:p(i,t,r)}}if(e.class&&e.class.forEach(a=>n.class=(n.class||[]).concat(Array.isArray(a)?a:p(a,t,r))),e.part&&e.part.forEach(a=>n.part=(n.part||[]).concat(Array.isArray(a)?a:p(a,t,r))),e.on){n.on||(n.on={});for(let a in e.on)n.on[a]=e.on[a].map(i=>p(i,t,r))}}function Ue(e,t,r=e.length-1,n=t.length-1){let[a,i]=J(e,"loop",r),[s,o]=J(t,"loop",n);return!a&&!s?!0:!a||!s?!1:a.index===s.index&&a.key===s.key&&a.value===s.value&&Ue(e,t,i-1,o-1)}function Ce(e){return e==null?[]:Array.isArray(e)?e:[e]}function kt(e,t){switch(e){case"void":return;case"typeof":return typeof t;case"+":return+t;case"-":return-t;case"~":return~t;case"!":return!t;default:throw Error(e+" does not exist")}}function Ke(e,t){switch(e){case"&&":return!!t;case"||":return!t;case"??":return t==null;default:return!0}}function qe(e,t,r){switch(e){case"+":return t+r;case"-":return t-r;case"/":return t/r;case"*":return t*r;case"%":return t%r;case"**":return t**r;case"in":return t in r;case"instanceof":return t instanceof r;case"<":return t<r;case">":return t>r;case"<=":return t<=r;case">=":return t>=r;case"==":return t==r;case"!=":return t!=r;case"===":return t===r;case"!==":return t!==r;case"<<":return t<<r;case">>":return t>>r;case">>>":return t>>>r;case"&":return t&r;case"|":return t|r;case"^":return t^r;case"&&":return t&&r;case"||":return t||r;case"??":return t??r;default:throw Error(e+" does not exist")}}var q=Symbol.for("Jito Special");function g(e){return typeof e=="object"&&e!==null&&(e.template||e.patcher)&&e.main&&e.options}function ce(e){return typeof e=="object"&&e!==null&&"default"in e&&e[Symbol.toStringTag]==="Module"}function ue(e,t,r={children:[]}){return e.children&&(e.children=e.children.filter(n=>{if(typeof n=="object"){if(t(n))return r.children.push(n),!1;"tag"in n&&ue(n,t,r)}return!0}),e.children.length||delete e.children),r.children.length?r:{}}function me(...e){let t={children:[]};return e.forEach(r=>{r&&r.children&&(t.children=t.children.concat(r.children))}),t.children.length?t:{}}var We=Object.freeze({alert,console,Object:Object.freeze({entries:Object.entries,fromEntries:Object.fromEntries,hasOwn:Object.hasOwn,is:Object.is,keys:Object.keys,values:Object.values}),Number,Math,Date,Array,JSON,String,isNaN,isFinite,location,history,navigator,setTimeout});var b=class{constructor(t,r,n){this._attrs={};this._refs={};this._requirePatch=!1;let a=n.el;this._component=t,this._template=t.template,this._patcher=t.patcher,this._host=r,this._tree=n,this._updater=new Ae(n),this.patch=this.patch.bind(this),this.dispatch=this.dispatch.bind(this),this._cache={[q]:[r,a]},this._component.options.mode==="closed"&&a.addEventListener(w.patch,s=>s.stopPropagation()),r.addEventListener(w.destroy,()=>{this.patch({type:"tree"}),$(this._stack,this.patch)});let i=typeof this._component.main=="function"?this._component.main(this):this._component.main;this._ready=(async()=>{let s=await i,o=s?Array.isArray(s)?s:[s]:[];this._stack=[We,{host:r,root:a},S(this._attrs),...o],de(this._stack,this.patch),this.patch(),o.forEach(l=>{if(typeof l=="object"&&l!==null){for(let c in l)if((typeof l[c]=="function"||l[c]instanceof Element)&&isNaN(c)&&!(c in this._host)){let E=typeof l[c]=="function"?l[c].bind(this):l[c];Object.defineProperty(this._host,c,{get(){return E}})}}})})()}setAttr(t,r){switch(t){case"is":case"class":case"part":case"style":return;default:if(this._attrs[t]!==r){if(t in this._refs){let a=this._refs[t][0];if(be(r)&&r.record===a.record)return;Z(this._attrs,t,this._refs[t][1]),Z(a.record,a.key,this._refs[t][2]),delete this._refs[t]}if(be(r)){let a=s=>{r.record[r.key]=s},i=s=>{this._attrs[t]=s};this._refs[t]=[r,a,i],S(this._attrs,t,a),S(r.record,r.key,i),Q(this._attrs,t,r.record[r.key])}else Q(this._attrs,t,r)}}}get component(){return this._component}get host(){return this._host}get root(){return this._tree.el}get attrs(){return this._attrs}get ready(){return()=>this._ready}patch(t){t&&(typeof t=="function"?(this._patcher=t,this._template=void 0):(this._patcher=void 0,this._template=typeof t=="string"?x(t):t)),this._requirePatch||(this._requirePatch=!0,setTimeout(()=>{if(this._requirePatch=!1,this._stack){let r=this._patcher?this._patcher(this._stack):this._template?p(this._template,this._stack,this._cache):this._tree&&this._component.template?p(this._component.template,this._stack,this._cache):void 0;r&&this._updater.patch(r)}}))}dispatch(t,r=null){this._host.dispatchEvent(new CustomEvent(t,{detail:r}))}toJSON(){return{component:this._component,attrs:this._attrs,tree:this._tree}}};function bt(e){return"tag"in e&&(e.tag==="style"||e.tag==="link")}function Be(e){return e.tag==="link"&&e.attrs?.href!==""&&(e.attrs?.rel).toLocaleLowerCase()==="stylesheet"}var Ae=class{constructor(t){this.tree=t;this._waitUrls=new Set;this.loaded=t=>{this.removeWaitUrl(t.target.getAttribute("href"))}}patch(t){let r=ue(t,bt),n=t,a=this.header?.children?.filter(Be)||[],i=r.children?.filter(Be)||[],s=i.filter(l=>a.every(c=>c.attrs?.href!==l.attrs?.href)),o=a.filter(l=>i.every(c=>c.attrs?.href!==l.attrs?.href));i.forEach(l=>{((l.on??={}).load??=[]).includes(this.loaded)||l.on.load.push(this.loaded),(l.on.error??=[]).includes(this.loaded)||l.on.error.push(this.loaded)}),s.forEach(l=>{this.addWaitUrl(l.attrs?.href),l.new=!0}),o.forEach(l=>this.removeWaitUrl(l.attrs?.href)),o.length?G(this.tree,me(this.header,r,this.body),!1):G(this.tree,me(r,this.body),!1),s.forEach(l=>l.new=!1),this.header=r,this.update=()=>{G(this.tree,me(this.header,n)),ue(n,l=>(delete l.new,!1)),this.body=n}}set update(t){this._update=t,this._executeUpdate()}addWaitUrl(t){this._waitUrls.add(t)}removeWaitUrl(t){this._waitUrls.delete(t),this._executeUpdate()}_executeUpdate(){!this._waitUrls.size&&this._update&&(this._update(),this._update=void 0)}};var v="jito-element",y=class extends HTMLElement{constructor(){super()}setAttr(r,n){this._entity?.setAttr(r,n)}static getComponent(){}loadAttrs(){this.hasAttributes()&&this.getAttributeNames().forEach(r=>{this.setAttr(r,this.getAttribute(r))})}ready(){return this._entity?this._entity.ready():new Promise(r=>{this._run=r})}_setEntity(r){this._entity=r,this._run&&this._entity.ready().then(this._run)}get entity(){return this._entity}get attributes(){return Et(super.attributes,this.setAttr)}setAttribute(r,n){this.setAttr(r,n),super.setAttribute(r,n)}getAttributeNode(r){let n=super.getAttributeNode(r);return n&&Ze(n,this.setAttr)}removeAttribute(r){return this.setAttr(r,void 0),super.removeAttribute(r)}removeAttributeNode(r){return this.setAttr(r.name,void 0),super.removeAttributeNode(r)}toJSON(){return{entity:this._entity}}},Le=class extends y{constructor(){super()}setAttr(t,r){if(t==="component")switch(typeof r){case"string":{let n=customElements.get(r);if(n&&y.isPrototypeOf(n)){let a=n.getComponent();if(a){let i=C(this.attachShadow(a.options));this._setEntity(new b(a,this,i))}}else throw Error(r+" is not a component.");break}case"object":if(g(r)){let n=C(this.attachShadow(r.options));this._setEntity(new b(r,this,n))}else if(r!==null)throw Error("The object is not a component.");break}super.setAttr(t,r)}};customElements.get(v)||customElements.define(v,Le);function Ze(e,t){return new Proxy(e,{set(r,n,a){if(t(n,a),n==="value")return r.value=a}})}function Et(e,t){return new Proxy(e,{get:function(r,n){return n==="length"?r[n]:Ze(r[n],t)}})}async function xt(e,t){let r;if(typeof e=="string")r=document.createElement(e);else{r=document.createElement(v);let n=await Promise.resolve(e),a=ce(n)&&g(n.default)?n.default:n;r.setAttribute("component",a)}if(t)for(let n in t)r.setAttribute(n,t[n]);if(typeof e=="string"){let n=customElements.get(e);n!==void 0&&Object.prototype.isPrototypeOf.call(y,n)&&await r.ready()}else await r.ready();return r}var Qe={match(e,t,r){if(e.type==="custom"){if(e.tag===v)return!0;let n=e,a=T(t,n.tag);if(typeof a=="object"&&a!==null&&(g(a)||ce(a)&&g(a.default)))return!0;{let i=customElements.get(n.tag);return i!==void 0&&Object.prototype.isPrototypeOf.call(y,i)}}return!1},exec(e,t,r){let n=e,a={tag:v},i;return n.tag!==v&&(i=T(t,n.tag),i?(a.attrs??={}).component=i:a.tag=n.tag),et(n,t,r,a),j(n,t,r,a),n.tag===v&&(i=a.attrs?.component,(a.attrs??={}).component=i),typeof i=="object"&&i!==null&&"default"in i&&i[Symbol.toStringTag]==="Module"&&g(i.default)&&(i=i.default,(a.attrs??={}).component=i),n.cache!==i&&(a.new=!0),n.cache=i,a}},Xe={match(e,t,r){if(e.type==="custom"){let n=T(t,e.tag);return typeof n=="object"&&n!==null&&n instanceof y}return!1},exec(e,t,r){let n=e,a=T(t,n.tag),i={el:a};return et(n,t,r,i),j(n,t,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),n.children&&n.children.length?i.children=H(n,t,r):i.invalid={children:!0},i}},Ye={match(e,t,r){if(e.type==="custom"&&q in r&&!F(e.tag)){let n=T(t,e.tag);return r[q].some(a=>a===n)}return!1},exec(e,t,r){let a={el:T(t,e.tag)||ShadowRoot,override:!0,invalid:{attrs:!0,children:!0}};return j(e,t,r,a),a}};function et(e,t,r,n){let a=[],i=[],s=(e.children||[])?.flatMap(o=>{if(typeof o!="string"){let l=o;if(l.attrs){if(l.attrs["@as"])return i.push([l.attrs["@as"],l]),[];if(l.attrs.slot)return[p(o,t,r)]}}return a.push(o),[]});a.length&&i.push(["content",{type:"group",children:a}]),i.length&&(n.attrs||(n.attrs={}),i.forEach(([o,l])=>{n.attrs[o]={type:"evaluation",value:l,stack:t}})),s.length&&(n.children=s)}p.plugin(Qe);p.plugin(Ye);p.plugin(Xe);function U(e,t=[]){let r={main:typeof t=="function"||Array.isArray(t)?t:[t],options:{mode:"open"}};return typeof e=="function"?r.patcher=e:r.template=typeof e=="string"?x(e):e,Te(r)}function vt(e,t,r=[]){let n=g(t)?t:U(t,r);if(n.options.localeOnly)throw Error("This componet is local only.");customElements.define(e,class extends y{constructor(){super();let a=C(this.attachShadow(n.options));this._setEntity(new b(n,this,a)),this.innerHTML&&Se(x(this.innerHTML)).forEach(([s,o])=>{this.entity.setAttr(s,o)}),this.loadAttrs()}static getComponent(){return n}})}function Se(e){let t=[],r=[];return(e.children||[])?.flatMap(n=>{if(typeof n!="string"){let a=n;if(a.attrs){if(a.attrs["@as"])return r.push([a.attrs["@as"],a]),[];if(a.attrs.slot)return[p(n)]}}return t.push(n),[]}),t.length&&r.push(["content",{type:"group",children:t}]),r}function Rt(e,t,r=[]){let n=typeof e=="string"?document.querySelector(e):e,a=g(t)?t:U(t,r);if(a.options.localeOnly)throw Error("This componet is local only.");let i=C(n.attachShadow(a.options)),s=new b(a,n,i);n.innerHTML&&Se(x(n.innerHTML)).forEach(([l,c])=>{s.setAttr(l,c)}),n.hasAttributes()&&n.getAttributeNames().forEach(o=>{s.setAttr(o,n.getAttribute(o))})}function wt(e,t={}){return e.options=Object.freeze({mode:"closed",...t}),Object.freeze(e)}export{y as ComponentElement,b as Entity,D as Loop,Q as change,U as compact,vt as define,O as destroy,xt as elementize,p as evaluate,w as eventTypes,d as expression,C as load,Te as lock,Rt as mount,x as parse,G as patch,T as pickup,de as reach,nt as receive,wt as seal,at as unlock,$ as unreach,Z as unwatch,S as watch};
