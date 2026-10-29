// Datos editables del prototipo. Validar la identidad Microsoft Entra de cada usuario antes de publicar.
const PEOPLE = {
  valeria: {name:'Valeria Olarte', user:'oiaoutgoing@uniandes.edu.co'},
  nicole: {name:'Nicole González', user:'oiaoutgoing2@uniandes.edu.co'},
  anderson: {name:'Anderson Henao', user:'oiaincoming@uniandes.edu.co'},
  angelica: {name:'Angélica Cuevas', user:'oiaresearchinfo@uniandes.edu.co'},
  flor: {name:'Flor Soto', user:'oiamobilityinfo@uniandes.edu.co'},
  yadira: {name:'Yadira Mogollón', user:'oiamobility@uniandes.edu.co'},
  margarita: {name:'Margarita Calderón', user:'oiacooperation@uniandes.edu.co'}
};
const TOPICS = [
  {id:'saliente',label:'Movilidad saliente',subtitle:'Quiero estudiar fuera',email:'oiaoutgoing@uniandes.edu.co',items:[
    {label:'Intercambio internacional semestral o doble titulación',people:['valeria','nicole'],desc:'El equipo de movilidad internacional saliente puede orientarte. Selecciona a la persona con quien deseas hablar.'},
    {label:'Study Abroad saliente',people:['angelica'],desc:'Consulta sobre programas Study Abroad salientes.'},
    {label:'Erasmus saliente',people:['angelica'],desc:'Consulta sobre programas Erasmus salientes.'},
    {label:'Movilidad nacional saliente',people:['angelica'],desc:'Consulta sobre intercambio semestral dentro de Colombia.'},
    {label:'Rotaciones clínicas salientes',people:[],desc:'No se ha definido responsable individual en la tabla. Usa el correo del proceso.'}]},
  {id:'entrante',label:'Movilidad entrante',subtitle:'Quiero estudiar en Uniandes',email:'oiaincoming@uniandes.edu.co',items:[
    {label:'Intercambio internacional o doble titulación',people:['anderson'],desc:'Consulta sobre intercambio o doble titulación internacional entrante.'},
    {label:'Study Abroad entrante',people:['anderson'],desc:'Consulta sobre Study Abroad entrante.'},
    {label:'Erasmus entrante',people:['anderson'],desc:'Consulta sobre Erasmus entrante.'},
    {label:'Movilidad nacional entrante',people:['angelica'],desc:'Consulta sobre intercambio semestral nacional entrante.'},
    {label:'Rotaciones clínicas entrantes',people:[],desc:'No se ha definido responsable individual en la tabla. Usa el correo del proceso.'}]},
  {id:'investigacion',label:'Investigación',subtitle:'Pasantías de investigación',email:'oiaresearchinfo@uniandes.edu.co',items:[
    {label:'Pasantía de investigación entrante',people:['angelica'],desc:'Pasantías de investigación nacionales e internacionales.'},
    {label:'Pasantía de investigación saliente',people:['angelica'],desc:'Pasantías de investigación nacionales e internacionales.'}]},
  {id:'virtual',label:'Movilidad virtual',subtitle:'Programa VMP',email:'oiaresearchinfo@uniandes.edu.co',items:[
    {label:'Virtual Mobility Program (VMP)',people:['angelica'],desc:'Movilidad virtual para estudiantes entrantes y salientes.'}]},
  {id:'orientacion',label:'Orientación general',subtitle:'No sé con quién hablar',email:'oiamobilityinfo@uniandes.edu.co',items:[
    {label:'Información y orientación general',people:['flor'],desc:'Si aún no sabes cuál es tu proceso, contacta el canal de orientación general.'},
    {label:'Jefatura de Movilidad',people:['yadira'],desc:'Asuntos que requieran atención de la jefatura. Se recomienda confirmar este canal antes de publicarlo.'}]},
  {id:'cooperacion',label:'Cooperación',subtitle:'Cooperación institucional',email:'oiacooperation@uniandes.edu.co',items:[
    {label:'Consulta de cooperación',people:['margarita'],desc:'Contacto institucional de cooperación. Confirmar alcance específico de sus funciones.'}]}
];
const listEl=document.getElementById('topic-list');
const selectEl=document.getElementById('subtopic');
const resultEl=document.getElementById('result-content');
const errorTopic=document.getElementById('topic-error');
const errorSubtopic=document.getElementById('subtopic-error');
const findButton=document.getElementById('find-contact');
let active=null;
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function link(label,href,css){const a=element('a','action '+css,label);a.href=href;if(href.startsWith('https')){a.target='_blank';a.rel='noopener noreferrer'}return a}
function buildMessage(item){
  return `Buen día,\n\nMi nombre es [escribe tu nombre] y quisiera recibir orientación sobre ${item.label.toLowerCase()}.\n\nMi consulta es: [escribe aquí tu consulta].\n\nMuchas gracias por su ayuda.`;
}
function emailLink(email,item){
  return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent('Consulta de movilidad académica - '+item.label)}&body=${encodeURIComponent(buildMessage(item))}`;
}
function teamsLink(user,item){
  return `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(user)}&message=${encodeURIComponent(buildMessage(item))}`;
}
function addMessagePreview(item,container){
  const wrap=element('div','message-preview');
  wrap.append(element('strong','', 'Mensaje que se preparará'));
  const pre=element('pre','message-text',buildMessage(item));
  const copy=element('button','copy-message','Copiar mensaje');copy.type='button';
  copy.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(buildMessage(item));copy.textContent='✓ Mensaje copiado';}
    catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(pre);selection.removeAllRanges();selection.addRange(range);copy.textContent='Selecciona y copia el mensaje';}
  });
  wrap.append(pre,copy);container.append(wrap);
}
function showError(el,show){el.hidden=!show}
function showEmpty(){
  resultEl.replaceChildren();
  resultEl.append(element('div','empty-icon','✉'));
  resultEl.append(element('h3','result-title','Tu contacto aparecerá aquí'));
  resultEl.append(element('p','result-desc','Selecciona un tema, especifica tu consulta y haz clic en «Encontrar contacto».'));
}
function render(){
  if(!active || selectEl.value===''){showEmpty();return}
  const item=active.items[Number(selectEl.value)];
  resultEl.replaceChildren();
  resultEl.append(element('span','result-heading','CONTACTO PARA TU CONSULTA'));
  resultEl.append(element('h3','result-title',item.people.length?item.people.map(k=>PEOPLE[k].name).join(' o '):'Equipo de '+active.label.toLowerCase()));
  resultEl.append(element('p','result-desc',item.desc));
  item.people.forEach(key=>{
    const person=PEOPLE[key],card=element('div','person'),info=element('div'),actions=element('div','person-actions');
    info.append(element('h4','',person.name),element('p','',person.user));
    actions.append(link('Abrir chat de Teams ↗',teamsLink(person.user,item),'action-primary'),link('Redactar en Outlook ↗',emailLink(person.user,item),'action-secondary'));
    card.append(info,actions);resultEl.append(card);
  });
  const mail=element('div','process-mail');mail.append(element('strong','','Correo del proceso: '));
  const a=link('Escribir a '+active.email+' ↗',emailLink(active.email,item),'action-secondary');mail.append(a);resultEl.append(mail);
  addMessagePreview(item,resultEl);
  resultEl.append(element('p','fallback','El texto queda como borrador: debes pulsar Enviar. Teams requiere que el usuario sea una cuenta Microsoft válida; Outlook requiere iniciar sesión. Si el texto no se carga, utiliza «Copiar mensaje».'));
}
function activate(topicId){
  active=TOPICS.find(t=>t.id===topicId)||null;
  [...listEl.children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===topicId)));
  listEl.classList.remove('has-error');showError(errorTopic,false);
  selectEl.replaceChildren();
  let opt=document.createElement('option');opt.value='';opt.textContent='Selecciona el tipo de consulta';selectEl.append(opt);
  if(active)active.items.forEach((x,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=x.label;selectEl.append(option)});
  selectEl.disabled=!active;
  selectEl.classList.remove('has-error');showError(errorSubtopic,false);
  if(active && active.items.length===1){selectEl.value='0';render()}else{showEmpty()}
}
TOPICS.forEach(t=>{
  const b=element('button','topic');b.type='button';b.dataset.id=t.id;b.setAttribute('aria-pressed','false');
  b.append(element('strong','',t.label),element('small','',t.subtitle));
  b.addEventListener('click',()=>activate(t.id));listEl.append(b)
});
selectEl.addEventListener('change',()=>{
  if(selectEl.value!==''){selectEl.classList.remove('has-error');showError(errorSubtopic,false)}
  if(active && selectEl.value!==''){render()}else{showEmpty()}
});
findButton.addEventListener('click',()=>{
  if(!active){listEl.classList.add('has-error');showError(errorTopic,true);listEl.scrollIntoView({behavior:'smooth',block:'center'});return}
  if(selectEl.value===''){selectEl.classList.add('has-error');showError(errorSubtopic,true);selectEl.focus();return}
  showError(errorTopic,false);showError(errorSubtopic,false);render();
  if(window.matchMedia('(max-width:820px)').matches)document.getElementById('resultado').scrollIntoView({behavior:'smooth',block:'start'});
});
activate(null);
