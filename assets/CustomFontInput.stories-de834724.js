import{C as g}from"./CustomFontInput-7210aa34.js";import"./Grow-ce4b08a7.js";import"./assertThisInitialized-0ff3d7a7.js";import"./index-ca859ab0.js";import"./_commonjsHelpers-de833af9.js";import"./LoadingButton-e03359d9.js";import"./TextField-0bb695ab.js";import"./hooks-d288bee1.js";const $={title:"Example/CustomFontInput",component:g,argTypes:{onFontRegistered:{table:{disable:!0}},isLoading:{control:"boolean"}},parameters:{layout:"centered"}},r={args:{initialValues:{name:"",url:"",displayName:"",isBold:!1,isItalic:!1},isLoading:!1,onFontRegistered:()=>{}}},t={...r,args:{...r.args,isLoading:!0}},e={...r,args:{...r.args,onFontRegistered:(m,p,d)=>{alert(`Registered font ${m} bold: ${p} italic: ${d}`)}}};var o,s,a;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  ...Empty,
  args: {
    ...Empty.args,
    isLoading: true
  }
}`,...(a=(s=t.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var i,n,l;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  ...Empty,
  args: {
    ...Empty.args,
    onFontRegistered: (url, isBold, isItalic) => {
      alert(\`Registered font \${url} bold: \${isBold} italic: \${isItalic}\`);
    }
  }
}`,...(l=(n=e.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};const b=["Loading","WithFontRegistering"];export{t as Loading,e as WithFontRegistering,b as __namedExportsOrder,$ as default};
//# sourceMappingURL=CustomFontInput.stories-de834724.js.map
