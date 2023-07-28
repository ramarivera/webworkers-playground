import{j as n}from"./Grow-ce4b08a7.js";import{F as m,P as F,c as g,g as f,D as u}from"./FontInput-a175b9ef.js";import"./assertThisInitialized-0ff3d7a7.js";import"./index-ca859ab0.js";import"./_commonjsHelpers-de833af9.js";import"./TextField-0bb695ab.js";const S=t=>n.jsx("div",{style:{border:"2px solid red",borderRadius:"5px",padding:"10px"},children:n.jsx(t,{})}),I={title:"Example/FontList",component:m,argTypes:{fonts:{table:{disable:!0}},fontSize:{control:"number"},onFontSelected:{table:{disable:!0}},onFontSizeChanged:{table:{disable:!0}}},parameters:{layout:"centered"},decorators:[S]},r={args:{fonts:[],fontSize:u,onFontSelected:()=>{},onFontSizeChanged:()=>{}}},e={...r,args:{...r.args,fonts:F.map(t=>{const a=g(t);return{...a,id:f(a)}})}},o={...e,args:{...e.args,onFontSelected:t=>{alert(`Font selected ${t.displayName}(${t.id}) bold: ${t.isBold} italic: ${t.isItalic}}`)}}};var s,i,d;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  ...Empty,
  args: {
    ...Empty.args,
    fonts: PREDEFINED_FONTS.map(font => {
      const fontData = convertPredefinedFontToFontRegistrationData(font);
      return {
        ...fontData,
        id: generateIdForFontRegistrationData(fontData)
      };
    })
  }
}`,...(d=(i=e.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var c,l,p;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  ...StaticFonts,
  args: {
    ...StaticFonts.args,
    onFontSelected: fontData => {
      alert(\`Font selected \${fontData.displayName}(\${fontData.id}) bold: \${fontData.isBold} italic: \${fontData.isItalic}}\`);
    }
  }
}`,...(p=(l=o.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const $=["StaticFonts","WithAlert"];export{e as StaticFonts,o as WithAlert,$ as __namedExportsOrder,I as default};
//# sourceMappingURL=FontInput.stories-e62a581e.js.map
