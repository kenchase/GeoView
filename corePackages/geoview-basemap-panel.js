"use strict";(self.webpackChunkgeoview_core=self.webpackChunkgeoview_core||[]).push([[286],{475:(e,t,a)=>{var s=a(1292),i=a(4702),r=a(19),n=a(9510),o=a(2746),p=a(7576),l=a(3110),m=a(6591),c=a(3457),d=a(5202),u=window;function f(e){var t=e.mapId,a=e.config,s=u.cgpv,i=s.api,r=s.react,n=s.ui,o=r.useState,p=r.useEffect,l=n.makeStyles((function(){return{listContainer:{overflowY:"scroll",height:"600px"},card:{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2)",transition:"0.3s",borderRadius:"5px","&:hover":{boxShadow:"0 8px 16px 0 rgba(0, 0, 0, 0.2)"},marginBottom:10,height:"250px",width:"100%",display:"block",position:"relative"},thumbnail:{borderRadius:"5px",position:"absolute",height:"100%",width:"100%",opacity:.8},container:{background:"rgba(0,0,0,.68)",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",height:"40px",display:"flex",alignItems:"center",padding:"0 5px",boxSizing:"border-box",position:"absolute",left:0,bottom:0,width:"inherit"}}})),m=o([]),f=(0,c.Z)(m,2),b=f[0],h=f[1],y=l(),v=function(e){i.map(t).basemap.setBasemap(e)};return p((function(){i.map(t).basemap.basemaps=[];for(var e=i.map(t).basemap.basemaps,s=0;s<a.coreBasemaps.length;s++){var r=a.coreBasemaps[s];i.map(t).basemap.createCoreBasemap(r)}for(var n=0;n<a.customBasemaps.length;n++){var o=a.customBasemaps[n];i.map(t).basemap.createCustomBasemap(o)}h(e)}),[i,a.coreBasemaps,a.customBasemaps,t]),(0,d.jsx)("div",{className:y.listContainer,children:b.map((function(e){return(0,d.jsxs)("div",{role:"button",tabIndex:0,className:y.card,onClick:function(){return v(e.id)},onKeyPress:function(){return v(e.id)},children:["string"==typeof e.thumbnailUrl&&(0,d.jsx)("img",{src:e.thumbnailUrl,alt:e.altText,className:y.thumbnail}),Array.isArray(e.thumbnailUrl)&&e.thumbnailUrl.map((function(t,a){return(0,d.jsx)("img",{src:t,alt:e.altText,className:y.thumbnail},a)})),(0,d.jsx)("div",{className:y.container,children:e.name})]},e.id)}))})}const b=JSON.parse('{"$schema":"http://json-schema.org/draft-07/schema#","title":"GeoView Basemap  Panel Schema","type":"object","version":1,"comments":"Configuration for GeoView basemap switcher panel package.","additionalProperties":false,"definitions":{"basemapNameNode":{"type":"object","properties":{"en":{"type":"string"},"fr":{"type":"string"}},"description":"The display name of the layer."},"basemapDescriptionNode":{"type":"object","properties":{"en":{"type":"string"},"fr":{"type":"string"}},"description":"Basemap description."},"thumbnailUrlNode":{"type":"object","properties":{"en":{"type":"array","uniqueItems":true,"items":{"type":"string"}},"fr":{"type":"array","uniqueItems":true,"items":{"type":"string"}}},"description":"Basemap thumbnail urls."},"basemapLayerUrlNode":{"type":"object","properties":{"en":{"type":"string"},"fr":{"type":"string"}},"description":"The service endpoint of the basemap layer."},"basemapAttributionNode":{"type":"object","properties":{"en":{"type":"string"},"fr":{"type":"string"}},"description":"Basemap attribution text."},"basemapLayersNode":{"type":"object","properties":{"id":{"type":"string","description":"the id of the layer"},"url":{"$ref":"#/definitions/basemapLayerUrlNode"},"opacity":{"type":"number","description":"the opacity of this layer","default":0},"options":{"type":"object","description":"basemap layer options","properties":{"tms":{"type":"boolean","default":false},"tileSize":{"type":"integer","default":1},"noWrap":{"type":"boolean","default":false},"attribution":{"type":"boolean","default":false}},"additionalItems":false}},"additionalItems":false,"required":["id","url"]},"basemap":{"type":"object","properties":{"id":{"type":"string","description":"the basemap id","enum":["transport","simple","shaded"]},"shaded":{"type":"boolean","description":"if a shaded layer should be included with this basemap","default":false},"labeled":{"type":"boolean","description":"if labels should be enabled in this basemap","default":false}},"additionalProperties":false,"required":["id","shaded","labeled"]},"customBasemap":{"type":"object","properties":{"id":{"type":"string","description":"the basemap id"},"name":{"$ref":"#/definitions/basemapNameNode"},"description":{"$ref":"#/definitions/basemapDescriptionNode"},"thumbnailUrl":{"$ref":"#/definitions/thumbnailUrlNode"},"layers":{"type":"array","description":"a list of basemap layers","items":{"$ref":"#/definitions/basemapLayersNode"},"minItems":1},"attribution":{"$ref":"#/definitions/basemapAttributionNode"},"zoomLevels":{"type":"object","description":"Zoom levels for the basemap","properties":{"min":{"type":"integer","minimum":0,"maximum":24,"default":0},"max":{"type":"integer","minimum":0,"maximum":24,"default":24}},"additionalProperties":false,"required":["min","max"]}},"additionalProperties":false,"required":["id","name","description","layers"]}},"properties":{"customBasemaps":{"type":"array","description":"A list of custom basemaps","items":{"$ref":"#/definitions/customBasemap"},"minItems":0},"coreBasemaps":{"type":"array","description":"A list of basemaps available in the core to show in the panel","items":{"$ref":"#/definitions/basemap"},"minItems":1},"isOpen":{"type":"boolean","description":"Specifies whether the basemap switcher panel is initially open or closed","default":false},"canSwichProjection":{"type":"boolean","description":"Allow the user to switch projection from the basemap switcher panel","default":false},"languages":{"type":"array","uniqueItems":true,"items":{"type":"string","enum":["en-CA","fr-CA"]},"default":["en-CA","fr-CA"],"description":"ISO 639-1 code indicating the languages supported by the configuration file.","minItems":1},"version":{"type":"string","enum":["1.0"],"description":"The schema version used to validate the configuration file. The schema should enumerate the list of versions accepted by this version of the viewer."}},"required":["coreBasemaps","customBasemaps","languages"]}'),h=JSON.parse('{"isOpen":false,"canSwichProjection":true,"coreBasemaps":[{"id":"transport","shaded":true,"labeled":true},{"id":"transport","shaded":true,"labeled":false},{"id":"simple","shaded":true,"labeled":false},{"id":"shaded","shaded":false,"labeled":true}],"customBasemaps":[{"id":"simpletestlabel","name":{"en":"Custom simple with labels","fr":"Perso simple avec étiquettes"},"description":{"en":"This is a custom province basemap in LCC projection.","fr":"Ceci est une carte de base personnalisée en projection ccl."},"thumbnailUrl":{"en":["https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/8/285/268.jpg"],"fr":["https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/8/285/268.jpg"]},"layers":[{"id":"simple2","url":{"en":"https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/{z}/{y}/{x}.jpg","fr":"https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/Simple/MapServer/WMTS/tile/1.0.0/Simple/default/default028mm/{z}/{y}/{x}.jpg"},"opacity":0.5,"options":{"tms":false,"tileSize":1,"noWrap":false,"attribution":false}},{"id":"label2","url":{"en":"https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_TXT_3978/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_TXT_3978/default/default028mm/{z}/{y}/{x}.jpg","fr":"https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBCT_TXT_3978/MapServer/WMTS/tile/1.0.0/BaseMaps_CBCT_TXT_3978/default/default028mm/{z}/{y}/{x}.jpg"},"opacity":1,"options":{"tms":false,"tileSize":1,"noWrap":false,"attribution":false}}],"attribution":{"en":"test attribution","fr":"test attribution"},"zoomLevels":{"min":0,"max":17}}],"languages":["en-CA","fr-CA"]}');function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,s=(0,p.Z)(e);if(t){var i=(0,p.Z)(this).constructor;a=Reflect.construct(s,arguments,i)}else a=s.apply(this,arguments);return(0,o.Z)(this,a)}}var v=window,g=function(e){(0,n.Z)(a,e);var t=y(a);function a(e,i){var n;return(0,s.Z)(this,a),n=t.call(this,e,i),(0,l.Z)((0,r.Z)(n),"schema",(function(){return b})),(0,l.Z)((0,r.Z)(n),"defaultConfig",(function(){return(0,m.ZQ)(h)})),(0,l.Z)((0,r.Z)(n),"translations",(0,m.ZQ)({"en-CA":{basemapPanel:"Basemaps"},"fr-CA":{basemapPanel:"Fond de carte"}})),(0,l.Z)((0,r.Z)(n),"added",(function(){var e=(0,r.Z)(n),t=e.configObj,a=e.pluginProps.mapId,s=v.cgpv;if(s){var i,o,p=s.api,l=p.map(a).language,m={tooltip:n.translations[l].basemapPanel,tooltipPlacement:"right",icon:'<i class="material-icons">map</i>',type:"textWithIcon"},c={title:n.translations[l].basemapPanel,icon:'<i class="material-icons">map</i>',width:200,status:null==t?void 0:t.isOpen};n.buttonPanel=p.map(a).appBarButtons.createAppbarPanel(m,c,null),null===(i=n.buttonPanel)||void 0===i||null===(o=i.panel)||void 0===o||o.changeContent((0,d.jsx)(f,{mapId:a,config:t||{}}))}})),n.buttonPanel=null,n}return(0,i.Z)(a,[{key:"removed",value:function(){var e=this.pluginProps.mapId,t=v.cgpv;if(t){var a=t.api;this.buttonPanel&&(a.map(e).appBarButtons.removeAppbarPanel(this.buttonPanel.id),a.map(e).basemap.basemaps=[],a.map(e).basemap.loadDefaultBasemaps(a.map(e).basemap.basemapOptions))}}}]),a}(m.EV);v.plugins=v.plugins||{},v.plugins["basemap-panel"]=(0,m.RF)(g)}},e=>{var t;t=475,e(e.s=t)}]);
//# sourceMappingURL=geoview-basemap-panel.js.map