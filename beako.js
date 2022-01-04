const p=Symbol("Beako");function W(t,e){const s=t.value;s!==e&&t.arms.forEach(n=>{switch(n[0]){case"bio":n[1]();break;case"bom":t.arms.delete(n);case"spy":n[1](e,s);break}}),t.value=e}function l(t,e,s){p in t||(t[p]={}),e!==void 0&&(e in t[p]||(t[p][e]={value:t[e],arms:new Set},Object.defineProperty(t,e,{get(){return this[p][e].value},set(n){W(this[p][e],n)}})),s&&t[p][e].arms.add(s))}function P(t,e,s){if(typeof t=="object"&&t!==null){const n=t;if(l(n),s===void 0){const r=e?typeof e=="function"?["bio",e]:e:void 0;for(const i in n)l(n,i,r);if(Array.isArray(n))return n;for(const i in n){const a=[...n[p][i].arms].filter(c=>c[0]==="bio");a.length?a.forEach(c=>P(n[i],c)):P(n[i])}}else{const r=typeof s=="function"?["spy",s]:s;Array.isArray(e)?e.forEach(i=>l(n,i,r)):l(n,e,r)}}return t}export{P as watch};async function Q(t,e){const s=Array.isArray(e)?e:[e],n=await Promise.all(s.map(r=>t[r]===void 0?new Promise(i=>{l(t,r,["bom",i])}):t[r]));return s.reduce((r,i,a)=>(r[i]=n[a],r),{})}export{Q as receive};function w(t,e,s){if(e!==void 0)p in t&&e in t[p]&&(s?t[p][e].arms.forEach(n=>{n[1]===s&&t[p][e].arms.delete(n)}):t[p][e].arms.clear(),t[p][e].arms.size||(Object.defineProperty(t,e,{enumerable:!0,configurable:!0,writable:!0,value:t[p][e].value}),delete t[p][e]));else{for(const n in t[p])w(t,n);delete t[p]}}function N(t,e,s){if(typeof t=="object"&&t!==null){const n=t;if(s===void 0)if(e){const r=e;for(const i in n)w(n,i,r),N(n[i],r)}else{for(const r in n)N(n[r]);w(n)}else Array.isArray(e)?e.forEach(r=>w(n,r,s)):w(n,e,s)}return t}export{N as unwatch};function A(t,e){const s=typeof e=="function"?["bio",e]:e;if(typeof t=="object"&&t!==null){const n=t;if(p in n)for(const r in n[p])l(n,r,s);for(const r in n)A(n[r],s)}return t}export{A as reach};function S(t){const e={node:t};return j(e),e}function R(t){const e={tag:t.tagName.toLowerCase(),node:t};return X(e),j(e),e}function X(t){if(t.node.hasAttributes()){const e={};t.node.getAttributeNames().forEach(s=>{if(s.startsWith("on"))return;const n=t.node.getAttribute(s);switch(s){case"class":case"part":return t[s]=n.split(/\s+/);case"style":case"is":return t[s]=n;default:return e[s]=n}}),Object.keys(e).length&&(t.props=e)}}function j(t){if(t.node.hasChildNodes()){const e=t.node.childNodes;t.children=[];for(let s=0;s<e.length;s++)switch(e[s].nodeType){case 3:t.children.push(e[s].data);break;case 1:t.children.push(R(e[s]));break}}}export{S as load};function M(t,e){return F(t,e),t}function y(t,e){return t.tag!==e.tag||t.is!==e.is?y({tag:e.tag,node:e.is?document.createElement(e.tag,{is:e.is}):document.createElement(e.tag)},e):(Y(t,e),ee(t,e),te(t,e),se(t,e),ne(t,e),F(t,e),"key"in e?t.key=e.key:delete t.key,t)}function Y(t,e){const s=t.class||[],n=e.class||[],r=n.filter(a=>!s.includes(a));r.length&&t.node.classList.add(...r);const i=s.filter(a=>!n.includes(a));i.length&&t.node.classList.remove(...i),n.length?t.class=n.slice():delete t.class}function ee(t,e){const s=t.part||[],n=e.part||[],r=n.filter(a=>!s.includes(a));r.length&&t.node.part.add(...r);const i=s.filter(a=>!n.includes(a));i.length&&t.node.part.remove(...i),n.length?t.part=n.slice():delete t.part}function te(t,e){if(t.node instanceof HTMLElement){const s=t.style||"",n=e.style||"";s!=n&&(t.node.style.cssText=n,n!=""?t.style=n:delete t.style)}}function se(t,e){const s=t.props||{},n=e.props||{},r=Object.keys(s),i=Object.keys(n),a=i.filter(u=>!r.includes(u)||s[u]!==n[u]);for(const u of a)t.node.setAttribute(u,n[u]);const c=r.filter(u=>!i.includes(u));for(const u of c)t.node.removeAttribute(u);i.length?t.props={...n}:delete t.props}function ne(t,e){}class re{index=0;node;parent;children;stock;constructor(e){this.stock=new Map,this.parent=e,this.node=e.node.firstChild,this.children=e.children||[]}get isEnd(){return this.index>=this.children.length}get ve(){return this.children[this.index]}next(){typeof this.children[this.index]=="number"?this.index++:this.node&&(this.index++,this.node=this.node.nextSibling)}prev(){typeof this.children[this.index]=="number"?this.index--:this.node?(this.index--,this.node=this.node.previousSibling):(this.node=this.parent.node.lastChild,this.node&&this.index--)}add(e){const s=typeof e=="string"?document.createTextNode(e):e.node;return this.node=this.parent.node.insertBefore(s,this.node||null),this.next(),e}replace(e){if(typeof e=="string"&&this.node?.nodeType===3)this.node.data!==e&&(this.node.data=e);else{const s=typeof e=="string"?document.createTextNode(e):e.node;this.node!==s&&(typeof this.ve=="object"&&"key"in this.ve&&this.stock.set(this.ve.key,this.ve),this.parent.node.replaceChild(s,this.node))}return this.next(),e}remove(){typeof this.ve=="object"&&"key"in this.ve&&this.stock.set(this.ve.key,this.ve);const e=this.node;this.node=e?.nextSibling||null,this.parent.node.removeChild(e)}removeAll(){if(this.node)for(let e=this.node;e!==null;e=e.nextSibling)this.parent.node.removeChild(e)}has(e){return this.stock.has(e)}addFromKey(e,s){const n=this.stock.get(e);return this.stock.delete(e),this.add(y(n,s))}clear(){this.stock.clear()}search(e){if(this.isEnd)return!1;const s=e();if(console.log("result:",s),typeof s=="boolean")return s;{this.next();const n=this.search(e);return this.prev(),n&&(this.remove(),this.index++),n}}}function F(t,e){const s=e.children||[],n=new re(t),r=s.filter(c=>typeof c=="number").reverse();let i=r.pop();const a=s.map(c=>{switch(typeof c){case"string":return!n.isEnd&&typeof n.ve=="string"?n.replace(c):n.add(c);case"object":{if("key"in c){if(n.has(c.key))return n.addFromKey(c.key,c);if(typeof n.ve=="object"&&n.search(()=>{if(typeof n.ve=="object"&&c.key===n.ve.key)return!0;if(typeof n.ve=="number"&&i!=null&&n.ve===i)return!1}))return n.replace(y(n.ve,c))}if(typeof n.ve=="object"){const u="key"in n.ve?{tag:c.tag,node:document.createElement(c.tag)}:n.ve;return n.replace(y(u,c))}else return n.add(y({tag:c.tag,node:document.createElement(c.tag)},c))}case"number":{const u=n.search(()=>{if(typeof n.ve=="number"&&c===n.ve)return!0});return i=r.pop(),u&&n.next(),n.clear(),c}}});n.removeAll(),a.length?t.children=a:delete t.children}export{M as patch};export{y as patchElement};function O(t,e){switch(t){case"script":switch(e){case"+":case"-":return"multi";case"void":case"typeof":case"~":case"!":return"unary";case"/":case"*":case"%":case"**":case"in":case"instanceof":case"<":case">":case"<=":case">=":case"==":case"!=":case"===":case"!==":case"<<":case">>":case">>>":case"&":case"|":case"^":case"&&":case"||":case"??":return"binary";case"=":case"*=":case"**=":case"/=":case"%=":case"+=":case"-=":case"<<=":case">>=":case">>>=":case"&=":case"^=":case"|=":case"&&=":case"||=":case"??=":return"assign";case"++":case"--":return"crement";case"false":case"true":return"boolean";case"null":case"undefined":case".":case"?.":case"[":case"]":case"{":case"}":case"(":case")":case"...":case"?":case":":case",":case"'":case'"':case"`":return e}switch(!0){case/^\/\/.*$/.test(e):return"lineComment";case/^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(e):return"word";case/^\d+\.?\d*$|^\.?\d+$/.test(e):return"number"}break;case"template":switch(e){case"$":return"partial";case"${":return e;case"}":return e;case"`":return"`";case"\r":case`
`:case`\r
`:return"other"}case"singleString":case"doubleString":switch(e){case"\\":return"partial";case"\r":case`
`:case`\r
`:return"return";case`\\\r
`:return"escape";case"'":if(t==="singleString")return e;break;case'"':if(t==="doubleString")return e;break}switch(!0){case/^\\(x|u)$/.test(e):return"partial";case/^\\.$/.test(e):return"escape"}break;case"innerText":switch(e){case"{":case"}":return"partial";case"{{":case"}}":return e}break}return"other"}class f{text;field;index;token;constructor(e,s,n=0,r=null){this.text=e,this.field=s,this.index=n,this.token=r}_next(e){const s=["",""];for(this.index=e;this.index<this.text.length;this.index++){const n=O(this.field,s[1]+this.text[this.index]);if(n==="other")return s;s[0]=n,s[1]=s[1]+this.text[this.index]}return s}skip(){let e="";if(!this.token)for(let s=this.index;s<this.text.length;s++)if(O(this.field,this.text[s])==="other")e+=this.text[s];else if(this.token=this._next(s),this.token&&this.token[0]==="partial")e+=this.token[1],this.token=null;else return e;return e}nextType(){return this.skip(),this.token?this.token[0]:""}pop(){this.skip();const e=this.token;return this.token=null,e||null}expand(e,s){const n=this.field;this.field=e,s(),this.token&&(this.index-=this.token[1].length,this.token=null),this.field=n}}export{f as Lexer};function d(t,e,s=""){if(!t||t[0]!==e)throw Error(s)}function K(t){const e=[];for(e.push(t.skip());t.nextType();)console.log("lexer.nextType():",t.nextType()),t.nextType()==="{{"?(t.pop(),t.expand("script",()=>{e.push(h(t))}),d(t.pop(),"}}"),e.push(t.skip())):t.pop();const s=e.filter(n=>n!=="");return s.length===1&&typeof s[0]=="string"?s[0]:{type:"join",values:s,separator:""}}function h(t){return ie(t)}function ie(t){const e=ce(t);if(t.nextType()==="assign"){if(e.type!=="get")throw Error("The left operand is not variable");const s=t.pop()[1],n=h(t);return{type:"assign",operator:s,left:e.value,right:n}}else return e}function ce(t){let e=q(t);for(;t.nextType()==="?";){t.pop();const s=h(t);d(t.pop(),":");const n=q(t);e={type:"if",condition:e,truthy:s,falsy:n}}return e}function q(t){const e=new Array;for(e.push(C(t));t.nextType()==="multi"||t.nextType()==="binary";)e.push(t.pop()[1]),e.push(C(t));for(;e.length>1;)for(let s=0;s+1<e.length;s+=2)if(s+3>=e.length||z(e[s+1])>z(e[s+3])){const n={type:"binary",operator:e[s+1],left:e[s],right:e[s+2]};e.splice(s,3,n)}return typeof e[0]=="string"?{type:"variable",name:e[0]}:e[0]}function z(t){switch(t){default:return 0;case"||":case"??":return 4;case"&&":return 5;case"|":return 6;case"^":return 7;case"&":return 8;case"==":case"!=":case"===":case"!==":return 9;case"in":case"instanceof":case"<":case">":case"<=":case">=":return 10;case"<<":case">>":case">>>":return 11;case"+":case"-":return 12;case"*":case"/":case"%":return 13;case"**":return 14}}function C(t){switch(t.nextType()){case"multi":case"!":return{type:"unary",operator:t.pop()[1],operand:C(t)};default:return oe(t)}}function oe(t){let e=ae(t);for(;;){switch(t.nextType()){case"(":{t.pop();const s=[];for(;t.nextType()!==")"&&(s.push(h(t)),t.nextType()===",");)t.pop();d(t.pop(),")"),e={type:"function",name:e,params:s};continue}case".":{t.pop();const s=t.pop();d(s,"word"),e={type:"get",value:{type:"hash",object:e,key:{type:"literal",value:s[1]}}};continue}case"[":{t.pop();const s=h(t);d(t.pop(),"]"),e={type:"get",value:{type:"hash",object:e,key:s}};continue}}break}return e}function ae(t){const e=t.pop();switch(e[0]){case"word":return{type:"get",value:{type:"variable",name:e[1]}};case"number":return{type:"literal",value:Number(e[1])};case"boolean":return{type:"literal",value:e[1]==="true"};case"undefined":return{type:"literal",value:void 0};case"null":return{type:"literal",value:null};case'"':return _(t,"doubleString",e[0]);case"'":return _(t,"singleString",e[0]);case"`":return _(t,"template",e[0]);case"(":{const s=h(t);return d(t.pop(),")"),s}default:throw new Error(JSON.stringify(e))}}function _(t,e,s){const n=[""];let r=0;return t.expand(e,()=>{e:for(;;){n[r]+=t.skip();const i=t.pop();switch(i[0]){case s:break e;case"return":throw Error();case"escape":n[r]+=i[1];continue;case"${":t.expand("script",()=>{n.push(h(t))}),d(t.pop(),"}"),n.push(t.skip()),r+=2}}}),r===0?{type:"literal",value:n[0]}:{type:"join",values:n.filter(i=>i!==""),separator:""}}export{K as innerText};export{h as expression};const ue=new DOMParser;function B(t){if(typeof t=="string"){const e=ue.parseFromString(t,"text/html");return{type:"tree",children:x(e.head).concat(x(e.body))}}else{const e=t.content;return{type:"tree",children:x(e)}}}class pe{node;constructor(e){this.node=e}hasAttribute(e){return!!(this.node&&this.node.nodeType===1&&this.node.hasAttribute(e))}pop(){const e=this.node;return this.node=this.node?this.node.nextSibling:null,e}}function x(t){const e=new pe(t.firstChild),s=[];for(;e.node;)s.push(he(e));return s}function he(t){switch(t.node.nodeType){case 3:return fe(t.pop());case 1:return D(t);default:return""}}function fe(t){return K(new f(t.data,"innerText"))}function de(t){return D(t)}function D(t){const e=t.node;if(e.hasAttribute("@for")){const s=e.getAttribute("@each"),n=h(new f(e.getAttribute("@for"),"script"));return{type:"each",each:s,array:n,value:J(t)}}else return J(t)}function J(t){const e=t.node;if(e.hasAttribute("@if")){const s=h(new f(e.getAttribute("@if"),"script")),n=H(e);t.pop();const r=t.hasAttribute("@else")?de(t):void 0;return{type:"if",condition:s,truthy:n,falsy:r}}else return H(t.pop())}function H(t){if(t.hasAttribute("@expand")){const e=h(new f(t.getAttribute("@expand"),"script")),s=U(t);return{type:"expand",template:e,default:s}}else return U(t)}function U(t){return le(t)}function le(t){const e={type:"element",tag:t.tagName.toLowerCase()};if(t.hasAttributes()){const s=[];t.getAttributeNames().forEach(n=>{const r=t.getAttribute(n);switch(n){case"is":{n in e||(e.is=r);return}case"class":case"part":return n in e||(e[n]=[]),e[n].push(r.split(/\s+/));case"style":return s.push(r)}{const i=n.match(/^(?<name>.+)(\+.*)$/);if(i?.groups){const a=i.groups.name,c=h(new f(r,"script"));switch(a){case"is":return e.is=c;case"class":case"part":return a in e||(e[a]=[]),e[a].push({type:"flags",value:c});case"style":return s.push(c)}}}{const i=n.match(/^(?<name>.+):$/);if(i?.groups)return"props"in e||(e.props={}),e.props[i.groups.name]=h(new f(r,"script"))}if(n.match(/^(?<name>.+)\*$/)?.groups,!n.match(/^@(if|else|for|each|expand)$/)&&("props"in e||(e.props={}),!(n in e.props)))return e.props[n]=r}),s.length&&(s.length===1&&typeof s[0]=="string"?e.style=s[0]:e.style={type:"join",values:s.filter(n=>n!==""),separator:";"})}return t.hasChildNodes()&&(e.children=x(t)),e}export{B as parse};function k(t){return typeof t=="object"&&"type"in t}function ye(t,e){switch(t){case"void":return;case"typeof":return typeof e;case"+":return+e;case"-":return-e;case"~":return~e;case"!":return!e;default:throw Error(t+" does not exist")}}function Z(t,e,s){switch(t){case"+":return e+s;case"-":return e-s;case"/":return e/s;case"*":return e*s;case"%":return e%s;case"**":return e**s;case"in":return e in s;case"instanceof":return e instanceof s;case"<":return e<s;case">":return e>s;case"<=":return e<=s;case">=":return e>=s;case"==":return e==s;case"!=":return e!=s;case"===":return e===s;case"!==":return e!==s;case"<<":return e<<s;case">>":return e>>s;case">>>":return e>>>s;case"&":return e&s;case"|":return e|s;case"^":return e^s;case"&&":return e&&s;case"||":return e||s;case"??":return e??s;default:throw Error(t+" does not exist")}}function o(t,e=[]){return g[t.type](t,e)}function ge(t){if(typeof t=="string")return t.split(/\s+/);if(typeof t=="object"){if(Array.isArray(t))return t;if(t)return Object.keys(t).filter(e=>t[e])}return[]}function $(t,e,s){if(t.style&&(s.style=typeof t.style=="string"?t.style:o(t.style,e)),t.props){s.props={};for(const n in t.props){const r=t.props[n];s.props[n]=typeof r=="string"?r:o(r,e)}}}const g={literal:(t,e)=>t.value,variable:(t,e)=>{for(let s=e.length-1;s>=0;s--)if(t.name in e[s])return[e[s],t.name];throw Error(t.name+" is not defined")},unary:(t,e)=>ye(t.operator,o(t.operand,e)),binary:(t,e)=>Z(t.operator,o(t.left,e),o(t.right,e)),assign:(t,e)=>{const[s,n]=o(t.left,e),r=o(t.right,e);return s[n]=t.operator.length>1?Z(t.operator.slice(0,-1),s[n],r):r},function:(t,e)=>{const s=o(t.name,e);if(typeof s=="function")return s(...t.params.map(n=>o(n,e)));throw Error(t.name.toString()+" is not a function")},hash:(t,e)=>[o(t.object,e),o(t.key,e)],get:(t,e)=>{const[s,n]=o(t.value,e);return s[n]},join:(t,e)=>t.values.reduce((s,n,r)=>{if(k(n)){const i=o(n,e);return s+(r?t.separator:"")+(typeof i=="object"?JSON.stringify(i):i)}else return s+(r?t.separator:"")+n},""),flags:(t,e)=>ge(o(t.value,e)),if:(t,e)=>o(t.condition,e)?o(t.truthy,e):t.falsy?o(t.falsy,e):null,each:(t,e)=>(o(t.array,e),""),element:(t,e)=>{const s=g.tree(t,e);return s.tag=t.tag,t.is&&(s.is=typeof t.is=="string"?t.is:o(t.is,e)),$(t,e,s),s},tree:(t,e)=>{const s=(t.children||[])?.flatMap(n=>{if(typeof n=="string")return[n];{const r=o(n,e);return Array.isArray(r)?r:[r]}});return s.length?{children:s}:{}},expand:(t,e)=>{const s=o(t.template,e);return k(s)?{}:o(t.default,e)},group:(t,e)=>t.values.map(s=>k(s)?o(s,e):s)};export{o as evaluate};export{$ as evaluateAttr};export{g as evaluator};const v={console,Object,Number,Math,Date,Array,JSON,String,isNaN,isFinite,location};class T{stack;_component;_el;_tree;_props={};constructor(e,s,n){this._component=e,this._el=s,this._tree=n,typeof this.component.stack=="function"?(async()=>{const r=await this.component.stack(this);this.stack=r?Array.isArray(r)?[v,...r]:[v,r]:[v],this.patch(),A(r,this.patch)})().then():(A(this.component.stack,this.patch),this.stack=[v,...this.component.stack],this.patch())}patch(){this.stack&&this._tree&&this.component.template&&M(this._tree,o(this.component.template,this.stack))}setProp(e,s){switch(console.log("setProp()",e,s),e){case"class":case"part":case"style":return;default:this._props[e]=s}this.patch()}get component(){return this._component}get el(){return this._el}get root(){return this._tree.node}get props(){return this._props}}function E(t){return typeof t=="object"&&t.template&&t.stack}const G="beako-entity";function I(t,e){return new Proxy(t,{set(s,n,r){if(e(n,r),n==="value")return s.value=r}})}function be(t,e){return new Proxy(t,{get:function(s,n){return n==="length"?s[n]:I(s[n],e)}})}class b extends HTMLElement{tree;entity;constructor(){super();this.tree=S(this.attachShadow({mode:"open"})),this.hasAttributes()&&this.getAttributeNames().forEach(e=>{this.setProp(e,this.getAttribute(e))})}static get observedAttributes(){return["class","part","style"]}setProp(e,s){this.entity?.setProp(e,s)}static getComponent(){}get attributes(){return be(super.attributes,this.setProp)}setAttribute(e,s){this.setProp(e,s),super.setAttribute(e,s)}attributeChangedCallback(e,s,n){console.log("attributeChangedCallback()",e,s,n)}getAttributeNode(e){const s=super.getAttributeNode(e);return s&&I(s,this.setProp)}removeAttribute(e){return this.setProp(e,void 0),super.removeAttribute(e)}removeAttributeNode(e){return this.setProp(e.name,void 0),super.removeAttributeNode(e)}}class me extends b{constructor(){super()}setProp(e,s){if(e==="component")switch(typeof s){case"string":{const n=customElements.get(s);if(n&&b.isPrototypeOf(n)){const r=n.getComponent();r&&(this.entity=new T(r,this,this.tree))}break}case"object":E(s)&&(this.entity=new T(s,this,this.tree));break}super.setProp(e,s)}}customElements.define(G,me),g.evaluation=(t,e)=>o(t.template,t.stack?t.stack.concat(e):e),g.custom=(t,e)=>{const s={tag:t.tag};t.is&&(s.is=typeof t.is=="string"?t.is:o(t.is,e));let n;if(V(t))n=customElements.get(s.is)instanceof b;else{let r;for(let i=e.length-1;i>=0;i--)if(t.tag in e[i]){r=e[i][t.tag];break}E(b)?(s.tag=G,s.props={component:r},n=!0):n=customElements.get(t.tag)instanceof b}if(n){const r=[],i=[],a=(t.children||[])?.flatMap(c=>{if(typeof c!="string"){const u=c;if(u.props){if(u.props["@as"])return i.push([u.props["@as"],u]),delete u.props["@as"],[];if(u.props.slot)return[o(c,e)]}}return r.push(c),[]});return r.length&&i.push(["content",{type:"group",values:r}]),i.length&&!t.props&&(s.props={},i.forEach(([c,u])=>{s.props[c]={type:"evaluation",template:u,stack:e}})),a.length&&(s.children=a),$(t,e,s),s}else return g.element(t,e)};function m(t){if(k(t))switch(t.type){case"element":V(t)&&"is"in t||(t.type="custom");case"tree":t.children?.forEach(m);break;case"if":{m(t.truthy),m(t.falsy);break}case"each":{m(t.value);break}}return t}function V(t){switch(t.tag){case"html":case"base":case"head":case"link":case"meta":case"style":case"title":case"body":case"address":case"article":case"aside":case"footer":case"header":case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":case"main":case"nav":case"section":case"blockquote":case"dd":case"div":case"dl":case"dt":case"figcaption":case"figure":case"hr":case"li":case"ol":case"p":case"pre":case"ul":case"a":case"abbr":case"b":case"bdi":case"bdo":case"br":case"cite":case"code":case"data":case"dfn":case"em":case"i":case"kbd":case"mark":case"q":case"rp":case"rt":case"ruby":case"s":case"samp":case"small":case"span":case"strong":case"sub":case"sup":case"time":case"u":case"var":case"wbr":case"area":case"audio":case"img":case"map":case"track":case"video":case"embed":case"iframe":case"object":case"param":case"picture":case"portal":case"source":case"svg":case"math":case"canvas":case"noscript":case"script":case"del":case"ins":case"caption":case"col":case"colgroup":case"table":case"tbody":case"td":case"tfoot":case"th":case"thead":case"tr":case"button":case"datalist":case"fieldset":case"form":case"input":case"label":case"legend":case"meter":case"optgroup":case"option":case"output":case"progress":case"select":case"textarea":case"details":case"dialog":case"menu":case"summary":case"slot":case"template":return!0}return!1}export{m as extend};function L(t,e=[]){return{template:m(typeof t=="string"?B(t):t),stack:typeof e=="function"||Array.isArray(e)?e:[e]}}export{L as compact};function we(t,e,s){const n=E(e)?e:L(e,s);customElements.define(t,class extends b{constructor(){super();this.entity=new T(n,this,this.tree)}static getComponent(){return n}})}export{we as define};function Ae(t,e,s){const n=typeof t=="string"?document.querySelector(t):t.nodeType===9?t.body:t,r=S(n.attachShadow({mode:"open"})),i=E(e)?e:L(e,s);new T(i,n,r)}export{Ae as hack};
