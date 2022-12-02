var c=Symbol.for("Jito Reactive"),I=Symbol.for("Jito Lock"),h=Symbol.for("Jito Recursive"),A=Symbol.for("Jito Array");function k(e){return typeof e=="object"&&e!==null&&(Object.getPrototypeOf(e)===Object.prototype||Array.isArray(e))&&!Object.isFrozen(e)&&!e[I]}function de(e,t){return j(e,[],!1,t),e}function j(e,t,r,n){if(k(e)&&!t.includes(e)){t.push(e),r&&Z(e),n&&c in e&&e[c][h][1].add(n);for(let a in e)j(e[a],t,r,n);t.pop()}return e}function Q(e,t,r){return k(e)&&(t===void 0?N(e,[],!0):r?(et(e,t,r),he(e)):N(e,[],!0,t)),e}function he(e){if(c in e){let t=e;if(!t[c][h][1].size){let r=!1;for(let n in t)t[c][n][1].size>1&&(r=!0);if(!r){for(let n in t[c])Object.defineProperty(t,n,{enumerable:!0,configurable:!0,writable:!0,value:t[c][n][0]}),delete t[c][n];Array.isArray(t)&&(delete t.unshift,delete t.push,delete t.splice,delete t.pop,delete t.shift,delete t.sort,delete t.reverse,delete t.copyWithin),delete t[c]}}}}function et(e,t,r){t in e[c]&&e[c][t][1].forEach(n=>{n[1]===r&&e[c][t][1].delete(n)})}function $(e,t){return N(e,[],!1,t)}function N(e,t,r,n){if(k(e)&&!t.includes(e)){if(t.push(e),e[c]){let a=e;if(n)a[c][h][1].delete(n);else{a[c][h][1].clear();for(let i in a)a[c][i][1].clear()}}for(let a in e)N(e[a],t,r,n);r&&he(e),t.pop()}return e}function L(e,t,r){return k(e)&&(t===void 0?j(e,[],!0):r?(j(e,[],!0),S(e,t,["spy",r])):j(e,[],!0,t)),e}function Z(e){if(!(c in e)){let t=new Set,r=()=>{t.forEach(a=>a())},n=["bio",r];if(e[c]={[h]:[n,t]},Array.isArray(e)){let a=e[c][A]=e.slice(),i=o=>(r(),o),s=o=>{let l=e[c][A].length;if(e.length<l)for(let u=e.length;u<l;u++)S(e,u);return e.length=l,i(o)};Object.defineProperties(e,{unshift:{get(){return(...o)=>s(Array.prototype.unshift.call(a,...o.map(l=>z(e,l))))}},push:{get(){return(...o)=>s(Array.prototype.push.call(a,...o.map(l=>z(e,l))))}},splice:{get(){return(o,l,...u)=>s(l===void 0?Array.prototype.splice.call(a,o,a.length-o):Array.prototype.splice.apply(a,[o,l,...u.map(E=>z(e,E))]))}},pop:{get(){return()=>s(Array.prototype.pop.call(a))}},shift:{get(){return()=>s(Array.prototype.shift.call(a))}},sort:{get(){return o=>i(o===void 0?Array.prototype.sort.call(a):Array.prototype.sort.call(a,o))}},reverse:{get(){return()=>i(Array.prototype.reverse.call(a))}},copyWithin:{get(){return(o,l,u)=>i(Array.prototype.copyWithin.call(a,o,l!==void 0?l:0,u!==void 0?u:a.length))}}})}}if(c in e){let t=e[c][h][0];for(let r in e)S(e,r,t)}}function S(e,t,r){if(!Array.isArray(e)||typeof t!="number"&&isNaN(t)){if(t in e[c]||(e[c][t]=[e[t],new Set],Object.defineProperty(e,t,{get(){return this[c][t][0]},set(n){tt(this,this[c][t],n)}})),r){for(let n of e[c][t][1])if(n[1]===r[1])return;e[c][t][1].add(r)}}else{let n=Object.getOwnPropertyDescriptor(e,t);(!n||"value"in n)&&t in e[c][A]&&Object.defineProperty(e,t,{get(){return this[c][A][t]},set(a){let i=this[c][A][t];i!==a&&(z(this,a),Oe(this,i),this[c][A][t]=a,e[c][h][0][1]())},configurable:!0,enumerable:!0})}}function z(e,t){return L(t),e[c][h][1].forEach(r=>L(t,r)),t}function Oe(e,t){return e[c][h][1].forEach(r=>$(t,r)),t}function tt(e,t,r){let n=t[0];t[0]=r,n!==r&&(z(e,r),Oe(e,n),t[1].forEach(a=>{switch(a[0]){case"bio":a[1]();break;case"bom":t[1].delete(a);case"spy":a[1](r,n);break}}))}async function rt(e,...t){if(k(e)){Z(e);let r=Array.isArray(t[0])?t.flatMap(a=>a):t,n=await Promise.all(r.map(a=>e[a]===void 0?new Promise(i=>{S(e,a,["bom",i])}):e[a]));return Object.fromEntries(r.map((a,i)=>[a,n[i]]))}return{}}function X(e,t,r){if(typeof e=="object"&&e!==null){if(!(t in e)&&c in e){let n=e;n[t]=void 0,S(n,t,n[c][h][0])}e[t]=r}return r}function Te(e){return e[I]=!0,e}function nt(e){return delete e[I],e}var Y=Symbol.for("Jito Event Types");var Pe="destroy",je="patch";Y in window||Object.defineProperty(window,Y,{value:Object.seal({get destroy(){return Pe},set destroy(e){Pe=e},get patch(){return je},set patch(e){je=e}})});var R=window[Y];function w(e){let t={el:e};return Ve(t),t}function at(e){let t={tag:e.tagName.toLowerCase(),el:e};return it(t),Ve(t),t}function it(e){if(e.el.hasAttributes()){let t={};e.el.getAttributeNames().forEach(r=>{if(r.startsWith("on"))return;let n=e.el.getAttribute(r);switch(r){case"class":case"part":return e[r]=n.split(/\s+/);case"style":case"is":return e[r]=n;default:return t[r]=n}}),Object.keys(t).length&&(e.attrs=t)}}function Ve(e){if(e.el.hasChildNodes()){let t=e.el.childNodes;e.children=[];for(let r=0;r<t.length;r++)switch(t[r].nodeType){case 1:if(t[r].tagName==="SCRIPT")break;e.children.push(at(t[r]));break;case 3:e.children.push(t[r].data);break}}}function _(e,t=!0){if(!e.invalid?.children&&e.el instanceof Node){e.children?.forEach(n=>typeof n=="object"&&_(n,t));let r=e.el;for(;r.firstChild;)r.removeChild(r.firstChild)}t&&e.tag&&e.el.dispatchEvent(new CustomEvent(R.destroy,{bubbles:!1})),e.invalid?.on||ae(e,{}),!e.invalid?.attrs&&e.el instanceof Element&&(ee(e,{}),te(e,{}),re(e,{}),ne(e,{}),ie(e,{}))}function G(e,t,r=!0){return ke(e,t,r),r&&e.el.dispatchEvent(new CustomEvent(R.patch,{bubbles:!0,composed:!0})),e}function ge(e,t,r){return(!e||e.tag!==t.tag||e.is!==t.is||t.new)&&(e=t.is?{tag:t.tag,is:t.is,el:document.createElement(t.tag,{is:t.is})}:{tag:t.tag,el:document.createElement(t.tag)}),ee(e,t),te(e,t),re(e,t),ie(e,t),ne(e,t),ae(e,t),ke(e,t,r),"key"in t?e.key=t.key:delete e.key,e}function Me(e,t,r){return(!e||e.el!==t.el)&&(e={el:t.el},"override"in t&&(e.override=t.override),"invalid"in t&&(e.invalid={...t.invalid})),!e.invalid?.attrs&&e.el instanceof Element&&(ee(e,t),te(e,t),re(e,t),ie(e,t),ne(e,t)),e.invalid?.on||ae(e,t),!e.invalid?.children&&e.el instanceof Node&&ke(e,t,r),e}function ee(e,t){let r=(e.class||[]).join(" "),n=(t.class||[]).join(" ");r!==n&&(e.el.className=n),n.length?e.class=(t.class||[]).slice():delete e.class}function te(e,t){let r=e.part||[],n=t.part||[],a=n.filter(s=>!r.includes(s));a.length&&e.el.part.add(...a);let i=r.filter(s=>!n.includes(s));i.length&&e.el.part.remove(...i),n.length?e.part=n.slice():delete e.part}function re(e,t){if(e.el instanceof HTMLElement){let r=e.style||"",n=t.style||"";r!=n&&(e.el.style.cssText=n,n!=""?e.style=n:delete e.style)}}function ne(e,t){let r=e.attrs||{},n=t.attrs||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)||r[s]!==n[s]).forEach(s=>e.el.setAttribute(s,n[s])),a.filter(s=>!i.includes(s)).forEach(s=>e.el.removeAttribute(s)),i.length?e.attrs={...n}:delete e.attrs}function ae(e,t){let r=e.on||{},n=t.on||{},a=Object.keys(r),i=Object.keys(n);i.filter(s=>!a.includes(s)).forEach(s=>{n[s].forEach(o=>{e.el.addEventListener(s,o)})}),a.filter(s=>!i.includes(s)).forEach(s=>{r[s].forEach(o=>{e.el.removeEventListener(s,o)})}),i.filter(s=>a.includes(s)).forEach(s=>{let o=n[s],l=r[s];o.filter(u=>!l.includes(u)).forEach(u=>e.el.addEventListener(s,u)),l.filter(u=>!o.includes(u)).forEach(u=>e.el.removeEventListener(s,u))}),i.length?e.on=i.reduce((s,o)=>(s[o]=[...n[o]],s),{}):delete e.on}function ie(e,t){if(Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype,e.el)){let r=e.el;e.attrs?.value!==t.attrs?.value&&r.value!==t.attrs?.value&&(t.attrs&&"value"in t.attrs?r.value!==(t.attrs?.value).toString()&&(r.value=t.attrs.value):e.el.value!==""&&(e.el.value="")),!r.checked&&t.attrs&&"checked"in t.attrs?r.checked=!0:r.checked&&!(t.attrs&&"checked"in t.attrs)&&(r.checked=!1)}if(Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype,e.el)){let r=e.el;!r.selected&&t.attrs&&"selected"in t.attrs?r.selected=!0:r.selected&&!(t.attrs&&"selected"in t.attrs)&&(r.selected=!1)}}var ye=class{constructor(){this.stock=new Map}has(t){return this.stock.get(t)?.length}push(t,r){this.stock.has(t)?this.stock.get(t).push(r):this.stock.set(t,[r])}shift(t){return this.stock.get(t).shift()}};function ke(e,t,r){let n=e.children||[],a=t.children||[];if(n.length===0&&a.length===0||n.length===0&&e.el.hasChildNodes())return;let i=n.length===0&&a.length>1?new DocumentFragment:e.el,s=new ye,o=0,l=i.firstChild,u=a.filter(f=>typeof f=="number").reverse(),E=u.pop(),v=f=>{let m=ge(null,f,r);return i.insertBefore(m.el,l||null),m},Se=f=>{let m=ge(n[o],f,r);return m!==n[o]&&(_(n[o],r),i.replaceChild(m.el,n[o].el)),l=m.el.nextSibling,o++,m},fe=(f=!1)=>{let m=n[o];if(typeof m!="number"){if(typeof m=="object"){if(l!==m.el){_(m,r),o++;return}f&&"key"in m?s.push(m.key,m):_(m,r)}if(typeof m=="string"||typeof m=="object"&&!m.override){let B=l;l=B.nextSibling,i.removeChild(B)}}o++},_e=a.map(f=>{switch(typeof f){case"string":return typeof n[o]=="string"?(l.data!==f&&(l.data=f),l=l.nextSibling,o++):i.insertBefore(document.createTextNode(f),l||null),f;case"object":{if("el"in f)if(typeof n[o]=="object"&&f.el===n[o].el){let m=Me(n[o],f,r);return!m.override&&m.el===l&&m.el instanceof Element&&m.el.getRootNode()===l.getRootNode()&&(l=l.nextSibling),o++,m}else{let m=Me(null,f,r);return!m.override&&m.el instanceof Element&&m.el.parentNode===null&&i.insertBefore(m.el,l||null),m}if("key"in f)if(s.has(f.key)){let m=ge(s.shift(f.key),f,r);return i.insertBefore(m.el,l||null),m}else{for(;o<n.length&&n[o]!==E;){if(typeof n[o]=="object"&&f.key===n[o].key)return Se(f);fe(!0)}return v(f)}else return typeof n[o]=="object"&&!("el"in f)&&!("key"in n[o])?Se(f):v(f)}case"number":{for(;o<n.length&&n[o]!==f;)fe();return o++,E=u.pop(),s.stock.forEach(m=>m.forEach(B=>_(B,r))),s.stock.clear(),f}}});for(;o<n.length;)fe();_e.length?e.children=_e:delete e.children,n.length===0&&a.length>1&&e.el.append(i)}function T(e,t){return J(e,t)[0]}function J(e,t,r=e.length-1){for(let n=r;n>=0;n--)if(t in e[n])return[e[n][t],n];return[void 0,-1]}var D=class{constructor(t,r,n,a,i){this._key=t;this._value=r;this._index=n;this._entries=a;this._stack=i}get key(){return this._key}get value(){return this._value}get index(){return this._index}get size(){return this._entries.length}get isFirst(){return this._index===0}get isLast(){return this._index===this._entries.length-1}get parent(){return T(this._stack,"loop")}toJSON(){return{key:this._key,value:this._value,_index:this._index,size:this._entries.length,isFirst:this._index===0,isLast:this._index===this._entries.length-1}}};var se=Symbol.for("Jito Ref");function V(e){return typeof e=="object"&&e!==null&&typeof e.type=="string"}function be(e){return typeof e=="object"&&e!==null&&e[se]===!0}function M(e){return"tag"in e}var C=class{constructor(t,r,n=0,a=null){this.text=t;this.field=r;this.index=n;this.token=a}_next(t){let r=["",""];for(this.index=t;this.index<this.text.length;this.index++){let n=Fe(this.field,r[1]+this.text[this.index]);if(n==="other")return r;r[0]=n,r[1]=r[1]+this.text[this.index]}return r}skip(t=[]){t.unshift("other");let r="";if(!this.token)for(let n=this.index;n<this.text.length;n++)if(t.includes(Fe(this.field,this.text[n])))r+=this.text[n];else if(this.token=this._next(n),this.token&&this.token[0]==="partial")r+=this.token[1],n=this.index-1,this.token=null;else return r;return r}nextIs(t){return this.skip(),this.token?t?this.token[0]===t:this.token[0]:!1}pop(){this.skip();let t=this.token;return this.token=null,t||null}expand(t,r){let n=this.field;this.field=t,r(),this.token&&(this.index-=this.token[1].length,this.token=null),this.field=n}must(t){let r=this.pop();if(!r||r[0]!==t)throw Error(t+" is required.");return r}};function Fe(e,t){switch(e){case"html":switch(t){case">":case"<!--":case"/":case"{{":return t;case"&":case"&a":case"&am":case"&amp":case"&l":case"&lt":case"&g":case"&gt":case"&q":case"&qu":case"&quo":case"&quot":case"<":case"</":case"<!":case"<!-":case"{":return"partial";case"&amp;":case"&lt;":case"&gt;":case"&quot;":return"entity"}switch(!0){case/^\/\/.*$/.test(t):return"//";case/^<[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(t):return"start";case/^<\/[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(t):return"end"}break;case"attr":switch(t){case"@if":case"@else":case"@for":case"@each":return"@";case"=":case":=":case"&=":case"*=":return"assign";case">":case"/":case"'":case'"':return t;case":":case"&":case"*":return"partial"}switch(!0){case/^on[_\$\-a-zA-Z0-9]+$/.test(t):return"on";case/^[_\$\-@a-zA-Z0-9]+$/.test(t):return"name"}break;case"comment":switch(t){case"-->":return t;case"-":case"--":return"partial"}break;case"script":switch(t){case"+":case"-":return"multi";case"void":case"typeof":case"~":case"!":return"unary";case"/":case"*":case"%":case"**":case"in":case"instanceof":case"<":case">":case"<=":case">=":case"==":case"!=":case"===":case"!==":case"<<":case">>":case">>>":case"&":case"|":case"^":case"&&":case"||":case"??":return"binary";case"=":case"*=":case"**=":case"/=":case"%=":case"+=":case"-=":case"<<=":case">>=":case">>>=":case"&=":case"^=":case"|=":case"&&=":case"||=":case"??=":return"assign";case"++":case"--":return"crement";case"false":case"true":return"boolean";case"null":case"undefined":case".":case"?.":case"[":case"]":case"{":case"}":case"(":case")":case"...":case"?":case":":case",":case"'":case'"':case"`":return t}switch(!0){case/^\/\/.*$/.test(t):return"//";case/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(t):return"word";case/^\d+\.?\d*$|^\.?\d+$/.test(t):return"number"}break;case"template":switch(t){case"$":return"partial";case"${":return t;case"}":return t;case"`":return"`";case"\r":case`
`:case`\r
`:return"other"}case"single":case"double":switch(t){case"\\":return"partial";case"\r":case`
`:case`\r
`:return"return";case`\\\r
`:return"escape";case"'":if(e==="single")return t;break;case'"':if(e==="double")return t;break}switch(!0){case/^\\u[0-9a-fA-F]{0,3}$/.test(t):case/^\\x[0-9a-fA-F]{0,1}$/.test(t):case/^\\u\{(0?[0-9a-fA-F]{0,5}|10[0-9a-fA-F]{0,4})$/.test(t):return"partial";case/^\\.$/.test(t):case/^\\u[0-9a-fA-F]{4}$/.test(t):case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(t):case/^\\x[0-9a-fA-F]{2}$/.test(t):return"escape"}break;case"text":switch(t){case"{":case"}":return"partial";case"{{":case"}}":return t}break}return"other"}function oe(e){switch(e){case"\\n":return`
`;case"\\r":return"\r";case"\\v":return"\v";case"\\t":return"	";case"\\b":return"\b";case"\\f":return"\f"}switch(!0){case/^\\u[0-9a-fA-F]{4}$/.test(e):case/^\\x[0-9a-fA-F]{2}$/.test(e):return String.fromCodePoint(parseInt(e.slice(2),16));case/^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(e):return String.fromCodePoint(parseInt(e.slice(3,-1),16))}return e.slice(1)}function d(e){let t=typeof e=="string"?new C(e,"script"):e;return st(t)}function st(e){let t=ot(e);if(e.nextIs("assign")){if(t.type!=="get")throw Error("The left operand is not variable");let r=e.pop()[1],n=d(e);return{type:"assign",operator:r,left:t.value,right:n}}else return t}function ot(e){let t=He(e);for(;e.nextIs("?");){e.pop();let r=d(e);e.must(":");let n=He(e);t={type:"if",condition:t,truthy:r,falsy:n}}return t}function He(e){let t=new Array;for(t.push(le(e));e.nextIs("multi")||e.nextIs("binary");)t.push(e.pop()[1]),t.push(le(e));for(;t.length>1;)for(let r=0;r+1<t.length;r+=2)if(r+3>=t.length||Ie(t[r+1])>Ie(t[r+3])){let n={type:"binary",operator:t[r+1],left:t[r],right:t[r+2]};t.splice(r,3,n)}return typeof t[0]=="string"?{type:"variable",name:t[0]}:t[0]}function Ie(e){switch(e){default:return 0;case"||":case"??":return 4;case"&&":return 5;case"|":return 6;case"^":return 7;case"&":return 8;case"==":case"!=":case"===":case"!==":return 9;case"in":case"instanceof":case"<":case">":case"<=":case">=":return 10;case"<<":case">>":case">>>":return 11;case"+":case"-":return 12;case"*":case"/":case"%":return 13;case"**":return 14}}function le(e){switch(e.nextIs()){case"multi":case"unary":return{type:"unary",operator:e.pop()[1],operand:le(e)};case"crement":return{type:"assign",operator:e.pop()[1].charAt(0)+"=",left:le(e).value,right:{type:"literal",value:1}};default:return lt(e)}}function lt(e){let t=pt(e);return e.nextIs("crement")?{type:"assign",operator:e.pop()[1].charAt(0)+"=",left:t.value,right:{type:"literal",value:1},prevalue:!0}:t}function pt(e){let t=ct(e);for(;;){switch(e.nextIs()){case"(":{e.pop();let r=[];for(;!e.nextIs(")")&&(r.push(d(e)),e.nextIs(","));)e.pop();e.must(")"),t={type:"function",name:t,params:r};continue}case".":{e.pop();let r=e.must("word");t={type:"get",value:{type:"hash",object:t,key:{type:"literal",value:r[1]}}};continue}case"[":{e.pop();let r=d(e);e.must("]"),t={type:"get",value:{type:"hash",object:t,key:r}};continue}}break}return t}function ct(e){let t=e.pop();switch(t[0]){case"word":return{type:"get",value:{type:"variable",name:t[1]}};case"number":return{type:"literal",value:Number(t[1])};case"boolean":return{type:"literal",value:t[1]==="true"};case"undefined":return{type:"literal",value:void 0};case"null":return{type:"literal",value:null};case'"':return K(e,"double",t[0]);case"'":return K(e,"single",t[0]);case"`":return K(e,"template",t[0]);case"(":{let r=d(e);return e.must(")"),r}case"[":{let r=[];for(;!e.nextIs("]");)if(r.push(d(e)),e.nextIs(","))e.pop();else if(e.nextIs("]")){e.pop();break}else throw Error("']' is required");return{type:"array",values:r}}case"{":{let r=[];for(;!e.nextIs("}");){let n=Array(2),a=e.pop();if(a[0]==="word"?n[0]={type:"literal",value:a[1]}:a[0]==='"'?n[0]=K(e,"double",a[0]):a[0]==="'"?n[0]=K(e,"single",a[0]):a[0]==="["&&(n[0]=d(e),e.must("]")),a[0]==="word"&&(e.nextIs(",")||e.nextIs("}"))?n[1]={type:"get",value:{type:"variable",name:a[1]}}:(e.must(":"),n[1]=d(e)),r.push(n),e.nextIs(","))e.pop();else if(e.nextIs("}")){e.pop();break}else throw Error("'}' is required")}return{type:"object",entries:r}}default:throw new Error(t[0]+" is invalid")}}function K(e,t,r){let n=[""],a=0;return e.expand(t,()=>{e:for(;;){n[a]+=e.skip();let i=e.pop();switch(i[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n[a]+=oe(i[1]);continue;case"${":e.expand("script",()=>{n.push(d(e))}),e.must("}"),n.push(e.skip()),a+=2}}}),a===0?{type:"literal",value:n[0]}:{type:"join",values:n.filter(i=>i!==""),separator:""}}function F(e){switch(e){case"html":case"base":case"head":case"link":case"meta":case"style":case"title":case"body":case"address":case"article":case"aside":case"footer":case"header":case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":case"main":case"nav":case"section":case"blockquote":case"dd":case"div":case"dl":case"dt":case"figcaption":case"figure":case"hr":case"li":case"ol":case"p":case"pre":case"ul":case"a":case"abbr":case"b":case"bdi":case"bdo":case"br":case"cite":case"code":case"data":case"dfn":case"em":case"i":case"kbd":case"mark":case"q":case"rp":case"rt":case"ruby":case"s":case"samp":case"small":case"span":case"strong":case"sub":case"sup":case"time":case"u":case"var":case"wbr":case"area":case"audio":case"img":case"map":case"track":case"video":case"embed":case"iframe":case"object":case"param":case"picture":case"portal":case"source":case"svg":case"math":case"canvas":case"noscript":case"script":case"del":case"ins":case"caption":case"col":case"colgroup":case"table":case"tbody":case"td":case"tfoot":case"th":case"thead":case"tr":case"button":case"datalist":case"fieldset":case"form":case"input":case"label":case"legend":case"meter":case"optgroup":case"option":case"output":case"progress":case"select":case"textarea":case"details":case"dialog":case"menu":case"summary":case"slot":case"template":return!0}return!1}function Ne(e){switch(e){case"br":case"hr":case"img":case"input":case"meta":case"area":case"base":case"col":case"embed":case"keygen":case"link":case"param":case"source":return!0}return!1}function pe(e){let t=typeof e=="string"?new C(e,"html"):e,r={text:O(t)};for(;t.nextIs("<!--");)t.pop(),t.expand("comment",()=>t.must("-->")),r.text+=O(t);if(t.nextIs("start")){let n=ut(t);n&&(M(n)?r.next=n:(r.text=n.text,n.next&&(r.next=n.next)))}return r.text?r:r.next?r.next:void 0}function O(e){let t=e.skip([">","/","}}"]);if(e.nextIs("entity"))switch(e.pop()[1]){case"&amp;":return t+"&"+O(e);case"&lt;":return t+"<"+O(e);case"&gt;":return t+">"+O(e);case"&quot;":return t+'"'+O(e)}return e.nextIs("{{")?(t+=e.pop()[1],e.expand("text",()=>{t+=e.skip(["{{"]),t+=e.must("}}")[1]}),t+O(e)):t}function ut(e){let t={tag:e.pop()[1].slice(1).toLocaleLowerCase()},r=mt(e);if(r.length&&(t.attrs=r),e.nextIs("/"))e.pop(),e.must(">");else if(Ne(t.tag))e.must(">");else{e.must(">");let a=pe(e);if(a&&(t.child=a),e.must("end")[1].slice(2)!==t.tag)throw Error(`end tag <${t.tag}> is required.`);e.must(">")}let n=pe(e);return n&&(t.next=n),t.tag==="script"&&t.next?t.next:t}function mt(e){let t=[];return e.expand("attr",()=>{for(e.skip();e.nextIs()&&!e.nextIs(">");){let r=new Array(3);if(e.nextIs("name"))if(r[0]=e.pop()[1],e.nextIs("assign"))r[1]=e.must("assign")[1];else if(e.nextIs("name")||e.nextIs(">")||e.nextIs("/"))r[1]="=",r[2]=r[0];else throw Error("assign is required.");else{if(e.nextIs("on"))r[0]=e.pop()[1],r[1]="on";else if(e.nextIs("@"))r[0]=e.pop()[1],r[1]="@";else break;if(r[0]==="@else")r[2]=r[0];else if(e.must("assign")[1]!=="=")throw Error("= is required.")}r[2]===void 0&&(e.nextIs('"')?r[2]=$e(e,"double",e.pop()[0]):e.nextIs("'")&&(r[2]=$e(e,"single",e.pop()[0]))),t.push(r),e.skip()}}),t}function $e(e,t,r){let n="";return e.expand(t,()=>{e:for(;;){n+=e.skip();let a=e.pop();switch(a[0]){case r:break e;case"return":throw Error("Newline cannot be used");case"escape":n+=oe(a[1]);continue}}}),n}function q(e){let t=pe(e),r=t?ve(t):[];return r.length?{type:"tree",children:r}:{type:"tree"}}var Ee=class{constructor(t){this.node=t}isSkippable(t){for(let r=this.node;r;r=r.next){if(M(r))return Re(r,t);if(!/^\s*$/.test(r.text))return!1}return!1}skip(){for(;;){if(M(this.node))return this;this.node=this.node.next}}pop(){let t=this.node;return this.node=this.node?.next,t}};function ve(e){let t=new Ee(e),r=[];for(;t.node;){let n=ft(t);n!==void 0&&r.push(n)}return r}function ft(e){if(!e.node)e.pop();else return M(e.node)?Je(e):Tt(new C(e.pop().text,"text"))}function dt(e){return Je(e)}function Je(e){let t=e.node;if(Re(t,"@for")){let r=xe(t,"@each")||void 0,n=d(xe(t,"@for"));return{type:"for",each:r,array:n,value:ze(e)}}else return ze(e)}function ze(e){let t=e.node;if(Re(t,"@if")){let r=d(xe(t,"@if")),n=Ge(t);e.pop();let a={type:"if",condition:r,truthy:n};return e.isSkippable("@else")&&(a.falsy=dt(e.skip())),a}else return Ge(e.pop())}function Ge(e){if(e.tag==="group"){let t={type:"group"};if(e.attrs?.forEach(([r,,n])=>{r.match(/^@(if|else|for|each)$/)||r.match(/^@.*$/)&&(t.attrs||(t.attrs={}),t.attrs[r]=n)}),e.child){let r=ve(e.child);r.length&&(t.children=r)}return t}else return ht(e)}function ht(e){let t={type:"element",tag:e.tag};{let r=[];e.attrs?.forEach(([n,a,i])=>{switch(a){case"=":{switch(n){case"is":{n in t||(t.is=i);return}case"class":case"part":return(t[n]??=[]).push(i.split(/\s+/));case"style":return r.push(i)}return n in(t.attrs??={})?void 0:t.attrs[n]=i}case":=":{switch(n){case"is":return t.is=d(i);case"class":case"part":return(t[n]??=[]).push({type:"flags",value:d(i)});case"style":return r.push(d(i))}return(t.attrs??={})[n]=d(i)}case"*=":{let s=d(i);return V(s)&&s.type==="get"&&(s=s.value),(t.attrs??={})[n]=s}case"on":{let s=n.slice(2),o={type:"handler",value:d(i)};return((t.on??={})[s]??=[]).push(o)}}}),r.length&&(r.length===1&&typeof r[0]=="string"?t.style=r[0]:t.style={type:"join",values:r.filter(n=>n!==""),separator:";"}),e.attrs?.forEach(([n,a,i])=>{a==="&="&&((t.bools??={})[n]=d(i),t.attrs&&(delete t.attrs[n],Object.keys(t.attrs).length||delete t.attrs))})}if(e.child){let r=ve(e.child);r.length&&(t.children=r)}return(!F(t.tag)||t.is)&&(t.type="custom"),t}function Re(e,t){return e.attrs?.some(r=>r[0]===t)}function xe(e,t){let r=e.attrs?.find(n=>n[0]===t);return r?r[2]:""}function Tt(e){let t=[];for(t.push(e.skip());e.nextIs();)e.nextIs("{{")?(e.pop(),e.expand("script",()=>{t.push({type:"draw",value:d(e)})}),e.must("}}"),t.push(e.skip())):e.pop();return t.length===1&&typeof t[0]=="string"?t[0]:{type:"flat",values:t}}var we=new Array,p=function(e,t=[],r={}){let n=e;switch(n.type){case"literal":return n.value;case"array":return n.values.map(a=>p(a,t,r));case"object":return Object.fromEntries(n.entries.map(a=>a.map(i=>p(i,t))));case"variable":{let[,a]=J(t,n.name);return a>=0?{record:t[a],key:n.name,[se]:!0}:void 0}case"unary":return yt(n.operator,p(n.operand,t,r));case"binary":{let a=p(n.left,t,r);return De(n.operator,a)?Ke(n.operator,a,p(n.right,t,r)):a}case"assign":{let a=p(n.left,t,r);if(!a)throw Error(n.left?n.left.name:"key is not defined");let{record:i,key:s}=a;if(typeof i=="function"||i===Object)throw Error("Cannot assign to this object");if(s==="__proto__")throw Error("Cannot assign to "+s);let o=i[s];if(typeof o=="function")throw Error("Cannot assign to function");let l=p(n.right,t,r);if(n.operator.length>1){let u=n.operator.slice(0,-1);De(u,o)&&(i[s]=Ke(u,o,l))}else i[s]=l;return n.prevalue?o:i[s]}case"function":{if(n.name.type==="get"&&n.name.value.type==="hash"){let a=p(n.name.value,t,r);if(!a)throw Error(p(n.name.value.key,t,r)+" is not defined");switch(a.key){case"__defineGetter__":case"__defineSetter__":throw Error("Cannot get "+a.key)}let i=a.record[a.key];if(typeof i=="function")return i.apply(a.record,n.params.map(s=>p(s,t,r)))}else{let a=p(n.name,t,r);if(typeof a=="function")return a(...n.params.map(i=>p(i,t,r)))}throw Error(n.name.toString()+" is not a function")}case"hash":return{record:p(n.object,t,r),key:p(n.key,t,r),[se]:!0};case"get":{let a=p(n.value,t,r);if(a){if(a.key==="__proto__")throw Error("Cannot get "+a.key);return a.record[a.key]}else return a}case"flat":{let a=n.values.flatMap(i=>typeof i=="string"?[i]:Ce(p(i,t,r))).filter(i=>i!=="").reduce((i,s)=>{let o=i.length;return o&&typeof s=="string"&&typeof i[o-1]=="string"?i[o-1]+=s:i.push(s),i},[]);return a.length===1&&typeof a[0]=="string"?a[0]:a}case"draw":{let a=p(n.value,t,r);if(typeof a=="object")if(V(a))if(a.type==="tree"){a.type="group";let i=p(a,t,r);return a.type="tree",i}else return p(a,t,r);else return Object.getPrototypeOf(a)===Object.prototype?JSON.stringify(a):"";else return a==null?"":a+""}case"join":return n.values.reduce((a,i,s)=>{if(V(i)){let o=p(i,t,r);return a+(s?n.separator:"")+(typeof o=="object"?"":o)}else return a+(s?n.separator:"")+i},"");case"flags":{let a=p(n.value,t,r);if(typeof a=="string")return a.split(/\s+/);if(typeof a=="object"){if(Array.isArray(a))return a;if(a)return Object.keys(a).filter(i=>a[i])}return[]}case"if":return p(n.condition,t,r)?p(n.truthy,t,r):n.falsy?p(n.falsy,t,r):null;case"for":{let a=p(n.array,t,r),i;if(typeof a=="object"&&a!==null)if(Symbol.iterator in a)if("entries"in a)i=[...a.entries()];else{let s=0;i=[];for(let o of a)i.push([s++,o])}else i=Object.entries(a);else i=[[0,a]];return i.flatMap(([s,o],l)=>{let u=new D(s,o,l,i,t),E=Ce(p(n.value,t.concat([n.each?{[n.each]:o,loop:u}:{loop:u}]),r)).filter(v=>typeof v!="number");return typeof u.value=="object"&&E.filter(v=>typeof v=="object").forEach(v=>v.key=u.value),E})}case"tree":{let a=H(n,t,r);return a.length?{children:a}:{}}case"custom":{let a=we.find(i=>i.match(n,t,r))?.exec(n,t,r);if(a)return a}case"element":{let a=H(n,t,r),s=a.length?{children:a}:{};return s.tag=n.tag,n.is&&(s.is=typeof n.is=="string"?n.is:p(n.is,t,r)),P(n,t,r,s),s}case"group":return H(n,t,r);case"handler":{r.handler||(r.handler=new WeakMap),r.handler.has(n)||r.handler.set(n,[]);let a=r.handler.get(n);for(let s of a)if(qe(s[0],t))return s[1];let i=s=>p(n.value,[...t,{event:s}],r);return a.push([t,i]),i}case"evaluation":return p(n.value,t,r);default:return we.find(a=>a.match(e,t,r))?.exec(e,t,r)}};p.plugin=e=>{we.unshift(e)};var gt={match(e,t,r){if(e.type==="custom"){let n=e;if(!F(n.tag))return n.tag==="window"||T(t,n.tag)instanceof EventTarget}return!1},exec(e,t,r){let n=e;if(e.tag==="window"){let s={el:window,override:!0,invalid:{attrs:!0,children:!0}};return P(n,t,r,s),s}let a=T(t,n.tag),i={el:a};return P(n,t,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),(a instanceof Element||a instanceof DocumentFragment||a instanceof ShadowRoot)&&n.children&&n.children.length?i.children=H(n,t,r):i.invalid={children:!0},i}};p.plugin(gt);function H(e,t,r){let n=e.children||[],a=0;n.length&&((r.groups??(r.groups=[new WeakMap,0]))[0].has(e)?a=r.groups[0].get(e):(a=r.groups[1]=r.groups[1]+n.length,r.groups[0].set(e,a)));let i=n.flatMap((s,o)=>{if(V(s)){let l=Ce(p(s,t,r));switch(s.type){case"if":case"for":case"group":l.push(a-o)}return l}else return[s]});return typeof i[i.length-1]=="number"&&i.pop(),i}function P(e,t,r,n){if(e.style&&(n.style=typeof e.style=="string"?e.style:p(e.style,t,r)),e.bools){for(let a in e.bools)if(!a.startsWith("@")){let i=e.bools[a],s=typeof i=="string"?i:p(i,t,r);s&&((n.attrs??(n.attrs={}))[a]=s)}}if(e.attrs){for(let a in e.attrs)if(!a.startsWith("@")){let i=e.attrs[a];(n.attrs??(n.attrs={}))[a]=typeof i=="string"?i:p(i,t,r)}}if(e.class&&e.class.forEach(a=>n.class=(n.class||[]).concat(Array.isArray(a)?a:p(a,t,r))),e.part&&e.part.forEach(a=>n.part=(n.part||[]).concat(Array.isArray(a)?a:p(a,t,r))),e.on){n.on||(n.on={});for(let a in e.on)n.on[a]=e.on[a].map(i=>p(i,t,r))}}function qe(e,t,r=e.length-1,n=t.length-1){let[a,i]=J(e,"loop",r),[s,o]=J(t,"loop",n);return!a&&!s?!0:!a||!s?!1:a.index===s.index&&a.key===s.key&&a.value===s.value&&qe(e,t,i-1,o-1)}function Ce(e){return e==null?[]:Array.isArray(e)?e:[e]}function yt(e,t){switch(e){case"void":return;case"typeof":return typeof t;case"+":return+t;case"-":return-t;case"~":return~t;case"!":return!t;default:throw Error(e+" does not exist")}}function De(e,t){switch(e){case"&&":return!!t;case"||":return!t;case"??":return t==null;default:return!0}}function Ke(e,t,r){switch(e){case"+":return t+r;case"-":return t-r;case"/":return t/r;case"*":return t*r;case"%":return t%r;case"**":return t**r;case"in":return t in r;case"instanceof":return t instanceof r;case"<":return t<r;case">":return t>r;case"<=":return t<=r;case">=":return t>=r;case"==":return t==r;case"!=":return t!=r;case"===":return t===r;case"!==":return t!==r;case"<<":return t<<r;case">>":return t>>r;case">>>":return t>>>r;case"&":return t&r;case"|":return t|r;case"^":return t^r;case"&&":return t&&r;case"||":return t||r;case"??":return t??r;default:throw Error(e+" does not exist")}}var U=Symbol.for("Jito Special");function g(e){return typeof e=="object"&&e!==null&&(e.template||e.patcher)&&e.main&&e.options}function ce(e){return typeof e=="object"&&e!==null&&"default"in e&&e[Symbol.toStringTag]==="Module"}function ue(e,t,r={children:[]}){return e.children&&(e.children=e.children.filter(n=>{if(typeof n=="object"){if(t(n))return r.children.push(n),!1;"tag"in n&&ue(n,t,r)}return!0}),e.children.length||delete e.children),r.children.length?r:{}}function me(...e){let t={children:[]};return e.forEach(r=>{r&&r.children&&(t.children=t.children.concat(r.children))}),t.children.length?t:{}}var Ue=Object.freeze({alert,console,Object:Object.freeze({entries:Object.entries,fromEntries:Object.fromEntries,hasOwn:Object.hasOwn,is:Object.is,keys:Object.keys,values:Object.values}),Number,Math,Date,Array,JSON,String,isNaN,isFinite,location,history,navigator,setTimeout});var b=class{constructor(t,r,n){this._attrs={};this._refs={};this._requirePatch=!1;let a=n.el;this._component=t,this._template=t.template,this._patcher=t.patcher,this._host=r,this._tree=n,this._updater=new Ae(n),this.patch=this.patch.bind(this),this.dispatch=this.dispatch.bind(this),this._cache={[U]:[r,a]},this._component.options.mode==="closed"&&a.addEventListener(R.patch,s=>s.stopPropagation()),r.addEventListener(R.destroy,()=>{this.patch({type:"tree"}),$(this._stack,this.patch)});let i=typeof this._component.main=="function"?this._component.main(this):this._component.main;this._ready=(async()=>{let s=await i,o=s?Array.isArray(s)?s:[s]:[];this._stack=[Ue,{host:r,root:a},L(this._attrs),...o],de(this._stack,this.patch),this.patch(),o.forEach(l=>{if(typeof l=="object"&&l!==null){for(let u in l)if((typeof l[u]=="function"||l[u]instanceof Element)&&isNaN(u)&&!(u in this._host)){let E=typeof l[u]=="function"?l[u].bind(this):l[u];Object.defineProperty(this._host,u,{get(){return E}})}}})})()}setAttr(t,r){switch(t){case"is":case"class":case"part":case"style":return;default:if(this._attrs[t]!==r){if(t in this._refs){let a=this._refs[t][0];if(be(r)&&r.record===a.record)return;Q(this._attrs,t,this._refs[t][1]),Q(a.record,a.key,this._refs[t][2]),delete this._refs[t]}if(be(r)){let a=s=>{r.record[r.key]=s},i=s=>{this._attrs[t]=s};this._refs[t]=[r,a,i],L(this._attrs,t,a),L(r.record,r.key,i),X(this._attrs,t,r.record[r.key])}else X(this._attrs,t,r)}}}get component(){return this._component}get host(){return this._host}get root(){return this._tree.el}get attrs(){return this._attrs}get ready(){return()=>this._ready}patch(t){t&&(typeof t=="function"?(this._patcher=t,this._template=void 0):(this._patcher=void 0,this._template=typeof t=="string"?q(t):t)),this._requirePatch||(this._requirePatch=!0,setTimeout(()=>{if(this._requirePatch=!1,this._stack){let r=this._patcher?this._patcher(this._stack):this._template?p(this._template,this._stack,this._cache):this._tree&&this._component.template?p(this._component.template,this._stack,this._cache):void 0;r&&this._updater.patch(r)}}))}dispatch(t,r=null){this._host.dispatchEvent(new CustomEvent(t,{detail:r}))}toJSON(){return{component:this._component,attrs:this._attrs,tree:this._tree}}};function kt(e){return"tag"in e&&(e.tag==="style"||e.tag==="link")}function We(e){return e.tag==="link"&&e.attrs?.href!==""&&(e.attrs?.rel).toLocaleLowerCase()==="stylesheet"}var Ae=class{constructor(t){this.tree=t;this._waitUrls=new Set;this.loaded=t=>{this.removeWaitUrl(t.target.getAttribute("href"))}}patch(t){let r=ue(t,kt),n=t,a=this.header?.children?.filter(We)||[],i=r.children?.filter(We)||[],s=i.filter(l=>a.every(u=>u.attrs?.href!==l.attrs?.href)),o=a.filter(l=>i.every(u=>u.attrs?.href!==l.attrs?.href));i.forEach(l=>{((l.on??={}).load??=[]).includes(this.loaded)||l.on.load.push(this.loaded),(l.on.error??=[]).includes(this.loaded)||l.on.error.push(this.loaded)}),s.forEach(l=>{this.addWaitUrl(l.attrs?.href),l.new=!0}),o.forEach(l=>this.removeWaitUrl(l.attrs?.href)),o.length?G(this.tree,me(this.header,r,this.body),!1):G(this.tree,me(r,this.body),!1),s.forEach(l=>l.new=!1),this.header=r,this.update=()=>{G(this.tree,me(this.header,n)),ue(n,l=>(delete l.new,!1)),this.body=n}}set update(t){this._update=t,this._executeUpdate()}addWaitUrl(t){this._waitUrls.add(t)}removeWaitUrl(t){this._waitUrls.delete(t),this._executeUpdate()}_executeUpdate(){!this._waitUrls.size&&this._update&&(this._update(),this._update=void 0)}};var x="jito-element",y=class extends HTMLElement{constructor(){super()}setAttr(r,n){this._entity?.setAttr(r,n)}static getComponent(){}loadAttrs(){this.hasAttributes()&&this.getAttributeNames().forEach(r=>{this.setAttr(r,this.getAttribute(r))})}ready(){return this._entity?this._entity.ready():new Promise(r=>{this._run=r})}_setEntity(r){this._entity=r,this._run&&this._entity.ready().then(this._run)}get entity(){return this._entity}get attributes(){return bt(super.attributes,this.setAttr)}setAttribute(r,n){this.setAttr(r,n),super.setAttribute(r,n)}getAttributeNode(r){let n=super.getAttributeNode(r);return n&&Be(n,this.setAttr)}removeAttribute(r){return this.setAttr(r,void 0),super.removeAttribute(r)}removeAttributeNode(r){return this.setAttr(r.name,void 0),super.removeAttributeNode(r)}toJSON(){return{entity:this._entity}}},Le=class extends y{constructor(){super()}setAttr(t,r){if(t==="component")switch(typeof r){case"string":{let n=customElements.get(r);if(n&&y.isPrototypeOf(n)){let a=n.getComponent();if(a){let i=w(this.attachShadow(a.options));this._setEntity(new b(a,this,i))}}else throw Error(r+" is not a component.");break}case"object":if(g(r)){let n=w(this.attachShadow(r.options));this._setEntity(new b(r,this,n))}else if(r!==null)throw Error("The object is not a component.");break}super.setAttr(t,r)}};customElements.get(x)||customElements.define(x,Le);function Be(e,t){return new Proxy(e,{set(r,n,a){if(t(n,a),n==="value")return r.value=a}})}function bt(e,t){return new Proxy(e,{get:function(r,n){return n==="length"?r[n]:Be(r[n],t)}})}async function Et(e,t){let r;if(typeof e=="string")r=document.createElement(e);else{r=document.createElement(x);let n=await Promise.resolve(e),a=ce(n)&&g(n.default)?n.default:n;r.setAttribute("component",a)}if(t)for(let n in t)r.setAttribute(n,t[n]);if(typeof e=="string"){let n=customElements.get(e);n!==void 0&&Object.prototype.isPrototypeOf.call(y,n)&&await r.ready()}else await r.ready();return r}var Ze={match(e,t,r){if(e.type==="custom"){if(e.tag===x)return!0;let n=e,a=T(t,n.tag);if(typeof a=="object"&&a!==null&&(g(a)||ce(a)&&g(a.default)))return!0;{let i=customElements.get(n.tag);return i!==void 0&&Object.prototype.isPrototypeOf.call(y,i)}}return!1},exec(e,t,r){let n=e,a={tag:x},i;return n.tag!==x&&(i=T(t,n.tag),i?(a.attrs??={}).component=i:a.tag=n.tag),Ye(n,t,r,a),P(n,t,r,a),n.tag===x&&(i=a.attrs?.component,(a.attrs??={}).component=i),typeof i=="object"&&i!==null&&"default"in i&&i[Symbol.toStringTag]==="Module"&&g(i.default)&&(i=i.default,(a.attrs??={}).component=i),n.cache!==i&&(a.new=!0),n.cache=i,a}},Qe={match(e,t,r){if(e.type==="custom"){let n=T(t,e.tag);return typeof n=="object"&&n!==null&&n instanceof y}return!1},exec(e,t,r){let n=e,a=T(t,n.tag),i={el:a};return Ye(n,t,r,i),P(n,t,r,i),a instanceof Element&&n.attrs&&"@override"in n.attrs&&(i.override=!0),n.children&&n.children.length?i.children=H(n,t,r):i.invalid={children:!0},i}},Xe={match(e,t,r){if(e.type==="custom"&&U in r&&!F(e.tag)){let n=T(t,e.tag);return r[U].some(a=>a===n)}return!1},exec(e,t,r){let a={el:T(t,e.tag)||ShadowRoot,override:!0,invalid:{attrs:!0,children:!0}};return P(e,t,r,a),a}};function Ye(e,t,r,n){let a=[],i=[],s=(e.children||[])?.flatMap(o=>{if(typeof o!="string"){let l=o;if(l.attrs){if(l.attrs["@as"])return i.push([l.attrs["@as"],l]),[];if(l.attrs.slot)return[p(o,t,r)]}}return a.push(o),[]});a.length&&i.push(["content",{type:"group",children:a}]),i.length&&(n.attrs||(n.attrs={}),i.forEach(([o,l])=>{n.attrs[o]={type:"evaluation",value:l,stack:t}})),s.length&&(n.children=s)}p.plugin(Ze);p.plugin(Xe);p.plugin(Qe);function W(e,t=[]){let r={main:typeof t=="function"||Array.isArray(t)?t:[t],options:{mode:"open"}};return typeof e=="function"?r.patcher=e:r.template=typeof e=="string"?q(e):e,Te(r)}function xt(e,t,r=[]){let n=g(t)?t:W(t,r);if(n.options.localeOnly)throw Error("This componet is local only.");customElements.define(e,class extends y{constructor(){super();let a=w(this.attachShadow(n.options));this._setEntity(new b(n,this,a)),this.innerHTML&&this.entity.setAttr("content",this.innerHTML),this.loadAttrs()}static getComponent(){return n}})}function vt(e,t,r=[]){let n=typeof e=="string"?document.querySelector(e):e,a=g(t)?t:W(t,r);if(a.options.localeOnly)throw Error("This componet is local only.");let i=w(n.attachShadow(a.options)),s=new b(a,n,i);n.innerHTML&&s.setAttr("content",n.innerHTML),n.hasAttributes()&&n.getAttributeNames().forEach(o=>{s.setAttr(o,n.getAttribute(o))})}function Rt(e,t={}){return e.options=Object.freeze({mode:"closed",...t}),Object.freeze(e)}export{y as ComponentElement,b as Entity,D as Loop,X as change,W as compact,xt as define,_ as destroy,Et as elementize,p as evaluate,R as eventTypes,d as expression,w as load,Te as lock,vt as mount,q as parse,G as patch,T as pickup,de as reach,rt as receive,Rt as seal,nt as unlock,$ as unreach,Q as unwatch,L as watch};
