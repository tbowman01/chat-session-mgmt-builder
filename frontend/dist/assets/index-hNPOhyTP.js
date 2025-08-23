const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jszip.min-B1CwBkmU.js","assets/react-DJ1oPbzn.js"])))=>i.map(i=>d[i]);
import{r as w,a as Ne,R as Se}from"./react-DJ1oPbzn.js";import{C as Ie,a as ke,L as Ee,b as Q,Z as Y,U as re,X as Ce,A as Te,c as $,I as ue,d as $e,S as ee,e as O,F as G,P as F,f as Re,D as K,g as ie,h as pe,i as Ae,T as _e,j as Me,E as he,B as oe,R as De,G as Oe,M as ce}from"./icons-CnXz--HH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const u of n)if(u.type==="childList")for(const c of u.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const u={};return n.integrity&&(u.integrity=n.integrity),n.referrerPolicy&&(u.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?u.credentials="include":n.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(n){if(n.ep)return;n.ep=!0;const u=a(n);fetch(n.href,u)}})();var ge={exports:{}},X={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Le=w,Pe=Symbol.for("react.element"),qe=Symbol.for("react.fragment"),Ue=Object.prototype.hasOwnProperty,ze=Le.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Be={key:!0,ref:!0,__self:!0,__source:!0};function xe(s,t,a){var r,n={},u=null,c=null;a!==void 0&&(u=""+a),t.key!==void 0&&(u=""+t.key),t.ref!==void 0&&(c=t.ref);for(r in t)Ue.call(t,r)&&!Be.hasOwnProperty(r)&&(n[r]=t[r]);if(s&&s.defaultProps)for(r in t=s.defaultProps,t)n[r]===void 0&&(n[r]=t[r]);return{$$typeof:Pe,type:s,key:u,ref:c,props:n,_owner:ze.current}}X.Fragment=qe;X.jsx=xe;X.jsxs=xe;ge.exports=X;var e=ge.exports,se={},le=Ne;se.createRoot=le.createRoot,se.hydrateRoot=le.hydrateRoot;const H={"discord-js":{name:"discord-js",displayName:"Discord Bot",icon:"🎮",description:"Build Discord bots with powerful slash commands and server management",requirements:["Node.js 16+","Discord Developer Account","Bot Token"],estimatedTime:"2-4 hours",complexity:"intermediate",supportedFeatures:["conversation-branching","context-awareness","custom-commands","webhooks","ai-integration"],defaultPriorities:["session-management","real-time-sync","error-handling"]},"telegram-bot-api":{name:"telegram-bot-api",displayName:"Telegram Bot",icon:"✈️",description:"Create Telegram bots with inline keyboards and file handling",requirements:["Node.js 16+","Telegram Bot Token from @BotFather"],estimatedTime:"1-3 hours",complexity:"basic",supportedFeatures:["file-attachments","custom-commands","ai-integration","multi-language"],defaultPriorities:["message-persistence","session-management"]},"whatsapp-web":{name:"whatsapp-web",displayName:"WhatsApp Bot",icon:"📱",description:"WhatsApp automation using web interface",requirements:["Node.js 16+","Chrome/Chromium","WhatsApp Account"],estimatedTime:"3-5 hours",complexity:"advanced",supportedFeatures:["file-attachments","context-awareness","backup-restore"],defaultPriorities:["message-persistence","session-management","error-handling","scalability"]},"slack-bolt":{name:"slack-bolt",displayName:"Slack App",icon:"💼",description:"Enterprise Slack applications with Bolt framework",requirements:["Node.js 16+","Slack App Configuration","Workspace Admin Access"],estimatedTime:"4-6 hours",complexity:"advanced",supportedFeatures:["conversation-branching","context-awareness","custom-commands","webhooks","ai-integration"],defaultPriorities:["user-authentication","real-time-sync","scalability"]},"twitter-api":{name:"twitter-api",displayName:"Twitter Bot",icon:"🐦",description:"Twitter automation and engagement bot",requirements:["Node.js 16+","Twitter Developer Account","API Keys"],estimatedTime:"2-4 hours",complexity:"intermediate",supportedFeatures:["ai-integration"],defaultPriorities:["error-handling"]},"web-chat":{name:"web-chat",displayName:"Web Chat Widget",icon:"💬",description:"Embeddable web chat interface with real-time messaging",requirements:["Node.js 16+","Socket.io","Web Server"],estimatedTime:"4-8 hours",complexity:"expert",supportedFeatures:["conversation-branching","context-awareness","multi-language","file-attachments","ai-integration","backup-restore"],defaultPriorities:["real-time-sync","user-authentication","message-persistence","scalability"]},"cli-interface":{name:"cli-interface",displayName:"CLI Tool",icon:"⌨️",description:"Command-line interface for chat session management",requirements:["Node.js 16+","Terminal/Command Prompt"],estimatedTime:"1-2 hours",complexity:"basic",supportedFeatures:["custom-commands","backup-restore","context-awareness"],defaultPriorities:["session-management","error-handling"]}},Fe=Object.entries(H).map(([s,t])=>({value:s,label:t.displayName,description:t.description,icon:t.icon})),ye=[{value:"message-persistence",label:"Message Persistence",description:"Store and retrieve chat messages reliably",icon:"💾",recommended:!0},{value:"session-management",label:"Session Management",description:"Handle user sessions and context switching",icon:"🔄",recommended:!0},{value:"user-authentication",label:"User Authentication",description:"Secure user identification and authorization",icon:"🔐"},{value:"real-time-sync",label:"Real-time Sync",description:"Live message synchronization across clients",icon:"⚡",recommended:!0},{value:"error-handling",label:"Error Handling",description:"Robust error recovery and logging",icon:"🚦"},{value:"error-handling",label:"Error Handling",description:"Robust error recovery and reporting",icon:"🛡️",recommended:!0},{value:"scalability",label:"Scalability",description:"Handle increasing load and users",icon:"📈"}],J=[{value:"conversation-branching",label:"Conversation Branching",description:"Support multiple conversation threads",icon:"🌳"},{value:"context-awareness",label:"Context Awareness",description:"Remember conversation history and context",icon:"🧠"},{value:"multi-language",label:"Multi-language Support",description:"International language support",icon:"🌍"},{value:"file-attachments",label:"File Attachments",description:"Upload and share files in conversations",icon:"📎"},{value:"custom-commands",label:"Custom Commands",description:"Define custom bot commands and responses",icon:"⚙️"},{value:"webhooks",label:"Webhooks Integration",description:"Connect with external services via webhooks",icon:"🔗"},{value:"ai-integration",label:"AI Integration",description:"Integrate with AI services for smart responses",icon:"🤖"},{value:"backup-restore",label:"Backup & Restore",description:"Data backup and recovery capabilities",icon:"💿"}],te=[{value:"solo",label:"Solo Developer",description:"Individual developer working alone",icon:"👤"},{value:"small",label:"Small Team (2-5)",description:"Small development team",icon:"👥"},{value:"medium",label:"Medium Team (6-15)",description:"Medium-sized development team",icon:"👨‍👩‍👧‍👦"},{value:"large",label:"Large Team (16-50)",description:"Large development organization",icon:"🏢"},{value:"enterprise",label:"Enterprise (50+)",description:"Enterprise-level organization",icon:"🏙️"}],ne=[{value:"basic",label:"Basic",description:"Simple setup with essential features",icon:"🟢"},{value:"intermediate",label:"Intermediate",description:"Moderate complexity with additional features",icon:"🟡"},{value:"advanced",label:"Advanced",description:"Complex setup with enterprise features",icon:"🟠"},{value:"expert",label:"Expert",description:"Full-featured, production-ready solution",icon:"🔴"}],R={PRIORITIES:{MIN:2,MAX:4},PROJECT_NAME:{MIN_LENGTH:3,MAX_LENGTH:50},DESCRIPTION:{MIN_LENGTH:10,MAX_LENGTH:500}},W=[{id:1,title:"Platform",description:"Choose your chat platform"},{id:2,title:"Priorities",description:"Select key priorities"},{id:3,title:"Features",description:"Pick desired features"},{id:4,title:"Configuration",description:"Set team & complexity"},{id:5,title:"Review",description:"Review your choices"},{id:6,title:"Generate",description:"Get your solution"},{id:7,title:"Setup",description:"Auto-setup (optional)"},{id:8,title:"Complete",description:"You're all set!"}],ae=W.length,Z={CONFIGURATION:"chat-mgmt-config",WIZARD_STATE:"chat-mgmt-wizard-state",ANALYTICS:"chat-mgmt-analytics"},We={platform:null,priorities:[],features:[],teamSize:null,complexity:null,projectName:"",description:""},fe={...We,currentStep:1,completedSteps:[],isLoading:!1,error:null,generatedSolution:null};function Ge(s,t){switch(t.type){case"SET_PLATFORM":return{...s,platform:t.payload};case"SET_PRIORITIES":return{...s,priorities:t.payload};case"SET_FEATURES":return{...s,features:t.payload};case"SET_TEAM_SIZE":return{...s,teamSize:t.payload};case"SET_COMPLEXITY":return{...s,complexity:t.payload};case"SET_PROJECT_NAME":return{...s,projectName:t.payload};case"SET_DESCRIPTION":return{...s,description:t.payload};case"SET_CURRENT_STEP":return{...s,currentStep:t.payload};case"ADD_COMPLETED_STEP":return s.completedSteps.includes(t.payload)?s:{...s,completedSteps:[...s.completedSteps,t.payload].sort()};case"SET_LOADING":return{...s,isLoading:t.payload};case"SET_ERROR":return{...s,error:t.payload};case"SET_GENERATED_SOLUTION":return{...s,generatedSolution:t.payload};case"RESET_WIZARD":return fe;case"LOAD_FROM_STORAGE":return{...s,...t.payload};default:return s}}const je=w.createContext(void 0);function He({children:s}){const[t,a]=w.useReducer(Ge,fe),r={setPlatform:n=>a({type:"SET_PLATFORM",payload:n}),setPriorities:n=>a({type:"SET_PRIORITIES",payload:n}),setFeatures:n=>a({type:"SET_FEATURES",payload:n}),setTeamSize:n=>a({type:"SET_TEAM_SIZE",payload:n}),setComplexity:n=>a({type:"SET_COMPLEXITY",payload:n}),setProjectName:n=>a({type:"SET_PROJECT_NAME",payload:n}),setDescription:n=>a({type:"SET_DESCRIPTION",payload:n}),setCurrentStep:n=>a({type:"SET_CURRENT_STEP",payload:n}),addCompletedStep:n=>a({type:"ADD_COMPLETED_STEP",payload:n}),setLoading:n=>a({type:"SET_LOADING",payload:n}),setError:n=>a({type:"SET_ERROR",payload:n}),setGeneratedSolution:n=>a({type:"SET_GENERATED_SOLUTION",payload:n}),resetWizard:()=>{a({type:"RESET_WIZARD"}),localStorage.removeItem(Z.WIZARD_STATE)},nextStep:()=>{if(t.currentStep<ae){const n=t.currentStep+1;a({type:"ADD_COMPLETED_STEP",payload:t.currentStep}),a({type:"SET_CURRENT_STEP",payload:n})}},previousStep:()=>{t.currentStep>1&&a({type:"SET_CURRENT_STEP",payload:t.currentStep-1})},goToStep:n=>{n>=1&&n<=ae&&a({type:"SET_CURRENT_STEP",payload:n})},canGoToStep:n=>n===1?!0:t.completedSteps.includes(n-1)||n<=t.currentStep,validateCurrentStep:()=>{const n=[];switch(t.currentStep){case 1:t.platform||n.push("Please select a platform");break;case 2:t.priorities.length<2&&n.push("Please select at least 2 priorities"),t.priorities.length>4&&n.push("Please select no more than 4 priorities");break;case 3:break;case 4:t.teamSize||n.push("Please select team size"),t.complexity||n.push("Please select complexity level"),t.projectName.trim()||n.push("Please enter a project name"),t.projectName.length<3&&n.push("Project name must be at least 3 characters"),t.description.trim()||n.push("Please enter a project description"),t.description.length<10&&n.push("Project description must be at least 10 characters");break}return{isValid:n.length===0,errors:n}},saveToStorage:()=>{try{const n={...t,timestamp:new Date().toISOString()};localStorage.setItem(Z.WIZARD_STATE,JSON.stringify(n))}catch(n){console.warn("Failed to save wizard state to localStorage:",n)}},loadFromStorage:()=>{try{const n=localStorage.getItem(Z.WIZARD_STATE);if(n){const u=JSON.parse(n),{timestamp:c,...m}=u;a({type:"LOAD_FROM_STORAGE",payload:m})}}catch(n){console.warn("Failed to load wizard state from localStorage:",n)}}};return w.useEffect(()=>{r.saveToStorage()},[t]),w.useEffect(()=>{r.loadFromStorage()},[]),e.jsx(je.Provider,{value:{state:t,actions:r},children:s})}function M(){const s=w.useContext(je);if(s===void 0)throw new Error("useWizard must be used within a WizardProvider");return s}const ve=w.createContext(void 0),Je=({children:s})=>{const[t,a]=w.useState(null),[r,n]=w.useState(!0);w.useEffect(()=>{u(),c()},[]);const u=async()=>{try{const i=localStorage.getItem("github_access_token");if(!i){n(!1);return}const d=await fetch("https://api.github.com/user",{headers:{Authorization:`Bearer ${i}`,Accept:"application/vnd.github.v3+json"}});if(d.ok){const h=await d.json();a({id:h.id.toString(),login:h.login,name:h.name||h.login,avatar_url:h.avatar_url,email:h.email})}else localStorage.removeItem("github_access_token")}catch(i){console.error("Failed to check auth status:",i),localStorage.removeItem("github_access_token")}finally{n(!1)}},c=()=>{const i=new URLSearchParams(window.location.search),d=i.get("code"),h=i.get("state");d&&h&&(window.history.replaceState({},document.title,window.location.pathname),m(d,h))},m=async(i,d)=>{try{n(!0);const h=localStorage.getItem("github_oauth_state");if(d!==h)throw new Error("Invalid state parameter");const D=await(await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:void 0,client_secret:void 0,code:i})})).json();if(D.access_token)localStorage.setItem("github_access_token",D.access_token),localStorage.removeItem("github_oauth_state"),await u();else throw new Error("Failed to exchange code for token")}catch(h){console.error("OAuth callback error:",h),localStorage.removeItem("github_oauth_state")}finally{n(!1)}},g={user:t,isLoading:r,login:()=>{const i=Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);localStorage.setItem("github_oauth_state",i);const d=void 0,h=window.location.origin+"/auth/callback",f=new URL("https://github.com/login/oauth/authorize");f.searchParams.set("client_id",d),f.searchParams.set("redirect_uri",h),f.searchParams.set("scope","user:email read:user"),f.searchParams.set("state",i),window.location.href=f.toString()},logout:()=>{localStorage.removeItem("github_access_token"),localStorage.removeItem("github_oauth_state"),a(null)},isAuthenticated:!!t};return e.jsx(ve.Provider,{value:g,children:s})},V=()=>{const s=w.useContext(ve);if(s===void 0)throw new Error("useAuth must be used within an AuthProvider");return s},Ye=()=>{const{login:s,isLoading:t}=V();return e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4",children:e.jsxs("div",{className:"max-w-md w-full bg-white rounded-lg shadow-xl p-8",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4",children:e.jsx("svg",{className:"h-8 w-8 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"})})}),e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Chat Session Manager"}),e.jsx("p",{className:"text-gray-600",children:"Build amazing chat experiences across multiple platforms"})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-900 mb-3",children:"🚀 What you can build:"}),e.jsxs("ul",{className:"text-sm text-gray-700 space-y-2",children:[e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-purple-500 mr-2",children:"💬"}),"Discord bots with slash commands"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-blue-500 mr-2",children:"📱"}),"Telegram automation bots"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-green-500 mr-2",children:"💬"}),"WhatsApp business integrations"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-indigo-500 mr-2",children:"🏢"}),"Slack workspace applications"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-blue-400 mr-2",children:"🐦"}),"Twitter engagement bots"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-orange-500 mr-2",children:"🌐"}),"Real-time web chat widgets"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"text-gray-600 mr-2",children:"⌨️"}),"Command-line chat tools"]})]})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"Sign in with GitHub to access your chat session history and configurations"}),e.jsxs("button",{onClick:s,disabled:t,className:"w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2",children:[t?e.jsxs("svg",{className:"animate-spin h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):e.jsx("svg",{className:"h-5 w-5",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z",clipRule:"evenodd"})}),e.jsx("span",{children:"Continue with GitHub"})]}),e.jsx("div",{className:"mt-4 pt-4 border-t border-gray-200",children:e.jsx("p",{className:"text-xs text-gray-500",children:"By signing in, you agree to our terms of service and privacy policy. Your GitHub information is used only for authentication and session management."})})]})]})]})})},Ke=({children:s})=>{const{isAuthenticated:t,isLoading:a}=V();return a?e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),e.jsx("p",{className:"mt-4 text-gray-600",children:"Loading..."})]})}):t?e.jsx(e.Fragment,{children:s}):e.jsx(Ye,{})},Xe=()=>{const{user:s,logout:t}=V(),[a,r]=w.useState(!1);return s?e.jsxs("div",{className:"relative",children:[e.jsxs("button",{onClick:()=>r(!a),className:"flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",children:[e.jsx("img",{src:s.avatar_url,alt:s.name,className:"h-8 w-8 rounded-full"}),e.jsxs("div",{className:"text-left min-w-0",children:[e.jsx("p",{className:"text-sm font-medium text-gray-900 truncate",children:s.name}),e.jsxs("p",{className:"text-xs text-gray-500 truncate",children:["@",s.login]})]}),e.jsx("svg",{className:`h-4 w-4 text-gray-400 transition-transform ${a?"rotate-180":""}`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),a&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 z-10",onClick:()=>r(!1)}),e.jsxs("div",{className:"absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20",children:[e.jsxs("div",{className:"px-4 py-3 border-b border-gray-200",children:[e.jsx("p",{className:"text-sm font-medium text-gray-900",children:s.name}),e.jsxs("p",{className:"text-sm text-gray-500",children:["@",s.login]}),s.email&&e.jsx("p",{className:"text-sm text-gray-500",children:s.email})]}),e.jsxs("div",{className:"py-1",children:[e.jsxs("button",{className:"flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",onClick:()=>{window.open(`https://github.com/${s.login}`,"_blank"),r(!1)},children:[e.jsx("svg",{className:"h-4 w-4 mr-3 text-gray-400",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z",clipRule:"evenodd"})}),"View GitHub Profile"]}),e.jsxs("button",{className:"flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",onClick:()=>{alert("Settings coming soon!"),r(!1)},children:[e.jsxs("svg",{className:"h-4 w-4 mr-3 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]}),"Settings"]})]}),e.jsx("div",{className:"border-t border-gray-200 py-1",children:e.jsxs("button",{onClick:()=>{t(),r(!1)},className:"flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50",children:[e.jsx("svg",{className:"h-4 w-4 mr-3 text-red-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})}),"Sign out"]})})]})]})]}):null};function be(s){var t,a,r="";if(typeof s=="string"||typeof s=="number")r+=s;else if(typeof s=="object")if(Array.isArray(s)){var n=s.length;for(t=0;t<n;t++)s[t]&&(a=be(s[t]))&&(r&&(r+=" "),r+=a)}else for(a in s)s[a]&&(r&&(r+=" "),r+=a);return r}function N(){for(var s,t,a=0,r="",n=arguments.length;a<n;a++)(s=arguments[a])&&(t=be(s))&&(r&&(r+=" "),r+=t);return r}const Ve=({currentStep:s,totalSteps:t,completedSteps:a,onStepClick:r,disabled:n=!1})=>{var m,l;const u=o=>a.includes(o)?"completed":o===s?"current":o<s?"completed":"upcoming",c=o=>n?!1:o<=s||a.includes(o-1);return e.jsxs("nav",{"aria-label":"Progress",className:"mb-8",children:[e.jsx("ol",{className:"flex items-center justify-center space-x-2 sm:space-x-4",children:W.slice(0,t).map((o,g)=>{const i=o.id,d=u(i),h=c(i);return e.jsxs("li",{className:"flex items-center",children:[e.jsxs("button",{type:"button",onClick:()=>h?r(i):void 0,disabled:!h,className:N("relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200",{"bg-primary-600 text-white hover:bg-primary-700":d==="completed"&&h,"bg-primary-600 text-white":d==="completed"&&!h,"bg-primary-600 text-white ring-4 ring-primary-200":d==="current","bg-gray-200 text-gray-500 hover:bg-gray-300":d==="upcoming"&&h,"bg-gray-200 text-gray-500":d==="upcoming"&&!h},{"cursor-pointer":h&&!n,"cursor-not-allowed opacity-50":n,"cursor-default":!h&&!n}),"aria-current":d==="current"?"step":void 0,children:[d==="completed"?e.jsx(Ie,{className:"w-5 h-5","aria-hidden":"true"}):e.jsx("span",{className:"text-xs",children:i}),e.jsx("span",{className:"sr-only",children:d==="completed"?`Step ${i} ${o.title}, completed`:d==="current"?`Step ${i} ${o.title}, current step`:`Step ${i} ${o.title}`})]}),e.jsxs("div",{className:"hidden sm:block ml-3",children:[e.jsx("div",{className:N("text-sm font-medium transition-colors duration-200",{"text-primary-600":d==="current"||d==="completed","text-gray-500":d==="upcoming"}),children:o.title}),e.jsx("div",{className:"text-xs text-gray-400",children:o.description})]}),g<W.slice(0,t).length-1&&e.jsx(ke,{className:N("w-5 h-5 mx-2 sm:mx-4 transition-colors duration-200",{"text-primary-600":i<s||a.includes(i),"text-gray-300":i>=s&&!a.includes(i)}),"aria-hidden":"true"})]},o.id)})}),e.jsxs("div",{className:"sm:hidden mt-4 text-center",children:[e.jsxs("div",{className:"text-sm font-medium text-primary-600",children:["Step ",s,": ",(m=W[s-1])==null?void 0:m.title]}),e.jsx("div",{className:"text-xs text-gray-500",children:(l=W[s-1])==null?void 0:l.description})]}),e.jsx("div",{className:"mt-6 bg-gray-200 rounded-full h-2 overflow-hidden",children:e.jsx("div",{className:"bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out",style:{width:`${(a.length+(s>a.length?.5:0))/t*100}%`}})}),e.jsxs("div",{className:"mt-2 text-center text-sm text-gray-500",children:["Step ",s," of ",t,a.length>0&&e.jsxs("span",{className:"ml-2",children:["(",a.length," completed)"]})]})]})},y=({children:s,variant:t="primary",size:a="md",loading:r=!1,disabled:n=!1,icon:u,iconPosition:c="left",fullWidth:m=!1,className:l,...o})=>{const g=N("inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",{"w-full":m}),i={primary:"bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm",secondary:"bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-sm",outline:"border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500",ghost:"bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",danger:"bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm"},d={sm:"px-3 py-1.5 text-sm rounded-md",md:"px-4 py-2 text-sm rounded-md",lg:"px-6 py-3 text-base rounded-lg"},h={sm:"w-4 h-4",md:"w-5 h-5",lg:"w-5 h-5"},f=n||r;return e.jsxs("button",{className:N(g,i[t],d[a],l),disabled:f,...o,children:[r&&e.jsx(Ee,{className:N("animate-spin",h[a],{"mr-2":s&&c==="left","ml-2":s&&c==="right"})}),!r&&u&&c==="left"&&e.jsx("span",{className:N(h[a],{"mr-2":s}),children:u}),s,!r&&u&&c==="right"&&e.jsx("span",{className:N(h[a],{"ml-2":s}),children:u})]})},j=({children:s,className:t,padding:a="md",shadow:r="sm",border:n=!0,hover:u=!1,selected:c=!1,onClick:m,disabled:l=!1})=>{const o=!!m&&!l,g="bg-white rounded-lg transition-all duration-200",i={none:"",sm:"p-3",md:"p-4",lg:"p-6"},d={none:"",sm:"shadow-sm",md:"shadow-md",lg:"shadow-lg"},h=n?"border border-gray-200":"",f=u&&!l?"hover:shadow-md hover:-translate-y-0.5":"",D=c?"ring-2 ring-primary-500 border-primary-300":"",B=o?"cursor-pointer":"",E=l?"opacity-50 cursor-not-allowed":"";return e.jsx("div",{className:N(g,i[a],d[r],h,f,D,B,E,t),onClick:o?m:void 0,role:o?"button":void 0,tabIndex:o?0:void 0,onKeyDown:o?p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),m==null||m())}:void 0,children:s})},I=({children:s,className:t})=>e.jsx("div",{className:N("mb-4",t),children:s}),b=({children:s,className:t,level:a=3})=>{const r=`h${a}`,n={1:"text-2xl",2:"text-xl",3:"text-lg",4:"text-base"};return e.jsx(r,{className:N("font-semibold text-gray-900",n[a],t),children:s})},S=({children:s,className:t})=>e.jsx("p",{className:N("text-sm text-gray-600",t),children:s}),v=({children:s,className:t})=>e.jsx("div",{className:t,children:s}),de=({onNext:s,onPrevious:t})=>{const{state:a,actions:r}=M(),n=c=>{r.setPlatform(c)},u=r.validateCurrentStep();return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Choose Your Platform"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Select the platform where you want to build your chat session management solution."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:Fe.map(c=>{const m=H[c.value],l=a.platform===c.value;return e.jsx(j,{selected:l,onClick:()=>n(c.value),hover:!0,className:"h-full",children:e.jsxs(v,{children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("div",{className:"text-4xl mb-3",role:"img","aria-label":c.label,children:c.icon}),e.jsx(b,{level:3,children:c.label}),e.jsx(S,{className:"mt-2",children:c.description})]}),e.jsxs("div",{className:"space-y-3 mb-4",children:[e.jsxs("div",{className:"flex items-center text-sm text-gray-600",children:[e.jsx(Q,{className:"w-4 h-4 mr-2 text-gray-400"}),e.jsx("span",{children:m.estimatedTime})]}),e.jsxs("div",{className:"flex items-center text-sm text-gray-600",children:[e.jsx(Y,{className:"w-4 h-4 mr-2 text-gray-400"}),e.jsxs("span",{className:"capitalize",children:[m.complexity," complexity"]})]}),e.jsxs("div",{className:"flex items-center text-sm text-gray-600",children:[e.jsx(re,{className:"w-4 h-4 mr-2 text-gray-400"}),e.jsxs("span",{children:[m.supportedFeatures.length," supported features"]})]})]}),e.jsxs("div",{className:"border-t pt-3",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-900 mb-2",children:"Requirements:"}),e.jsx("ul",{className:"text-xs text-gray-600 space-y-1",children:m.requirements.map((o,g)=>e.jsxs("li",{className:"flex items-center",children:[e.jsx("div",{className:"w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"}),o]},g))})]}),l&&e.jsx("div",{className:"mt-4 p-2 bg-primary-50 rounded-lg",children:e.jsx("div",{className:"text-sm font-medium text-primary-700 text-center",children:"✓ Selected"})})]})},c.value)})}),e.jsxs("div",{className:"mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200",children:[e.jsx("h3",{className:"text-sm font-medium text-blue-900 mb-2",children:"💡 Popular Choices"}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-blue-800",children:"Beginners:"}),e.jsx("span",{className:"text-blue-700 ml-1",children:"Telegram Bot, CLI Tool"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-blue-800",children:"Enterprise:"}),e.jsx("span",{className:"text-blue-700 ml-1",children:"Slack App, Web Chat"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-blue-800",children:"Gaming:"}),e.jsx("span",{className:"text-blue-700 ml-1",children:"Discord Bot"})]})]})]}),!u.isValid&&e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4",children:[e.jsx("h4",{className:"text-sm font-medium text-red-800 mb-2",children:"Please complete this step:"}),e.jsx("ul",{className:"text-sm text-red-700 space-y-1",children:u.errors.map((c,m)=>e.jsxs("li",{className:"flex items-center",children:[e.jsx("div",{className:"w-1 h-1 bg-red-400 rounded-full mr-2 flex-shrink-0"}),c]},m))})]}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx("div",{}),e.jsx("div",{className:"flex space-x-3",children:e.jsx(y,{onClick:s,disabled:!u.isValid,variant:"primary",size:"lg",children:"Continue"})})]})]})},C=({type:s="info",title:t,children:a,dismissible:r=!1,onDismiss:n,className:u})=>{const c={info:ue,success:$,warning:Te,error:Ce},m={info:{container:"bg-blue-50 border-blue-200 text-blue-800",icon:"text-blue-400",title:"text-blue-800"},success:{container:"bg-green-50 border-green-200 text-green-800",icon:"text-green-400",title:"text-green-800"},warning:{container:"bg-yellow-50 border-yellow-200 text-yellow-800",icon:"text-yellow-400",title:"text-yellow-800"},error:{container:"bg-red-50 border-red-200 text-red-800",icon:"text-red-400",title:"text-red-800"}},l=c[s],o=m[s];return e.jsx("div",{className:N("border rounded-lg p-4",o.container,u),role:"alert",children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx(l,{className:N("w-5 h-5",o.icon),"aria-hidden":"true"})}),e.jsxs("div",{className:"ml-3 flex-1",children:[t&&e.jsx("h3",{className:N("text-sm font-medium",o.title),children:t}),e.jsx("div",{className:N("text-sm",t?"mt-2":""),children:a})]}),r&&n&&e.jsx("div",{className:"ml-auto pl-3",children:e.jsx("div",{className:"-mx-1.5 -my-1.5",children:e.jsx("button",{type:"button",onClick:n,className:N("inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",{"text-blue-500 hover:bg-blue-100 focus:ring-blue-600":s==="info","text-green-500 hover:bg-green-100 focus:ring-green-600":s==="success","text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600":s==="warning","text-red-500 hover:bg-red-100 focus:ring-red-600":s==="error"}),"aria-label":"Dismiss",children:e.jsx($e,{className:"w-5 h-5"})})})})]})})},Ze=({onNext:s,onPrevious:t})=>{const{state:a,actions:r}=M(),n=o=>{const g=a.priorities;g.includes(o)?r.setPriorities(g.filter(d=>d!==o)):g.length<R.PRIORITIES.MAX&&r.setPriorities([...g,o])},u=r.validateCurrentStep(),c=a.priorities.length,m=R.PRIORITIES.MIN,l=R.PRIORITIES.MAX;return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Set Your Priorities"}),e.jsxs("p",{className:"text-lg text-gray-600 mb-4",children:["Choose ",m,"-",l," key priorities for your chat session management system."]}),e.jsxs("div",{className:"inline-flex items-center px-4 py-2 bg-gray-100 rounded-full",children:[e.jsxs("span",{className:"text-sm font-medium text-gray-700",children:["Selected: ",c,"/",l]}),c>=m&&e.jsx(ee,{className:"w-4 h-4 ml-2 text-yellow-500 fill-current"})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:ye.map(o=>{const g=a.priorities.includes(o.value),i=!g&&c<l,d=!g&&!i;return e.jsx(j,{selected:g,onClick:()=>n(o.value),hover:!d,disabled:d,className:"h-full relative",children:e.jsx(v,{children:e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx("div",{className:"text-2xl flex-shrink-0",role:"img","aria-label":o.label,children:o.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(b,{level:4,className:"text-base",children:o.label}),e.jsxs("div",{className:"flex items-center space-x-1",children:[o.recommended&&e.jsxs("span",{className:"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",children:[e.jsx(ee,{className:"w-3 h-3 mr-1 fill-current"}),"Recommended"]}),g&&e.jsx("span",{className:"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800",children:"✓ Selected"})]})]}),e.jsx(S,{className:"mt-2",children:o.description})]})]})})},o.value)})}),e.jsx(C,{type:"info",title:"💡 Selection Tips",children:e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Recommended priorities"})," are marked with a star and are commonly needed for most chat systems."]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mt-3",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"For beginners:"}),e.jsx("span",{className:"ml-1",children:"Focus on Message Persistence and Session Management"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"For enterprises:"}),e.jsx("span",{className:"ml-1",children:"Consider User Authentication and Scalability"})]})]})]})}),c>0&&c<m&&e.jsxs(C,{type:"warning",children:["Please select at least ",m-c," more priorit",m-c===1?"y":"ies"," to continue."]}),c===l&&e.jsx(C,{type:"success",children:"Great! You've selected the maximum number of priorities. You can still change your selection if needed."}),!u.isValid&&e.jsx(C,{type:"error",title:"Please complete this step:",children:e.jsx("ul",{className:"space-y-1",children:u.errors.map((o,g)=>e.jsxs("li",{className:"flex items-center",children:[e.jsx("div",{className:"w-1 h-1 bg-red-400 rounded-full mr-2 flex-shrink-0"}),o]},g))})}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Previous"}),e.jsx("div",{className:"flex space-x-3",children:e.jsx(y,{onClick:s,disabled:!u.isValid,variant:"primary",size:"lg",children:"Continue"})})]})]})},Qe=({onNext:s,onPrevious:t,onSkip:a})=>{const{state:r,actions:n}=M(),u=i=>{const d=r.features;d.includes(i)?n.setFeatures(d.filter(f=>f!==i)):n.setFeatures([...d,i])},c=()=>{if(r.platform){const i=H[r.platform],d=J.filter(h=>i.supportedFeatures.includes(h.value)).map(h=>h.value);n.setFeatures(d)}},m=()=>{n.setFeatures([])};n.validateCurrentStep();const l=r.features.length,o=r.platform?H[r.platform]:null,g=(o==null?void 0:o.supportedFeatures)||[];return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Choose Features"}),e.jsx("p",{className:"text-lg text-gray-600 mb-4",children:"Select additional features to enhance your chat session management system."}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4",children:[e.jsx("div",{className:"inline-flex items-center px-4 py-2 bg-gray-100 rounded-full",children:e.jsxs("span",{className:"text-sm font-medium text-gray-700",children:["Selected: ",l," feature",l!==1?"s":""]})}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsx(y,{onClick:c,variant:"outline",size:"sm",disabled:!o,children:"Select All Supported"}),e.jsx(y,{onClick:m,variant:"outline",size:"sm",disabled:l===0,children:"Clear All"})]})]})]}),o&&e.jsx(C,{type:"info",className:"mb-6",children:e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx(ue,{className:"w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Platform Compatibility"}),e.jsxs("p",{className:"text-sm mt-1",children:[o.displayName," supports ",g.length," out of ",J.length," available features. Features not supported by your platform will be shown as disabled."]})]})]})}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:J.map(i=>{const d=r.features.includes(i.value),h=!o||g.includes(i.value);return e.jsx(j,{selected:d,onClick:h?()=>u(i.value):void 0,hover:h,disabled:!h,className:"h-full relative",children:e.jsxs(v,{children:[e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx("div",{className:"text-2xl flex-shrink-0",role:"img","aria-label":i.label,children:i.icon}),e.jsx("div",{className:"flex-1 min-w-0",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx(b,{level:4,className:`text-base ${h?"":"text-gray-400"}`,children:i.label}),e.jsx(S,{className:`mt-2 ${h?"":"text-gray-400"}`,children:i.description})]}),e.jsxs("div",{className:"flex flex-col items-end space-y-1 ml-2",children:[d&&e.jsx("span",{className:"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800",children:"✓ Selected"}),!h&&e.jsx("span",{className:"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500",children:"Not Supported"})]})]})})]}),!h&&e.jsx("div",{className:"absolute inset-0 bg-gray-50 bg-opacity-50 rounded-lg pointer-events-none"})]})},i.value)})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8",children:[e.jsxs("div",{className:"bg-green-50 p-4 rounded-lg",children:[e.jsx("h4",{className:"font-medium text-green-800 mb-2",children:"🤖 AI & Automation"}),e.jsx("p",{className:"text-sm text-green-600",children:"AI Integration, Custom Commands"})]}),e.jsxs("div",{className:"bg-blue-50 p-4 rounded-lg",children:[e.jsx("h4",{className:"font-medium text-blue-800 mb-2",children:"🔗 Integration"}),e.jsx("p",{className:"text-sm text-blue-600",children:"Webhooks, File Attachments"})]}),e.jsxs("div",{className:"bg-purple-50 p-4 rounded-lg",children:[e.jsx("h4",{className:"font-medium text-purple-800 mb-2",children:"🧠 Intelligence"}),e.jsx("p",{className:"text-sm text-purple-600",children:"Context Awareness, Conversation Branching"})]}),e.jsxs("div",{className:"bg-orange-50 p-4 rounded-lg",children:[e.jsx("h4",{className:"font-medium text-orange-800 mb-2",children:"🌍 Global"}),e.jsx("p",{className:"text-sm text-orange-600",children:"Multi-language, Backup & Restore"})]})]}),l>0&&e.jsx(C,{type:"success",children:e.jsxs("p",{children:["Great! You've selected ",l," feature",l!==1?"s":"",". You can continue to configure your team settings, or add/remove features as needed."]})}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Previous"}),e.jsxs("div",{className:"flex space-x-3",children:[a&&e.jsx(y,{onClick:a,variant:"ghost",size:"lg",children:"Skip Features"}),e.jsx(y,{onClick:s,variant:"primary",size:"lg",children:"Continue"})]})]})]})},es=({onNext:s,onPrevious:t})=>{var o,g;const{state:a,actions:r}=M(),n=i=>{r.setTeamSize(i)},u=i=>{r.setComplexity(i)},c=i=>{r.setProjectName(i.target.value)},m=i=>{r.setDescription(i.target.value)},l=r.validateCurrentStep();return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-8",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Project Configuration"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Configure your team size, project complexity, and provide basic project information."})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2 mb-4",children:[e.jsx(re,{className:"w-5 h-5 text-gray-600"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-900",children:"Team Size"})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4",children:te.map(i=>{const d=a.teamSize===i.value;return e.jsx(j,{selected:d,onClick:()=>n(i.value),hover:!0,className:"text-center",children:e.jsxs(v,{className:"p-4",children:[e.jsx("div",{className:"text-3xl mb-2",role:"img","aria-label":i.label,children:i.icon}),e.jsx(b,{level:4,className:"text-sm font-medium",children:i.label}),e.jsx(S,{className:"text-xs mt-1",children:i.description}),d&&e.jsx("div",{className:"mt-2 text-xs font-medium text-primary-600",children:"✓ Selected"})]})},i.value)})})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2 mb-4",children:[e.jsx(Y,{className:"w-5 h-5 text-gray-600"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-900",children:"Complexity Level"})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:ne.map(i=>{const d=a.complexity===i.value;return e.jsx(j,{selected:d,onClick:()=>u(i.value),hover:!0,className:"text-center",children:e.jsxs(v,{className:"p-4",children:[e.jsx("div",{className:"text-3xl mb-2",role:"img","aria-label":i.label,children:i.icon}),e.jsx(b,{level:4,className:"text-sm font-medium",children:i.label}),e.jsx(S,{className:"text-xs mt-1",children:i.description}),d&&e.jsx("div",{className:"mt-2 text-xs font-medium text-primary-600",children:"✓ Selected"})]})},i.value)})})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center space-x-2 mb-4",children:[e.jsx(G,{className:"w-5 h-5 text-gray-600"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-900",children:"Project Information"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"projectName",className:"block text-sm font-medium text-gray-700 mb-2",children:"Project Name *"}),e.jsx("input",{type:"text",id:"projectName",value:a.projectName,onChange:c,placeholder:"e.g., my-chat-bot, customer-support-system",className:"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",maxLength:R.PROJECT_NAME.MAX_LENGTH}),e.jsxs("div",{className:"mt-1 flex justify-between text-xs text-gray-500",children:[e.jsx("span",{children:a.projectName.length<R.PROJECT_NAME.MIN_LENGTH?`Minimum ${R.PROJECT_NAME.MIN_LENGTH} characters`:"Good!"}),e.jsxs("span",{children:[a.projectName.length,"/",R.PROJECT_NAME.MAX_LENGTH]})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"description",className:"block text-sm font-medium text-gray-700 mb-2",children:"Description *"}),e.jsx("textarea",{id:"description",rows:4,value:a.description,onChange:m,placeholder:"Briefly describe what your chat system will do...",className:"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none",maxLength:R.DESCRIPTION.MAX_LENGTH}),e.jsxs("div",{className:"mt-1 flex justify-between text-xs text-gray-500",children:[e.jsx("span",{children:a.description.length<R.DESCRIPTION.MIN_LENGTH?`Minimum ${R.DESCRIPTION.MIN_LENGTH} characters`:"Good!"}),e.jsxs("span",{children:[a.description.length,"/",R.DESCRIPTION.MAX_LENGTH]})]})]})]})]}),(a.teamSize||a.complexity)&&e.jsxs(C,{type:"info",title:"Configuration Preview",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[a.teamSize&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Team Size:"}),e.jsx("span",{className:"ml-1",children:(o=te.find(i=>i.value===a.teamSize))==null?void 0:o.label})]}),a.complexity&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium",children:"Complexity:"}),e.jsx("span",{className:"ml-1",children:(g=ne.find(i=>i.value===a.complexity))==null?void 0:g.label})]})]}),a.teamSize==="enterprise"&&a.complexity==="expert"&&e.jsx("div",{className:"mt-2 p-2 bg-yellow-50 rounded border border-yellow-200",children:e.jsx("p",{className:"text-sm text-yellow-800",children:"⚡ This configuration will generate a comprehensive, production-ready solution with advanced enterprise features."})})]}),!l.isValid&&e.jsx(C,{type:"error",title:"Please complete the following:",children:e.jsx("ul",{className:"space-y-1",children:l.errors.map((i,d)=>e.jsxs("li",{className:"flex items-center text-sm",children:[e.jsx("div",{className:"w-1 h-1 bg-red-400 rounded-full mr-2 flex-shrink-0"}),i]},d))})}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Previous"}),e.jsx("div",{className:"flex space-x-3",children:e.jsx(y,{onClick:s,disabled:!l.isValid,variant:"primary",size:"lg",children:"Review Configuration"})})]})]})},ss=({onNext:s,onPrevious:t})=>{const{state:a,actions:r}=M(),n=a.platform?H[a.platform]:null,u=ye.filter(i=>a.priorities.includes(i.value)),c=J.filter(i=>a.features.includes(i.value)),m=te.find(i=>i.value===a.teamSize),l=ne.find(i=>i.value===a.complexity),o=i=>{r.goToStep(i)},g=()=>{if(!n)return"Unknown";const i={basic:2,intermediate:4,advanced:6,expert:8}[a.complexity||"basic"],d=1+a.features.length*.1,h={solo:1,small:.8,medium:.6,large:.5,enterprise:.4}[a.teamSize||"solo"],f=Math.ceil(i*d*h);return f<2?"1-2 hours":f<4?"2-4 hours":f<8?"4-8 hours":"8+ hours"};return r.validateCurrentStep(),e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Review Your Configuration"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Please review your selections before generating your chat session management solution."})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs(j,{children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"text-2xl",children:n==null?void 0:n.icon}),e.jsx(b,{level:3,children:"Platform"})]}),e.jsx(y,{variant:"ghost",size:"sm",onClick:()=>o(1),icon:e.jsx(F,{}),children:"Edit"})]})}),e.jsx(v,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900",children:n==null?void 0:n.displayName}),e.jsx(S,{children:n==null?void 0:n.description})]}),e.jsxs("div",{className:"flex items-center space-x-4 text-sm text-gray-600",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(Q,{className:"w-4 h-4 mr-1"}),e.jsx("span",{children:n==null?void 0:n.estimatedTime})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx(Y,{className:"w-4 h-4 mr-1"}),e.jsx("span",{className:"capitalize",children:n==null?void 0:n.complexity})]})]})]})})]}),e.jsxs(j,{children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(b,{level:3,children:["Priorities (",a.priorities.length,")"]}),e.jsx(y,{variant:"ghost",size:"sm",onClick:()=>o(2),icon:e.jsx(F,{}),children:"Edit"})]})}),e.jsx(v,{children:e.jsx("div",{className:"space-y-2",children:u.map(i=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"text-lg",children:i.icon}),e.jsx("span",{className:"text-sm font-medium",children:i.label}),i.recommended&&e.jsx("span",{className:"text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded",children:"Recommended"})]},i.value))})})]}),e.jsxs(j,{children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs(b,{level:3,children:["Features (",a.features.length,")"]}),e.jsx(y,{variant:"ghost",size:"sm",onClick:()=>o(3),icon:e.jsx(F,{}),children:"Edit"})]})}),e.jsx(v,{children:a.features.length>0?e.jsx("div",{className:"space-y-2",children:c.map(i=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"text-lg",children:i.icon}),e.jsx("span",{className:"text-sm font-medium",children:i.label})]},i.value))}):e.jsx(S,{children:"No additional features selected"})})]}),e.jsxs(j,{children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(b,{level:3,children:"Configuration"}),e.jsx(y,{variant:"ghost",size:"sm",onClick:()=>o(4),icon:e.jsx(F,{}),children:"Edit"})]})}),e.jsx(v,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(re,{className:"w-4 h-4 text-gray-500"}),e.jsx("span",{className:"text-sm font-medium",children:"Team:"}),e.jsx("span",{className:"text-sm",children:m==null?void 0:m.label})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(Y,{className:"w-4 h-4 text-gray-500"}),e.jsx("span",{className:"text-sm font-medium",children:"Complexity:"}),e.jsx("span",{className:"text-sm",children:l==null?void 0:l.label})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(Q,{className:"w-4 h-4 text-gray-500"}),e.jsx("span",{className:"text-sm font-medium",children:"Est. Time:"}),e.jsx("span",{className:"text-sm",children:g()})]})]})})]})]}),e.jsxs(j,{children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(G,{className:"w-5 h-5 text-gray-600"}),e.jsx(b,{level:3,children:"Project Information"})]}),e.jsx(y,{variant:"ghost",size:"sm",onClick:()=>o(4),icon:e.jsx(F,{}),children:"Edit"})]})}),e.jsx(v,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Project Name:"}),e.jsx("p",{className:"text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded mt-1",children:a.projectName})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Description:"}),e.jsx("p",{className:"text-gray-900 mt-1",children:a.description})]})]})})]}),e.jsx(C,{type:"info",title:"What You'll Get",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium",children:"Generated Files:"}),e.jsxs("ul",{className:"space-y-1",children:[e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-green-500 mr-2"}),"Complete source code"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-green-500 mr-2"}),"Configuration files"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-green-500 mr-2"}),"Package.json with dependencies"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-green-500 mr-2"}),"Documentation & README"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium",children:"Setup Options:"}),e.jsxs("ul",{className:"space-y-1",children:[e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-blue-500 mr-2"}),"Download as ZIP"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-blue-500 mr-2"}),"Copy to clipboard"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-blue-500 mr-2"}),"Auto-setup (optional)"]}),e.jsxs("li",{className:"flex items-center",children:[e.jsx($,{className:"w-4 h-4 text-blue-500 mr-2"}),"Step-by-step instructions"]})]})]})]})}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Previous"}),e.jsx("div",{className:"flex space-x-3",children:e.jsx(y,{onClick:s,variant:"primary",size:"lg",icon:e.jsx(Re,{}),children:"Generate Solution"})})]})]})},ts="modulepreload",ns=function(s){return"/"+s},me={},as=function(t,a,r){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),m=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));n=Promise.allSettled(a.map(l=>{if(l=ns(l),l in me)return;me[l]=!0;const o=l.endsWith(".css"),g=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${g}`))return;const i=document.createElement("link");if(i.rel=o?"stylesheet":ts,o||(i.as="script"),i.crossOrigin="",i.href=l,m&&i.setAttribute("nonce",m),document.head.appendChild(i),o)return new Promise((d,h)=>{i.addEventListener("load",d),i.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function u(c){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=c,window.dispatchEvent(m),!m.defaultPrevented)throw c}return n.then(c=>{for(const m of c||[])m.status==="rejected"&&u(m.reason);return t().catch(u)})};async function rs(s){const t=[],a={...L(s),dependencies:{"discord.js":"^14.13.0",dotenv:"^16.3.1",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"}}},r=`const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}

dotenv.config();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ${s.features.includes("context-awareness")?"GatewayIntentBits.GuildMembers,":""}
  ],
});

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageId: String,
  guildId: String,
  channelId: String,
  userId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const Message = mongoose.model('Message', messageSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

// Commands
const commands = [
  {
    name: 'hello',
    description: 'Replies with a greeting',
  },
  ${s.features.includes("conversation-branching")?`
  {
    name: 'thread',
    description: 'Create a new conversation thread',
  },
  `:""}
  ${s.features.includes("context-awareness")?`
  {
    name: 'context',
    description: 'Show conversation context',
  },
  `:""}
];

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Event handlers
client.once('ready', () => {
  console.log(\`Ready! Logged in as \${client.user.tag}\`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'hello':
        await interaction.reply('Hello! I\\'m your chat session manager.');
        break;
        
      ${s.features.includes("conversation-branching")?`
      case 'thread':
        const thread = await interaction.channel.threads.create({
          name: \`Thread-\${Date.now()}\`,
          autoArchiveDuration: 60,
          reason: 'New conversation thread',
        });
        await interaction.reply(\`Created new thread: <#\${thread.id}>\`);
        break;
      `:""}
      
      ${s.features.includes("context-awareness")?"\n      case 'context':\n        // Get recent messages for context\n        const messages = await interaction.channel.messages.fetch({ limit: 5 });\n        const context = messages.map(m => `${m.author.username}: ${m.content}`).join('\\n');\n        await interaction.reply(`Recent context:\\n\\`\\`\\`\\n${context}\\n\\`\\`\\``);\n        break;\n      ":""}
      
      default:
        await interaction.reply('Unknown command');
    }

    ${s.priorities.includes("session-management")?`
    // Store session data
    const sessionId = \`\${interaction.guildId}-\${interaction.user.id}\`;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
      userId: interaction.user.id,
      guildId: interaction.guildId,
      lastCommand: commandName,
      timestamp: Date.now(),
    }));
    `:""}

  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

${s.priorities.includes("message-persistence")?`
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    // Save message to database
    const newMessage = new Message({
      messageId: message.id,
      guildId: message.guild?.id,
      channelId: message.channel.id,
      userId: message.author.id,
      content: message.content,
      sessionId: \`\${message.guild?.id}-\${message.author.id}\`,
    });
    
    await newMessage.save();
  } catch (error) {
    console.error('Error saving message:', error);
  }
});
`:""}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);`;return t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"index.js",content:r,type:"source",description:"Main Discord bot application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"}),s.features.includes("custom-commands")&&t.push({path:"src/commands.js",content:`// Custom command handlers
const customCommands = {
  // Add your custom commands here
  ping: {
    name: 'ping',
    description: 'Check bot latency',
    execute: async (interaction) => {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(\`Pong! Latency is \${latency}ms.\`);
    },
  },
};

module.exports = customCommands;`,type:"source",description:"Custom command definitions"}),s.features.includes("webhooks")&&t.push({path:"src/webhook.js",content:`const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook verification middleware
const verifyWebhook = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Webhook endpoint
app.post('/webhook', verifyWebhook, (req, res) => {
  const { type, data } = req.body;
  
  // Process webhook data
  console.log('Received webhook:', type, data);
  
  // Send to Discord channel if needed
  // client.channels.cache.get(CHANNEL_ID).send(\`Webhook received: \${type}\`);
  
  res.json({ success: true });
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Webhook server running on port \${PORT}\`);
});

module.exports = app;`,type:"source",description:"Webhook server for external integrations"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm",'2. Run "npm install" to install dependencies',"3. Copy .env.example to .env and fill in your Discord bot token","4. Create a Discord application at https://discord.com/developers/applications","5. Create a bot and copy the token to your .env file","6. Invite the bot to your server with appropriate permissions",'7. Run "npm run dev" to start development server',"8. Use slash commands in your Discord server to test the bot"],estimatedTime:"2-4 hours",complexity:"intermediate"}}async function is(s){const t=[],a={...L(s),dependencies:{"node-telegram-bot-api":"^0.63.0",dotenv:"^16.3.1",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"}}},r=`const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}

dotenv.config();

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageId: Number,
  chatId: Number,
  userId: Number,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const Message = mongoose.model('Message', messageSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

// Bot commands
bot.onText(/\\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = \`
Welcome to ${s.projectName}!

Available commands:
/start - Show this welcome message
/help - Get help
${s.features.includes("context-awareness")?"/context - Show conversation context":""}
${s.features.includes("custom-commands")?"/custom - Run custom command":""}
${s.features.includes("ai-integration")?"/ask - Ask AI a question":""}

Type any message to interact with the bot!
  \`;
  
  await bot.sendMessage(chatId, welcomeMessage);
  
  ${s.priorities.includes("session-management")?`
  // Initialize user session
  const sessionId = \`telegram-\${msg.from.id}\`;
  await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
    userId: msg.from.id,
    chatId: chatId,
    username: msg.from.username,
    startedAt: Date.now(),
  }));
  `:""}
});

bot.onText(/\\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const helpText = \`
${s.projectName} Help

This bot helps you manage chat sessions with the following features:
\${config.priorities.map(p => \`• \${p.replace('-', ' ').replace(/\\\\b\\\\w/g, l => l.toUpperCase())}\`).join('\\\\n')}

For more information, contact the administrator.
  \`;
  
  await bot.sendMessage(chatId, helpText);
});

${s.features.includes("context-awareness")?`
bot.onText(/\\/context/, async (msg) => {
  const chatId = msg.chat.id;
  const sessionId = \`telegram-\${msg.from.id}\`;
  
  try {
    ${s.priorities.includes("session-management")?"\n    const sessionData = await redisClient.get(`session:${sessionId}`);\n    if (sessionData) {\n      const session = JSON.parse(sessionData);\n      await bot.sendMessage(chatId, `Session started: ${new Date(session.startedAt).toLocaleString()}`);\n    }\n    ":""}
    
    ${s.priorities.includes("message-persistence")?`
    const recentMessages = await Message.find({ 
      chatId: chatId 
    }).sort({ timestamp: -1 }).limit(5);
    
    if (recentMessages.length > 0) {
      const context = recentMessages.reverse().map(m => 
        \`\${m.username || 'User'}: \${m.text}\`
      ).join('\\n');
      await bot.sendMessage(chatId, \`Recent context:\\n\\n\${context}\`);
    } else {
      await bot.sendMessage(chatId, 'No recent context found.');
    }
    `:'await bot.sendMessage(chatId, "Context tracking not enabled.");'}
  } catch (error) {
    console.error('Error getting context:', error);
    await bot.sendMessage(chatId, 'Error retrieving context.');
  }
});
`:""}

${s.features.includes("ai-integration")?`
bot.onText(/\\/ask (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const question = match[1];
  
  try {
    await bot.sendMessage(chatId, 'Thinking...', { reply_to_message_id: msg.message_id });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant integrated into a Telegram bot." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    await bot.sendMessage(chatId, answer, { 
      parse_mode: 'Markdown',
      reply_to_message_id: msg.message_id 
    });
    
  } catch (error) {
    console.error('AI Error:', error);
    await bot.sendMessage(chatId, 'Sorry, I encountered an error processing your request.');
  }
});
`:""}

// Handle all text messages
bot.on('message', async (msg) => {
  // Skip if it's a command (starts with /)
  if (msg.text && msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const sessionId = \`telegram-\${msg.from.id}\`;
  
  try {
    ${s.priorities.includes("message-persistence")?`
    // Save message to database
    const newMessage = new Message({
      messageId: msg.message_id,
      chatId: chatId,
      userId: msg.from.id,
      username: msg.from.username || msg.from.first_name,
      text: msg.text,
      sessionId: sessionId,
    });
    
    await newMessage.save();
    `:""}
    
    ${s.priorities.includes("session-management")?`
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      session.messageCount = (session.messageCount || 0) + 1;
      await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    }
    `:""}
    
    // Simple echo response (customize as needed)
    if (msg.text) {
      await bot.sendMessage(chatId, \`You said: "\${msg.text}"\`);
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

${s.features.includes("file-attachments")?`
// Handle file uploads
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1]; // Get highest resolution
  
  try {
    const fileInfo = await bot.getFile(photo.file_id);
    const fileUrl = \`https://api.telegram.org/file/bot\${process.env.TELEGRAM_TOKEN}/\${fileInfo.file_path}\`;
    
    await bot.sendMessage(chatId, \`Photo received! File URL: \${fileUrl}\`);
    
    // Here you could download and process the file
    // const response = await fetch(fileUrl);
    // const buffer = await response.buffer();
    // ... process the file
    
  } catch (error) {
    console.error('Error handling photo:', error);
    await bot.sendMessage(chatId, 'Error processing your photo.');
  }
});

bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const document = msg.document;
  
  try {
    const fileInfo = await bot.getFile(document.file_id);
    const fileUrl = \`https://api.telegram.org/file/bot\${process.env.TELEGRAM_TOKEN}/\${fileInfo.file_path}\`;
    
    await bot.sendMessage(chatId, \`Document received: \${document.file_name}\\nSize: \${document.file_size} bytes\`);
    
  } catch (error) {
    console.error('Error handling document:', error);
    await bot.sendMessage(chatId, 'Error processing your document.');
  }
});
`:""}

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

console.log('Telegram bot started successfully!');`;return t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"index.js",content:r,type:"source",description:"Main Telegram bot application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"}),s.features.includes("custom-commands")&&t.push({path:"src/customCommands.js",content:`// Custom command handlers for Telegram bot
const customCommands = {
  // Example custom command
  '/status': async (bot, msg) => {
    const chatId = msg.chat.id;
    const uptime = process.uptime();
    const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
    
    await bot.sendMessage(chatId, \`
🤖 Bot Status:
Uptime: \${uptimeString}
Memory Usage: \${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
Node.js: \${process.version}
    \`);
  },
  
  '/weather': async (bot, msg) => {
    const chatId = msg.chat.id;
    // Integrate with weather API
    await bot.sendMessage(chatId, 'Weather feature not implemented yet. Add your weather API integration here!');
  },
  
  // Add your custom commands here
};

module.exports = customCommands;`,type:"source",description:"Custom command definitions"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm",'2. Run "npm install" to install dependencies',"3. Create a Telegram bot by messaging @BotFather on Telegram","4. Copy the bot token from @BotFather","5. Copy .env.example to .env and add your bot token",'6. Run "npm run dev" to start development server',"7. Start a chat with your bot on Telegram","8. Send /start to begin interacting with your bot"],estimatedTime:"1-3 hours",complexity:"basic"}}async function os(s){const t=[],a={...L(s),dependencies:{"whatsapp-web.js":"^1.22.2","qrcode-terminal":"^0.12.0",dotenv:"^16.3.1",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"}}},r=`const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}

dotenv.config();

// Initialize WhatsApp client with local authentication
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "${s.projectName.toLowerCase()}",
    dataPath: './sessions'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageId: String,
  from: String,
  to: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  isGroup: Boolean,
  groupName: String,
  sessionId: String,
  hasMedia: Boolean,
  mediaType: String,
});

const Message = mongoose.model('Message', messageSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

// Event handlers
client.on('qr', (qr) => {
  console.log('Scan the QR code below to login:');
  qrcode.generate(qr, { small: true });
  console.log('Or use your phone to scan the QR code in the terminal above.');
});

client.on('authenticated', () => {
  console.log('WhatsApp authenticated successfully!');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  console.log('Bot is now active and listening for messages.');
});

client.on('disconnected', (reason) => {
  console.log('WhatsApp client disconnected:', reason);
});

// Message handling
client.on('message_create', async (message) => {
  // Skip messages sent by this bot
  if (message.fromMe) return;
  
  const contact = await message.getContact();
  const chat = await message.getChat();
  const sessionId = \`whatsapp-\${contact.number}\`;
  
  try {
    ${s.priorities.includes("message-persistence")?`
    // Save message to database
    const newMessage = new Message({
      messageId: message.id._serialized,
      from: contact.number,
      to: message.to,
      body: message.body,
      isGroup: chat.isGroup,
      groupName: chat.isGroup ? chat.name : null,
      sessionId: sessionId,
      hasMedia: message.hasMedia,
      mediaType: message.hasMedia ? message.type : null,
    });
    
    await newMessage.save();
    `:""}
    
    ${s.priorities.includes("session-management")?`
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    const session = sessionData ? JSON.parse(sessionData) : {
      contactNumber: contact.number,
      contactName: contact.pushname || contact.name,
      startedAt: Date.now(),
    };
    
    session.lastActivity = Date.now();
    session.messageCount = (session.messageCount || 0) + 1;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    `:""}
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

client.on('message', async (message) => {
  const contact = await message.getContact();
  const chat = await message.getChat();
  
  // Command handling
  const command = message.body.toLowerCase().trim();
  
  switch (command) {
    case '!help':
      await message.reply(\`
Welcome to ${s.projectName}!

Available commands:
!help - Show this help message
!status - Show bot status
${s.features.includes("context-awareness")?"!context - Show conversation context":""}
${s.features.includes("ai-integration")?"!ask [question] - Ask AI a question":""}
${s.features.includes("backup-restore")?"!backup - Backup your conversation data":""}

Just send a regular message to chat with the bot!
      \`);
      break;
      
    case '!status':
      const uptime = process.uptime();
      const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
      await message.reply(\`
🤖 Bot Status:
Uptime: \${uptimeString}
Contact: \${contact.pushname || contact.name}
Chat Type: \${chat.isGroup ? 'Group' : 'Individual'}
      \`);
      break;
      
    ${s.features.includes("context-awareness")?`
    case '!context':
      try {
        const sessionId = \`whatsapp-\${contact.number}\`;
        ${s.priorities.includes("message-persistence")?`
        const recentMessages = await Message.find({
          $or: [
            { from: contact.number },
            { to: contact.number }
          ]
        }).sort({ timestamp: -1 }).limit(5);
        
        if (recentMessages.length > 0) {
          const context = recentMessages.reverse().map(m => 
            \`\${m.from === contact.number ? 'You' : 'Bot'}: \${m.body}\`
          ).join('\\n');
          await message.reply(\`Recent context:\\n\\n\${context}\`);
        } else {
          await message.reply('No recent context found.');
        }
        `:'await message.reply("Message persistence not enabled for context.");'}
      } catch (error) {
        console.error('Error getting context:', error);
        await message.reply('Error retrieving context.');
      }
      break;
    `:""}
    
    ${s.features.includes("ai-integration")?`
    default:
      if (command.startsWith('!ask ')) {
        const question = message.body.slice(5);
        try {
          await chat.sendStateTyping();
          
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant integrated into a WhatsApp bot. Keep responses concise." },
              { role: "user", content: question }
            ],
            max_tokens: 300
          });
          
          const answer = completion.choices[0].message.content;
          await message.reply(answer);
          
        } catch (error) {
          console.error('AI Error:', error);
          await message.reply('Sorry, I encountered an error processing your request.');
        }
      } else if (!command.startsWith('!')) {
        // Handle regular messages
        await message.reply(\`Thanks for your message: "\${message.body}"\`);
      }
      break;
    `:`
    default:
      if (!command.startsWith('!')) {
        // Handle regular messages
        await message.reply(\`Thanks for your message: "\${message.body}"\`);
      }
      break;
    `}
  }
});

${s.features.includes("file-attachments")?`
// Handle media messages
client.on('message', async (message) => {
  if (message.hasMedia) {
    try {
      const media = await message.downloadMedia();
      
      if (media) {
        console.log(\`Received media: \${media.mimetype}, size: \${media.data.length}\`);
        
        // Here you can process the media file
        // For example, save it to disk or upload to cloud storage
        
        await message.reply(\`Received your \${media.mimetype} file! File size: \${Math.round(media.data.length / 1024)}KB\`);
      }
    } catch (error) {
      console.error('Error handling media:', error);
      await message.reply('Sorry, I had trouble processing your media file.');
    }
  }
});
`:""}

${s.features.includes("backup-restore")?`
// Backup functionality
client.on('message', async (message) => {
  if (message.body.toLowerCase() === '!backup') {
    const contact = await message.getContact();
    const sessionId = \`whatsapp-\${contact.number}\`;
    
    try {
      ${s.priorities.includes("message-persistence")?`
      const messages = await Message.find({
        $or: [
          { from: contact.number },
          { to: contact.number }
        ]
      }).sort({ timestamp: 1 });
      
      const backup = {
        contact: {
          number: contact.number,
          name: contact.pushname || contact.name,
        },
        messages: messages,
        backupDate: new Date(),
      };
      
      // In a real implementation, you'd save this to a file or cloud storage
      await message.reply(\`Backup created with \${messages.length} messages from your conversation history.\`);
      `:'await message.reply("Message persistence not enabled for backups.");'}
      
    } catch (error) {
      console.error('Backup error:', error);
      await message.reply('Error creating backup.');
    }
  }
});
`:""}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down WhatsApp bot...');
  await client.destroy();
  process.exit(0);
});

// Start the client
client.initialize();`;return t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"index.js",content:r,type:"source",description:"Main WhatsApp bot application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"}),t.push({path:"src/sessionManager.js",content:`// WhatsApp session management utilities
class SessionManager {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async createSession(contactNumber, data) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    await this.redis.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
      ...data,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    }));
    return sessionId;
  }
  
  async getSession(contactNumber) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    const data = await this.redis.get(\`session:\${sessionId}\`);
    return data ? JSON.parse(data) : null;
  }
  
  async updateSession(contactNumber, updates) {
    const session = await this.getSession(contactNumber);
    if (session) {
      const updated = { ...session, ...updates, lastActivity: Date.now() };
      await this.createSession(contactNumber, updated);
    }
  }
  
  async deleteSession(contactNumber) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    await this.redis.del(\`session:\${sessionId}\`);
  }
}

module.exports = SessionManager;`,type:"source",description:"Session management utilities"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm",'2. Run "npm install" to install dependencies',"3. Copy .env.example to .env (no API keys needed for WhatsApp Web)",'4. Run "npm run dev" to start the bot',"5. Scan the QR code with your WhatsApp mobile app","6. Go to WhatsApp > Settings > Linked Devices > Link a Device","7. Scan the QR code displayed in your terminal",'8. Once connected, send "!help" to any WhatsApp contact to test'],estimatedTime:"3-5 hours",complexity:"advanced"}}async function cs(s){const t=[],a={...L(s),dependencies:{"@slack/bolt":"^3.14.0",dotenv:"^16.3.1",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"}}},r=`const { App } = require('@slack/bolt');
const dotenv = require('dotenv');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}

dotenv.config();

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageTs: String,
  channelId: String,
  userId: String,
  userName: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  teamId: String,
  sessionId: String,
  threadTs: String,
});

const Message = mongoose.model('Message', messageSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

// Command handlers
app.command('/hello', async ({ command, ack, respond }) => {
  await ack();
  
  await respond({
    text: \`Hello <@\${command.user_id}>! Welcome to ${s.projectName}.\`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`Hello <@\${command.user_id}>! Welcome to *${s.projectName}*.\`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Available commands:\\n• \`/hello\` - Show this greeting\\n• \`/help\` - Get help${s.features.includes("context-awareness")?"\\n• `/context` - Show conversation context":""}${s.features.includes("ai-integration")?"\\n• `/ask [question]` - Ask AI a question":""}'
        }
      }
    ]
  });
  
  ${s.priorities.includes("session-management")?`
  // Create or update user session
  const sessionId = \`slack-\${command.team_id}-\${command.user_id}\`;
  await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
    userId: command.user_id,
    teamId: command.team_id,
    channelId: command.channel_id,
    lastCommand: 'hello',
    timestamp: Date.now(),
  }));
  `:""}
});

app.command('/help', async ({ command, ack, respond }) => {
  await ack();
  
  await respond({
    text: 'Help for ${s.projectName}',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '${s.projectName} Help'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'This Slack app provides chat session management with the following features:'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`\${config.priorities.map(p => \`• *\${p.replace('-', ' ').replace(/\\\\b\\\\w/g, l => l.toUpperCase())}*\`).join('\\\\n')}\`
        }
      },
      ${s.features.length>0?`
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`Additional features:\\\\n\${config.features.map(f => \`• \${f.replace('-', ' ').replace(/\\\\b\\\\w/g, l => l.toUpperCase())}\`).join('\\\\n')}\`
        }
      },
      `:""}
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'For support, contact your system administrator.'
          }
        ]
      }
    ]
  });
});

${s.features.includes("context-awareness")?`
app.command('/context', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const sessionId = \`slack-\${command.team_id}-\${command.user_id}\`;
    
    ${s.priorities.includes("message-persistence")?`
    const recentMessages = await Message.find({
      channelId: command.channel_id,
      teamId: command.team_id
    }).sort({ timestamp: -1 }).limit(5);
    
    if (recentMessages.length > 0) {
      const context = recentMessages.reverse().map(m => 
        \`<@\${m.userId}>: \${m.text}\`
      ).join('\\n');
      
      await respond({
        text: 'Recent conversation context',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Recent Context:*\\n\`\`\`\\n' + context + '\\n\`\`\`'
            }
          }
        ]
      });
    } else {
      await respond('No recent context found in this channel.');
    }
    `:'await respond("Message persistence not enabled for context.");'}
    
  } catch (error) {
    console.error('Error getting context:', error);
    await respond('Error retrieving context.');
  }
});
`:""}

${s.features.includes("ai-integration")?`
app.command('/ask', async ({ command, ack, respond }) => {
  await ack();
  
  const question = command.text.trim();
  if (!question) {
    await respond('Please provide a question. Example: \`/ask What is the weather like?\`');
    return;
  }
  
  try {
    await respond({
      text: 'Thinking...',
      response_type: 'ephemeral'
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant integrated into a Slack bot. Keep responses professional and concise." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    
    await respond({
      text: \`AI Response to: "\${question}"\`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: \`*Question:* \${question}\\n\\n*AI Response:*\\n\${answer}\`
          }
        }
      ]
    });
    
  } catch (error) {
    console.error('AI Error:', error);
    await respond('Sorry, I encountered an error processing your request.');
  }
});
`:""}

// Message handling
app.message(async ({ message, say }) => {
  // Skip bot messages and threaded replies (unless specifically handling threads)
  if (message.subtype || message.bot_id) return;
  
  const sessionId = \`slack-\${message.team}-\${message.user}\`;
  
  try {
    ${s.priorities.includes("message-persistence")?`
    // Save message to database
    const newMessage = new Message({
      messageTs: message.ts,
      channelId: message.channel,
      userId: message.user,
      text: message.text,
      teamId: message.team,
      sessionId: sessionId,
      threadTs: message.thread_ts,
    });
    
    await newMessage.save();
    `:""}
    
    ${s.priorities.includes("session-management")?`
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    const session = sessionData ? JSON.parse(sessionData) : {
      userId: message.user,
      teamId: message.team,
      startedAt: Date.now(),
    };
    
    session.lastActivity = Date.now();
    session.lastChannelId = message.channel;
    session.messageCount = (session.messageCount || 0) + 1;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    `:""}
    
    // Simple response logic (customize as needed)
    if (message.text && message.text.toLowerCase().includes('hello')) {
      await say(\`Hello <@\${message.user}>! Use \`/hello\` for more options.\`);
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

${s.features.includes("conversation-branching")?`
// Handle thread messages
app.message(async ({ message, say }) => {
  if (message.thread_ts && !message.bot_id) {
    try {
      // This is a thread reply
      await say({
        text: \`Thread reply received: "\${message.text}"\`,
        thread_ts: message.thread_ts
      });
      
      ${s.priorities.includes("message-persistence")?`
      // Update message with thread info
      await Message.findOneAndUpdate(
        { messageTs: message.ts },
        { threadTs: message.thread_ts }
      );
      `:""}
      
    } catch (error) {
      console.error('Error handling thread message:', error);
    }
  }
});
`:""}

${s.features.includes("webhooks")?`
// Webhook endpoint for external integrations
app.event('app_mention', async ({ event, say }) => {
  try {
    await say({
      text: \`Thanks for mentioning me, <@\${event.user}>!\`,
      channel: event.channel
    });
    
    // Process external webhook data if needed
    // This could trigger based on external events
    
  } catch (error) {
    console.error('Error handling mention:', error);
  }
});
`:""}

${s.features.includes("file-attachments")?`
// Handle file uploads
app.event('file_shared', async ({ event, client }) => {
  try {
    const fileInfo = await client.files.info({
      file: event.file_id
    });
    
    console.log('File shared:', fileInfo.file);
    
    // Process the file as needed
    // You could download, analyze, or store file metadata
    
  } catch (error) {
    console.error('Error handling file:', error);
  }
});
`:""}

${s.priorities.includes("user-authentication")?`
// User authentication and authorization
app.use(async ({ next, context }) => {
  // Add user validation logic here
  const userId = context.userId;
  const teamId = context.teamId;
  
  // Example: Check if user has permission
  // const hasPermission = await checkUserPermission(userId, teamId);
  // if (!hasPermission) {
  //   return; // Block the request
  // }
  
  await next();
});
`:""}

// Error handling
app.error((error) => {
  console.error('Slack app error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('⚡️ Slack app started successfully!');
  } catch (error) {
    console.error('Error starting Slack app:', error);
    process.exit(1);
  }
})();`;t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"index.js",content:r,type:"source",description:"Main Slack app application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"});const n=`{
  "display_information": {
    "name": "${s.projectName}",
    "description": "${s.description}",
    "background_color": "#2c2d30"
  },
  "features": {
    "app_home": {
      "home_tab_enabled": true,
      "messages_tab_enabled": false,
      "messages_tab_read_only_enabled": false
    },
    "bot_user": {
      "display_name": "${s.projectName}",
      "always_online": true
    },
    "slash_commands": [
      {
        "command": "/hello",
        "description": "Get a greeting from the bot",
        "should_escape": false
      },
      {
        "command": "/help",
        "description": "Get help and information",
        "should_escape": false
      }
      ${s.features.includes("context-awareness")?`,
      {
        "command": "/context",
        "description": "Show conversation context",
        "should_escape": false
      }`:""}
      ${s.features.includes("ai-integration")?`,
      {
        "command": "/ask",
        "description": "Ask AI a question",
        "usage_hint": "[your question]",
        "should_escape": false
      }`:""}
    ]
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "app_mentions:read",
        "channels:history",
        "chat:write",
        "commands",
        "groups:history",
        "im:history",
        "mpim:history"
        ${s.features.includes("file-attachments")?',"files:read"':""}
        ${s.priorities.includes("user-authentication")?',"users:read"':""}
      ]
    }
  },
  "settings": {
    "event_subscriptions": {
      "bot_events": [
        "app_mention",
        "message.channels",
        "message.groups",
        "message.im",
        "message.mpim"
        ${s.features.includes("file-attachments")?',"file_shared"':""}
      ]
    },
    "interactivity": {
      "is_enabled": true
    },
    "org_deploy_enabled": false,
    "socket_mode_enabled": true,
    "token_rotation_enabled": false
  }
}`;return t.push({path:"slack-app-manifest.json",content:n,type:"config",description:"Slack app manifest for easy setup"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm","2. Create a Slack app at https://api.slack.com/apps","3. Use the slack-app-manifest.json file to configure your app","4. Install the app to your workspace","5. Copy the Bot User OAuth Token and Signing Secret","6. Generate an App-Level Token with connections:write scope","7. Copy .env.example to .env and fill in your tokens",'8. Run "npm install" to install dependencies','9. Run "npm run dev" to start the app',"10. Test with /hello command in your Slack workspace"],estimatedTime:"4-6 hours",complexity:"advanced"}}async function ls(s){const t=[],a={...L(s),dependencies:{"twitter-api-v2":"^1.15.1",dotenv:"^16.3.1","node-cron":"^3.0.2",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"}}},r=`const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');
const cron = require('node-cron');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}

dotenv.config();

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Get read-write access
const rwClient = client.readWrite;

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const tweetSchema = new mongoose.Schema({
  tweetId: String,
  userId: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  isRetweet: Boolean,
  replyToId: String,
  sessionId: String,
  sentiment: String,
  processed: { type: Boolean, default: false },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

// Rate limiting tracker
const rateLimitTracker = {
  tweets: { count: 0, resetTime: Date.now() + 900000 }, // 15 minutes
  mentions: { count: 0, resetTime: Date.now() + 900000 },
};

function checkRateLimit(type, limit) {
  const tracker = rateLimitTracker[type];
  if (Date.now() > tracker.resetTime) {
    tracker.count = 0;
    tracker.resetTime = Date.now() + 900000;
  }
  
  if (tracker.count >= limit) {
    console.log(\`Rate limit reached for \${type}. Waiting...\`);
    return false;
  }
  
  tracker.count++;
  return true;
}

// Bot functionality
class TwitterBot {
  constructor() {
    this.lastMentionId = null;
    this.initialize();
  }
  
  async initialize() {
    console.log('Initializing Twitter Bot...');
    
    try {
      // Verify credentials
      const user = await rwClient.currentUser();
      console.log(\`Logged in as: @\${user.username} (\${user.name})\`);
      
      ${s.priorities.includes("error-handling")?`
      // Set up rate limiting
      this.setupRateLimiting();
      `:""}
      
      // Start monitoring
      this.startMonitoring();
      
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }
  
  async startMonitoring() {
    console.log('Starting mention monitoring...');
    
    // Monitor mentions every 60 seconds
    setInterval(async () => {
      await this.checkMentions();
    }, 60000);
    
    // Initial check
    await this.checkMentions();
  }
  
  async checkMentions() {
    if (!checkRateLimit('mentions', 75)) return;
    
    try {
      const mentions = await rwClient.v2.userMentionTimeline(
        (await rwClient.currentUser()).id,
        {
          max_results: 10,
          'tweet.fields': ['author_id', 'created_at', 'conversation_id'],
          'user.fields': ['username'],
          expansions: ['author_id'],
          since_id: this.lastMentionId
        }
      );
      
      if (mentions.data?.length) {
        for (const tweet of mentions.data) {
          await this.processMention(tweet, mentions.includes?.users);
        }
        
        this.lastMentionId = mentions.data[0].id;
      }
      
    } catch (error) {
      console.error('Error checking mentions:', error);
    }
  }
  
  async processMention(tweet, users) {
    const author = users?.find(u => u.id === tweet.author_id);
    const sessionId = \`twitter-\${tweet.author_id}\`;
    
    console.log(\`Processing mention from @\${author?.username}: \${tweet.text}\`);
    
    try {
      ${s.priorities.includes("message-persistence")?`
      // Save tweet to database
      const newTweet = new Tweet({
        tweetId: tweet.id,
        userId: tweet.author_id,
        username: author?.username,
        text: tweet.text,
        replyToId: tweet.conversation_id,
        sessionId: sessionId,
      });
      
      await newTweet.save();
      `:""}
      
      ${s.priorities.includes("session-management")?`
      // Update or create session
      const sessionData = await redisClient.get(\`session:\${sessionId}\`);
      const session = sessionData ? JSON.parse(sessionData) : {
        userId: tweet.author_id,
        username: author?.username,
        startedAt: Date.now(),
      };
      
      session.lastActivity = Date.now();
      session.mentionCount = (session.mentionCount || 0) + 1;
      await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
      `:""}
      
      // Generate response
      let response = await this.generateResponse(tweet, author);
      
      ${s.features.includes("ai-integration")?`
      // Use AI to generate smart response
      if (response.includes('[AI_RESPONSE]')) {
        response = await this.getAIResponse(tweet.text, author?.username);
      }
      `:""}
      
      // Reply to the mention
      if (response && checkRateLimit('tweets', 300)) {
        await rwClient.v2.reply(response, tweet.id);
        console.log(\`Replied to @\${author?.username}\`);
      }
      
    } catch (error) {
      console.error('Error processing mention:', error);
    }
  }
  
  async generateResponse(tweet, author) {
    const text = tweet.text.toLowerCase();
    
    // Simple response logic (customize as needed)
    if (text.includes('hello') || text.includes('hi')) {
      return \`Hello @\${author?.username}! Thanks for reaching out to ${s.projectName}.\`;
    }
    
    if (text.includes('help')) {
      return \`Hi @\${author?.username}! I'm ${s.projectName}, a chat session management bot. How can I assist you?\`;
    }
    
    if (text.includes('status')) {
      const uptime = Math.floor(process.uptime() / 3600);
      return \`Hi @\${author?.username}! Bot status: Running for \${uptime} hours. All systems operational!\`;
    }
    
    ${s.features.includes("custom-commands")?`
    // Custom commands
    if (text.includes('!stats')) {
      return await this.getStats(author?.username);
    }
    `:""}
    
    ${s.features.includes("ai-integration")?`
    // Default to AI response
    return '[AI_RESPONSE]';
    `:`
    // Default response
    return \`Thanks for your message, @\${author?.username}! I'm ${s.projectName}.\`;
    `}
  }
  
  ${s.features.includes("ai-integration")?`
  async getAIResponse(text, username) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are ${s.projectName}, a helpful Twitter bot. Keep responses under 280 characters and friendly. Always include the username in your response." 
          },
          { role: "user", content: \`@\${username} said: \${text}\` }
        ],
        max_tokens: 60
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('AI Error:', error);
      return \`Thanks for your message, @\${username}! I'm having trouble processing that right now.\`;
    }
  }
  `:""}
  
  ${s.features.includes("custom-commands")?`
  async getStats(username) {
    try {
      ${s.priorities.includes("message-persistence")?"\n      const totalTweets = await Tweet.countDocuments();\n      const userTweets = await Tweet.countDocuments({ username: username });\n      return `Hi @${username}! Stats: ${totalTweets} total interactions, ${userTweets} from you.`;\n      ":"\n      return `Hi @${username}! Stats feature requires message persistence to be enabled.`;\n      "}
    } catch (error) {
      return \`Hi @\${username}! Error retrieving stats.\`;
    }
  }
  `:""}
  
  ${s.priorities.includes("error-handling")?`
  async logAnalytics(event, data) {
    try {
      const analyticsData = {
        event,
        data,
        timestamp: new Date(),
        botId: '${s.projectName.toLowerCase()}',
      };
      
      // Log to console (in production, send to analytics service)
      console.log('Analytics:', JSON.stringify(analyticsData));
      
      // Store in Redis for temporary analytics
      await redisClient.lPush('analytics', JSON.stringify(analyticsData));
      await redisClient.lTrim('analytics', 0, 999); // Keep last 1000 events
      
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  `:""}
  
  ${s.priorities.includes("error-handling")?`
  setupRateLimiting() {
    // Monitor rate limit status
    setInterval(async () => {
      try {
        const limits = await rwClient.v1.rateLimitStatus();
        console.log('Rate limit status:', {
          mentions: limits.resources.statuses['/statuses/mentions_timeline'],
          tweets: limits.resources.statuses['/statuses/update'],
        });
      } catch (error) {
        console.error('Rate limit check error:', error);
      }
    }, 300000); // Check every 5 minutes
  }
  `:""}
}

${s.features.includes("webhooks")?`
// Webhook server for external triggers
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook/tweet', async (req, res) => {
  try {
    const { message, hashtags } = req.body;
    
    if (message && checkRateLimit('tweets', 300)) {
      let tweetText = message;
      if (hashtags && hashtags.length > 0) {
        tweetText += ' ' + hashtags.map(tag => \`#\${tag}\`).join(' ');
      }
      
      await rwClient.v2.tweet(tweetText);
      res.json({ success: true, message: 'Tweet posted' });
    } else {
      res.status(429).json({ error: 'Rate limit reached' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to post tweet' });
  }
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Webhook server running on port \${PORT}\`);
});
`:""}

// Scheduled tasks
${s.features.includes("custom-commands")?`
// Daily status tweet (customize timing)
cron.schedule('0 9 * * *', async () => {
  if (checkRateLimit('tweets', 300)) {
    const uptime = Math.floor(process.uptime() / 86400);
    await rwClient.v2.tweet(\`Good morning! ${s.projectName} has been running for \${uptime} days. Have a great day! #bot #automation\`);
  }
});
`:""}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
const bot = new TwitterBot();

console.log('Twitter bot started! Monitoring mentions...');`;return t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"index.js",content:r,type:"source",description:"Main Twitter bot application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"}),s.priorities.includes("error-handling")&&t.push({path:"src/analytics.js",content:`// Twitter bot analytics utilities
class TwitterAnalytics {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async trackMention(userId, tweetId) {
    const key = \`analytics:mentions:\${new Date().toISOString().split('T')[0]}\`;
    await this.redis.incr(key);
    await this.redis.expire(key, 2592000); // 30 days
  }
  
  async trackResponse(userId, tweetId) {
    const key = \`analytics:responses:\${new Date().toISOString().split('T')[0]}\`;
    await this.redis.incr(key);
    await this.redis.expire(key, 2592000);
  }
  
  async getDailyStats(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    const mentions = await this.redis.get(\`analytics:mentions:\${dateStr}\`) || 0;
    const responses = await this.redis.get(\`analytics:responses:\${dateStr}\`) || 0;
    
    return {
      date: dateStr,
      mentions: parseInt(mentions),
      responses: parseInt(responses),
      responseRate: mentions > 0 ? (responses / mentions * 100).toFixed(2) : 0
    };
  }
  
  async getWeeklyStats() {
    const stats = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      stats.push(await this.getDailyStats(date));
    }
    return stats.reverse();
  }
}

module.exports = TwitterAnalytics;`,type:"source",description:"Analytics tracking utilities"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm","2. Create a Twitter Developer account at https://developer.twitter.com","3. Create a new app and generate API keys","4. Enable read and write permissions for your app","5. Copy .env.example to .env and fill in your Twitter API credentials",'6. Run "npm install" to install dependencies','7. Run "npm run dev" to start the bot',"8. Mention your bot on Twitter to test functionality","9. Monitor the console for bot activity and responses"],estimatedTime:"2-4 hours",complexity:"intermediate"}}async function ds(s){const t=[],a={...L(s),dependencies:{express:"^4.18.2","socket.io":"^4.7.2",cors:"^2.8.5",helmet:"^7.0.0",dotenv:"^16.3.1",uuid:"^9.0.0",...s.priorities.includes("message-persistence")&&{mongoose:"^7.4.1"},...s.priorities.includes("session-management")&&{redis:"^4.6.7"},...s.priorities.includes("user-authentication")&&{jsonwebtoken:"^9.0.1",bcryptjs:"^2.4.3"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"},...s.features.includes("file-attachments")&&{multer:"^1.4.5-lts.1"}}},r=`const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
${s.priorities.includes("message-persistence")?"const mongoose = require('mongoose');":""}
${s.priorities.includes("session-management")?"const redis = require('redis');":""}
${s.priorities.includes("user-authentication")?"const jwt = require('jsonwebtoken');":""}
${s.priorities.includes("user-authentication")?"const bcrypt = require('bcryptjs');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}
${s.features.includes("file-attachments")?"const multer = require('multer');":""}

dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

${s.priorities.includes("session-management")?`
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
`:""}

${s.priorities.includes("message-persistence")?`
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${s.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageId: { type: String, unique: true },
  sessionId: String,
  userId: String,
  username: String,
  content: String,
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  roomId: String,
  isSystem: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  userId: String,
  username: String,
  roomId: String,
  startTime: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  metadata: Object,
});

const Session = mongoose.model('Session', sessionSchema);
`:""}

${s.priorities.includes("user-authentication")?`
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model('User', userSchema);
`:""}

${s.features.includes("ai-integration")?`
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
`:""}

${s.features.includes("file-attachments")?`
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});
`:""}

// In-memory storage for demo (use Redis/Database in production)
const activeSessions = new Map();
const activeRooms = new Map();

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // messages per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(sessionId) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(sessionId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  rateLimitMap.set(sessionId, userLimit);
  return true;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-chat', async (data) => {
    try {
      const { username, roomId = 'general' } = data;
      const sessionId = uuidv4();
      
      // Store session info
      const sessionData = {
        sessionId,
        userId: socket.id,
        username,
        roomId,
        joinTime: new Date(),
      };
      
      activeSessions.set(socket.id, sessionData);
      socket.join(roomId);
      
      ${s.priorities.includes("session-management")?"\n      // Store in Redis\n      await redisClient.setEx(`session:${sessionId}`, 3600, JSON.stringify(sessionData));\n      ":""}
      
      ${s.priorities.includes("message-persistence")?`
      // Save session to database
      const session = new Session(sessionData);
      await session.save();
      `:""}
      
      // Notify room
      socket.to(roomId).emit('user-joined', {
        username,
        message: \`\${username} joined the chat\`,
        timestamp: new Date(),
      });
      
      // Send session info back to client
      socket.emit('session-created', { sessionId, roomId });
      
      console.log(\`User \${username} joined room \${roomId}\`);
      
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });
  
  socket.on('send-message', async (data) => {
    try {
      const session = activeSessions.get(socket.id);
      if (!session) {
        socket.emit('error', { message: 'No active session' });
        return;
      }
      
      const { content, type = 'text' } = data;
      
      // Rate limiting
      if (!checkRateLimit(session.sessionId)) {
        socket.emit('error', { message: 'Rate limit exceeded. Please slow down.' });
        return;
      }
      
      const messageData = {
        messageId: uuidv4(),
        sessionId: session.sessionId,
        userId: session.userId,
        username: session.username,
        content,
        type,
        timestamp: new Date(),
        roomId: session.roomId,
      };
      
      ${s.priorities.includes("message-persistence")?`
      // Save message to database
      const message = new Message(messageData);
      await message.save();
      `:""}
      
      // Broadcast message to room
      io.to(session.roomId).emit('new-message', messageData);
      
      ${s.features.includes("ai-integration")?`
      // AI auto-response (if enabled for the room)
      if (content.toLowerCase().includes('bot') || content.startsWith('/ai')) {
        const aiResponse = await generateAIResponse(content, session.username);
        if (aiResponse) {
          const botMessage = {
            messageId: uuidv4(),
            sessionId: 'bot-session',
            userId: 'bot',
            username: 'ChatBot',
            content: aiResponse,
            type: 'text',
            timestamp: new Date(),
            roomId: session.roomId,
            isSystem: true,
          };
          
          io.to(session.roomId).emit('new-message', botMessage);
          
          ${s.priorities.includes("message-persistence")?`
          const botMessageDoc = new Message(botMessage);
          await botMessageDoc.save();
          `:""}
        }
      }
      `:""}
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  ${s.features.includes("conversation-branching")?`
  socket.on('create-thread', async (data) => {
    try {
      const session = activeSessions.get(socket.id);
      if (!session) return;
      
      const { parentMessageId, threadName } = data;
      const threadId = \`thread-\${uuidv4()}\`;
      
      socket.join(threadId);
      
      const threadData = {
        threadId,
        parentMessageId,
        threadName: threadName || 'New Thread',
        createdBy: session.username,
        roomId: session.roomId,
        createdAt: new Date(),
      };
      
      socket.emit('thread-created', threadData);
      socket.to(session.roomId).emit('thread-available', threadData);
      
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  });
  `:""}
  
  socket.on('typing-start', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      socket.to(session.roomId).emit('user-typing', {
        username: session.username,
        isTyping: true,
      });
    }
  });
  
  socket.on('typing-stop', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      socket.to(session.roomId).emit('user-typing', {
        username: session.username,
        isTyping: false,
      });
    }
  });
  
  socket.on('disconnect', async () => {
    try {
      const session = activeSessions.get(socket.id);
      if (session) {
        // Notify room
        socket.to(session.roomId).emit('user-left', {
          username: session.username,
          message: \`\${session.username} left the chat\`,
          timestamp: new Date(),
        });
        
        ${s.priorities.includes("session-management")?"\n        // Update session status\n        await redisClient.del(`session:${session.sessionId}`);\n        ":""}
        
        ${s.priorities.includes("message-persistence")?`
        // Update session in database
        await Session.findOneAndUpdate(
          { sessionId: session.sessionId },
          { isActive: false, lastActivity: new Date() }
        );
        `:""}
        
        activeSessions.delete(socket.id);
      }
      
      console.log('Client disconnected:', socket.id);
      
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

${s.features.includes("ai-integration")?`
// AI Response Generator
async function generateAIResponse(message, username) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful chat assistant. Keep responses concise and friendly. You're integrated into a web chat application called ${s.projectName}." 
        },
        { role: "user", content: \`\${username} said: \${message}\` }
      ],
      max_tokens: 150
    });
    
    return completion.choices[0].message.content;
    
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}
`:""}

// REST API Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

${s.priorities.includes("message-persistence")?`
// Get chat history
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json({ messages: messages.reverse() });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
`:""}

${s.features.includes("file-attachments")?`
// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = \`/uploads/\${req.file.filename}\`;
    
    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
`:""}

${s.priorities.includes("error-handling")?`
// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const stats = {
      activeSessions: activeSessions.size,
      totalRooms: activeRooms.size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
    
    ${s.priorities.includes("message-persistence")?`
    const totalMessages = await Message.countDocuments();
    const totalUsers = await Session.distinct('username').then(users => users.length);
    
    stats.totalMessages = totalMessages;
    stats.totalUsers = totalUsers;
    `:""}
    
    res.json(stats);
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});
`:""}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    uptime: process.uptime() 
  });
});

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Web chat server running on port \${PORT}\`);
  console.log(\`Visit http://localhost:\${PORT} to test the chat\`);
});`;t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with dependencies"},{path:"server.js",content:r,type:"source",description:"Main web chat server application"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"});const n=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.projectName} - Web Chat</title>
    <script src="/socket.io/socket.io.js"><\/script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; height: 100vh; display: flex; flex-direction: column; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { padding: 20px; background: #007bff; color: white; text-align: center; }
        .chat-container { flex: 1; display: flex; flex-direction: column; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; max-height: 400px; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; }
        .message.own { background: #007bff; color: white; margin-left: 50px; }
        .message.other { background: #e9ecef; margin-right: 50px; }
        .message.system { background: #ffc107; text-align: center; margin: 10px 0; font-style: italic; }
        .message-info { font-size: 12px; opacity: 0.7; margin-bottom: 5px; }
        .input-container { padding: 20px; border-top: 1px solid #dee2e6; display: flex; gap: 10px; }
        .message-input { flex: 1; padding: 12px; border: 1px solid #dee2e6; border-radius: 25px; outline: none; }
        .send-button { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 25px; cursor: pointer; }
        .send-button:hover { background: #0056b3; }
        .typing-indicator { padding: 10px 20px; font-style: italic; color: #666; font-size: 14px; }
        .join-form { padding: 40px; text-align: center; }
        .join-input { padding: 12px; margin: 10px; border: 1px solid #dee2e6; border-radius: 5px; width: 200px; }
        .join-button { padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${s.projectName}</h1>
            <p>Real-time Web Chat Application</p>
        </div>
        
        <div id="joinForm" class="join-form">
            <h2>Join the Chat</h2>
            <input type="text" id="usernameInput" class="join-input" placeholder="Enter your username" maxlength="20">
            <input type="text" id="roomInput" class="join-input" placeholder="Room (optional)" maxlength="20">
            <button id="joinButton" class="join-button">Join Chat</button>
        </div>
        
        <div id="chatContainer" class="chat-container hidden">
            <div id="messages" class="messages"></div>
            <div id="typingIndicator" class="typing-indicator"></div>
            <div class="input-container">
                <input type="text" id="messageInput" class="message-input" placeholder="Type your message..." maxlength="500">
                <button id="sendButton" class="send-button">Send</button>
            </div>
        </div>
    </div>

    <script src="client.js"><\/script>
</body>
</html>`;return t.push({path:"public/index.html",content:n,type:"source",description:"Client-side HTML interface"},{path:"public/client.js",content:`// Client-side Socket.IO chat application
let socket;
let currentSession = null;
let typingTimer;

// DOM elements
const joinForm = document.getElementById('joinForm');
const chatContainer = document.getElementById('chatContainer');
const usernameInput = document.getElementById('usernameInput');
const roomInput = document.getElementById('roomInput');
const joinButton = document.getElementById('joinButton');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    joinButton.addEventListener('click', joinChat);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            handleTyping();
        }
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
    
    roomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
}

function joinChat() {
    const username = usernameInput.value.trim();
    const room = roomInput.value.trim() || 'general';
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    // Initialize socket connection
    socket = io();
    
    // Setup socket event listeners
    socket.on('session-created', (data) => {
        currentSession = data;
        joinForm.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        messageInput.focus();
        
        addSystemMessage(\`Welcome to \${room} room!\`);
    });
    
    socket.on('new-message', (message) => {
        addMessage(message);
    });
    
    socket.on('user-joined', (data) => {
        addSystemMessage(data.message);
    });
    
    socket.on('user-left', (data) => {
        addSystemMessage(data.message);
    });
    
    socket.on('user-typing', (data) => {
        if (data.isTyping) {
            typingIndicator.textContent = \`\${data.username} is typing...\`;
        } else {
            typingIndicator.textContent = '';
        }
    });
    
    socket.on('error', (error) => {
        alert(\`Error: \${error.message}\`);
    });
    
    socket.on('disconnect', () => {
        addSystemMessage('Disconnected from server');
    });
    
    // Join the chat
    socket.emit('join-chat', { username, roomId: room });
}

function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !socket) return;
    
    socket.emit('send-message', { content });
    messageInput.value = '';
    socket.emit('typing-stop');
}

function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const isOwnMessage = message.userId === socket.id;
    messageElement.classList.add(isOwnMessage ? 'own' : 'other');
    
    if (message.isSystem) {
        messageElement.classList.add('system');
    }
    
    const timeString = new Date(message.timestamp).toLocaleTimeString();
    
    messageElement.innerHTML = \`
        <div class="message-info">\${message.username} - \${timeString}</div>
        <div>\${escapeHtml(message.content)}</div>
    \`;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = text;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleTyping() {
    if (!socket) return;
    
    socket.emit('typing-start');
    
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('typing-stop');
    }, 1000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}`,type:"source",description:"Client-side JavaScript application"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm",'2. Run "npm install" to install dependencies',"3. Copy .env.example to .env and configure as needed","4. Create uploads directory: mkdir uploads",'5. Run "npm run dev" to start development server',"6. Open browser to http://localhost:3000","7. Enter a username and optional room name","8. Start chatting with multiple browser tabs to test","9. Customize the interface and add features as needed"],estimatedTime:"4-8 hours",complexity:"expert"}}async function ms(s){const t=[],a={...L(s),bin:{[s.projectName.toLowerCase().replace(/[^a-z0-9-]/g,"-")]:"./bin/cli.js"},dependencies:{commander:"^11.0.0",inquirer:"^9.2.8",chalk:"^5.3.0","cli-table3":"^0.6.3",ora:"^6.3.1",dotenv:"^16.3.1",...s.priorities.includes("message-persistence")&&{"better-sqlite3":"^8.14.2"},...s.features.includes("ai-integration")&&{openai:"^3.3.0"},...s.features.includes("backup-restore")&&{"node-tar":"^6.1.15"}}},r=`#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');
const ChatManager = require('../src/chatManager');
const SessionManager = require('../src/sessionManager');
const { version } = require('../package.json');

dotenv.config();

const program = new Command();

program
  .name('${s.projectName.toLowerCase().replace(/[^a-z0-9-]/g,"-")}')
  .description('${s.description}')
  .version(version);

// Initialize managers
const chatManager = new ChatManager();
const sessionManager = new SessionManager();

// Main interactive mode
program
  .command('start')
  .description('Start interactive chat session manager')
  .option('-u, --user <username>', 'Set username')
  .option('-s, --session <sessionId>', 'Resume existing session')
  .action(async (options) => {
    console.log(chalk.blue.bold(\`Welcome to \${chalk.cyan('${s.projectName}')}\`));
    console.log(chalk.gray('Type "help" for commands or "exit" to quit\\n'));
    
    let username = options.user;
    let sessionId = options.session;
    
    if (!username) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Enter your username:',
          validate: (input) => input.length > 0 || 'Username is required'
        }
      ]);
      username = answers.username;
    }
    
    if (!sessionId) {
      sessionId = await sessionManager.createSession(username);
    }
    
    console.log(chalk.green(\`Session started: \${sessionId}\`));
    console.log(chalk.gray(\`User: \${username}\\n\`));
    
    await startInteractiveSession(username, sessionId);
  });

// List sessions
program
  .command('sessions')
  .description('List all chat sessions')
  .option('-a, --active', 'Show only active sessions')
  .action(async (options) => {
    const spinner = ora('Loading sessions...').start();
    
    try {
      const sessions = await sessionManager.listSessions(options.active);
      spinner.stop();
      
      if (sessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
      }
      
      console.log(chalk.blue.bold('Chat Sessions:'));
      sessions.forEach(session => {
        const status = session.isActive ? chalk.green('Active') : chalk.red('Inactive');
        const duration = new Date(Date.now() - new Date(session.startTime)).toISOString().substr(11, 8);
        console.log(\`\${chalk.cyan(session.sessionId)} - \${session.username} [\${status}] (\${duration})\`);
      });
      
    } catch (error) {
      spinner.fail('Error loading sessions');
      console.error(chalk.red(error.message));
    }
  });

// Show session details
program
  .command('session <sessionId>')
  .description('Show detailed session information')
  .action(async (sessionId) => {
    const spinner = ora('Loading session details...').start();
    
    try {
      const session = await sessionManager.getSession(sessionId);
      const messages = await chatManager.getSessionMessages(sessionId);
      spinner.stop();
      
      if (!session) {
        console.log(chalk.red('Session not found'));
        return;
      }
      
      console.log(chalk.blue.bold('Session Details:'));
      console.log(\`ID: \${chalk.cyan(session.sessionId)}\`);
      console.log(\`User: \${chalk.green(session.username)}\`);
      console.log(\`Status: \${session.isActive ? chalk.green('Active') : chalk.red('Inactive')}\`);
      console.log(\`Started: \${new Date(session.startTime).toLocaleString()}\`);
      console.log(\`Messages: \${messages.length}\\n\`);
      
      if (messages.length > 0) {
        console.log(chalk.blue.bold('Recent Messages:'));
        messages.slice(-10).forEach(msg => {
          const time = new Date(msg.timestamp).toLocaleTimeString();
          console.log(\`[\${chalk.gray(time)}] \${chalk.cyan(msg.username)}: \${msg.content}\`);
        });
      }
      
    } catch (error) {
      spinner.fail('Error loading session');
      console.error(chalk.red(error.message));
    }
  });

${s.features.includes("backup-restore")?`
// Backup command
program
  .command('backup <outputPath>')
  .description('Backup chat data')
  .option('-s, --session <sessionId>', 'Backup specific session')
  .action(async (outputPath, options) => {
    const spinner = ora('Creating backup...').start();
    
    try {
      await chatManager.createBackup(outputPath, options.session);
      spinner.succeed(\`Backup created: \${outputPath}\`);
    } catch (error) {
      spinner.fail('Backup failed');
      console.error(chalk.red(error.message));
    }
  });

// Restore command
program
  .command('restore <backupPath>')
  .description('Restore chat data from backup')
  .option('-c, --confirm', 'Skip confirmation prompt')
  .action(async (backupPath, options) => {
    if (!options.confirm) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'This will overwrite existing data. Continue?',
          default: false
        }
      ]);
      
      if (!answers.proceed) {
        console.log('Restore cancelled');
        return;
      }
    }
    
    const spinner = ora('Restoring backup...').start();
    
    try {
      await chatManager.restoreBackup(backupPath);
      spinner.succeed('Backup restored successfully');
    } catch (error) {
      spinner.fail('Restore failed');
      console.error(chalk.red(error.message));
    }
  });
`:""}

${s.priorities.includes("error-handling")?`
// Analytics command
program
  .command('stats')
  .description('Show chat statistics')
  .option('-s, --session <sessionId>', 'Stats for specific session')
  .action(async (options) => {
    const spinner = ora('Calculating statistics...').start();
    
    try {
      const stats = await chatManager.getStatistics(options.session);
      spinner.stop();
      
      console.log(chalk.blue.bold('Chat Statistics:'));
      console.log(\`Total Sessions: \${chalk.cyan(stats.totalSessions)}\`);
      console.log(\`Active Sessions: \${chalk.green(stats.activeSessions)}\`);
      console.log(\`Total Messages: \${chalk.cyan(stats.totalMessages)}\`);
      console.log(\`Unique Users: \${chalk.cyan(stats.uniqueUsers)}\`);
      
      if (stats.topUsers?.length > 0) {
        console.log('\\n' + chalk.blue.bold('Most Active Users:'));
        stats.topUsers.forEach((user, index) => {
          console.log(\`\${index + 1}. \${chalk.cyan(user.username)} - \${user.messageCount} messages\`);
        });
      }
      
    } catch (error) {
      spinner.fail('Error calculating statistics');
      console.error(chalk.red(error.message));
    }
  });
`:""}

// Help command
program
  .command('help-commands')
  .description('Show interactive mode commands')
  .action(() => {
    console.log(chalk.blue.bold('Interactive Mode Commands:'));
    console.log('  help                 - Show this help');
    console.log('  exit, quit           - Exit the application');
    console.log('  clear                - Clear screen');
    console.log('  whoami               - Show current user');
    console.log('  sessions             - List active sessions');
    console.log('  switch <sessionId>   - Switch to another session');
    ${s.features.includes("context-awareness")?"console.log('  context              - Show conversation context');":""}
    ${s.features.includes("custom-commands")?"console.log('  /command [args]      - Run custom commands');":""}
    ${s.features.includes("ai-integration")?"console.log('  /ai <question>       - Ask AI assistant');":""}
    console.log('  history              - Show message history');
  });

async function startInteractiveSession(username, sessionId) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green(\`[\${username}] > \`)
  });
  
  let currentSession = sessionId;
  
  rl.prompt();
  
  rl.on('line', async (input) => {
    const command = input.trim();
    
    if (!command) {
      rl.prompt();
      return;
    }
    
    try {
      await handleCommand(command, username, currentSession, rl);
    } catch (error) {
      console.log(chalk.red(\`Error: \${error.message}\`));
    }
    
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log(chalk.yellow('\\nGoodbye!'));
    process.exit(0);
  });
}

async function handleCommand(command, username, sessionId, rl) {
  const args = command.split(' ');
  const cmd = args[0].toLowerCase();
  
  switch (cmd) {
    case 'help':
      console.log(chalk.blue.bold('Available Commands:'));
      console.log('  help, exit, clear, whoami, sessions, switch, history');
      ${s.features.includes("context-awareness")?"console.log('  context - Show conversation context');":""}
      ${s.features.includes("custom-commands")?"console.log('  /command - Run custom commands');":""}
      ${s.features.includes("ai-integration")?"console.log('  /ai - Ask AI assistant');":""}
      break;
      
    case 'exit':
    case 'quit':
      rl.close();
      break;
      
    case 'clear':
      console.clear();
      break;
      
    case 'whoami':
      console.log(\`Current user: \${chalk.cyan(username)}\`);
      console.log(\`Session ID: \${chalk.gray(sessionId)}\`);
      break;
      
    case 'sessions':
      const sessions = await sessionManager.listSessions(true);
      console.log(chalk.blue.bold('Active Sessions:'));
      sessions.forEach(s => {
        const current = s.sessionId === sessionId ? chalk.green(' (current)') : '';
        console.log(\`  \${chalk.cyan(s.sessionId)} - \${s.username}\${current}\`);
      });
      break;
      
    case 'history':
      const messages = await chatManager.getSessionMessages(sessionId, 20);
      console.log(chalk.blue.bold('Message History:'));
      messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        console.log(\`[\${chalk.gray(time)}] \${chalk.cyan(msg.username)}: \${msg.content}\`);
      });
      break;
      
    ${s.features.includes("context-awareness")?`
    case 'context':
      const context = await chatManager.getConversationContext(sessionId);
      console.log(chalk.blue.bold('Conversation Context:'));
      if (context.length > 0) {
        context.forEach(item => {
          console.log(\`  \${chalk.cyan(item.type)}: \${item.content}\`);
        });
      } else {
        console.log(chalk.gray('  No context available'));
      }
      break;
    `:""}
      
    ${s.features.includes("ai-integration")?`
    default:
      if (command.startsWith('/ai ')) {
        const question = command.slice(4);
        const spinner = ora('AI is thinking...').start();
        
        try {
          const response = await chatManager.askAI(question, username);
          spinner.stop();
          console.log(chalk.magenta(\`AI: \${response}\`));
          
          // Save AI interaction
          await chatManager.saveMessage(sessionId, 'AI', response, 'ai');
          
        } catch (error) {
          spinner.fail('AI request failed');
          console.log(chalk.red(\`AI Error: \${error.message}\`));
        }
      } else {
        // Regular message
        await chatManager.saveMessage(sessionId, username, command);
        console.log(chalk.green('Message saved'));
      }
      break;
    `:`
    default:
      // Regular message
      await chatManager.saveMessage(sessionId, username, command);
      console.log(chalk.green('Message saved'));
      break;
    `}
  }
}

program.parse();`;t.push({path:"package.json",content:JSON.stringify(a,null,2),type:"config",description:"Package configuration with CLI binary"},{path:"bin/cli.js",content:r,type:"script",description:"Main CLI application entry point"},{path:"README.md",content:k(s),type:"documentation",description:"Project documentation"},{path:".env.example",content:P(s),type:"config",description:"Environment variables template"},{path:".gitignore",content:q(),type:"config",description:"Git ignore rules"});const n=`const path = require('path');
${s.priorities.includes("message-persistence")?"const Database = require('./database');":""}
${s.features.includes("ai-integration")?"const { OpenAI } = require('openai');":""}
${s.features.includes("backup-restore")?"const tar = require('node-tar');":""}
${s.features.includes("backup-restore")?"const fs = require('fs').promises;":""}

class ChatManager {
  constructor() {
    ${s.priorities.includes("message-persistence")?"this.db = new Database();":"this.messages = new Map(); // In-memory storage"}
    ${s.features.includes("ai-integration")?`
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    `:""}
  }
  
  async saveMessage(sessionId, username, content, type = 'text') {
    const message = {
      id: Date.now().toString(),
      sessionId,
      username,
      content,
      type,
      timestamp: new Date().toISOString(),
    };
    
    ${s.priorities.includes("message-persistence")?`
    await this.db.saveMessage(message);
    `:`
    if (!this.messages.has(sessionId)) {
      this.messages.set(sessionId, []);
    }
    this.messages.get(sessionId).push(message);
    `}
    
    return message;
  }
  
  async getSessionMessages(sessionId, limit = 100) {
    ${s.priorities.includes("message-persistence")?`
    return await this.db.getMessages(sessionId, limit);
    `:`
    const messages = this.messages.get(sessionId) || [];
    return messages.slice(-limit);
    `}
  }
  
  ${s.features.includes("context-awareness")?`
  async getConversationContext(sessionId) {
    const messages = await this.getSessionMessages(sessionId, 10);
    const context = [];
    
    // Analyze message patterns
    const userMessages = messages.filter(m => m.type === 'text');
    if (userMessages.length > 0) {
      context.push({
        type: 'recent_activity',
        content: \`\${userMessages.length} messages in conversation\`
      });
    }
    
    // Find questions
    const questions = messages.filter(m => m.content.includes('?'));
    if (questions.length > 0) {
      context.push({
        type: 'questions',
        content: \`\${questions.length} questions asked\`
      });
    }
    
    return context;
  }
  `:""}
  
  ${s.features.includes("ai-integration")?`
  async askAI(question, username) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant integrated into a CLI chat application called ${s.projectName}. Keep responses concise and helpful." 
          },
          { role: "user", content: \`\${username} asks: \${question}\` }
        ],
        max_tokens: 200
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      throw new Error(\`AI request failed: \${error.message}\`);
    }
  }
  `:""}
  
  ${s.priorities.includes("error-handling")?`
  async getStatistics(sessionId = null) {
    ${s.priorities.includes("message-persistence")?`
    return await this.db.getStatistics(sessionId);
    `:`
    const allMessages = Array.from(this.messages.values()).flat();
    const sessions = Array.from(this.messages.keys());
    
    const stats = {
      totalSessions: sessions.length,
      activeSessions: sessions.length, // All are active in memory
      totalMessages: allMessages.length,
      uniqueUsers: [...new Set(allMessages.map(m => m.username))].length,
    };
    
    if (sessionId) {
      const sessionMessages = this.messages.get(sessionId) || [];
      stats.sessionMessages = sessionMessages.length;
    }
    
    return stats;
    `}
  }
  `:""}
  
  ${s.features.includes("backup-restore")?`
  async createBackup(outputPath, sessionId = null) {
    ${s.priorities.includes("message-persistence")?`
    const data = await this.db.exportData(sessionId);
    `:`
    const data = sessionId 
      ? { [sessionId]: this.messages.get(sessionId) || [] }
      : Object.fromEntries(this.messages);
    `}
    
    const backupData = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      data: data
    };
    
    await fs.writeFile(outputPath, JSON.stringify(backupData, null, 2));
  }
  
  async restoreBackup(backupPath) {
    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    ${s.priorities.includes("message-persistence")?`
    await this.db.importData(backup.data);
    `:`
    this.messages.clear();
    for (const [sessionId, messages] of Object.entries(backup.data)) {
      this.messages.set(sessionId, messages);
    }
    `}
  }
  `:""}
}

module.exports = ChatManager;`,u=`${s.priorities.includes("message-persistence")?"const Database = require('./database');":""}

class SessionManager {
  constructor() {
    ${s.priorities.includes("message-persistence")?"this.db = new Database();":"this.sessions = new Map();"}
  }
  
  async createSession(username) {
    const sessionId = \`session-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
    const session = {
      sessionId,
      username,
      startTime: new Date().toISOString(),
      isActive: true,
      messageCount: 0,
    };
    
    ${s.priorities.includes("message-persistence")?`
    await this.db.saveSession(session);
    `:`
    this.sessions.set(sessionId, session);
    `}
    
    return sessionId;
  }
  
  async getSession(sessionId) {
    ${s.priorities.includes("message-persistence")?`
    return await this.db.getSession(sessionId);
    `:`
    return this.sessions.get(sessionId);
    `}
  }
  
  async listSessions(activeOnly = false) {
    ${s.priorities.includes("message-persistence")?`
    return await this.db.listSessions(activeOnly);
    `:`
    const sessions = Array.from(this.sessions.values());
    return activeOnly ? sessions.filter(s => s.isActive) : sessions;
    `}
  }
  
  async updateSession(sessionId, updates) {
    ${s.priorities.includes("message-persistence")?`
    await this.db.updateSession(sessionId, updates);
    `:`
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
    `}
  }
  
  async endSession(sessionId) {
    await this.updateSession(sessionId, { 
      isActive: false, 
      endTime: new Date().toISOString() 
    });
  }
}

module.exports = SessionManager;`;return t.push({path:"src/chatManager.js",content:n,type:"source",description:"Chat management functionality"},{path:"src/sessionManager.js",content:u,type:"source",description:"Session management functionality"}),s.priorities.includes("message-persistence")&&t.push({path:"src/database.js",content:`const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'chat.db');
    this.db = new Database(dbPath);
    this.init();
  }
  
  init() {
    // Create tables
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS sessions (
        sessionId TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        isActive INTEGER DEFAULT 1,
        messageCount INTEGER DEFAULT 0,
        metadata TEXT
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        timestamp TEXT NOT NULL,
        FOREIGN KEY (sessionId) REFERENCES sessions (sessionId)
      );
      
      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(sessionId);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    \`);
  }
  
  async saveSession(session) {
    const stmt = this.db.prepare(\`
      INSERT OR REPLACE INTO sessions 
      (sessionId, username, startTime, isActive, messageCount, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    \`);
    
    stmt.run(
      session.sessionId,
      session.username,
      session.startTime,
      session.isActive ? 1 : 0,
      session.messageCount || 0,
      JSON.stringify(session.metadata || {})
    );
  }
  
  async getSession(sessionId) {
    const stmt = this.db.prepare('SELECT * FROM sessions WHERE sessionId = ?');
    const row = stmt.get(sessionId);
    
    if (row) {
      return {
        ...row,
        isActive: Boolean(row.isActive),
        metadata: JSON.parse(row.metadata || '{}')
      };
    }
    
    return null;
  }
  
  async listSessions(activeOnly = false) {
    const sql = activeOnly 
      ? 'SELECT * FROM sessions WHERE isActive = 1 ORDER BY startTime DESC'
      : 'SELECT * FROM sessions ORDER BY startTime DESC';
      
    const stmt = this.db.prepare(sql);
    const rows = stmt.all();
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      metadata: JSON.parse(row.metadata || '{}')
    }));
  }
  
  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId);
    if (!session) return;
    
    const updated = { ...session, ...updates };
    await this.saveSession(updated);
  }
  
  async saveMessage(message) {
    const stmt = this.db.prepare(\`
      INSERT INTO messages (id, sessionId, username, content, type, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    \`);
    
    stmt.run(
      message.id,
      message.sessionId,
      message.username,
      message.content,
      message.type,
      message.timestamp
    );
    
    // Update session message count
    const updateStmt = this.db.prepare(\`
      UPDATE sessions 
      SET messageCount = messageCount + 1 
      WHERE sessionId = ?
    \`);
    updateStmt.run(message.sessionId);
  }
  
  async getMessages(sessionId, limit = 100) {
    const stmt = this.db.prepare(\`
      SELECT * FROM messages 
      WHERE sessionId = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    \`);
    
    return stmt.all(sessionId, limit).reverse();
  }
  
  async getStatistics(sessionId = null) {
    if (sessionId) {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      
      return {
        sessionId,
        messageCount: messages.length,
        username: session?.username,
        startTime: session?.startTime,
        isActive: session?.isActive
      };
    }
    
    const stats = {
      totalSessions: this.db.prepare('SELECT COUNT(*) as count FROM sessions').get().count,
      activeSessions: this.db.prepare('SELECT COUNT(*) as count FROM sessions WHERE isActive = 1').get().count,
      totalMessages: this.db.prepare('SELECT COUNT(*) as count FROM messages').get().count,
      uniqueUsers: this.db.prepare('SELECT COUNT(DISTINCT username) as count FROM sessions').get().count,
    };
    
    // Top users by message count
    const topUsers = this.db.prepare(\`
      SELECT username, COUNT(*) as messageCount 
      FROM messages 
      GROUP BY username 
      ORDER BY messageCount DESC 
      LIMIT 5
    \`).all();
    
    stats.topUsers = topUsers;
    
    return stats;
  }
  
  async exportData(sessionId = null) {
    if (sessionId) {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      return { [sessionId]: { session, messages } };
    }
    
    const sessions = await this.listSessions();
    const data = {};
    
    for (const session of sessions) {
      const messages = await this.getMessages(session.sessionId);
      data[session.sessionId] = { session, messages };
    }
    
    return data;
  }
  
  async importData(data) {
    // Clear existing data
    this.db.exec('DELETE FROM messages; DELETE FROM sessions;');
    
    for (const [sessionId, sessionData] of Object.entries(data)) {
      await this.saveSession(sessionData.session);
      
      if (sessionData.messages) {
        for (const message of sessionData.messages) {
          await this.saveMessage(message);
        }
      }
    }
  }
}

module.exports = DatabaseManager;`,type:"source",description:"SQLite database management"}),t.push({path:"Dockerfile",content:U(s),type:"config",description:"Docker container configuration"}),{platform:s.platform,files:t,packageJson:a,readme:k(s),setupInstructions:["1. Install Node.js 18+ and npm",'2. Run "npm install" to install dependencies',"3. Copy .env.example to .env and configure as needed",'4. Run "npm link" to install CLI globally (optional)',"5. Run the CLI with: npx . start (or your-cli-name start if linked)","6. Follow the interactive prompts to start chatting",'7. Use "help" command to see available options','8. Use "sessions" to manage multiple chat sessions','9. Type "exit" to quit the application'],estimatedTime:"1-2 hours",complexity:"basic"}}async function us(s){if(!s.platform)throw new Error("Platform is required for solution generation");const a={"discord-js":rs,"telegram-bot-api":is,"whatsapp-web":os,"slack-bolt":cs,"twitter-api":ls,"web-chat":ds,"cli-interface":ms}[s.platform];if(!a)throw new Error(`No generator found for platform: ${s.platform}`);try{return await a(s)}catch(r){throw console.error("Error generating solution:",r),new Error(`Failed to generate solution: ${r instanceof Error?r.message:"Unknown error"}`)}}function L(s){return{name:s.projectName.toLowerCase().replace(/[^a-z0-9-]/g,"-"),version:"1.0.0",description:s.description,main:"index.js",scripts:{start:"node index.js",dev:"nodemon index.js",test:"jest",lint:"eslint .","lint:fix":"eslint . --fix"},keywords:["chat","bot","session-management",s.platform],author:"",license:"MIT",devDependencies:{nodemon:"^3.0.1",eslint:"^8.45.0",jest:"^29.6.1","@types/node":"^20.4.5",typescript:"^5.1.6"}}}function k(s){const{projectName:t,description:a,platform:r,priorities:n,features:u}=s;return`# ${t}

${a}

## Platform
- **${r}** - Chat session management system

## Features
${n.length>0?`
### Core Priorities
${n.map(c=>`- ${c.replace("-"," ").replace(/\b\w/g,m=>m.toUpperCase())}`).join(`
`)}
`:""}

${u.length>0?`
### Additional Features
${u.map(c=>`- ${c.replace("-"," ").replace(/\b\w/g,m=>m.toUpperCase())}`).join(`
`)}
`:""}

## Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment file and configure:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Configuration

See \`.env.example\` for required environment variables.

## Project Structure

\`\`\`
${t}/
├── src/
│   ├── handlers/          # Message and event handlers
│   ├── middleware/        # Authentication and validation
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── index.js           # Application entry point
├── tests/                 # Test files
├── docs/                  # Documentation
└── package.json
\`\`\`

## Development

- \`npm run dev\` - Start development server with hot reload
- \`npm test\` - Run test suite
- \`npm run lint\` - Run linter
- \`npm run lint:fix\` - Fix linting issues automatically

## Deployment

[Add deployment instructions specific to your platform]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details.
`}function P(s){const{platform:t,priorities:a,features:r}=s;let n=`# ${s.projectName} Environment Configuration

`;switch(t){case"discord-js":n+=`# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id

`;break;case"telegram-bot-api":n+=`# Telegram Configuration
TELEGRAM_TOKEN=your_telegram_bot_token

`;break;case"slack-bolt":n+=`# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your_signing_secret

`;break;case"twitter-api":n+=`# Twitter API Configuration
TWITTER_CONSUMER_KEY=your_consumer_key
TWITTER_CONSUMER_SECRET=your_consumer_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

`;break;default:n+=`# API Configuration
API_TOKEN=your_api_token

`}return a.includes("message-persistence")&&(n+=`# Database Configuration
DATABASE_URL=mongodb://localhost:27017/${s.projectName.toLowerCase()}
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/${s.projectName.toLowerCase()}

`),(a.includes("session-management")||a.includes("real-time-sync"))&&(n+=`# Redis Configuration
REDIS_URL=redis://localhost:6379

`),a.includes("error-handling")&&(n+=`# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

`),a.includes("error-handling")&&(n+=`# Logging & Analytics
LOG_LEVEL=info
ANALYTICS_ENDPOINT=https://your-analytics-service.com

`),r.includes("ai-integration")&&(n+=`# AI Integration
OPENAI_API_KEY=your_openai_api_key
# or for other AI services:
# AI_SERVICE_URL=https://your-ai-service.com
# AI_SERVICE_KEY=your_ai_service_key

`),r.includes("webhooks")&&(n+=`# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=https://your-domain.com/webhook

`),n+=`# General Configuration
PORT=3000
NODE_ENV=development
`,n}function q(){return`# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/

# Database
*.db
*.sqlite
*.sqlite3

# Session files
sessions/

# Upload directories
uploads/
`}function U(s){return`FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ${s.projectName.toLowerCase()} -u 1001

# Change ownership
RUN chown -R ${s.projectName.toLowerCase()}:nodejs /app
USER ${s.projectName.toLowerCase()}

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
`}const ps=({onNext:s,onPrevious:t,isLoading:a})=>{const{state:r,actions:n}=M(),[u,c]=w.useState(!1),[m,l]=w.useState(null),[o,g]=w.useState(new Set);w.useEffect(()=>{r.generatedSolution||i()},[]);const i=async()=>{c(!0),l(null),n.setLoading(!0);try{const p=await us({platform:r.platform,priorities:r.priorities,features:r.features,teamSize:r.teamSize,complexity:r.complexity,projectName:r.projectName,description:r.description});n.setGeneratedSolution(p),n.addCompletedStep(6)}catch(p){const x=p instanceof Error?p.message:"Failed to generate solution";l(x),n.setError(x)}finally{c(!1),n.setLoading(!1)}},d=async()=>{if(r.generatedSolution)try{const p=(await as(async()=>{const{default:z}=await import("./jszip.min-B1CwBkmU.js").then(we=>we.j);return{default:z}},__vite__mapDeps([0,1]))).default,x=new p;r.generatedSolution.files.forEach(z=>{x.file(z.path,z.content)});const A=await x.generateAsync({type:"blob"}),T=window.URL.createObjectURL(A),_=document.createElement("a");_.href=T,_.download=`${r.projectName.toLowerCase().replace(/[^a-z0-9-]/g,"-")}.zip`,document.body.appendChild(_),_.click(),document.body.removeChild(_),window.URL.revokeObjectURL(T)}catch(p){console.error("Download failed:",p),alert("Download failed. Please try again.")}},h=async p=>{try{await navigator.clipboard.writeText(p.content),g(x=>new Set(x).add(p.path)),setTimeout(()=>{g(x=>{const A=new Set(x);return A.delete(p.path),A})},3e3)}catch(x){console.error("Copy failed:",x),alert("Copy failed. Please try copying manually.")}},f=async()=>{if(r.generatedSolution)try{const p=r.generatedSolution.files.map(x=>`// File: ${x.path}
${x.content}`).join(`

// `+"=".repeat(50)+`

`);await navigator.clipboard.writeText(p),alert("All files copied to clipboard!")}catch(p){console.error("Copy all failed:",p),alert("Copy failed. Files might be too large for clipboard.")}},D=p=>{switch(p){case"config":return e.jsx(Ae,{className:"w-4 h-4"});case"source":return e.jsx(G,{className:"w-4 h-4"});case"documentation":return e.jsx(G,{className:"w-4 h-4"});case"script":return e.jsx(pe,{className:"w-4 h-4"});default:return e.jsx(G,{className:"w-4 h-4"})}},B=p=>{switch(p){case"config":return"text-blue-600";case"source":return"text-green-600";case"documentation":return"text-purple-600";case"script":return"text-orange-600";default:return"text-gray-600"}};if(u||a)return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Generating Your Solution"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Please wait while we create your custom chat session management system..."})]}),e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"})}),e.jsxs("div",{className:"text-center text-gray-500",children:[e.jsx("p",{children:"This may take a few moments..."}),e.jsxs("p",{className:"text-sm mt-2",children:["Generating ",r.platform," solution with ",r.priorities.length," priorities and ",r.features.length," features"]})]})]});if(m)return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsx("div",{className:"text-center mb-8",children:e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Generation Failed"})}),e.jsxs(C,{type:"error",title:"Generation Error",children:[e.jsx("p",{children:m}),e.jsx("div",{className:"mt-4",children:e.jsx(y,{onClick:i,variant:"primary",children:"Try Again"})})]}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Back to Review"}),e.jsx("div",{})]})]});const E=r.generatedSolution;return E?e.jsxs("div",{className:"max-w-6xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Your Solution is Ready!"}),e.jsxs("p",{className:"text-lg text-gray-600",children:["We've generated a complete ",E.platform," chat session management system for you."]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",children:[e.jsx(j,{children:e.jsxs(v,{className:"text-center",children:[e.jsx("div",{className:"text-3xl font-bold text-primary-600 mb-2",children:E.files.length}),e.jsx("div",{className:"text-sm text-gray-600",children:"Generated Files"})]})}),e.jsx(j,{children:e.jsxs(v,{className:"text-center",children:[e.jsx("div",{className:"text-3xl font-bold text-green-600 mb-2",children:E.estimatedTime}),e.jsx("div",{className:"text-sm text-gray-600",children:"Estimated Setup Time"})]})}),e.jsx(j,{children:e.jsxs(v,{className:"text-center",children:[e.jsx("div",{className:"text-3xl font-bold text-orange-600 mb-2 capitalize",children:E.complexity}),e.jsx("div",{className:"text-sm text-gray-600",children:"Complexity Level"})]})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"Download Your Solution"}),e.jsx(S,{children:"Get your complete project files and start building immediately."})]}),e.jsx(v,{children:e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(y,{onClick:d,variant:"primary",size:"lg",icon:e.jsx(K,{}),children:"Download ZIP File"}),e.jsx(y,{onClick:f,variant:"outline",size:"lg",icon:e.jsx(ie,{}),children:"Copy All Files"})]})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsxs(b,{level:3,children:["Generated Files (",E.files.length,")"]}),e.jsx(S,{children:"Preview and copy individual files as needed."})]}),e.jsx(v,{children:e.jsx("div",{className:"space-y-4",children:E.files.map((p,x)=>e.jsxs("div",{className:"border border-gray-200 rounded-lg overflow-hidden",children:[e.jsxs("div",{className:"bg-gray-50 px-4 py-3 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:B(p.type),children:D(p.type)}),e.jsxs("div",{children:[e.jsx("div",{className:"font-mono text-sm font-medium",children:p.path}),e.jsx("div",{className:"text-xs text-gray-500",children:p.description})]})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:`px-2 py-1 text-xs font-medium rounded ${p.type==="config"?"bg-blue-100 text-blue-800":p.type==="source"?"bg-green-100 text-green-800":p.type==="documentation"?"bg-purple-100 text-purple-800":"bg-gray-100 text-gray-800"}`,children:p.type}),e.jsx(y,{onClick:()=>h(p),variant:"ghost",size:"sm",icon:o.has(p.path)?e.jsx($,{}):e.jsx(ie,{}),children:o.has(p.path)?"Copied!":"Copy"})]})]}),e.jsx("div",{className:"p-4",children:e.jsx("pre",{className:"text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto max-h-64",children:e.jsx("code",{children:p.content})})})]},x))})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"Setup Instructions"}),e.jsx(S,{children:"Follow these steps to get your chat system up and running."})]}),e.jsx(v,{children:e.jsx("div",{className:"space-y-3",children:E.setupInstructions.map((p,x)=>e.jsxs("div",{className:"flex items-start space-x-3",children:[e.jsx("div",{className:"flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center",children:x+1}),e.jsx("p",{className:"text-sm text-gray-700",children:p})]},x))})})]}),e.jsx(C,{type:"success",title:"Solution Generated Successfully!",children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["Your ",E.platform," chat session management system is ready to use."]}),e.jsxs("div",{className:"text-sm",children:[e.jsx("strong",{children:"What's included:"}),e.jsxs("ul",{className:"list-disc list-inside mt-1 space-y-1",children:[e.jsx("li",{children:"Complete source code with your selected features"}),e.jsx("li",{children:"Configuration files and environment setup"}),e.jsx("li",{children:"Documentation and README"}),e.jsx("li",{children:"Package.json with all dependencies"}),e.jsx("li",{children:"Docker configuration for easy deployment"})]})]})]})}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Back to Review"}),e.jsx("div",{className:"flex space-x-3",children:e.jsx(y,{onClick:s,variant:"primary",size:"lg",children:"Continue to Setup"})})]})]}):null},hs=({onNext:s,onPrevious:t,canSkip:a})=>{const{state:r}=M(),[n,u]=w.useState(0),[c,m]=w.useState(!1),[l,o]=w.useState([]),[g,i]=w.useState(!1),d=r.generatedSolution;if(!d)return null;const h=[{name:"Project Directory",command:`mkdir ${r.projectName}`,description:"Create project directory"},{name:"Extract Files",command:"Extracting generated files...",description:"Extract all generated files"},{name:"Install Dependencies",command:"npm install",description:"Install required packages"},{name:"Environment Setup",command:"cp .env.example .env",description:"Create environment file"},{name:"Initialize Database",command:"npm run init-db",description:"Set up database (if required)"},{name:"Build Project",command:"npm run build",description:"Build the application"},{name:"Verify Setup",command:"npm test",description:"Run initial tests"}],f=(p,x="info")=>{const T=`[${new Date().toLocaleTimeString()}] ${p}`;o(_=>[..._,T])},D=async p=>{const x=h[p];return f(`Starting: ${x.name}`,"info"),f(`Running: ${x.command}`,"info"),await new Promise(T=>setTimeout(T,2e3+Math.random()*3e3)),Math.random()>.1?(f(`✓ Completed: ${x.name}`,"success"),!0):(f(`✗ Failed: ${x.name}`,"error"),!1)},B=async()=>{if(!c){m(!0),o([]),f("Starting automated setup...","info");try{for(let p=0;p<h.length;p++)if(u(p),!await D(p)){f("Setup failed. Please check the logs and try manual setup.","error"),m(!1);return}f("🎉 Automated setup completed successfully!","success"),i(!0)}catch(p){f(`Setup error: ${p}`,"error")}finally{m(!1)}}},E=()=>{const p=d.setupInstructions.map((_,z)=>`# Step ${z+1}: ${_}`).join(`
`),x=new Blob([`#!/bin/bash

# Automated Setup Script for ${r.projectName}

${p}
`],{type:"text/plain"}),A=URL.createObjectURL(x),T=document.createElement("a");T.href=A,T.download="setup.sh",document.body.appendChild(T),T.click(),document.body.removeChild(T),URL.revokeObjectURL(A)};return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Automated Setup"}),e.jsxs("p",{className:"text-lg text-gray-600",children:["Let us set up your ",d.platform," project automatically, or download setup instructions for manual installation."]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",children:[e.jsxs(j,{className:"relative",children:[e.jsxs(I,{children:[e.jsxs(b,{level:3,className:"flex items-center space-x-2",children:[e.jsx(_e,{className:"w-5 h-5 text-primary-600"}),e.jsx("span",{children:"Automated Setup"})]}),e.jsx(S,{children:"Run the complete setup process automatically in your browser."})]}),e.jsx(v,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("p",{className:"mb-2",children:"This will:"}),e.jsxs("ul",{className:"space-y-1",children:[e.jsx("li",{children:"• Create project directory structure"}),e.jsx("li",{children:"• Install all dependencies"}),e.jsx("li",{children:"• Configure environment files"}),e.jsx("li",{children:"• Run initial setup commands"})]})]}),e.jsx(C,{type:"info",children:e.jsx("p",{className:"text-sm",children:"Note: This is a simulation. In a real implementation, this would execute actual setup commands."})}),e.jsx(y,{onClick:B,disabled:c,variant:"primary",fullWidth:!0,icon:c?e.jsx(Me,{}):e.jsx(pe,{}),loading:c,children:c?"Setting Up...":"Start Automated Setup"})]})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsxs(b,{level:3,className:"flex items-center space-x-2",children:[e.jsx(K,{className:"w-5 h-5 text-gray-600"}),e.jsx("span",{children:"Manual Setup"})]}),e.jsx(S,{children:"Download setup instructions and run them manually."})]}),e.jsx(v,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("p",{className:"mb-2",children:"Perfect if you prefer to:"}),e.jsxs("ul",{className:"space-y-1",children:[e.jsx("li",{children:"• Follow step-by-step instructions"}),e.jsx("li",{children:"• Customize the setup process"}),e.jsx("li",{children:"• Run setup on your local machine"}),e.jsx("li",{children:"• Have full control over each step"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(y,{onClick:E,variant:"outline",fullWidth:!0,icon:e.jsx(K,{}),children:"Download Setup Script"}),e.jsx(y,{variant:"ghost",fullWidth:!0,icon:e.jsx(he,{}),onClick:()=>window.open(`https://docs.${d.platform}.com`,"_blank"),children:"View Platform Documentation"})]})]})})]})]}),(c||l.length>0)&&e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"Setup Progress"}),e.jsx(S,{children:c?"Setup is running...":g?"Setup completed!":"Setup stopped"})]}),e.jsxs(v,{children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between text-sm text-gray-600 mb-2",children:[e.jsx("span",{children:"Progress"}),e.jsxs("span",{children:[c?n+1:g?h.length:n+1," of ",h.length]})]}),e.jsx("div",{className:"space-y-2",children:h.map((p,x)=>e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${x<n?"bg-green-500 text-white":x===n&&c?"bg-primary-500 text-white animate-pulse":x===n&&g?"bg-green-500 text-white":"bg-gray-200 text-gray-500"}`,children:x<n||g?e.jsx($,{className:"w-3 h-3"}):x+1}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:`text-sm font-medium ${x<=n?"text-gray-900":"text-gray-400"}`,children:p.name}),e.jsx("div",{className:`text-xs ${x<=n?"text-gray-600":"text-gray-400"}`,children:p.description})]})]},x))})]}),e.jsxs("div",{className:"bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto",children:[l.length===0&&!c&&e.jsx("div",{className:"text-gray-500",children:"Setup logs will appear here..."}),l.map((p,x)=>e.jsx("div",{className:"whitespace-pre-wrap",children:p},x)),c&&e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-2 h-2 bg-green-400 rounded-full animate-pulse"}),e.jsx("span",{children:"Running..."})]})]})]})]}),g&&e.jsx(C,{type:"success",title:"Setup Complete!",children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{children:["Your ",d.platform," project has been set up successfully."]}),e.jsxs("div",{className:"text-sm",children:[e.jsx("strong",{children:"What's ready:"}),e.jsxs("ul",{className:"list-disc list-inside mt-1 space-y-1",children:[e.jsx("li",{children:"Project directory created"}),e.jsx("li",{children:"All dependencies installed"}),e.jsx("li",{children:"Environment configured"}),e.jsx("li",{children:"Database initialized (if required)"}),e.jsx("li",{children:"Build process completed"})]})]}),e.jsx("div",{className:"mt-4 p-3 bg-green-50 rounded-lg",children:e.jsxs("p",{className:"text-sm text-green-800",children:[e.jsx("strong",{children:"Next steps:"})," Navigate to your project directory and run `npm start` to launch your chat system!"]})})]})}),e.jsxs(j,{children:[e.jsx(I,{children:e.jsx(b,{level:3,children:"Need Help?"})}),e.jsx(v,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Common Issues:"}),e.jsxs("ul",{className:"space-y-1 text-gray-600",children:[e.jsx("li",{children:"• Check Node.js version (18+ required)"}),e.jsx("li",{children:"• Ensure all environment variables are set"}),e.jsx("li",{children:"• Verify database connection"}),e.jsx("li",{children:"• Check API keys and tokens"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Resources:"}),e.jsxs("ul",{className:"space-y-1 text-gray-600",children:[e.jsx("li",{children:"• Platform documentation"}),e.jsx("li",{children:"• Community forums"}),e.jsx("li",{children:"• GitHub examples"}),e.jsx("li",{children:"• Video tutorials"})]})]})]})})]}),e.jsxs("div",{className:"flex justify-between pt-6",children:[e.jsx(y,{onClick:t,variant:"outline",size:"lg",icon:e.jsx(O,{}),children:"Back to Files"}),e.jsxs("div",{className:"flex space-x-3",children:[a&&e.jsx(y,{onClick:s,variant:"ghost",size:"lg",children:"Skip Setup"}),e.jsx(y,{onClick:s,variant:"primary",size:"lg",disabled:c,children:g?"Continue":"Skip to Completion"})]})]})]})},gs=({onPrevious:s})=>{const{state:t,actions:a}=M(),r=t.generatedSolution;if(!r)return null;const n=()=>{a.resetWizard()},u=()=>{const o={projectName:t.projectName,description:t.description,platform:t.platform,priorities:t.priorities,features:t.features,teamSize:t.teamSize,complexity:t.complexity,estimatedTime:r.estimatedTime,totalFiles:r.files.length,setupInstructions:r.setupInstructions,generatedAt:new Date().toISOString()},g=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),i=URL.createObjectURL(g),d=document.createElement("a");d.href=i,d.download=`${t.projectName}-summary.json`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(i)},c=[{icon:"🎯",title:"Platform Selected",description:`Chose ${r.platform}`},{icon:"⚡",title:"Priorities Set",description:`Configured ${t.priorities.length} priorities`},{icon:"✨",title:"Features Added",description:`Selected ${t.features.length} features`},{icon:"🏗️",title:"Project Configured",description:`${t.complexity} complexity level`},{icon:"📦",title:"Solution Generated",description:`${r.files.length} files created`},{icon:"🚀",title:"Ready to Deploy",description:"Complete setup instructions provided"}],m=[{title:"Start Development",description:"Follow the setup instructions to get your project running locally",icon:e.jsx(oe,{className:"w-5 h-5"}),action:"Follow setup guide"},{title:"Customize Your Solution",description:"Modify the generated code to match your specific requirements",icon:e.jsx(ce,{className:"w-5 h-5"}),action:"Customize code"},{title:"Deploy to Production",description:"Use the included Docker configuration for easy deployment",icon:e.jsx(he,{className:"w-5 h-5"}),action:"Deploy project"}],l=[{title:"Documentation",description:"Complete README and setup guides included in your project",url:"#readme"},{title:"Community",description:"Join our Discord community for help and discussions",url:"#community"},{title:"Examples",description:"Browse example projects and implementations",url:"#examples"},{title:"Support",description:"Get help with implementation and troubleshooting",url:"#support"}];return e.jsxs("div",{className:"max-w-4xl mx-auto space-y-8",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6",children:e.jsx($,{className:"w-8 h-8 text-white"})}),e.jsx("h2",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Congratulations! 🎉"}),e.jsxs("p",{className:"text-lg text-gray-600 mb-2",children:["Your ",e.jsx("span",{className:"font-semibold text-primary-600",children:t.projectName})," chat session management system is ready!"]}),e.jsxs("p",{className:"text-gray-500",children:["We've generated a complete ",r.platform," solution with all your selected features."]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:c.map((o,g)=>e.jsx(j,{className:"text-center",children:e.jsxs(v,{className:"pt-6",children:[e.jsx("div",{className:"text-3xl mb-2",children:o.icon}),e.jsx("h3",{className:"font-semibold text-gray-900 mb-1",children:o.title}),e.jsx("p",{className:"text-sm text-gray-600",children:o.description})]})},g))}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"Project Summary"}),e.jsx(S,{children:"Overview of your generated chat session management system"})]}),e.jsx(v,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700",children:"Platform & Configuration"}),e.jsxs("div",{className:"mt-1 space-y-1 text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Platform:"})," ",r.platform]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Complexity:"})," ",t.complexity]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Team Size:"})," ",t.teamSize]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Setup Time:"})," ",r.estimatedTime]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700",children:"Generated Output"}),e.jsxs("div",{className:"mt-1 space-y-1 text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Total Files:"})," ",r.files.length]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Source Files:"})," ",r.files.filter(o=>o.type==="source").length]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Config Files:"})," ",r.files.filter(o=>o.type==="config").length]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Documentation:"})," ",r.files.filter(o=>o.type==="documentation").length]})]})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700",children:"Core Priorities"}),e.jsx("div",{className:"mt-1 space-y-1",children:t.priorities.map(o=>e.jsx("span",{className:"inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mr-1 mb-1",children:o.replace("-"," ").replace(/\b\w/g,g=>g.toUpperCase())},o))})]}),t.features.length>0&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700",children:"Additional Features"}),e.jsx("div",{className:"mt-1 space-y-1",children:t.features.map(o=>e.jsx("span",{className:"inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1",children:o.replace("-"," ").replace(/\b\w/g,g=>g.toUpperCase())},o))})]})]})]})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"What's Next?"}),e.jsx(S,{children:"Recommended next steps to get your chat system running"})]}),e.jsx(v,{children:e.jsx("div",{className:"space-y-4",children:m.map((o,g)=>e.jsxs("div",{className:"flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50",children:[e.jsx("div",{className:"flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center",children:o.icon}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium text-gray-900",children:o.title}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:o.description})]}),e.jsx("div",{className:"flex-shrink-0",children:e.jsxs("span",{className:"text-sm text-primary-600 font-medium",children:[o.action," →"]})})]},g))})})]}),e.jsxs(j,{children:[e.jsxs(I,{children:[e.jsx(b,{level:3,children:"Resources & Support"}),e.jsx(S,{children:"Helpful resources to support your development journey"})]}),e.jsx(v,{children:e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:l.map((o,g)=>e.jsxs("div",{className:"flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer",children:[e.jsx(oe,{className:"w-5 h-5 text-gray-400"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900",children:o.title}),e.jsx("p",{className:"text-sm text-gray-600",children:o.description})]})]},g))})})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center items-center",children:[e.jsx(y,{onClick:u,variant:"outline",size:"lg",icon:e.jsx(K,{}),children:"Download Project Summary"}),e.jsx(y,{onClick:n,variant:"outline",size:"lg",icon:e.jsx(De,{}),children:"Create Another Project"})]}),e.jsx(j,{className:"bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200",children:e.jsxs(v,{className:"text-center py-8",children:[e.jsx(ee,{className:"w-12 h-12 text-yellow-500 mx-auto mb-4"}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-2",children:"Thank You for Using Our Builder!"}),e.jsx("p",{className:"text-gray-600 mb-4",children:"We hope this tool helps you build amazing chat experiences. If you found it useful, consider giving us a star on GitHub!"}),e.jsxs("div",{className:"flex justify-center space-x-4",children:[e.jsx(y,{variant:"outline",size:"sm",icon:e.jsx(Oe,{}),children:"Star on GitHub"}),e.jsx(y,{variant:"outline",size:"sm",icon:e.jsx(ce,{}),children:"Share Feedback"})]})]})}),e.jsxs("div",{className:"text-center text-sm text-gray-500",children:[e.jsx("p",{children:"Built with ❤️ for developers who love creating great chat experiences"}),e.jsx("p",{className:"mt-1",children:"Need help? Join our community or check the documentation included in your project."})]})]})},xs=()=>{const{state:s,actions:t}=M(),a=()=>{t.validateCurrentStep().isValid&&t.nextStep()},r=()=>{t.previousStep()},n=()=>{(s.currentStep===3||s.currentStep===7)&&t.nextStep()},u=l=>{t.canGoToStep(l)&&t.goToStep(l)},c=()=>{const l={onNext:a,onPrevious:r,onSkip:n,isLoading:s.isLoading,canSkip:s.currentStep===3||s.currentStep===7};switch(s.currentStep){case 1:return e.jsx(de,{...l});case 2:return e.jsx(Ze,{...l});case 3:return e.jsx(Qe,{...l});case 4:return e.jsx(es,{...l});case 5:return e.jsx(ss,{...l});case 6:return e.jsx(ps,{...l});case 7:return e.jsx(hs,{...l});case 8:return e.jsx(gs,{...l});default:return e.jsx(de,{...l})}},{user:m}=V();return e.jsx("div",{className:"min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"flex justify-between items-start mb-8",children:[e.jsxs("div",{className:"text-center flex-1",children:[e.jsx("h1",{className:"text-4xl font-bold text-gray-900 mb-4",children:"Chat Session Management Builder"}),e.jsx("p",{className:"text-lg text-gray-600 max-w-2xl mx-auto",children:"Generate a complete, production-ready chat session management system tailored to your platform and requirements."})]}),e.jsx("div",{className:"ml-8",children:e.jsx(Xe,{})})]}),m&&e.jsx("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-blue-400",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})})}),e.jsx("div",{className:"ml-3",children:e.jsxs("p",{className:"text-sm text-blue-700",children:["Welcome back, ",e.jsx("span",{className:"font-medium",children:m.name}),"! Your session configurations are automatically saved and synced with your GitHub account."]})})]})}),e.jsx("div",{className:"mb-8",children:e.jsx(Ve,{currentStep:s.currentStep,totalSteps:ae,completedSteps:s.completedSteps,onStepClick:u,disabled:s.isLoading})}),s.error&&e.jsx("div",{className:"mb-8",children:e.jsx("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4",children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-red-400",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})}),e.jsxs("div",{className:"ml-3",children:[e.jsx("h3",{className:"text-sm font-medium text-red-800",children:"Error"}),e.jsx("div",{className:"mt-2 text-sm text-red-700",children:s.error}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{type:"button",onClick:()=>t.setError(null),className:"text-sm font-medium text-red-800 hover:text-red-600",children:"Dismiss"})})]})]})})}),e.jsx("div",{className:"bg-white rounded-xl shadow-lg p-8",children:c()}),e.jsxs("div",{className:"mt-8 text-center text-sm text-gray-500",children:[e.jsx("p",{children:"Built with modern web technologies • Supports 7+ platforms • Production-ready code generation"}),e.jsxs("div",{className:"mt-2 space-x-4",children:[e.jsx("a",{href:"#",className:"hover:text-gray-700",children:"Documentation"}),e.jsx("a",{href:"#",className:"hover:text-gray-700",children:"Examples"}),e.jsx("a",{href:"#",className:"hover:text-gray-700",children:"GitHub"}),e.jsx("a",{href:"#",className:"hover:text-gray-700",children:"Support"})]})]})]})})};function ys(){return e.jsx(Je,{children:e.jsx(Ke,{children:e.jsx(He,{children:e.jsx("div",{className:"App",children:e.jsx(xs,{})})})})})}se.createRoot(document.getElementById("root")).render(e.jsx(Se.StrictMode,{children:e.jsx(ys,{})}));
//# sourceMappingURL=index-hNPOhyTP.js.map
