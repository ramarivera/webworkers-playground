import{s as S}from"./index-d475d2ea.js";import{r as Ct}from"./index-da07a199.js";import{a as Nt,c as St}from"./_commonjsHelpers-de833af9.js";const{addons:$t}=__STORYBOOK_MODULE_PREVIEW_API__,{once:Ut,logger:Ft}=__STORYBOOK_MODULE_CLIENT_LOGGER__,{FORCE_REMOUNT:at,STORY_RENDER_PHASE_CHANGED:xt,SET_CURRENT_STORY:Dt,IGNORED_EXCEPTION:kt}=__STORYBOOK_MODULE_CORE_EVENTS__;var Mt=(r=>(r.DONE="done",r.ERROR="error",r.ACTIVE="active",r.WAITING="waiting",r))(Mt||{}),A={CALL:"storybook/instrumenter/call",SYNC:"storybook/instrumenter/sync",START:"storybook/instrumenter/start",BACK:"storybook/instrumenter/back",GOTO:"storybook/instrumenter/goto",NEXT:"storybook/instrumenter/next",END:"storybook/instrumenter/end"},it={start:!1,back:!1,goto:!1,next:!1,end:!1},st=new Error("This function ran after the play function completed. Did you forget to `await` it?"),lt=r=>Object.prototype.toString.call(r)==="[object Object]",Gt=r=>Object.prototype.toString.call(r)==="[object Module]",Lt=r=>{if(!lt(r)&&!Gt(r))return!1;if(r.constructor===void 0)return!0;let t=r.constructor.prototype;return!(!lt(t)||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)},Yt=r=>{try{return new r.constructor}catch{return{}}},M=()=>({renderPhase:void 0,isDebugging:!1,isPlaying:!1,isLocked:!1,cursor:0,calls:[],shadowCalls:[],callRefsByResult:new Map,chainedCallIds:new Set,ancestors:[],playUntil:void 0,resolvers:{},syncTimeout:void 0}),ct=(r,t=!1)=>{let e=(t?r.shadowCalls:r.calls).filter(n=>n.retain);if(!e.length)return;let o=new Map(Array.from(r.callRefsByResult.entries()).filter(([,n])=>n.retain));return{cursor:e.length,calls:e,callRefsByResult:o}},Wt=class{constructor(){this.initialized=!1,this.channel=$t.getChannel(),this.state=S.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__||{};let r=({storyId:a,isPlaying:s=!0,isDebugging:i=!1})=>{let p=this.getState(a);this.setState(a,{...M(),...ct(p,i),shadowCalls:i?p.shadowCalls:[],chainedCallIds:i?p.chainedCallIds:new Set,playUntil:i?p.playUntil:void 0,isPlaying:s,isDebugging:i}),this.sync(a)};this.channel.on(at,r),this.channel.on(xt,({storyId:a,newPhase:s})=>{let{isDebugging:i}=this.getState(a);this.setState(a,{renderPhase:s}),s==="preparing"&&i&&r({storyId:a}),s==="playing"&&r({storyId:a,isDebugging:i}),s==="played"&&this.setState(a,{isLocked:!1,isPlaying:!1,isDebugging:!1}),s==="errored"&&this.setState(a,{isLocked:!1,isPlaying:!1})}),this.channel.on(Dt,()=>{this.initialized?this.cleanup():this.initialized=!0});let t=({storyId:a,playUntil:s})=>{this.getState(a).isDebugging||this.setState(a,({calls:p})=>({calls:[],shadowCalls:p.map(l=>({...l,status:"waiting"})),isDebugging:!0}));let i=this.getLog(a);this.setState(a,({shadowCalls:p})=>{var c;if(s||!i.length)return{playUntil:s};let l=p.findIndex(f=>f.id===i[0].callId);return{playUntil:(c=p.slice(0,l).filter(f=>f.interceptable&&!f.ancestors.length).slice(-1)[0])==null?void 0:c.id}}),this.channel.emit(at,{storyId:a,isDebugging:!0})},e=({storyId:a})=>{var p;let s=this.getLog(a).filter(l=>!l.ancestors.length),i=s.reduceRight((l,c,f)=>l>=0||c.status==="waiting"?l:f,-1);t({storyId:a,playUntil:(p=s[i-1])==null?void 0:p.callId})},o=({storyId:a,callId:s})=>{var u;let{calls:i,shadowCalls:p,resolvers:l}=this.getState(a),c=i.find(({id:d})=>d===s),f=p.find(({id:d})=>d===s);if(!c&&f&&Object.values(l).length>0){let d=(u=this.getLog(a).find(h=>h.status==="waiting"))==null?void 0:u.callId;f.id!==d&&this.setState(a,{playUntil:f.id}),Object.values(l).forEach(h=>h())}else t({storyId:a,playUntil:s})},n=({storyId:a})=>{var i;let{resolvers:s}=this.getState(a);if(Object.values(s).length>0)Object.values(s).forEach(p=>p());else{let p=(i=this.getLog(a).find(l=>l.status==="waiting"))==null?void 0:i.callId;p?t({storyId:a,playUntil:p}):y({storyId:a})}},y=({storyId:a})=>{this.setState(a,{playUntil:void 0,isDebugging:!1}),Object.values(this.getState(a).resolvers).forEach(s=>s())};this.channel.on(A.START,t),this.channel.on(A.BACK,e),this.channel.on(A.GOTO,o),this.channel.on(A.NEXT,n),this.channel.on(A.END,y)}getState(r){return this.state[r]||M()}setState(r,t){let e=this.getState(r),o=typeof t=="function"?t(e):t;this.state={...this.state,[r]:{...e,...o}},S.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__=this.state}cleanup(){this.state=Object.entries(this.state).reduce((t,[e,o])=>{let n=ct(o);return n&&(t[e]=Object.assign(M(),n)),t},{});let r={controlStates:it,logItems:[]};this.channel.emit(A.SYNC,r),S.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__=this.state}getLog(r){let{calls:t,shadowCalls:e}=this.getState(r),o=[...e];t.forEach((y,a)=>{o[a]=y});let n=new Set;return o.reduceRight((y,a)=>(a.args.forEach(s=>{s!=null&&s.__callId__&&n.add(s.__callId__)}),a.path.forEach(s=>{s.__callId__&&n.add(s.__callId__)}),(a.interceptable||a.exception)&&!n.has(a.id)&&(y.unshift({callId:a.id,status:a.status,ancestors:a.ancestors}),n.add(a.id)),y),[])}instrument(r,t){if(!Lt(r))return r;let{mutate:e=!1,path:o=[]}=t;return Object.keys(r).reduce((n,y)=>{let a=r[y];return typeof a!="function"?(n[y]=this.instrument(a,{...t,path:o.concat(y)}),n):typeof a.__originalFn__=="function"?(n[y]=a,n):(n[y]=(...s)=>this.track(y,a,s,t),n[y].__originalFn__=a,Object.defineProperty(n[y],"name",{value:y,writable:!1}),Object.keys(a).length>0&&Object.assign(n[y],this.instrument({...a},{...t,path:o.concat(y)})),n)},e?r:Yt(r))}track(r,t,e,o){var d,h,m,I;let n=((d=e==null?void 0:e[0])==null?void 0:d.__storyId__)||((I=(m=(h=S.__STORYBOOK_PREVIEW__)==null?void 0:h.selectionStore)==null?void 0:m.selection)==null?void 0:I.storyId),{cursor:y,ancestors:a}=this.getState(n);this.setState(n,{cursor:y+1});let s=`${a.slice(-1)[0]||n} [${y}] ${r}`,{path:i=[],intercept:p=!1,retain:l=!1}=o,c=typeof p=="function"?p(r,i):p,f={id:s,cursor:y,storyId:n,ancestors:a,path:i,method:r,args:e,interceptable:c,retain:l},u=(c&&!a.length?this.intercept:this.invoke).call(this,t,f,o);return this.instrument(u,{...o,mutate:!0,path:[{__callId__:f.id}]})}intercept(r,t,e){let{chainedCallIds:o,isDebugging:n,playUntil:y}=this.getState(t.storyId),a=o.has(t.id);return!n||a||y?(y===t.id&&this.setState(t.storyId,{playUntil:void 0}),this.invoke(r,t,e)):new Promise(s=>{this.setState(t.storyId,({resolvers:i})=>({isLocked:!1,resolvers:{...i,[t.id]:s}}))}).then(()=>(this.setState(t.storyId,s=>{let{[t.id]:i,...p}=s.resolvers;return{isLocked:!0,resolvers:p}}),this.invoke(r,t,e)))}invoke(r,t,e){let{callRefsByResult:o,renderPhase:n}=this.getState(t.storyId),y=i=>{var p,l;if(o.has(i))return o.get(i);if(i instanceof Array)return i.map(y);if(i instanceof Date)return{__date__:{value:i.toISOString()}};if(i instanceof Error){let{name:c,message:f,stack:u}=i;return{__error__:{name:c,message:f,stack:u}}}if(i instanceof RegExp){let{flags:c,source:f}=i;return{__regexp__:{flags:c,source:f}}}if(i instanceof S.window.HTMLElement){let{prefix:c,localName:f,id:u,classList:d,innerText:h}=i,m=Array.from(d);return{__element__:{prefix:c,localName:f,id:u,classNames:m,innerText:h}}}return typeof i=="function"?{__function__:{name:i.name}}:typeof i=="symbol"?{__symbol__:{description:i.description}}:typeof i=="object"&&((p=i==null?void 0:i.constructor)!=null&&p.name)&&((l=i==null?void 0:i.constructor)==null?void 0:l.name)!=="Object"?{__class__:{name:i.constructor.name}}:Object.prototype.toString.call(i)==="[object Object]"?Object.fromEntries(Object.entries(i).map(([c,f])=>[c,y(f)])):i},a={...t,args:t.args.map(y)};t.path.forEach(i=>{i!=null&&i.__callId__&&this.setState(t.storyId,({chainedCallIds:p})=>({chainedCallIds:new Set(Array.from(p).concat(i.__callId__))}))});let s=i=>{if(i instanceof Error){let{name:p,message:l,stack:c,callId:f=t.id}=i,u={name:p,message:l,stack:c,callId:f};if(this.update({...a,status:"error",exception:u}),this.setState(t.storyId,d=>({callRefsByResult:new Map([...Array.from(d.callRefsByResult.entries()),[i,{__callId__:t.id,retain:t.retain}]])})),t.ancestors.length)throw Object.prototype.hasOwnProperty.call(i,"callId")||Object.defineProperty(i,"callId",{value:t.id}),i;if(i!==st)throw Ft.warn(i),kt}throw i};try{if(n==="played"&&!t.retain)throw st;let i=(e.getArgs?e.getArgs(t,this.getState(t.storyId)):t.args).map(l=>typeof l!="function"||Object.keys(l).length?l:(...c)=>{let{cursor:f,ancestors:u}=this.getState(t.storyId);this.setState(t.storyId,{cursor:0,ancestors:[...u,t.id]});let d=()=>this.setState(t.storyId,{cursor:f,ancestors:u}),h=!1;try{let m=l(...c);return m instanceof Promise?(h=!0,m.finally(d)):m}finally{h||d()}}),p=r(...i);return p&&["object","function","symbol"].includes(typeof p)&&this.setState(t.storyId,l=>({callRefsByResult:new Map([...Array.from(l.callRefsByResult.entries()),[p,{__callId__:t.id,retain:t.retain}]])})),this.update({...a,status:p instanceof Promise?"active":"done"}),p instanceof Promise?p.then(l=>(this.update({...a,status:"done"}),l),s):p}catch(i){return s(i)}}update(r){this.channel.emit(A.CALL,r),this.setState(r.storyId,({calls:t})=>{let e=t.concat(r).reduce((o,n)=>Object.assign(o,{[n.id]:n}),{});return{calls:Object.values(e).sort((o,n)=>o.id.localeCompare(n.id,void 0,{numeric:!0}))}}),this.sync(r.storyId)}sync(r){let t=()=>{var p;let{isLocked:e,isPlaying:o}=this.getState(r),n=this.getLog(r),y=(p=n.filter(({ancestors:l})=>!l.length).find(l=>l.status==="waiting"))==null?void 0:p.callId,a=n.some(l=>l.status==="active");if(e||a||n.length===0){let l={controlStates:it,logItems:n};this.channel.emit(A.SYNC,l);return}let s=n.some(l=>l.status==="done"||l.status==="error"),i={controlStates:{start:s,back:s,goto:!0,next:o,end:o},logItems:n,pausedAt:y};this.channel.emit(A.SYNC,i)};this.setState(r,({syncTimeout:e})=>(clearTimeout(e),{syncTimeout:setTimeout(t,0)}))}};function Qe(r,t={}){var e,o,n,y;try{let a=!1,s=!1;return(o=(e=S.window.location)==null?void 0:e.search)!=null&&o.includes("instrument=true")?a=!0:(y=(n=S.window.location)==null?void 0:n.search)!=null&&y.includes("instrument=false")&&(s=!0),S.window.parent===S.window&&!a||s?r:(S.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__||(S.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__=new Wt),S.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__.instrument(r,t))}catch(a){return Ut.warn(a),r}}var j={exports:{}};j.exports;var yt;function Ze(){return yt||(yt=1,function(r){const t=(l,c)=>(...f)=>`\x1B[${l(...f)+c}m`,e=(l,c)=>(...f)=>{const u=l(...f);return`\x1B[${38+c};5;${u}m`},o=(l,c)=>(...f)=>{const u=l(...f);return`\x1B[${38+c};2;${u[0]};${u[1]};${u[2]}m`},n=l=>l,y=(l,c,f)=>[l,c,f],a=(l,c,f)=>{Object.defineProperty(l,c,{get:()=>{const u=f();return Object.defineProperty(l,c,{value:u,enumerable:!0,configurable:!0}),u},enumerable:!0,configurable:!0})};let s;const i=(l,c,f,u)=>{s===void 0&&(s=Ct());const d=u?10:0,h={};for(const[m,I]of Object.entries(s)){const ot=m==="ansi16"?"ansi":m;m===c?h[ot]=l(f,d):typeof I=="object"&&(h[ot]=l(I[c],d))}return h};function p(){const l=new Map,c={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}};c.color.gray=c.color.blackBright,c.bgColor.bgGray=c.bgColor.bgBlackBright,c.color.grey=c.color.blackBright,c.bgColor.bgGrey=c.bgColor.bgBlackBright;for(const[f,u]of Object.entries(c)){for(const[d,h]of Object.entries(u))c[d]={open:`\x1B[${h[0]}m`,close:`\x1B[${h[1]}m`},u[d]=c[d],l.set(h[0],h[1]);Object.defineProperty(c,f,{value:u,enumerable:!1})}return Object.defineProperty(c,"codes",{value:l,enumerable:!1}),c.color.close="\x1B[39m",c.bgColor.close="\x1B[49m",a(c.color,"ansi",()=>i(t,"ansi16",n,!1)),a(c.color,"ansi256",()=>i(e,"ansi256",n,!1)),a(c.color,"ansi16m",()=>i(o,"rgb",y,!1)),a(c.bgColor,"ansi",()=>i(t,"ansi16",n,!0)),a(c.bgColor,"ansi256",()=>i(e,"ansi256",n,!0)),a(c.bgColor,"ansi16m",()=>i(o,"rgb",y,!0)),c}Object.defineProperty(r,"exports",{enumerable:!0,get:p})}(j)),j.exports}var G,pt;function tr(){return pt||(pt=1,G={stdout:!1,stderr:!1}),G}var At=function(){if(typeof Symbol!="function"||typeof Object.getOwnPropertySymbols!="function")return!1;if(typeof Symbol.iterator=="symbol")return!0;var t={},e=Symbol("test"),o=Object(e);if(typeof e=="string"||Object.prototype.toString.call(e)!=="[object Symbol]"||Object.prototype.toString.call(o)!=="[object Symbol]")return!1;var n=42;t[e]=n;for(e in t)return!1;if(typeof Object.keys=="function"&&Object.keys(t).length!==0||typeof Object.getOwnPropertyNames=="function"&&Object.getOwnPropertyNames(t).length!==0)return!1;var y=Object.getOwnPropertySymbols(t);if(y.length!==1||y[0]!==e||!Object.prototype.propertyIsEnumerable.call(t,e))return!1;if(typeof Object.getOwnPropertyDescriptor=="function"){var a=Object.getOwnPropertyDescriptor(t,e);if(a.value!==n||a.enumerable!==!0)return!1}return!0},ft=typeof Symbol<"u"&&Symbol,Vt=At,Kt=function(){return typeof ft!="function"||typeof Symbol!="function"||typeof ft("foo")!="symbol"||typeof Symbol("bar")!="symbol"?!1:Vt()},ut={foo:{}},qt=Object,zt=function(){return{__proto__:ut}.foo===ut.foo&&!({__proto__:null}instanceof qt)},Ht="Function.prototype.bind called on incompatible ",L=Array.prototype.slice,Jt=Object.prototype.toString,Xt="[object Function]",Qt=function(t){var e=this;if(typeof e!="function"||Jt.call(e)!==Xt)throw new TypeError(Ht+e);for(var o=L.call(arguments,1),n,y=function(){if(this instanceof n){var l=e.apply(this,o.concat(L.call(arguments)));return Object(l)===l?l:this}else return e.apply(t,o.concat(L.call(arguments)))},a=Math.max(0,e.length-o.length),s=[],i=0;i<a;i++)s.push("$"+i);if(n=Function("binder","return function ("+s.join(",")+"){ return binder.apply(this,arguments); }")(y),e.prototype){var p=function(){};p.prototype=e.prototype,n.prototype=new p,p.prototype=null}return n},Zt=Qt,tt=Function.prototype.bind||Zt,te=tt,ee=te.call(Function.call,Object.prototype.hasOwnProperty),g,T=SyntaxError,vt=Function,w=TypeError,Y=function(r){try{return vt('"use strict"; return ('+r+").constructor;")()}catch{}},v=Object.getOwnPropertyDescriptor;if(v)try{v({},"")}catch{v=null}var W=function(){throw new w},re=v?function(){try{return arguments.callee,W}catch{try{return v(arguments,"callee").get}catch{return W}}}():W,O=Kt(),ne=zt(),b=Object.getPrototypeOf||(ne?function(r){return r.__proto__}:null),E={},oe=typeof Uint8Array>"u"||!b?g:b(Uint8Array),_={"%AggregateError%":typeof AggregateError>"u"?g:AggregateError,"%Array%":Array,"%ArrayBuffer%":typeof ArrayBuffer>"u"?g:ArrayBuffer,"%ArrayIteratorPrototype%":O&&b?b([][Symbol.iterator]()):g,"%AsyncFromSyncIteratorPrototype%":g,"%AsyncFunction%":E,"%AsyncGenerator%":E,"%AsyncGeneratorFunction%":E,"%AsyncIteratorPrototype%":E,"%Atomics%":typeof Atomics>"u"?g:Atomics,"%BigInt%":typeof BigInt>"u"?g:BigInt,"%BigInt64Array%":typeof BigInt64Array>"u"?g:BigInt64Array,"%BigUint64Array%":typeof BigUint64Array>"u"?g:BigUint64Array,"%Boolean%":Boolean,"%DataView%":typeof DataView>"u"?g:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":typeof Float32Array>"u"?g:Float32Array,"%Float64Array%":typeof Float64Array>"u"?g:Float64Array,"%FinalizationRegistry%":typeof FinalizationRegistry>"u"?g:FinalizationRegistry,"%Function%":vt,"%GeneratorFunction%":E,"%Int8Array%":typeof Int8Array>"u"?g:Int8Array,"%Int16Array%":typeof Int16Array>"u"?g:Int16Array,"%Int32Array%":typeof Int32Array>"u"?g:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":O&&b?b(b([][Symbol.iterator]())):g,"%JSON%":typeof JSON=="object"?JSON:g,"%Map%":typeof Map>"u"?g:Map,"%MapIteratorPrototype%":typeof Map>"u"||!O||!b?g:b(new Map()[Symbol.iterator]()),"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":typeof Promise>"u"?g:Promise,"%Proxy%":typeof Proxy>"u"?g:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":typeof Reflect>"u"?g:Reflect,"%RegExp%":RegExp,"%Set%":typeof Set>"u"?g:Set,"%SetIteratorPrototype%":typeof Set>"u"||!O||!b?g:b(new Set()[Symbol.iterator]()),"%SharedArrayBuffer%":typeof SharedArrayBuffer>"u"?g:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":O&&b?b(""[Symbol.iterator]()):g,"%Symbol%":O?Symbol:g,"%SyntaxError%":T,"%ThrowTypeError%":re,"%TypedArray%":oe,"%TypeError%":w,"%Uint8Array%":typeof Uint8Array>"u"?g:Uint8Array,"%Uint8ClampedArray%":typeof Uint8ClampedArray>"u"?g:Uint8ClampedArray,"%Uint16Array%":typeof Uint16Array>"u"?g:Uint16Array,"%Uint32Array%":typeof Uint32Array>"u"?g:Uint32Array,"%URIError%":URIError,"%WeakMap%":typeof WeakMap>"u"?g:WeakMap,"%WeakRef%":typeof WeakRef>"u"?g:WeakRef,"%WeakSet%":typeof WeakSet>"u"?g:WeakSet};if(b)try{null.error}catch(r){var ae=b(b(r));_["%Error.prototype%"]=ae}var ie=function r(t){var e;if(t==="%AsyncFunction%")e=Y("async function () {}");else if(t==="%GeneratorFunction%")e=Y("function* () {}");else if(t==="%AsyncGeneratorFunction%")e=Y("async function* () {}");else if(t==="%AsyncGenerator%"){var o=r("%AsyncGeneratorFunction%");o&&(e=o.prototype)}else if(t==="%AsyncIteratorPrototype%"){var n=r("%AsyncGenerator%");n&&b&&(e=b(n.prototype))}return _[t]=e,e},gt={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},R=tt,U=ee,se=R.call(Function.call,Array.prototype.concat),le=R.call(Function.apply,Array.prototype.splice),dt=R.call(Function.call,String.prototype.replace),F=R.call(Function.call,String.prototype.slice),ce=R.call(Function.call,RegExp.prototype.exec),ye=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,pe=/\\(\\)?/g,fe=function(t){var e=F(t,0,1),o=F(t,-1);if(e==="%"&&o!=="%")throw new T("invalid intrinsic syntax, expected closing `%`");if(o==="%"&&e!=="%")throw new T("invalid intrinsic syntax, expected opening `%`");var n=[];return dt(t,ye,function(y,a,s,i){n[n.length]=s?dt(i,pe,"$1"):a||y}),n},ue=function(t,e){var o=t,n;if(U(gt,o)&&(n=gt[o],o="%"+n[0]+"%"),U(_,o)){var y=_[o];if(y===E&&(y=ie(o)),typeof y>"u"&&!e)throw new w("intrinsic "+t+" exists, but is not available. Please file an issue!");return{alias:n,name:o,value:y}}throw new T("intrinsic "+t+" does not exist!")},et=function(t,e){if(typeof t!="string"||t.length===0)throw new w("intrinsic name must be a non-empty string");if(arguments.length>1&&typeof e!="boolean")throw new w('"allowMissing" argument must be a boolean');if(ce(/^%?[^%]*%?$/,t)===null)throw new T("`%` may not be present anywhere but at the beginning and end of the intrinsic name");var o=fe(t),n=o.length>0?o[0]:"",y=ue("%"+n+"%",e),a=y.name,s=y.value,i=!1,p=y.alias;p&&(n=p[0],le(o,se([0,1],p)));for(var l=1,c=!0;l<o.length;l+=1){var f=o[l],u=F(f,0,1),d=F(f,-1);if((u==='"'||u==="'"||u==="`"||d==='"'||d==="'"||d==="`")&&u!==d)throw new T("property names with quotes must have matching quotes");if((f==="constructor"||!c)&&(i=!0),n+="."+f,a="%"+n+"%",U(_,a))s=_[a];else if(s!=null){if(!(f in s)){if(!e)throw new w("base intrinsic for "+t+" exists, but the property is not available.");return}if(v&&l+1>=o.length){var h=v(s,f);c=!!h,c&&"get"in h&&!("originalValue"in h.get)?s=h.get:s=s[f]}else c=U(s,f),s=s[f];c&&!i&&(_[a]=s)}}return s},_t={exports:{}};(function(r){var t=tt,e=et,o=e("%Function.prototype.apply%"),n=e("%Function.prototype.call%"),y=e("%Reflect.apply%",!0)||t.call(n,o),a=e("%Object.getOwnPropertyDescriptor%",!0),s=e("%Object.defineProperty%",!0),i=e("%Math.max%");if(s)try{s({},"a",{value:1})}catch{s=null}r.exports=function(c){var f=y(t,n,arguments);if(a&&s){var u=a(f,"length");u.configurable&&s(f,"length",{value:1+i(0,c.length-(arguments.length-1))})}return f};var p=function(){return y(t,o,arguments)};s?s(r.exports,"apply",{value:p}):r.exports.apply=p})(_t);var Ot=_t.exports,Et=et,Pt=Ot,ge=Pt(Et("String.prototype.indexOf")),wt=function(t,e){var o=Et(t,!!e);return typeof o=="function"&&ge(t,".prototype.")>-1?Pt(o):o},de=At,Tt=function(){return de()&&!!Symbol.toStringTag},he=Tt(),be=wt,H=be("Object.prototype.toString"),k=function(t){return he&&t&&typeof t=="object"&&Symbol.toStringTag in t?!1:H(t)==="[object Arguments]"},It=function(t){return k(t)?!0:t!==null&&typeof t=="object"&&typeof t.length=="number"&&t.length>=0&&H(t)!=="[object Array]"&&H(t.callee)==="[object Function]"},me=function(){return k(arguments)}();k.isLegacyArguments=It;var er=me?k:It;const Se={},Ae=Object.freeze(Object.defineProperty({__proto__:null,default:Se},Symbol.toStringTag,{value:"Module"})),rr=Nt(Ae);var Rt=Function.prototype.toString,P=typeof Reflect=="object"&&Reflect!==null&&Reflect.apply,J,B;if(typeof P=="function"&&typeof Object.defineProperty=="function")try{J=Object.defineProperty({},"length",{get:function(){throw B}}),B={},P(function(){throw 42},null,J)}catch(r){r!==B&&(P=null)}else P=null;var ve=/^\s*class\b/,X=function(t){try{var e=Rt.call(t);return ve.test(e)}catch{return!1}},V=function(t){try{return X(t)?!1:(Rt.call(t),!0)}catch{return!1}},C=Object.prototype.toString,_e="[object Object]",Oe="[object Function]",Ee="[object GeneratorFunction]",Pe="[object HTMLAllCollection]",we="[object HTML document.all class]",Te="[object HTMLCollection]",Ie=typeof Symbol=="function"&&!!Symbol.toStringTag,Re=!(0 in[,]),Q=function(){return!1};if(typeof document=="object"){var je=document.all;C.call(je)===C.call(document.all)&&(Q=function(t){if((Re||!t)&&(typeof t>"u"||typeof t=="object"))try{var e=C.call(t);return(e===Pe||e===we||e===Te||e===_e)&&t("")==null}catch{}return!1})}var Be=P?function(t){if(Q(t))return!0;if(!t||typeof t!="function"&&typeof t!="object")return!1;try{P(t,null,J)}catch(e){if(e!==B)return!1}return!X(t)&&V(t)}:function(t){if(Q(t))return!0;if(!t||typeof t!="function"&&typeof t!="object")return!1;if(Ie)return V(t);if(X(t))return!1;var e=C.call(t);return e!==Oe&&e!==Ee&&!/^\[object HTML/.test(e)?!1:V(t)},Ce=Be,Ne=Object.prototype.toString,jt=Object.prototype.hasOwnProperty,$e=function(t,e,o){for(var n=0,y=t.length;n<y;n++)jt.call(t,n)&&(o==null?e(t[n],n,t):e.call(o,t[n],n,t))},Ue=function(t,e,o){for(var n=0,y=t.length;n<y;n++)o==null?e(t.charAt(n),n,t):e.call(o,t.charAt(n),n,t)},Fe=function(t,e,o){for(var n in t)jt.call(t,n)&&(o==null?e(t[n],n,t):e.call(o,t[n],n,t))},xe=function(t,e,o){if(!Ce(e))throw new TypeError("iterator must be a function");var n;arguments.length>=3&&(n=o),Ne.call(t)==="[object Array]"?$e(t,e,n):typeof t=="string"?Ue(t,e,n):Fe(t,e,n)},De=xe,K=["BigInt64Array","BigUint64Array","Float32Array","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray"],ke=typeof globalThis>"u"?St:globalThis,Me=function(){for(var t=[],e=0;e<K.length;e++)typeof ke[K[e]]=="function"&&(t[t.length]=K[e]);return t},Ge=et,N=Ge("%Object.getOwnPropertyDescriptor%",!0);if(N)try{N([],"length")}catch{N=null}var Le=N,x=De,Ye=Me,ht=Ot,rt=wt,$=Le,We=rt("Object.prototype.toString"),Bt=Tt(),bt=typeof globalThis>"u"?St:globalThis,Z=Ye(),nt=rt("String.prototype.slice"),q=Object.getPrototypeOf,Ve=rt("Array.prototype.indexOf",!0)||function(t,e){for(var o=0;o<t.length;o+=1)if(t[o]===e)return o;return-1},D={__proto__:null};Bt&&$&&q?x(Z,function(r){var t=new bt[r];if(Symbol.toStringTag in t){var e=q(t),o=$(e,Symbol.toStringTag);if(!o){var n=q(e);o=$(n,Symbol.toStringTag)}D["$"+r]=ht(o.get)}}):x(Z,function(r){var t=new bt[r];D["$"+r]=ht(t.slice)});var Ke=function(t){var e=!1;return x(D,function(o,n){if(!e)try{"$"+o(t)===n&&(e=nt(n,1))}catch{}}),e},qe=function(t){var e=!1;return x(D,function(o,n){if(!e)try{o(t),e=nt(n,1)}catch{}}),e},ze=function(t){if(!t||typeof t!="object")return!1;if(!Bt){var e=nt(We(t),8,-1);return Ve(Z,e)>-1?e:e!=="Object"?!1:qe(t)}return $?Ke(t):null},z,mt;function nr(){if(mt)return z;mt=1;var r=ze;return z=function(e){return!!r(e)},z}export{tr as a,rr as b,nr as c,Qe as d,At as e,wt as f,et as g,Ot as h,er as i,ee as j,Kt as k,Ze as r,Tt as s,ze as w};
//# sourceMappingURL=index-ae9ebf78.js.map