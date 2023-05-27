var E=class{constructor(){this._historyStack=[null];this._currentIndex=0;this._handlers=new Map;this.scrollRestoration="auto"}get length(){return this._historyStack.length}get state(){return this._historyStack.length?this._historyStack[this._currentIndex]:null}go(t){setTimeout(()=>{if(t!==0){let s=Math.min(Math.max(this._currentIndex+t,0),this._historyStack.length-1);this._currentIndex!==s&&this._dispatchEvent({type:"popstate",state:this._historyStack[s]}),this._currentIndex=s}else this._historyStack.length&&this._dispatchEvent({type:"reload",state:this._historyStack[this._currentIndex]})},1)}back(){this.go(-1)}forward(){this.go(1)}pushState(t){this._historyStack.splice(this._currentIndex+1,this._historyStack.length-this._currentIndex-1,t),this._currentIndex++}replaceState(t){this._historyStack.splice(this._currentIndex,this._historyStack.length-this._currentIndex,t)}addEventListener(t,s){this._handlers.has(t)||this._handlers.set(t,new Set),this._handlers.get(t).add(s)}removeEventListener(t,s){!this._handlers.has(t)||this._handlers.get(t).delete(s)}_dispatchEvent(t){let s=this._handlers.get(t.type);if(s){let u=!1,g=()=>{u=!0};for(let T of s)if(T({...t,stopImmediatePropagation:g}),u)break}}};function z(r=new E){let t,s=[],u=null,g=new Map,T=e=>{t.pathname=e.pathname,t.pattern=e.pattern,t.params=e.params,t.props=e.props,t.query=e.query},H=(e,...n)=>{let i=z();if(e==="*")u=[e,[],n,new b(i,void 0,a=>!!a.size)];else{let a=e.split("/"),p=a.length;for(;s.length<p+1;)s.push([new Set,new Map]);let o=s[p][0],d=s[p][1],m=a.reduce((c,h,w)=>c|(h[0]===":"?1:0)<<p-1-w,0),l=a.map(c=>c[0]===":"?"*":c).join("/"),k=[];a.forEach((c,h)=>c[0]===":"&&k.push([c.slice(1),h])),o.add(m),s[p][0]=new Set(Array.from(o).sort()),d.set(l,[e,k,n,new b(i,void 0,c=>!!c.size)])}return i},D=(...e)=>(n,...i)=>H(n,...e,...i),v=(e,n,i,a,p)=>new Promise((o,d)=>{let m={pathname:e,props:n,query:i};(async()=>{try{let l=2,k=()=>{l=2},c=(h,w,S)=>{v(h,w,S).then(o).catch(d),l=1};for(let h of V(e)){let w={parent:p,from:r.state,pathname:e,params:h[0],pattern:h[1][0]},S=f(n||{}),M=f(i||{}),Q=(R,y,_)=>{let q=h[1][3].deref();q&&q.open(R,y,_,null,Object.assign({props:f(S),query:f(M)},w)).then(o).catch(d),l=1},j=(R,y)=>{R&&(S=R),y&&(M=y)};l=0;for(let R of h[1][2]){let y=Object.assign({props:S,query:M,next:j,redirect:c,branch:Q,through:k,block:async _=>{l=3,_&&await _(y),l=3},call:async _=>await _(y)},w);if(await R(y)===!1&&(l=3),l!==0)break}if(l!==2){l===0?o({input:m,parent:p,from:r.state,pathname:e,params:h[0],pattern:h[1][0],props:f(S),query:f(M)}):l===3&&d(Error("blocked"));break}}l===2&&d(Error("not found"))}catch(l){d(l)}})()}).then(o=>(T(o),o)),I=(e,n,i)=>v(e,n,i).then(a=>{r.pushState(C(a,!0),"",P(a.pathname,a.query))}).catch(()=>{}),F=(e,n,i)=>v(e,n,i).then(a=>{r.replaceState(C(a,!0),"",P(a.pathname,a.query))}).catch(()=>{}),J=()=>r.back(),N=()=>r.forward(),U=e=>r.go(e),x=new Map;t={pathname:null,pattern:null,params:{},props:{},query:{},panel:null,get size(){return s.reduce((e,n)=>e+n[1].size,0)+(u?1:0)},page:H,section:D,open:v,push:I,replace:F,back:J,forward:N,go:U,embed:G,link:(e,n,i)=>{let a=P(e,i||{});if(!n&&x.has(a))return x.get(a);let o={href:a,onclick:d=>{I(e,n,i),d.preventDefault()}};return n||x.set(a,o),o}};function*V(e){let n=e.split("/"),i=n.length;if(s[i]){let a=s[i][0],p=s[i][1];for(let o of a){let d=n.map((m,l)=>1<<i-1-l&o?"*":m).join("/");if(p.has(d)){let m=p.get(d),l={};m[1].forEach(k=>{l[k[0]]=n[k[1]]}),yield[l,m]}}}u&&(yield[{},u])}async function A(e,n,i){if(i){if(!g.has(e)){let a=await O(n);g.set(e,a instanceof Element?a:await i(a))}return g.get(e)}else return await O(n)}function G(e,n){return async i=>{t.panel=await A(i.pattern,e,n)}}let L=e=>{if(e.state){let n=e.state;for(;n.parent;)n=n.parent;let i=n.input;v(i.pathname,i.props,i.query)}};return r===self.history?self.addEventListener("popstate",L):r.addEventListener("popstate",L),t}var b=class{constructor(t,s=6e4,u){this._ref=t,setTimeout(()=>{this._ref&&(u&&u(this._ref)||(this._ref=void 0))},s)}deref(){return this._ref}};function f(r){return structuredClone?structuredClone(r):JSON.parse(JSON.stringify(r))}function C(r,t=!1){return{input:r.input,parent:r.parent?C(r.parent,t):void 0,from:!t&&r.from?C(r.from,t):void 0,pathname:r.pathname,params:f(r.params),pattern:r.pattern,props:f(r.props),query:f(r.query)}}function P(r,t){let s=new URLSearchParams;for(let g in t)s.append(g,t[g]);let u=s.toString();return r+(u?"?"+u:"")}async function O(r){return typeof r=="string"?await import(r):await r}export{E as MemoryHistory,z as walk};