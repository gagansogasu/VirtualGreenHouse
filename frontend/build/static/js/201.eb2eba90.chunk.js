"use strict";(self.webpackChunkvirtual_greenhouse_frontend=self.webpackChunkvirtual_greenhouse_frontend||[]).push([[201],{201:(e,s,a)=>{a.r(s),a.d(s,{default:()=>J});var t=a(43),i=a(216),r=a(475),n=a(621);let l={data:""},o=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||l,d=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,h=/\n+/g,p=(e,s)=>{let a="",t="",i="";for(let r in e){let n=e[r];"@"==r[0]?"i"==r[1]?a=r+" "+n+";":t+="f"==r[1]?p(n,r):r+"{"+p(n,"k"==r[1]?"":s)+"}":"object"==typeof n?t+=p(n,s?s.replace(/([^,])+/g,(e=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,(s=>/&/.test(s)?s.replace(/&/g,e):e?e+" "+s:s)))):r):null!=n&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=p.p?p.p(r,n):r+":"+n+";")}return a+(s&&i?s+"{"+i+"}":i)+t},m={},u=e=>{if("object"==typeof e){let s="";for(let a in e)s+=a+u(e[a]);return s}return e},x=(e,s,a,t,i)=>{let r=u(e),n=m[r]||(m[r]=(e=>{let s=0,a=11;for(;s<e.length;)a=101*a+e.charCodeAt(s++)>>>0;return"go"+a})(r));if(!m[n]){let s=r!==e?e:(e=>{let s,a,t=[{}];for(;s=d.exec(e.replace(c,""));)s[4]?t.shift():s[3]?(a=s[3].replace(h," ").trim(),t.unshift(t[0][a]=t[0][a]||{})):t[0][s[1]]=s[2].replace(h," ").trim();return t[0]})(e);m[n]=p(i?{["@keyframes "+n]:s}:s,a?"":"."+n)}let l=a&&m.g?m.g:null;return a&&(m.g=m[n]),((e,s,a,t)=>{t?s.data=s.data.replace(t,e):-1===s.data.indexOf(e)&&(s.data=a?e+s.data:s.data+e)})(m[n],s,t,l),n};function j(e){let s=this||{},a=e.call?e(s.p):e;return x(a.unshift?a.raw?((e,s,a)=>e.reduce(((e,t,i)=>{let r=s[i];if(r&&r.call){let e=r(a),s=e&&e.props&&e.props.className||/^go/.test(e)&&e;r=s?"."+s:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+t+(null==r?"":r)}),""))(a,[].slice.call(arguments,1),s.p):a.reduce(((e,a)=>Object.assign(e,a&&a.call?a(s.p):a)),{}):a,o(s.target),s.g,s.o,s.k)}j.bind({g:1});let f,g,v,N=j.bind({k:1});function b(e,s){let a=this||{};return function(){let t=arguments;function i(r,n){let l=Object.assign({},r),o=l.className||i.className;a.p=Object.assign({theme:g&&g()},l),a.o=/ *go\d+/.test(o),l.className=j.apply(a,t)+(o?" "+o:""),s&&(l.ref=n);let d=e;return e[0]&&(d=l.as||e,delete l.as),v&&d[0]&&v(l),f(d,l)}return s?s(i):i}}var y=(e,s)=>(e=>"function"==typeof e)(e)?e(s):e,w=(()=>{let e=0;return()=>(++e).toString()})(),S=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let s=matchMedia("(prefers-reduced-motion: reduce)");e=!s||s.matches}return e}})(),k=(e,s)=>{switch(s.type){case 0:return{...e,toasts:[s.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map((e=>e.id===s.toast.id?{...e,...s.toast}:e))};case 2:let{toast:a}=s;return k(e,{type:e.toasts.find((e=>e.id===a.id))?1:0,toast:a});case 3:let{toastId:t}=s;return{...e,toasts:e.toasts.map((e=>e.id===t||void 0===t?{...e,dismissed:!0,visible:!1}:e))};case 4:return void 0===s.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter((e=>e.id!==s.toastId))};case 5:return{...e,pausedAt:s.time};case 6:let i=s.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map((e=>({...e,pauseDuration:e.pauseDuration+i})))}}},C=[],P={toasts:[],pausedAt:void 0},F=e=>{P=k(P,e),C.forEach((e=>{e(P)}))},A=e=>(s,a)=>{let t=function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"blank",a=arguments.length>2?arguments[2]:void 0;return{createdAt:Date.now(),visible:!0,dismissed:!1,type:s,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}}(s,e,a);return F({type:2,toast:t}),t.id},E=(e,s)=>A("blank")(e,s);E.error=A("error"),E.success=A("success"),E.loading=A("loading"),E.custom=A("custom"),E.dismiss=e=>{F({type:3,toastId:e})},E.remove=e=>F({type:4,toastId:e}),E.promise=(e,s,a)=>{let t=E.loading(s.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then((e=>{let i=s.success?y(s.success,e):void 0;return i?E.success(i,{id:t,...a,...null==a?void 0:a.success}):E.dismiss(t),e})).catch((e=>{let i=s.error?y(s.error,e):void 0;i?E.error(i,{id:t,...a,...null==a?void 0:a.error}):E.dismiss(t)})),e};new Map;var _=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=N`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=N`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,$=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${D} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,O=N`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${O} 1s linear infinite;
`,L=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,M=N`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,z=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${M} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,T=b("div")`
  position: absolute;
`,R=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=N`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,U=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,X=e=>{let{toast:s}=e,{icon:a,type:i,iconTheme:r}=s;return void 0!==a?"string"==typeof a?t.createElement(U,null,a):a:"blank"===i?null:t.createElement(R,null,t.createElement(q,{...r}),"loading"!==i&&t.createElement(T,null,"error"===i?t.createElement($,{...r}):t.createElement(z,{...r})))},Z=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,G=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,H=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Q=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;t.memo((e=>{let{toast:s,position:a,style:i,children:r}=e,n=s.height?((e,s)=>{let a=e.includes("top")?1:-1,[t,i]=S()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[Z(a),G(a)];return{animation:s?`${N(t)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${N(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(s.position||a||"top-center",s.visible):{opacity:0},l=t.createElement(X,{toast:s}),o=t.createElement(Q,{...s.ariaProps},y(s.message,s));return t.createElement(H,{className:s.className,style:{...n,...i,...s.style}},"function"==typeof r?r({icon:l,message:o}):t.createElement(t.Fragment,null,l,o))}));!function(e,s,a,t){p.p=s,f=e,g=a,v=t}(t.createElement);j`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var B=a(579);const J=()=>{var e,s;const[a,l]=(0,t.useState)(null),[o,d]=(0,t.useState)([]),[c,h]=(0,t.useState)(!0),[p,m]=(0,t.useState)(null),[u,x]=(0,t.useState)(null),[j,f]=(0,t.useState)({name:"",category:"",description:"",price:"",inStock:!0,image:null,model3d:null}),[g,v]=(0,t.useState)(!1),N=(0,i.Zp)(),[b,y]=(0,t.useState)([]),[w,S]=(0,t.useState)(!1),[k,C]=(0,t.useState)({shopName:"",phone:"",address:"",description:""}),[P,F]=(0,t.useState)(null),[A,_]=(0,t.useState)(!1),D=(0,t.useCallback)((async()=>{h(!0),m(null);try{const e=(await n.dP.getProfile()).data;l(e),C({shopName:e.shopName||"",phone:e.phone||"",address:e.address||"",description:e.description||""});try{const e=await n.rX.getShopOrders();d(e.data||[])}catch(a){console.error("Error fetching shop orders:",a),d([])}try{const e=await n.gc.getPlants();y(e.data||[])}catch(t){console.error("Error fetching plants:",t),y([])}}catch(p){var e,s;console.error("Error fetching shop data:",p),m((null===(e=p.response)||void 0===e||null===(s=e.data)||void 0===s?void 0:s.message)||"Failed to fetch shop data")}finally{h(!1)}}),[]);(0,t.useEffect)((()=>{D();const e=setInterval((()=>{n.rX.getShopOrders().then((e=>{d(e.data||[])})).catch((e=>{console.error("Error refreshing orders:",e)}))}),3e4);return()=>clearInterval(e)}),[D]);const I=(0,t.useCallback)((()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),localStorage.removeItem("userType"),window.location.href="/login"}),[]),$=(0,t.useCallback)((e=>{const{name:s,value:a}=e.target;C((e=>({...e,[s]:a})))}),[]),O=(0,t.useCallback)((async e=>{e.preventDefault(),_(!0),F(null);try{const e=await n.dP.updateProfile(k);e.data&&(l(e.data.shop),S(!1),alert("Profile updated successfully!"))}catch(p){var s,a;console.error("Error updating profile:",p),F((null===(s=p.response)||void 0===s||null===(a=s.data)||void 0===a?void 0:a.message)||"Failed to update profile")}finally{_(!1)}}),[k]),q=(0,t.useCallback)((e=>{const{name:s,value:a,type:t,checked:i,files:r}=e.target;f((e=>({...e,[s]:"checkbox"===t?i:"file"===t?r[0]:a}))),!u||"name"!==s&&"price"!==s||x(null)}),[u]),L=(0,t.useCallback)((async e=>{if(e.preventDefault(),v(!0),x(null),!j.name.trim()||!j.price||!j.category||!j.description)return x("Please fill in all required fields (name, price, category, description)."),void v(!1);try{const e=new FormData;e.append("name",j.name),e.append("category",j.category),e.append("description",j.description),e.append("price",j.price),e.append("inStock",j.inStock),e.append("stock",j.inStock?10:0),j.image&&e.append("image",j.image),j.model3d&&e.append("model3d",j.model3d);const a=await n.gc.addPlant(e);var s;if(a.data&&a.data.success)alert(a.data.message||"Plant added successfully!"),f({name:"",category:"",description:"",price:"",inStock:!0,image:null,model3d:null}),D();else x((null===(s=a.data)||void 0===s?void 0:s.message)||"Failed to add plant.")}catch(p){var a,t;console.error("Error adding plant:",p),x((null===(a=p.response)||void 0===a||null===(t=a.data)||void 0===t?void 0:t.message)||"An error occurred while adding the plant.")}finally{v(!1)}}),[j,D]);return c&&!a?(0,B.jsxs)("div",{className:"loading-spinner",children:[(0,B.jsx)("div",{className:"spinner"}),(0,B.jsx)("p",{children:"Loading dashboard..."})]}):p&&!a?(0,B.jsxs)("div",{className:"error-container",children:[(0,B.jsx)("h2",{children:"Error Loading Shop Dashboard"}),(0,B.jsx)("p",{children:p}),(0,B.jsx)("button",{onClick:D,className:"retry-button",children:"Retry"})]}):c||a?(0,B.jsxs)("div",{className:"dashboard-container",children:[(0,B.jsxs)("div",{className:"sidebar",children:[(0,B.jsxs)("div",{className:"logo-container",children:[(0,B.jsx)("h2",{children:"\ud83c\udf3f Virtual Greenhouse"}),(0,B.jsx)("p",{className:"shop-type",children:"Shop Portal"})]}),(0,B.jsx)("div",{className:"shop-info",children:a&&(0,B.jsxs)("div",{className:"shop-profile",children:[(0,B.jsx)("div",{className:"shop-avatar",children:(null===(e=a.shopName)||void 0===e?void 0:e.charAt(0))||"S"}),(0,B.jsxs)("div",{className:"shop-details",children:[(0,B.jsx)("h3",{children:a.shopName||"My Shop"}),(0,B.jsx)("p",{children:a.email||"shop@example.com"})]})]})}),(0,B.jsx)("nav",{children:(0,B.jsxs)("ul",{children:[(0,B.jsx)("li",{className:"active",children:(0,B.jsxs)(r.N_,{to:"/shop-dashboard",children:[(0,B.jsx)("i",{className:"fas fa-home"})," Dashboard"]})}),(0,B.jsx)("li",{children:(0,B.jsxs)(r.N_,{to:"/shop-dashboard/orders",children:[(0,B.jsx)("i",{className:"fas fa-shopping-bag"})," Orders"]})}),(0,B.jsx)("li",{children:(0,B.jsxs)(r.N_,{to:"/shop-dashboard/add-plant",children:[(0,B.jsx)("i",{className:"fas fa-plus-circle"})," Add New Plant"]})}),(0,B.jsx)("li",{children:(0,B.jsxs)(r.N_,{to:"/shop-dashboard/my-plants",children:[(0,B.jsx)("i",{className:"fas fa-leaf"})," My Plants"]})}),(0,B.jsx)("li",{children:(0,B.jsxs)(r.N_,{to:"/shop-dashboard/profile",children:[(0,B.jsx)("i",{className:"fas fa-user"})," Profile"]})}),(0,B.jsxs)("li",{onClick:I,className:"logout-btn",children:[(0,B.jsx)("i",{className:"fas fa-sign-out-alt"})," Logout"]})]})})]}),(0,B.jsxs)("div",{className:"main",children:[(0,B.jsxs)("header",{className:"dashboard-header",children:[(0,B.jsx)("div",{className:"header-left",children:(0,B.jsx)("h1",{children:"Shop Dashboard"})}),(0,B.jsxs)("div",{className:"header-right",children:[(0,B.jsxs)("button",{className:"refresh-btn",onClick:()=>{h(!0),n.rX.getShopOrders().then((e=>{d(e.data||[]),E.success("Orders refreshed successfully!")})).catch((e=>{console.error("Error refreshing orders:",e),E.error("Failed to refresh orders")})).finally((()=>{h(!1)}))},disabled:c,children:[(0,B.jsx)("i",{className:"fas fa-sync-alt"})," Refresh Orders"]}),(0,B.jsx)("div",{className:"user-info",children:(0,B.jsx)("span",{children:(null===a||void 0===a?void 0:a.shopName)||"Shop"})})]})]}),p&&!c&&(0,B.jsx)("p",{className:"error-message general",children:p}),(0,B.jsxs)("div",{className:"dashboard-stats",children:[(0,B.jsxs)("div",{className:"stat-card",children:[(0,B.jsx)("div",{className:"stat-icon orders-icon",children:(0,B.jsx)("i",{className:"fas fa-shopping-bag"})}),(0,B.jsxs)("div",{className:"stat-details",children:[(0,B.jsx)("h3",{children:o.length}),(0,B.jsx)("p",{children:"Total Orders"})]})]}),(0,B.jsxs)("div",{className:"stat-card",children:[(0,B.jsx)("div",{className:"stat-icon plants-icon",children:(0,B.jsx)("i",{className:"fas fa-leaf"})}),(0,B.jsxs)("div",{className:"stat-details",children:[(0,B.jsx)("h3",{children:(null===a||void 0===a||null===(s=a.plants)||void 0===s?void 0:s.length)||0}),(0,B.jsx)("p",{children:"Plants Listed"})]})]}),(0,B.jsxs)("div",{className:"stat-card",children:[(0,B.jsx)("div",{className:"stat-icon revenue-icon",children:(0,B.jsx)("i",{className:"fas fa-dollar-sign"})}),(0,B.jsxs)("div",{className:"stat-details",children:[(0,B.jsxs)("h3",{children:["\u20b9",o.reduce(((e,s)=>e+(s.totalAmount||0)),0).toFixed(2)]}),(0,B.jsx)("p",{children:"Total Revenue"})]})]}),(0,B.jsxs)("div",{className:"stat-card",children:[(0,B.jsx)("div",{className:"stat-icon rating-icon",children:(0,B.jsx)("i",{className:"fas fa-star"})}),(0,B.jsxs)("div",{className:"stat-details",children:[(0,B.jsx)("h3",{children:(null===a||void 0===a?void 0:a.rating)||"4.5"}),(0,B.jsx)("p",{children:"Shop Rating"})]})]})]}),(0,B.jsxs)("div",{className:"dashboard-sections",children:[(0,B.jsxs)("section",{className:"shop-info-section",children:[(0,B.jsxs)("div",{className:"section-header",children:[(0,B.jsx)("h2",{children:"Shop Information"}),w?(0,B.jsxs)("button",{className:"cancel-btn",onClick:()=>{S(!1),C({shopName:(null===a||void 0===a?void 0:a.shopName)||"",phone:(null===a||void 0===a?void 0:a.phone)||"",address:(null===a||void 0===a?void 0:a.address)||"",description:(null===a||void 0===a?void 0:a.description)||""}),F(null)},children:[(0,B.jsx)("i",{className:"fas fa-times"})," Cancel"]}):(0,B.jsxs)("button",{className:"edit-btn",onClick:()=>S(!0),children:[(0,B.jsx)("i",{className:"fas fa-edit"})," Edit"]})]}),w?(0,B.jsxs)("form",{onSubmit:O,className:"edit-profile-form",children:[P&&(0,B.jsx)("p",{className:"error-message",children:P}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"shopName",children:"Shop Name"}),(0,B.jsx)("input",{type:"text",id:"shopName",name:"shopName",value:k.shopName,onChange:$,required:!0})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"phone",children:"Phone"}),(0,B.jsx)("input",{type:"text",id:"phone",name:"phone",value:k.phone,onChange:$,required:!0})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"address",children:"Address"}),(0,B.jsx)("input",{type:"text",id:"address",name:"address",value:k.address,onChange:$,required:!0})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"description",children:"Description"}),(0,B.jsx)("textarea",{id:"description",name:"description",value:k.description,onChange:$,rows:"4",required:!0})]}),(0,B.jsx)("button",{type:"submit",className:"save-btn",disabled:A,children:A?"Saving...":"Save Changes"})]}):(0,B.jsxs)("div",{className:"info-card",children:[(0,B.jsxs)("div",{className:"info-row",children:[(0,B.jsxs)("div",{className:"info-item",children:[(0,B.jsx)("span",{className:"info-label",children:"Shop Name"}),(0,B.jsx)("span",{className:"info-value",children:null===a||void 0===a?void 0:a.shopName})]}),(0,B.jsxs)("div",{className:"info-item",children:[(0,B.jsx)("span",{className:"info-label",children:"Email"}),(0,B.jsx)("span",{className:"info-value",children:null===a||void 0===a?void 0:a.email})]})]}),(0,B.jsxs)("div",{className:"info-row",children:[(0,B.jsxs)("div",{className:"info-item",children:[(0,B.jsx)("span",{className:"info-label",children:"Phone"}),(0,B.jsx)("span",{className:"info-value",children:(null===a||void 0===a?void 0:a.phone)||"Not provided"})]}),(0,B.jsxs)("div",{className:"info-item",children:[(0,B.jsx)("span",{className:"info-label",children:"Address"}),(0,B.jsx)("span",{className:"info-value",children:(null===a||void 0===a?void 0:a.address)||"Not provided"})]})]}),(0,B.jsx)("div",{className:"info-row full-width",children:(0,B.jsxs)("div",{className:"info-item",children:[(0,B.jsx)("span",{className:"info-label",children:"Description"}),(0,B.jsx)("span",{className:"info-value description",children:(null===a||void 0===a?void 0:a.description)||"Not provided"})]})})]})]}),(0,B.jsxs)("section",{className:"recent-orders-section",children:[(0,B.jsxs)("div",{className:"section-header",children:[(0,B.jsx)("h2",{children:"Recent Orders"}),(0,B.jsxs)(r.N_,{to:"/shop-dashboard/orders",className:"view-all-btn",children:["View All ",(0,B.jsx)("i",{className:"fas fa-arrow-right"})]})]}),c&&!o.length&&(0,B.jsxs)("p",{className:"loading-message",children:[(0,B.jsx)("i",{className:"fas fa-spinner fa-spin"})," Loading orders..."]}),!c&&0===o.length&&(0,B.jsxs)("div",{className:"empty-state",children:[(0,B.jsx)("i",{className:"fas fa-shopping-cart empty-icon"}),(0,B.jsx)("p",{children:"No recent orders found"}),(0,B.jsx)("span",{children:"New orders will appear here"})]}),o.length>0&&(0,B.jsxs)("div",{className:"orders-list-container",children:[(0,B.jsxs)("div",{className:"search-filter",children:[(0,B.jsx)("input",{type:"text",placeholder:"Search orders..."}),(0,B.jsx)("button",{className:"filter-btn",children:"Filter"})]}),(0,B.jsxs)("table",{children:[(0,B.jsx)("thead",{children:(0,B.jsxs)("tr",{children:[(0,B.jsx)("th",{children:"Order ID"}),(0,B.jsx)("th",{children:"Customer"}),(0,B.jsx)("th",{children:"Items"}),(0,B.jsx)("th",{children:"Total"}),(0,B.jsx)("th",{children:"Status"}),(0,B.jsx)("th",{children:"Date"}),(0,B.jsx)("th",{children:"Actions"})]})}),(0,B.jsx)("tbody",{children:o.slice(0,5).map((e=>{var s,a;return(0,B.jsxs)("tr",{children:[(0,B.jsx)("td",{children:e._id.substring(0,8)}),(0,B.jsx)("td",{children:(null===(s=e.user)||void 0===s?void 0:s.name)||"N/A"}),(0,B.jsx)("td",{children:(0,B.jsx)("ul",{children:e.items.map(((e,s)=>{var a;return(0,B.jsxs)("li",{children:[(null===(a=e.plant)||void 0===a?void 0:a.name)||"Plant"," x ",e.quantity]},s)}))})}),(0,B.jsxs)("td",{children:["\u20b9",e.shopTotalAmount?e.shopTotalAmount.toFixed(2):e.totalAmount?e.totalAmount.toFixed(2):"0.00"]}),(0,B.jsx)("td",{children:(0,B.jsx)("span",{className:`status ${(null===(a=e.status)||void 0===a?void 0:a.toLowerCase().replace(/ /g,"-"))||"pending"}`,children:e.status||"Pending"})}),(0,B.jsx)("td",{children:new Date(e.orderDate).toLocaleDateString()}),(0,B.jsxs)("td",{children:[(0,B.jsx)("button",{className:"action-btn view-btn",children:"View"}),("Pending"===e.status||!e.status)&&(0,B.jsx)("button",{className:"action-btn update-status-btn",children:"Mark as Shipped"})]})]},e._id)}))})]})]})]}),(0,B.jsxs)("section",{className:"my-plants-section",children:[(0,B.jsxs)("div",{className:"section-header",children:[(0,B.jsx)("h2",{children:"My Plants"}),(0,B.jsxs)(r.N_,{to:"/shop-dashboard/my-plants",className:"view-all-btn",children:["View All ",(0,B.jsx)("i",{className:"fas fa-arrow-right"})]})]}),c&&!b.length&&(0,B.jsxs)("p",{className:"loading-message",children:[(0,B.jsx)("i",{className:"fas fa-spinner fa-spin"})," Loading plants..."]}),!c&&0===b.length&&(0,B.jsxs)("div",{className:"empty-state",children:[(0,B.jsx)("i",{className:"fas fa-leaf empty-icon"}),(0,B.jsx)("p",{children:"No plants added yet"}),(0,B.jsx)("span",{children:"Add plants to your shop to see them here"})]}),b.length>0&&(0,B.jsx)("div",{className:"plants-grid",children:b.slice(0,4).map((e=>(0,B.jsxs)("div",{className:"plant-card",children:[(0,B.jsxs)("div",{className:"plant-image",children:[(0,B.jsx)("img",{src:`http://localhost:5000${e.imageUrl}`,alt:e.name}),(0,B.jsx)("span",{className:"plant-status "+(e.stock>0?"in-stock":"out-of-stock"),children:e.stock>0?"In Stock":"Out of Stock"})]}),(0,B.jsxs)("div",{className:"plant-details",children:[(0,B.jsx)("h3",{children:e.name}),(0,B.jsx)("p",{className:"plant-category",children:e.category}),(0,B.jsxs)("p",{className:"plant-price",children:["\u20b9",e.price.toFixed(2)]}),(0,B.jsxs)("div",{className:"plant-actions",children:[(0,B.jsxs)("button",{className:"edit-plant-btn",onClick:()=>N(`/shop-dashboard/edit-plant/${e._id}`),children:[(0,B.jsx)("i",{className:"fas fa-edit"})," Edit"]}),(0,B.jsxs)("button",{className:"toggle-featured-btn",onClick:async()=>{try{await n.gc.toggleFeatured(e._id),D()}catch(p){console.error("Error toggling featured status:",p)}},children:[(0,B.jsx)("i",{className:"fas "+(e.isFeatured?"fa-star":"fa-star-o")}),e.isFeatured?"Featured":"Feature"]})]})]})]},e._id)))})]}),(0,B.jsxs)("section",{className:"add-plant-section",children:[(0,B.jsx)("h2",{children:"Add New Plant"}),u&&!g&&(0,B.jsx)("p",{className:"error-message",children:u}),(0,B.jsxs)("form",{onSubmit:L,className:"add-plant-form",children:[(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantName",children:"Plant Name"}),(0,B.jsx)("input",{type:"text",id:"plantName",name:"name",placeholder:"Enter plant name",value:j.name,onChange:q,required:!0})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantCategory",children:"Category"}),(0,B.jsxs)("select",{id:"plantCategory",name:"category",value:j.category,onChange:q,required:!0,children:[(0,B.jsx)("option",{value:"",children:"Select Category"}),(0,B.jsx)("option",{value:"Indoor",children:"Indoor"}),(0,B.jsx)("option",{value:"Outdoor",children:"Outdoor"})]})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantDescription",children:"Description"}),(0,B.jsx)("textarea",{id:"plantDescription",name:"description",placeholder:"Enter plant description",value:j.description,onChange:q,rows:"4"})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantPrice",children:"Price"}),(0,B.jsx)("input",{type:"number",id:"plantPrice",name:"price",placeholder:"Enter price",value:j.price,onChange:q,required:!0,min:"0",step:"0.01"})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{children:"Availability"}),(0,B.jsxs)("div",{className:"availability-options",children:[(0,B.jsxs)("label",{className:"availability-option",children:[(0,B.jsx)("input",{type:"radio",name:"inStock",value:"true",checked:!0===j.inStock,onChange:()=>f((e=>({...e,inStock:!0})))}),"In Stock"]}),(0,B.jsxs)("label",{className:"availability-option",children:[(0,B.jsx)("input",{type:"radio",name:"inStock",value:"false",checked:!1===j.inStock,onChange:()=>f((e=>({...e,inStock:!1})))}),"Out of Stock"]})]})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantImage",children:"Plant Image"}),(0,B.jsx)("input",{type:"file",id:"plantImage",name:"image",onChange:q,accept:"image/*"})]}),(0,B.jsxs)("div",{className:"form-group",children:[(0,B.jsx)("label",{htmlFor:"plantModel3d",children:"3D Model (Optional)"}),(0,B.jsx)("input",{type:"file",id:"plantModel3d",name:"model3d",onChange:q})]}),(0,B.jsx)("button",{type:"submit",className:"add-plant-btn",disabled:g,children:g?"Adding...":"Add Plant"})]})]}),(0,B.jsxs)("section",{className:"quick-actions-section",children:[(0,B.jsx)("div",{className:"section-header",children:(0,B.jsx)("h2",{children:"Quick Actions"})}),(0,B.jsxs)("div",{className:"quick-actions-container",children:[(0,B.jsxs)("div",{className:"action-card",children:[(0,B.jsx)("div",{className:"action-icon",children:(0,B.jsx)("i",{className:"fas fa-plus-circle"})}),(0,B.jsx)("h3",{children:"Add Plant"}),(0,B.jsx)("p",{children:"List a new plant in your shop"}),(0,B.jsx)(r.N_,{to:"/shop-dashboard/add-plant",className:"action-btn",children:"Add Now"})]}),(0,B.jsxs)("div",{className:"action-card",children:[(0,B.jsx)("div",{className:"action-icon",children:(0,B.jsx)("i",{className:"fas fa-tags"})}),(0,B.jsx)("h3",{children:"Manage Inventory"}),(0,B.jsx)("p",{children:"Update stock and prices"}),(0,B.jsx)(r.N_,{to:"/shop-dashboard/my-plants",className:"action-btn",children:"Manage"})]}),(0,B.jsxs)("div",{className:"action-card",children:[(0,B.jsx)("div",{className:"action-icon",children:(0,B.jsx)("i",{className:"fas fa-cog"})}),(0,B.jsx)("h3",{children:"Shop Settings"}),(0,B.jsx)("p",{children:"Update your shop details"}),(0,B.jsx)(r.N_,{to:"/shop-dashboard/profile",className:"action-btn",children:"Settings"})]})]})]})]})]})]}):(0,B.jsxs)("div",{className:"error-container",children:[(0,B.jsx)("h2",{children:"Shop Data Not Found"}),(0,B.jsx)("p",{children:"Could not load your shop information. Please ensure you are logged in as a shop owner."}),(0,B.jsx)(r.N_,{to:"/login",className:"retry-button",children:"Login Page"})]})}}}]);
//# sourceMappingURL=201.eb2eba90.chunk.js.map