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
let active=TOPICS[0];
const teamsLink=(user)=>`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(user)}`;
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function link(label,href,css){const a=element('a','action '+css,label);a.href=href;if(href.startsWith('https')){a.target='_blank';a.rel='noopener noreferrer'}return a}
function render(){
  const item=active.items[Number(selectEl.value)]||active.items[0];
  resultEl.replaceChildren();
  resultEl.append(element('span','result-heading','Te recomendamos contactar a:'));
  resultEl.append(element('h3','result-title',item.people.length?item.people.map(k=>PEOPLE[k].name).join(' o '):'Equipo de '+active.label.toLowerCase()));
  resultEl.append(element('p','result-desc',item.desc));
  item.people.forEach(key=>{
    const p=PEOPLE[key],card=element('div','person'),info=element('div'),actions=element('div','person-actions');
    info.append(element('h4','',p.name),element('p','',p.user));
    actions.append(link('Abrir Teams ↗',teamsLink(p.user),'action-primary'),link('Correo ↗','mailto:'+p.user,'action-secondary'));
    card.append(info,actions);resultEl.append(card);
  });
  const mail=element('div','process-mail');mail.append('Correo general del proceso: ');const a=element('a','',active.email);a.href='mailto:'+active.email;mail.append(a);resultEl.append(mail);
  resultEl.append(element('p','fallback','Importante: abrir Teams puede requerir iniciar sesión y disponer de permisos para escribir al destinatario.'));
}
function activate(topicId){active=TOPICS.find(t=>t.id===topicId)||TOPICS[0];
  [...listEl.children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===active.id)));
  selectEl.replaceChildren();active.items.forEach((x,i)=>{const opt=document.createElement('option');opt.value=String(i);opt.textContent=x.label;selectEl.append(opt)});render();
}
TOPICS.forEach(t=>{const b=element('button','topic');b.type='button';b.dataset.id=t.id;b.append(element('strong','',t.label),element('small','',t.subtitle));b.addEventListener('click',()=>activate(t.id));listEl.append(b)});
selectEl.addEventListener('change',render);activate('saliente');
