const W=960,H=540,WW=4200,cv=document.getElementById('c'),c=cv.getContext('2d'),ov=document.getElementById('ov');
const PC=['#39ff6a','#25e8d0','#a85cff','#3d8bff','#ff3fd0','#ffc933'],PN=['Uranio','Cobre','Curio','Radón','Polonio','Torio'];
const COST=[20,15,25,20,25,25],CD=[300,40,70,150,200,300];
let vol=.5,state='menu',K={},T=0,P,E,S,PT=[],ck=0,door=false,shake=0,msg='',msgT=0,boss=null;
const PL=[[0,470,1300,70],[1420,470,2780,70],[350,380,140,16],[560,310,140,16],[820,360,140,16],[1100,400,120,16],[1800,390,160,16],[2050,320,140,16],[2250,380,140,16]];
const MP={x:1300,y:410,w:120,h:16,o:1300,t:0,dx:0};
const PK=[[640,270],[2100,280],[3300,430]];let pk=[];
try{ck=+localStorage.getItem('laumar_ck')||0}catch(e){}
function snd(f,d,ty){if(!vol)return;try{const a=snd.a||(snd.a=new AudioContext()),o=a.createOscillator(),g=a.createGain();o.type=ty||'sine';o.frequency.value=f;g.gain.value=.08*vol;g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function reset(){door=ck>2700;P={x:Math.max(80,ck),y:300,w:30,h:68,vx:0,vy:0,on:0,f:1,hp:100,en:100,st:100,sel:0,cd:[0,0,0,0,0,0],sh:0,ar:0,fog:0,inv:0,hit:0,cast:0,crouch:0,land:0,fu:0,fcd:0};
 E=[];[700,1100,1900,2300].forEach((x,i)=>E.push({t:'d',x,y:230,w:34,h:24,hp:30,bx:x,by:230,sh:i*50,vx:0,st:0}));
 [[900,150],[1700,150],[2200,130]].forEach(a=>E.push({t:'r',x:a[0],y:410,w:34,h:60,hp:60,bx:a[0],rg:a[1],d:1,vx:0,st:0}));
 boss={t:'b',x:3750,y:340,w:90,h:130,hp:300,mx:300,sh:true,shT:0,ph:1,tm:0,mode:0,vx:0,st:0,dead:0,on:0};E.push(boss);
 S=[];PT=[];pk=PK.map(a=>({x:a[0],y:a[1],u:0}));MP.t=0;msg='';}
const sol=()=>{const a=PL.map(p=>({x:p[0],y:p[1],w:p[2],h:p[3]}));a.push({x:MP.x,y:MP.y,w:MP.w,h:MP.h,m:1});if(!door)a.push({x:2640,y:240,w:24,h:230});return a};
function part(x,y,col,n,sp){for(let i=0;i<n;i++)PT.push({x,y,vx:(Math.random()-.5)*sp,vy:(Math.random()-.5)*sp,l:30+Math.random()*30,col})}
function say(m){msg=m;msgT=240}
function hurt(d){if(P.inv>0||P.fog>0||P.sh>0||P.fu>0)return;P.hp-=d*(P.ar>0?.3:1);P.inv=50;P.hit=20;shake=8;P.vy=-5;snd(120,.2,'sawtooth');part(P.x+15,P.y+30,'#ff5060',12,6);if(P.hp<=0){P.hp=0;state='dead';show('dead')}}
function power(){const i=P.sel;if(P.cd[i]>0||P.en<COST[i]||P.st<10)return;
 P.en-=COST[i];P.st=Math.max(0,P.st-7);P.cd[i]=CD[i];P.cast=18;snd(300+i*90,.25,'triangle');const cx=P.x+15,cy=P.y+30;
 if(i==0){P.sh=240;part(cx,cy,PC[0],20,6)}
 if(i==1)S.push({x:cx+P.f*20,y:cy-8,vx:P.f*10,k:1,dmg:12,r:6,l:70});
 if(i==2)S.push({x:cx+P.f*20,y:cy-8,vx:P.f*5,k:2,dmg:30,r:12,l:100});
 if(i==3){P.fog=36;P.vx=P.f*10;part(cx,cy,PC[3],25,5)}
 if(i==4)S.push({x:cx,y:cy,w:1,r:10,mx:260,dmg:15,k:4,h:[]});
 if(i==5){P.ar=420;part(cx,cy,PC[5],20,6)}}
function fusion(){if(P.fcd>0||P.en<80||P.st<50)return say(P.fcd>0?'Fusión en recuperación':'Necesitas 80 de energía y 50 de estabilidad');
 P.en-=80;P.st-=45;P.fcd=1200;P.fu=70;P.cast=70;shake=20;snd(80,.8,'sawtooth');S.push({x:P.x+15,y:P.y+30,r:10,mx:720,dmg:100,k:6,h:[],f:1})}
function ex(e){return E.indexOf(e)}
function dmg(e,d,pos){if(e.t=='b'&&e.sh){part(e.x+45,e.y+50,'#9ff',6,4);return}e.hp-=d;e.st=10;part(e.x+e.w/2,e.y+e.h/2,'#fff',8,5);snd(200,.08,'square');if(e.hp<=0&&!e.dead){e.dead=1;e.dt=60;part(e.x+e.w/2,e.y+e.h/2,'#ffc933',40,10);snd(60,.5,'sawtooth')}}
function update(){T++;const p=P,s=sol();
 const L=K.KeyA||K.ArrowLeft,R=K.KeyD||K.ArrowRight,run=K.ShiftLeft||K.ShiftRight;
 p.crouch=(K.KeyS||K.ArrowDown)&&p.on?1:0;const sp=p.crouch?1.2:run?5:3;
 if(p.fog<=0){p.vx*=.8;if(L&&!p.hit){p.vx=-sp;p.f=-1}if(R&&!p.hit){p.vx=sp;p.f=1}}
 if(K.Space&&p.on&&!p.crouch){p.vy=-13.5;p.on=0;snd(420,.1)}
 if(!p.fog)p.vy+=.65;else p.vy=0;if(p.vy>16)p.vy=16;
 p.x+=p.vx;for(const o of s)if(p.x<o.x+o.w&&p.x+p.w>o.x&&p.y<o.y+o.h&&p.y+p.h>o.y){if(p.vx>0)p.x=o.x-p.w;else if(p.vx<0)p.x=o.x+o.w}
 p.x=Math.max(0,Math.min(WW-p.w,p.x));p.y+=p.vy;const was=p.on;p.on=0;
 for(const o of s)if(p.x<o.x+o.w&&p.x+p.w>o.x&&p.y<o.y+o.h&&p.y+p.h>o.y){if(p.vy>=0){p.y=o.y-p.h;p.vy=0;p.on=1;if(o.m)p.x+=MP.dx}else{p.y=o.y+o.h;p.vy=0}}
 if(p.on&&!was){p.land=10;snd(90,.08)}if(p.land>0)p.land--;
 if(p.y>650){p.hp-=25;if(p.hp<=0){state='dead';show('dead')}p.x=Math.max(80,ck);p.y=300;p.vy=0}
 MP.t+=.012;const nx=MP.o+60+Math.sin(MP.t)*60;MP.dx=nx-MP.x;MP.x=nx;
 p.en=Math.min(100,p.en+.1);p.st=Math.min(100,p.st+.03);for(let i=0;i<6;i++)if(p.cd[i]>0)p.cd[i]--;
 ['sh','ar','fog','inv','hit','cast','fu','fcd'].forEach(k=>{if(p[k]>0)p[k]--});
 if(p.fog>0&&T%2)part(p.x+15,p.y+30,PC[3],1,2);
 if(p.sh>0&&T%4==0)part(p.x+15,p.y+34,PC[0],1,3);
 if(p.x>1450&&ck<1450){ck=1450;say('Punto de control guardado')}if(p.x>2700&&ck<2700){ck=2700}
 try{localStorage.setItem('laumar_ck',ck)}catch(e){}
 // peligro eléctrico (zona Uranio)
 if(p.x+p.w>1500&&p.x<1700&&p.y>380&&T%2==0){if(p.sh<=0&&p.ar<=0&&p.fog<=0)hurt(4);part(1500+Math.random()*200,460,PC[1],1,4)}
 pk.forEach(k=>{if(!k.u&&Math.abs(p.x-k.x)<30&&Math.abs(p.y-k.y)<70){k.u=1;p.hp=Math.min(100,p.hp+35);p.en=100;p.st=100;say('Estación de recuperación activada');snd(700,.3)}});
 // proyectiles y ondas
 S.forEach(b=>{if(b.w){b.r+=7;b.l=b.r<b.mx?1:0;E.forEach(e=>{if(e.dead||b.h.includes(e))return;const dx=e.x+e.w/2-b.x,dy=e.y+e.h/2-b.y,d=Math.hypot(dx,dy);if(Math.abs(d-b.r)<30){b.h.push(e);if(e.t=='b'){e.sh=false;e.shT=300;say('¡Escudo roto! Ataca ahora')}dmg(e,b.dmg)}})}
  else if(b.hs){b.x+=b.vx;b.y+=b.vy;b.l--;if(Math.hypot(b.x-p.x-15,b.y-p.y-34)<20){hurt(10);b.l=0}}
  else{b.x+=b.vx;b.l--;if(b.k==1&&!door&&b.x>2480&&b.x<2510&&b.y>390){door=true;b.l=0;say('Circuito activado: puerta abierta');snd(500,.4);shake=8}
   sol().forEach(o=>{if(!o.m&&b.x>o.x&&b.x<o.x+o.w&&b.y>o.y&&b.y<o.y+o.h)b.l=0});
   E.forEach(e=>{if(!e.dead&&b.l>0&&b.x>e.x&&b.x<e.x+e.w&&b.y>e.y&&b.y<e.y+e.h){dmg(e,b.dmg);b.l=0}})}
  if(b.k!=4&&b.k!=6&&Math.random()<.5)part(b.x,b.y,PC[b.k-1],1,2)});
 S=S.filter(b=>b.l>0||(b.w&&b.r<b.mx));
 // enemigos
 E.forEach(e=>{if(e.st>0)e.st--;if(e.dead){e.dt--;return}
  const dx=p.x-e.x,dist=Math.abs(dx);
  if(e.t=='d'){e.sh++;if(dist<400){e.state='c';e.vx=Math.sign(dx)*1.6;e.by+=((p.y-90)-e.by)*.02;if(T%110==e.x%110|0&&dist<400){const a=Math.atan2(p.y+30-e.y,p.x+15-e.x);S.push({x:e.x+17,y:e.y+12,vx:Math.cos(a)*5,vy:Math.sin(a)*5,hs:1,l:90,k:1,r:5})}}else e.vx=Math.sin(e.sh*.02)*1.3;
   e.x+=e.vx;e.y=e.by+Math.sin(e.sh*.08)*14}
  if(e.t=='r'){if(dist<260&&Math.abs(p.y-e.y)<80){e.vx=Math.sign(dx)*1.8}else{e.vx=e.d*1;if(Math.abs(e.x-e.bx)>e.rg)e.d*=-1}e.x+=e.vx;e.f=Math.sign(e.vx)||1}
  if(e.t=='b'){if(p.x<3050&&!e.on)return;if(!e.on){e.on=1;say('Guardián: rompe su escudo con Polonio (5)')}
   if(e.shT>0){e.shT--;if(e.shT==0){e.sh=true}}e.ph=e.hp<e.mx/2?2:1;e.tm++;const sp=e.ph==2?1.6:1;
   if(e.mode==0){e.vx=Math.sign(dx)*1.2*sp;e.x+=e.vx;if(e.tm>150/sp){e.mode=Math.random()<.5?1:2;e.tm=0}}
   else if(e.mode==1){if(e.tm<30)e.vx=0;else{e.vx=Math.sign(dx)*8*sp;e.x+=e.vx}if(e.tm>80){e.mode=0;e.tm=0}}
   else{if(e.tm%25==10){const n=e.ph==2?5:3;for(let i=0;i<n;i++){const a=Math.atan2(p.y-e.y-30,dx)+(i-(n-1)/2)*.2;S.push({x:e.x+45,y:e.y+40,vx:Math.cos(a)*5,vy:Math.sin(a)*5,hs:1,l:120,k:3,r:6})}}if(e.tm>60){e.mode=0;e.tm=0}}
   e.x=Math.max(3000,Math.min(4100,e.x))}
  if(!(e.t=='d'&&false)&&p.x<e.x+e.w&&p.x+p.w>e.x&&p.y<e.y+e.h&&p.y+p.h>e.y){hurt(e.t=='b'?20:10);p.vx=Math.sign(p.x-e.x)*6}});
 E=E.filter(e=>!(e.dead&&e.dt<=0));
 if(boss.dead&&boss.dt<=0&&state=='play'){state='win';show('win')}
 PT.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.l--});PT=PT.filter(q=>q.l>0);if(shake>0)shake--;if(msgT>0)msgT--}
// ---- LAUMAR: combinación imagen (traje oscuro con energía, cabello azul-negro) + descripción (rubio con reflejos, blusa asimétrica, puños amplios) ----
function drawL(x,y,f,s,o){const col=PC[o.sel],t=o.t,mv=Math.abs(o.vx),sw=o.on&&mv>.3?Math.sin(t*(mv>4?.026:.016)):0,br=Math.sin(t*.004);
 c.save();c.translate(x,y);c.scale(f*s,s);if(o.dead)c.rotate(-1.3);if(o.hit)c.rotate(-.12);if(o.crouch)c.scale(1,.74);
 const hy=-30+br*.5;c.lineCap='round';
 const leg=(k)=>{const a=o.on?sw*.7*k:(o.vy<0?(k>0?.6:-.2):(k>0?.3:-.3));const fx=Math.sin(a)*30,fy=hy+Math.cos(a)*30;
  c.strokeStyle='#120a22';c.lineWidth=10;c.beginPath();c.moveTo(0,hy);c.lineTo(fx,fy);c.stroke();c.strokeStyle=col;c.globalAlpha=.8;c.lineWidth=1.3;c.beginPath();c.moveTo(1,hy);c.lineTo(fx+1,fy);c.stroke();c.globalAlpha=1;c.fillStyle='#0a0614';c.fillRect(fx-1,fy-3,9,4)};
 const arm=(k,sl,ln)=>{const a=o.cast>0?1.45:o.def?1.1:-sw*.6*k+br*.06*k;const sx=-1+k*2,sy=-60+br*.5,hx=sx+Math.sin(a)*24,hy2=sy+Math.cos(a)*24;
  c.strokeStyle=sl;c.lineWidth=7;c.beginPath();c.moveTo(sx,sy);c.lineTo(hx,hy2);c.stroke();c.strokeStyle=ln;c.lineWidth=1.2;c.beginPath();c.moveTo(sx,sy);c.lineTo(hx,hy2);c.stroke();
  c.fillStyle=sl;c.strokeStyle=col;c.lineWidth=1;c.beginPath();c.moveTo(hx-4,hy2-5);c.lineTo(hx+4,hy2-5);c.lineTo(hx+6,hy2+3);c.lineTo(hx-6,hy2+3);c.closePath();c.fill();c.stroke();
  c.fillStyle='#e8bfa6';c.beginPath();c.arc(hx+Math.sin(a)*4,hy2+Math.cos(a)*5,3,0,7);c.fill()};
 // cabello trasero (azul-negro con mechones rubios, verdes y violetas)
 const sy=Math.sin(t*.005)*3-Math.max(-8,Math.min(8,o.vx*1.4));
 c.fillStyle='#0a0620';c.beginPath();c.moveTo(-3,-78);c.bezierCurveTo(-18,-76,-20+sy,-50,-14+sy,-26);c.bezierCurveTo(-8+sy,-40,-3,-52,4,-60);c.closePath();c.fill();
 [['#a85cff',-14],['#3d8bff',-11],['#25e8d0',-8]].forEach(a=>{c.strokeStyle=a[0];c.lineWidth=1.4;c.globalAlpha=.85;c.beginPath();c.moveTo(-4,-76);c.quadraticCurveTo(a[1]-4+sy*.5,-52,a[1]+sy,-30);c.stroke()});c.globalAlpha=1;
 arm(-1,'#0a0614','#a85cff');leg(-1);leg(1);
 // blusa: delantera corta, trasera larga
 const g=c.createLinearGradient(-9,-62,9,-34);g.addColorStop(0,'#2e1260');g.addColorStop(.5,'#0a0614');g.addColorStop(1,'#05030a');c.fillStyle=g;
 c.beginPath();c.moveTo(-8,-62+br*.5);c.lineTo(8,-62+br*.5);c.lineTo(8,-37);c.lineTo(-8,-37);c.fill();
 
 c.strokeStyle=col;c.lineWidth=1.3;c.beginPath();c.moveTo(-6,-60);c.quadraticCurveTo(3,-50,-4,-38);c.moveTo(7,-58);c.quadraticCurveTo(0,-48,6,-38);c.moveTo(-8,-37);c.lineTo(8,-37);c.stroke();
 const gl=c.createRadialGradient(3,-52,0,3,-52,11);gl.addColorStop(0,'#fff');gl.addColorStop(.3,col);gl.addColorStop(1,'transparent');c.fillStyle=gl;c.beginPath();c.arc(3,-52,11+Math.sin(t*.01)*1.5,0,7);c.fill();
 const sg=c.createRadialGradient(-1,-59,0,-1,-59,8);sg.addColorStop(0,'#fff');sg.addColorStop(.35,'#25e8d0');sg.addColorStop(1,'transparent');c.fillStyle=sg;c.beginPath();c.arc(-1,-59,8,0,7);c.fill();c.strokeStyle='#a85cff';c.lineWidth=1;c.beginPath();c.moveTo(-8,-56);c.quadraticCurveTo(0,-62,8,-56);c.moveTo(0,-44);c.lineTo(3,-36);c.stroke();c.fillStyle='#e8bfa6';c.fillRect(0,-68,5,8);
 c.beginPath();c.ellipse(3,-70,6.5,8,0,0,7);c.fill();
 c.fillStyle='#fff';c.fillRect(5,-72,4,2);c.fillStyle='#a8b04a';c.fillRect(7,-72,2,2);c.fillStyle='#c0506a';c.fillRect(6,-65,3,1.5);
 c.fillStyle='#0a0620';c.beginPath();c.moveTo(-4,-70);c.quadraticCurveTo(-3,-84,5,-79);c.quadraticCurveTo(10,-77,10,-73);c.quadraticCurveTo(4,-77,-1,-68);c.fill();
 c.strokeStyle='#a85cff';c.lineWidth=1.2;c.beginPath();c.moveTo(0,-80);c.quadraticCurveTo(6,-79,9,-74);c.stroke();
 arm(1,'#0a0614','#25e8d0');c.restore()}
// ---- enemigos y jefe ----
function drawE(e){c.save();c.translate(e.x,e.y);if(e.st>0)c.globalAlpha=.6;
 if(e.dead)c.globalAlpha=Math.max(0,e.dt/60);
 if(e.t=='d'){c.fillStyle='#1c2a3a';c.beginPath();c.ellipse(17,12,17,9,0,0,7);c.fill();c.fillStyle='#ff3040';c.beginPath();c.arc(17,12,4+Math.sin(T*.2),0,7);c.fill();c.strokeStyle='#25e8d0';c.lineWidth=2;const r=Math.sin(T*.7)*5;c.beginPath();c.moveTo(0,4);c.lineTo(-8,r);c.moveTo(34,4);c.lineTo(42,r);c.stroke()}
 if(e.t=='r'){const f=e.f||1,w=Math.sin(T*.15)*4;c.translate(17,0);c.scale(f,1);c.fillStyle='#2a3444';c.fillRect(-9,18,18,26);c.fillRect(-10,44,7,16-w);c.fillRect(3,44,7,16+w);c.fillStyle='#3a4a60';c.fillRect(-12,4,24,20);c.fillStyle='#202a3a';c.fillRect(-8,-8,16,12);c.fillStyle='#ff3040';c.fillRect(0,-4,7,3);c.fillStyle='#25e8d0';c.fillRect(-3,10,6,5)}
 if(e.t=='b'){const b=Math.sin(T*.05)*4;c.fillStyle='#1a2236';c.fillRect(10,40,70,90);c.fillStyle='#2c3a58';c.fillRect(0,20+b,90,50);c.fillStyle='#202c48';c.fillRect(25,-5+b,40,30);
  c.fillStyle=e.ph==2?'#ff3040':'#39ff6a';c.fillRect(35,5+b,20,6);c.fillStyle=e.sh?'#3d8bff':'#ff3fd0';c.beginPath();c.arc(45,50+b,12+Math.sin(T*.2)*2,0,7);c.fill();
  c.fillStyle='#14203a';c.fillRect(-12,30,14,60);c.fillRect(88,30,14,60);
  if(e.sh){c.strokeStyle='rgba(61,139,255,.7)';c.lineWidth=3;c.beginPath();c.ellipse(45,65,66,80,0,0,7);c.stroke()}}
 c.restore();if(e.t!='b'&&!e.dead){c.fillStyle='#300';c.fillRect(e.x,e.y-8,e.w,4);c.fillStyle='#f44';c.fillRect(e.x,e.y-8,e.w*Math.max(0,e.hp/(e.t=='d'?30:60)),4)}}
function draw(){const cx=state=='menu'?0:Math.max(0,Math.min(WW-W,P.x-W/2+15)),p=P;c.save();
 if(shake>0)c.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#04101c');g.addColorStop(1,'#0a2a30');c.fillStyle=g;c.fillRect(0,0,W,H);
 // capa lejana: torres del laboratorio
 for(let i=0;i<14;i++){const x=i*180-(cx*.15)%180-40;c.fillStyle='#08202a';c.fillRect(x,120+(i%3)*40,90,420);c.fillStyle='rgba(57,255,106,.35)';for(let j=0;j<6;j++)c.fillRect(x+10+(j%2)*45,150+(i%3)*40+j*38,20,8)}
 // capa media: cápsulas con tubos de energía
 for(let i=0;i<20;i++){const x=i*210-(cx*.5)%210;c.fillStyle='#0c1c2c';c.fillRect(x,300,60,170);const a=c.createLinearGradient(x,0,x+60,0);a.addColorStop(0,'rgba(37,232,208,.1)');a.addColorStop(.5,'rgba(57,255,106,.5)');a.addColorStop(1,'rgba(37,232,208,.1)');c.fillStyle=a;c.fillRect(x+8,315,44,130);c.fillStyle='#4a5a70';c.fillRect(x,296,60,8);c.fillRect(x,466,60,6);c.strokeStyle='rgba(61,139,255,.5)';c.lineWidth=3;c.beginPath();c.moveTo(x+30,296);c.lineTo(x+30,200);c.stroke()}
 c.translate(-cx,0);
 // plataformas
 sol().forEach(o=>{const m=c.createLinearGradient(0,o.y,0,o.y+o.h);m.addColorStop(0,'#3a4c64');m.addColorStop(1,'#141c2a');c.fillStyle=o.w==24?'#25304a':m;c.fillRect(o.x,o.y,o.w,Math.min(o.h,o.w==24?o.h:o.h));c.fillStyle=o.w==24?'#ff3040':PC[1];c.fillRect(o.x,o.y,o.w,2)});
 // peligro eléctrico
 c.strokeStyle=PC[1];c.lineWidth=2;c.beginPath();for(let x=1500;x<1700;x+=10)c.lineTo(x,468-Math.random()*14);c.stroke();
 // panel de Cobre
 c.fillStyle='#1c2a3a';c.fillRect(2480,400,24,50);c.fillStyle=door?PC[0]:PC[1];c.shadowColor=c.fillStyle;c.shadowBlur=12;c.fillRect(2486,410,12,12);c.shadowBlur=0;
 pk.forEach(k=>{if(!k.u){c.fillStyle='#39ff6a';c.shadowColor='#39ff6a';c.shadowBlur=14;c.fillRect(k.x+5,k.y+20,20,40);c.shadowBlur=0;c.fillStyle='#fff';c.fillRect(k.x+13,k.y+28,4,24);c.fillRect(k.x+8,k.y+36,14,4)}});
 E.forEach(drawE);
 if(p){const o={sel:p.sel,vx:p.vx,vy:p.vy,on:p.on,crouch:p.crouch,cast:p.cast,hit:p.hit,def:p.sh>0||p.ar>0,t:T,dead:state=='dead'};
  if(p.inv%6<3||p.hit==0){const sc=state=='menu'?1:1;drawL(p.x+15,p.y+p.h,p.f,sc,o)}
  const col=PC[p.sel];c.globalCompositeOperation='lighter';
  if(p.sh>0){c.strokeStyle=PC[0];c.lineWidth=3;c.beginPath();c.arc(p.x+15,p.y+34,46,0,7);c.stroke()}
  if(p.ar>0){c.strokeStyle=PC[5];c.lineWidth=4;c.beginPath();c.arc(p.x+15,p.y+34,40,.3,2.6);c.arc(p.x+15,p.y+34,40,3.4,5.7);c.stroke()}
  if(p.fog>0){c.fillStyle='rgba(61,139,255,.35)';c.beginPath();c.arc(p.x+15,p.y+34,50,0,7);c.fill()}
  if(p.fu>0){PC.forEach((q,i)=>{c.strokeStyle=q;c.lineWidth=3;c.beginPath();c.arc(p.x+15,p.y+34,20+p.fu+i*5,i,i+3);c.stroke()})}
  S.forEach(b=>{if(b.w){const cc=b.f?'#fff':PC[4];c.strokeStyle=cc;c.lineWidth=b.f?10:6;c.beginPath();c.arc(b.x,b.y,b.r,0,7);c.stroke();if(b.f){PC.forEach((q,i)=>{c.strokeStyle=q;c.lineWidth=4;c.beginPath();c.arc(b.x,b.y,b.r-6*i,0,7);c.stroke()})}}else{c.fillStyle=b.hs?'#ff5060':PC[b.k-1];c.shadowColor=c.fillStyle;c.shadowBlur=14;c.beginPath();c.arc(b.x,b.y,b.r,0,7);c.fill();c.shadowBlur=0}});
  PT.forEach(q=>{c.globalAlpha=q.l/60;c.fillStyle=q.col;c.fillRect(q.x,q.y,3,3)});c.globalAlpha=1;c.globalCompositeOperation='source-over'}
 c.restore();if(state=='menu'||!p)return;hud()}
function hud(){const p=P;const bar=(x,y,w,v,col,l)=>{c.fillStyle='rgba(5,6,16,.75)';c.fillRect(x,y,w,12);c.fillStyle=col;c.fillRect(x,y,w*v/100,12);c.strokeStyle='#cbb8ff';c.strokeRect(x,y,w,12);c.fillStyle='#fff';c.font='11px Georgia';c.fillText(l,x+w+6,y+10)};
 bar(16,16,200,p.hp,'#ff4a68','Integridad');bar(16,34,200,p.en,PC[p.sel],'Energía');bar(16,52,200,p.st,'#d8c8ff','Estabilidad del núcleo');
 for(let i=0;i<6;i++){const x=16+i*50,y=H-58;c.fillStyle='rgba(5,6,16,.8)';c.fillRect(x,y,44,44);c.strokeStyle=PC[i];c.lineWidth=i==p.sel?3:1;c.strokeRect(x,y,44,44);c.fillStyle=PC[i];c.font='bold 16px Georgia';c.fillText(['U','Cu','Cm','Rn','Po','Th'][i],x+8,y+27);c.fillStyle='#fff';c.font='10px Georgia';c.fillText(i+1,x+3,y+11);if(p.cd[i]>0){c.fillStyle='rgba(0,0,0,.65)';c.fillRect(x,y+44-44*p.cd[i]/CD[i],44,44*p.cd[i]/CD[i])}}
 c.fillStyle='#fff';c.font='13px Georgia';c.fillText('Poder: '+PN[p.sel]+'   (Z usar, F fusión'+(p.fcd>0?' · recarga '+Math.ceil(p.fcd/60)+'s':'')+')',320,H-20);
 c.fillStyle='#cbb8ff';c.fillText('Objetivo: '+(boss.on?'Derrota al Guardián del Laboratorio':!door?'Activa el panel de Cobre (2) para abrir la puerta':'Cruza la puerta y llega al Guardián'),W-380,24);
 c.fillStyle='rgba(255,255,255,.2)';c.fillRect(W-380,32,360,4);c.fillStyle=PC[1];c.fillRect(W-380,32,360*Math.min(1,p.x/WW),4);
 if(boss.on&&!boss.dead){c.fillStyle='#200';c.fillRect(W/2-200,H-40,400,12);c.fillStyle=boss.sh?'#3d8bff':'#ff3fd0';c.fillRect(W/2-200,H-40,400*boss.hp/boss.mx,12);c.strokeStyle='#fff';c.strokeRect(W/2-200,H-40,400,12);c.fillStyle='#fff';c.fillText('GUARDIÁN DEL LABORATORIO · Fase '+boss.ph+(boss.sh?' · escudo activo':''),W/2-100,H-46)}
 if(msgT>0){c.fillStyle='#fff';c.font='16px Georgia';c.textAlign='center';c.fillText(msg,W/2,90);c.textAlign='left'}}
// ---- menús ----
function show(k){ov.classList.remove('h');const b=(id,t,d)=>`<button id="${id}"${d?' disabled':''}>${t}</button>`;let h='';
 if(k=='menu')h=`<h1>LAUMAR</h1><h2>THE SIX ELEMENTS</h2><div style="height:2em"></div>${b('play','JUGAR')}${b('cont','CONTINUAR',!ck)}${b('help','CONTROLES')}${b('opt','CONFIGURACIÓN')}${b('cred','CRÉDITOS')}`;
 if(k=='help')h=`<h2>CONTROLES</h2><p>A / D o flechas: mover · Espacio: saltar · Shift: correr · S: agacharse<br>1 Uranio · 2 Cobre · 3 Curio · 4 Radón · 5 Polonio · 6 Torio<br>Z: usar poder · F: Fusión de los seis elementos · Esc: pausa</p><p>Uranio protege del suelo eléctrico. Cobre activa el panel de la puerta. Polonio rompe el escudo del Guardián.</p>${b('back','VOLVER')}`;
 if(k=='opt')h=`<h2>CONFIGURACIÓN</h2><p>Volumen</p><input id="vol" type="range" min="0" max="100" value="${vol*100}">${b('back','VOLVER')}`;
 if(k=='cred')h=`<h2>CRÉDITOS</h2><p>LAUMAR: THE SIX ELEMENTS. Nivel 1 jugable, creado con Canvas y Web Audio.</p>${b('back','VOLVER')}`;
 if(k=='pause')h=`<h2>PAUSA</h2>${b('res','CONTINUAR')}${b('rst','REINICIAR NIVEL')}${b('opt','CONFIGURACIÓN')}${b('help','CONTROLES')}${b('menu','MENÚ PRINCIPAL')}`;
 if(k=='dead')h=`<h2>INTEGRIDAD AGOTADA</h2>${b('rst','REINICIAR DESDE EL CHECKPOINT')}${b('menu','MENÚ PRINCIPAL')}`;
 if(k=='win')h=`<h1>VICTORIA</h1><p>El Guardián cae y el laboratorio queda en silencio. Laumar domina los seis elementos. Nivel 1 completado.</p>${b('rst','JUGAR DE NUEVO')}${b('menu','MENÚ PRINCIPAL')}`;
 ov.style.paddingLeft=k=='menu'?'38%':'0';ov.innerHTML=h;const q=id=>document.getElementById(id);const on=(id,f)=>q(id)&&(q(id).onclick=f);
 on('play',()=>{ck=0;door=false;try{localStorage.setItem('laumar_ck',0)}catch(e){}start()});on('cont',start);on('rst',()=>{if(state=='win'){ck=0}start()});on('res',()=>{state='play';ov.classList.add('h')});
 on('help',()=>show('help'));on('opt',()=>show('opt'));on('cred',()=>show('cred'));on('menu',()=>{state='menu';show('menu')});on('back',()=>show(prev));
 if(q('vol'))q('vol').oninput=e=>vol=e.target.value/100;if(k!='help'&&k!='opt'&&k!='cred')prev=k;const f=ov.querySelector('button:not(:disabled)');f&&f.focus()}
let prev='menu';const IMG=new Image();IMG.src='assets/characters/laumar.jpg';
function start(){reset();state='play';ov.classList.add('h');snd(440,.3)}
addEventListener('keydown',e=>{if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(K[e.code])return;K[e.code]=1;
 if(state=='play'){if(/^Digit[1-6]$/.test(e.code))P.sel=+e.code[5]-1;if(e.code=='KeyZ')power();if(e.code=='KeyF')fusion();if(e.code=='Escape'){state='pause';show('pause')}}
 else if(state=='pause'&&e.code=='Escape'){state='play';ov.classList.add('h')}});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>K={});
reset();show('menu');let last=0,acc=0;
function loop(t){acc+=Math.min(100,t-last);last=t;while(acc>=16.67){if(state=='play'||state=='win'&&false)update();else if(state=='menu'||state=='pause'||state=='dead'||state=='win'){T++}acc-=16.67}
 if(state=='menu'){draw();c.fillStyle='rgba(3,4,12,.6)';c.fillRect(0,0,W,H);if(IMG.complete)c.drawImage(IMG,50,0,360,540)}else draw();
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);
