var D=Object.defineProperty;var F=(e,t,i)=>t in e?D(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var h=(e,t,i)=>(F(e,typeof t!="symbol"?t+"":t,i),i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();class g{constructor(){h(this,"head");h(this,"tail");h(this,"length",0);this.head=null,this.tail=null}makeNode(t){return{value:t,next:null}}append(t){let i=this.makeNode(t);return this.length++,this.tail?(this.tail.next=i,this.tail=i,i):(this.head=this.tail=i,i)}forEach(t){let i=this.head,n=0;for(;i;)t(i.value,n),i=i.next,n++}removeFirst(){if(this.length--,!this.head)return null;let t=this.head;return this.head=t.next,t.next=null,t===this.tail&&(this.tail=null),t}}class O{constructor(t,{speed:i}){h(this,"globalSpeed");h(this,"timeBetweenDecorations",0);h(this,"content",new g);h(this,"speed",0);h(this,"count",0);this.canvas=t,this.globalSpeed=i,this.content=new g,setTimeout(()=>{this.calcSpeed(),this.calcTimeBetweenDecorations(),this.calcCount(),this.instanceEach(),setInterval(()=>this.interval(),this.timeBetweenDecorations)},0)}calcSpeed(){this.speed=this.globalSpeed/this.depth}calcCount(){this.count=1+1/this.frequency}calcTimeBetweenDecorations(){this.timeBetweenDecorations=this.canvas.width*this.frequency/this.speed}instanceEach(){for(let t=0;t<this.count;t++)this.content.append(this.instance());this.content.forEach((t,i)=>{t.update(this.timeBetweenDecorations*(this.count-i))})}interval(){this.content.append(this.instance()),this.content.removeFirst()}instance(){return this.instanceDecoration(this.canvas,this.speed)}update(t){this.content.forEach(i=>{i.update(t)})}}function j(e,t,i){return e+t*i}function z(e,t,i){return e-t*i}class A{constructor(t,i){h(this,"path",new Path2D);h(this,"position",0);this.canvas=t,this.speed=i,this.setPath()}update(t){const i=this.canvas.width-this.position;this.canvas.ctx.save(),this.canvas.ctx.fillStyle=this.color,this.canvas.ctx.translate(i,this.y),this.canvas.ctx.scale(this.sizeX,this.sizeY),this.draw(),this.canvas.ctx.restore(),this.forward(t)}forward(t){this.position=j(this.position,this.speed,t)}}function d(e,t,i=1){return e*=i,t*=i,Math.random()*(t-e)+e}function B(e,t){return Math.abs(e-t)}const b=[...new Array(5)].map((e,t)=>t*90);function E(e){const t=[...new Array(5)].map((s,o)=>B(b[o],e));let i=361,n=0;return t.forEach((s,o)=>{i>s&&(i=s,n=o)}),b[n]}function _(e){return e*Math.PI/180}function u(e){return e/180*Math.PI}function P(e,...t){const i=t.map(r=>e(...r)),n=i.map(r=>Math.abs(r)),s=Math.min(...n);let o=0;return n.forEach((r,c)=>{r===s&&(o=i[c])}),o}function m(e=2){return function(t,i){const n=t[i];Object.defineProperty(t,i,{get:()=>n,set:s=>{if(typeof s!="number")throw new Error("Invalid property: Exepted number");const o=10**e;return Math.floor(s*o)/o}})}}var q=Object.defineProperty,N=Object.getOwnPropertyDescriptor,C=(e,t,i,n)=>{for(var s=n>1?void 0:n?N(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&q(t,i,s),s};class v extends A{constructor(){super(...arguments);h(this,"y",d(.3,1.5,this.canvas.height/10));h(this,"isReturned",Boolean(Math.floor(d(0,2))));h(this,"sizeY",d(1.1,1.5,this.canvas.width/1e3));h(this,"sizeX",this.isReturned?-this.sizeY:this.sizeY);h(this,"color","#fff")}setPath(){this.path.moveTo(20,50),this.path.arcTo(-30,40,20,20,15),this.path.arcTo(20,-15,60,20,17),this.path.arcTo(70,-10,80,25,17),this.path.arcTo(100,-10,100,25,15),this.path.arcTo(150,35,110,50,15),this.path.arcTo(110,100,70,60,15),this.path.arcTo(65,80,40,50,17),this.path.arcTo(30,80,20,50,17),this.path.closePath()}draw(){this.isReturned&&this.canvas.ctx.translate(this.sizeY*-110,0),this.canvas.ctx.fill(this.path)}}C([m()],v.prototype,"y",2);C([m()],v.prototype,"isReturned",2);class k extends O{constructor(){super(...arguments);h(this,"frequency",.3);h(this,"depth",4)}instanceDecoration(i,n){return new v(i,n)}}function I(e,t){const i=Math.floor(t/e)+4;return i===1/0?[]:[...new Array(i)].map((s,o)=>(o-1)*e)}function p(e){const t=new Image;return t.src=e,t}var L=Object.defineProperty,R=Object.getOwnPropertyDescriptor,Y=(e,t,i,n)=>{for(var s=n>1?void 0:n?R(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&L(t,i,s),s};class S{constructor(t,{speed:i,floorHeight:n}){h(this,"speed");h(this,"floorHeight");h(this,"position",0);h(this,"images",[p("img/dirt/depth-1.svg"),p("img/dirt/depth-2.svg"),p("img/dirt/depth-3.svg")]);h(this,"depths",[1,2,3]);h(this,"margins",[0,1,0]);h(this,"scale");this.canvas=t,this.speed=i,this.floorHeight=n,this.scale=this.canvas.width/1e4*6}draw(t,i,n){this.canvas.ctx.save(),this.canvas.ctx.translate(t,Math.floor(this.floorHeight+this.canvas.width/100*5*n)),this.canvas.ctx.scale(this.scale,this.scale),this.canvas.ctx.drawImage(i,0,0),this.canvas.ctx.restore()}update(t){this.position+=t*this.speed,this.images[0].width!==0&&(this.position%=this.images[0].width*this.scale),this.images.forEach((i,n)=>{I(i.width*this.scale,this.canvas.width).forEach(s=>{this.draw(s-this.position+this.margins[n]*(this.canvas.width/10),i,this.depths[n]*1)})})}}Y([m(0)],S.prototype,"scale",2);class ${constructor(t){h(this,"colors",{sky:"#00C2FF",dirt:"#A85100",grass:"#1CA600"});h(this,"config");h(this,"clouds");h(this,"dirts");this.canvas=t;const i=t.width/1460,n=Math.floor(t.height/9),s=[Math.floor(t.width/2-n/2),Math.floor(t.height/2-n/2)],o=Math.floor(n/i),r=Math.floor(s[1]+n),c=Math.floor(t.height/20);this.config={speed:i,blockSize:n,cubeOrigin:s,timePerBlock:o,floorHeight:r,grassHeight:c},this.clouds=new k(this.canvas,this.config),this.dirts=new S(this.canvas,this.config)}updateBackground(t){this.setSky(),this.clouds.update(t)}updateForeground(t){this.setDirt(),this.setGrass(),this.dirts.update(t)}setSky(){this.canvas.ctx.fillStyle=this.colors.sky,this.canvas.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}setDirt(){this.canvas.ctx.fillStyle=this.colors.dirt,this.canvas.ctx.fillRect(0,this.config.floorHeight,this.canvas.width,Math.floor(this.canvas.height/2-this.config.blockSize/2))}setGrass(){this.canvas.ctx.fillStyle=this.colors.grass,this.canvas.ctx.fillRect(0,this.config.floorHeight,this.canvas.width,this.config.grassHeight)}}function G(e,t,i,n){const s=[...new Array(4)],o=[e+n/2,t+n/2];for(let r in s){const c=Math.sin(u(i+Number(r)*90-45))*Math.sqrt((n/2)**2*2)+o[0],a=Math.cos(u(i+Number(r)*90-45))*Math.sqrt((n/2)**2*2)+o[1];s[r]=[c,a]}return s}function X(e,t,i,n){const s=[...new Array(4)],o=[e+i/2,t+n/2];for(let r in s){const c=Math.sin(u(Number(r)*90-45))*Math.sqrt((i/2)**2*2)+o[0],a=Math.cos(u(Number(r)*90-45))*Math.sqrt((n/2)**2*2)+o[1];s[r]=[c,a]}return s}function J(e,t,i){return[[e,t+i],[e+i/2,t],[e+i,t+i]]}function K(e,t,i,n,s,o,r,c){const a=((r-s)*(t-o)-(c-o)*(e-s))/((c-o)*(i-e)-(r-s)*(n-t)),l=((i-e)*(t-o)-(n-t)*(e-s))/((c-o)*(i-e)-(r-s)*(n-t));return a>=0&&a<=1&&l>=0&&l<=1}function U(e,t){for(let i=0;i<e.length;i++){let n=Number(i)+1;n===e.length&&(n=0);const s=e[i],o=e[n],r=V(s[0],s[1],o[0],o[1],t);if(r)return r}return!1}function V(e,t,i,n,s){for(let o=0;o<s.length;o++){let r=Number(o)+1;r===s.length&&(r=0);const c=s[o],a=s[r],l=K(c[0],c[1],a[0],a[1],e,t,i,n);if(l)return l}return!1}function x(e,t,i,n){const s=n?P((o,r)=>o-r,[t,e],[t+n,e],[t,e+n]):t-e;return Math.abs(s)>i?s>0?e+i:e-i:t}function y(e,t,i,n){const{content:s,target:o,speed:r}=e;if(e.content instanceof Array){const c=e.content,a=e.target;e.content=c.map((l,w)=>{const f=a[w];return f!==null&&f!==l?x(l,f,r*t,n):(a!==null&&(e.target[w]=null),l)}),a.some(l=>l===null)&&i(e.target.map(l=>l===null),c);return}typeof o=="number"&&!(s instanceof Array)&&(e.content=x(s,o,r*t,n),s===o&&(e.target=null)),i(!1,s)}class W{constructor({ctx:t},i){h(this,"ctx");h(this,"floorHeight");h(this,"speedFrame",0);h(this,"deg");h(this,"origin");h(this,"velocity",0);h(this,"isFalling",!0);h(this,"canForward",!0);h(this,"size");h(this,"center");h(this,"jumpHeight",0);this.graphics=i,this.origin={content:i.cubeOrigin,target:[null,null],speed:i.speed},this.deg={content:0,speed:.6,target:null},this.ctx=t,this.floorHeight=i.floorHeight,this.size=this.graphics.blockSize,this.center=this.updateCenter()}get hitbox(){return G(this.origin.content[0],this.origin.content[1]-this.jumpHeight,360-this.deg.content,this.size)}updateCenter(){return[this.origin.content[0]+this.size/2,this.origin.content[1]-this.jumpHeight+this.size/2]}touchTheFloor(){return this.origin.content[1]-this.jumpHeight+this.size>=this.floorHeight}update(t){this.speedFrame=t,this.ctx.fillStyle="#000",this.velocity-=this.velocity===0?0:1,this.jumpHeight+=this.velocity*t*.05,this.deg.content%=360,this.touchTheFloor()&&this.isFalling&&(this.isFalling=!1,this.jumpHeight=0,this.velocity=0,this.deg.target=E(this.deg.content),this.deg.target%=360,this.origin.content[1]=this.floorHeight-this.size),y(this.deg,t,(n,s)=>{this.isFalling&&(this.deg.content=s+.5*this.speedFrame)},360),y(this.origin,t,([n,s])=>{this.isFalling&&s&&(this.jumpHeight-=7),!this.canForward&&n&&(this.origin.content[0]=z(this.origin.content[0],this.graphics.speed,t))});const i=[this.origin.content[0],this.origin.content[1]-this.jumpHeight];this.center=this.updateCenter(),this.ctx.save(),this.ctx.translate(...this.center),this.ctx.rotate(_(this.deg.content)),this.ctx.translate(-this.center[0],-this.center[1]),this.ctx.fillRect(...i,this.size,this.size),this.ctx.restore(),this.canForward=!0}jump(){this.touchTheFloor()&&(this.velocity=22,this.isFalling=!0)}onSlabCollision(t){if(this.center[0]>=t[0]){setTimeout(()=>{this.isFalling=!0,this.floorHeight=this.graphics.floorHeight},this.graphics.timePerBlock),this.floorHeight=t[1],this.origin.target=[null,t[1]-this.size];return}this.isFalling=!0,this.origin.target=[t[0]-this.size,this.floorHeight-this.size],this.canForward=!1}}class H{constructor({ctx:t},i,n,s){h(this,"ctx");this.position=i,this.speed=n,this.size=s,this.ctx=t}update(t){this.position[0]=z(this.position[0],this.speed,t),this.ctx.save(),this.ctx.translate(...this.position),this.ctx.fillStyle=this.color,this.drawPatern(),this.ctx.restore()}}class Z extends H{constructor(){super(...arguments);h(this,"color","#f00")}get hitbox(){return J(...this.position,this.size)}onCollision(){console.log("game over")}drawPatern(){this.ctx.beginPath(),this.ctx.moveTo(0,this.size),this.ctx.lineTo(this.size/2,0),this.ctx.lineTo(this.size,this.size),this.ctx.closePath(),this.ctx.fill()}}class Q extends H{constructor(i,n,s,o,r){super(i,n,s,o);h(this,"color","#000");this.cubeOnSlabCollision=r}get hitbox(){return X(...this.position,this.size,this.size/2)}onCollision(){this.cubeOnSlabCollision(this.position)}drawPatern(){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.size,0),this.ctx.lineTo(this.size,this.size/2),this.ctx.lineTo(0,this.size/2),this.ctx.closePath(),this.ctx.fill()}}class tt{constructor(t,i,n,s){h(this,"content",new g);this.cubeSize=t,this.canvas=i,this.graphics=n,this.onCubeSlabCollision=s}add(t,i){const n=[this.canvas,[this.canvas.width,i?this.graphics.cubeOrigin[1]-i*this.graphics.blockSize:this.graphics.cubeOrigin[1]],this.graphics.speed,this.graphics.blockSize];let s;switch(t){case"Spike":s=new Z(...n);break;case"Slab":s=new Q(...n,this.onCubeSlabCollision);break}this.content.append(s)}update(t,i,n){this.content.forEach(s=>{s.update(i),s.position[0]>=t[0]-this.cubeSize&&s.position[0]<t[0]+this.cubeSize&&U(s.hitbox,n)&&s.onCollision(),s.position[0]+s.size<0&&setTimeout(()=>{this.content.removeFirst()},0)})}}class it{constructor(t){h(this,"config");h(this,"isActive",!1);h(this,"lastFrame",Date.now());h(this,"blocks");h(this,"graphics");h(this,"cube");const i=document.querySelector(t);if(!i)throw new Error(`Invalid input: The query ${t} does not match any HTML element`);this.config={ctx:i.getContext("2d"),width:i.width,height:i.height},this.graphics=new $(this.config),this.cube=new W(this.config,this.graphics.config),this.blocks=new tt(this.cube.size,this.config,this.graphics.config,this.cube.onSlabCollision.bind(this.cube))}jump(){this.cube.jump()}start(){this.isActive=!0,this.animate()}addBlock(t){this.blocks.add(t)}animate(){this.isActive&&window.requestAnimationFrame(this.animate.bind(this));const t=Date.now()-this.lastFrame;this.lastFrame=Date.now(),this.graphics.updateBackground(t),this.blocks.update(this.cube.origin.content,t,this.cube.hitbox),this.cube.update(t),this.graphics.updateForeground(t)}stop(){this.isActive=!1}}const T=new it("#game");T.start();document.addEventListener("keyup",e=>{const{key:t}=e;(t===" "||t==="ArrowUp")&&M()});document.addEventListener("click",()=>M());function M(){T.jump()}
