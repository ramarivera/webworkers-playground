import{g as x,a as j,s as E,B as D,r as V,b as y,u as P,_ as k,c as A,d as U,j as n,e as R,f as z}from"./Grow-ce4b08a7.js";import{r as f,R as G}from"./index-ca859ab0.js";import{L as T,C as q,G as I,T as W,F as Z,I as H,S as J,a as K}from"./TextField-0bb695ab.js";import{_ as g}from"./assertThisInitialized-0ff3d7a7.js";const Q=[{display:"Roboto (default)",name:"Roboto",bold:!1,italic:!1,url:"https://fonts.cdnfonts.com/s/12165/Roboto-Regular.woff"},{display:"Roboto (italic)",name:"Roboto",bold:!1,italic:!0,url:"https://fonts.cdnfonts.com/s/12165/Roboto-Italic.woff"},{display:"Roboto (bold)",name:"Roboto",bold:!0,italic:!1,url:"https://fonts.cdnfonts.com/s/12165/Roboto-Bold.woff"},{display:"Roboto (italic bold)",name:"Roboto",bold:!0,italic:!0,url:"https://fonts.cdnfonts.com/s/12165/Roboto-BoldItalic.woff"},{name:"Open Sans",url:"https://fonts.cdnfonts.com/s/14884/OpenSans-Regular.woff",display:"Open Sans (default)",bold:!1,italic:!1},{name:"Open Sans",url:"https://fonts.cdnfonts.com/s/14884/OpenSans-Italic.woff",display:"Open Sans (italic)",bold:!1,italic:!0},{name:"Open Sans",url:"https://fonts.cdnfonts.com/s/14884/OpenSans-Bold.woff",display:"Open Sans (bold)",bold:!0,italic:!1},{name:"Open Sans",url:"https://fonts.cdnfonts.com/s/14884/OpenSans-BoldItalic.woff",display:"Open Sans (bold italic)",bold:!0,italic:!0}],gt=Q;function X(t){let e=0;for(let a=0;a<t.length;a++){const s=t.charCodeAt(a);e=(e<<5)-e+s,e|=0}return e.toString()}const Y=14;function yt(t,e,a,s=Y){let o="";return e&&(o+="bold "),a&&(o+="italic "),o+=`${s}px "${t}"`,o}function It(t){return{font:t.name,displayName:t.display,url:t.url,isBold:t.bold,isItalic:t.italic,isCustom:!1}}function tt(t,e){return{weight:t?"bold":"normal",style:e?"italic":"normal"}}function vt(t,e,a,s){const o=tt(a,s);return new FontFace(t,`url(${e})`,o)}function xt(t){const{font:e,displayName:a,isBold:s,isItalic:o,url:d}=t,l=s?"bold":"normal",c=o?"italic":"normal",r=a?`-${X(a)}`:"";return`${e}-${l}-${c}-${d.length}${r}`}const et=x("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]),_=et,at=x("MuiListItemIcon",["root","alignItemsFlexStart"]),N=at,st=x("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]),L=st;function ot(t){return j("MuiMenuItem",t)}const nt=x("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),b=nt,it=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex","className"],lt=(t,e)=>{const{ownerState:a}=t;return[e.root,a.dense&&e.dense,a.divider&&e.divider,!a.disableGutters&&e.gutters]},rt=t=>{const{disabled:e,dense:a,divider:s,disableGutters:o,selected:d,classes:l}=t,r=z({root:["root",a&&"dense",e&&"disabled",!o&&"gutters",s&&"divider",d&&"selected"]},ot,l);return g({},l,r)},dt=E(D,{shouldForwardProp:t=>V(t)||t==="classes",name:"MuiMenuItem",slot:"Root",overridesResolver:lt})(({theme:t,ownerState:e})=>g({},t.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!e.disableGutters&&{paddingLeft:16,paddingRight:16},e.divider&&{borderBottom:`1px solid ${(t.vars||t).palette.divider}`,backgroundClip:"padding-box"},{"&:hover":{textDecoration:"none",backgroundColor:(t.vars||t).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${b.selected}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:y(t.palette.primary.main,t.palette.action.selectedOpacity),[`&.${b.focusVisible}`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.focusOpacity}))`:y(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.focusOpacity)}},[`&.${b.selected}:hover`]:{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:y(t.palette.primary.main,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${t.vars.palette.primary.mainChannel} / ${t.vars.palette.action.selectedOpacity})`:y(t.palette.primary.main,t.palette.action.selectedOpacity)}},[`&.${b.focusVisible}`]:{backgroundColor:(t.vars||t).palette.action.focus},[`&.${b.disabled}`]:{opacity:(t.vars||t).palette.action.disabledOpacity},[`& + .${_.root}`]:{marginTop:t.spacing(1),marginBottom:t.spacing(1)},[`& + .${_.inset}`]:{marginLeft:52},[`& .${L.root}`]:{marginTop:0,marginBottom:0},[`& .${L.inset}`]:{paddingLeft:36},[`& .${N.root}`]:{minWidth:36}},!e.dense&&{[t.breakpoints.up("sm")]:{minHeight:"auto"}},e.dense&&g({minHeight:32,paddingTop:4,paddingBottom:4},t.typography.body2,{[`& .${N.root} svg`]:{fontSize:"1.25rem"}}))),ct=f.forwardRef(function(e,a){const s=P({props:e,name:"MuiMenuItem"}),{autoFocus:o=!1,component:d="li",dense:l=!1,divider:c=!1,disableGutters:r=!1,focusVisibleClassName:C,role:h="menuitem",tabIndex:m,className:i}=s,u=k(s,it),p=f.useContext(T),$=f.useMemo(()=>({dense:l||p.dense||!1,disableGutters:r}),[p.dense,l,r]),S=f.useRef(null);A(()=>{o&&S.current&&S.current.focus()},[o]);const B=g({},s,{dense:$.dense,divider:c,disableGutters:r}),F=rt(s),M=U(S,a);let O;return s.disabled||(O=m!==void 0?m:-1),n.jsx(T.Provider,{value:$,children:n.jsx(dt,g({ref:M,role:h,tabIndex:O,component:d,focusVisibleClassName:R(F.focusVisible,C),className:R(F.root,i)},u,{ownerState:B,classes:F}))})}),ut=ct,v={FONT_LIST:"font-input-list",FONT_LIST_LABEL:"font-input-list-label",FONT_SIZE_INPUT:"font-input-size",FONT_SIZE_INPUT_LABEL:"font-input-size-label"},w=({fonts:t,selectedFont:e,onFontSelected:a,fontSize:s,onFontSizeChanged:o})=>{var m;const d=f.useMemo(()=>t.reduce((i,u)=>(i[u.id]=u,i),{}),[t]),[l,c]=G.useState(e),r=f.useCallback(i=>{const u=i.target.value,p=d[u];p&&(c(p),a==null||a(p))},[d,a]),C=i=>{o==null||o(i.target.value)},h=(e==null?void 0:e.id)??(l==null?void 0:l.id)??((m=t==null?void 0:t[0])==null?void 0:m.id)??"";return n.jsx(q,{children:n.jsxs(I,{container:!0,direction:"column",spacing:2,padding:1,children:[n.jsx(I,{children:n.jsx(W,{variant:"h6",textAlign:"center",children:"Fonts"})}),n.jsx(I,{children:n.jsxs(Z,{children:[n.jsx(H,{id:v.FONT_LIST_LABEL,children:"Font"}),n.jsx(J,{id:v.FONT_LIST,labelId:v.FONT_LIST_LABEL,label:"Font",style:{minWidth:"200px"},value:h,onChange:r,children:t.map(i=>n.jsx(ut,{value:i.id,children:i.displayName},i.id))})]})}),n.jsx(I,{children:n.jsx(K,{id:v.FONT_SIZE_INPUT,label:"Font Size",variant:"outlined",type:"number",value:s,onChange:C})})]})})};try{w.displayName="FontInput",w.__docgenInfo={description:"",displayName:"FontInput",props:{fonts:{defaultValue:null,description:"",name:"fonts",required:!0,type:{name:"RegisteredFontData[]"}},selectedFont:{defaultValue:null,description:"",name:"selectedFont",required:!1,type:{name:"RegisteredFontData"}},fontSize:{defaultValue:null,description:"",name:"fontSize",required:!0,type:{name:"number"}},onFontSizeChanged:{defaultValue:null,description:"",name:"onFontSizeChanged",required:!1,type:{name:"((fontSize: number) => void)"}},onFontSelected:{defaultValue:null,description:"",name:"onFontSelected",required:!1,type:{name:"((font: RegisteredFontData) => void)"}}}}}catch{}export{Y as D,w as F,gt as P,tt as a,vt as b,It as c,yt as d,xt as g};
//# sourceMappingURL=FontInput-a175b9ef.js.map