document.addEventListener("DOMContentLoaded", () => {

displayList();

document.getElementById("addToggle")
  .addEventListener("click", () => toggleSection("addArea"));

document.getElementById("settingsToggle")
  .addEventListener("click", () => toggleSection("backupArea"));

document.getElementById("saveBtn")
  .addEventListener("click", addCard);

document.getElementById("exportBtn")
  .addEventListener("click", exportData);

document.getElementById("importBtn")
  .addEventListener("click", importData);

document.getElementById("backBtn")
  .addEventListener("click", closeDetail);

document.getElementById("colorInput")
  .addEventListener("change", (e)=>updatePreviewColor(e.target.value));

});

function updatePreviewColor(color){
document.getElementById("saveBtn").style.backgroundColor=color;
document.documentElement.style.setProperty("--accent-color",color);
}

function displayList(){
const list=getList();
const container=document.getElementById("cardList");
container.innerHTML="";
if(list.length===0){
const p=document.createElement("p");
p.style.color="#ccc";
p.style.padding="60px";
p.textContent="カードがありません";
container.appendChild(p);
return;
}
document.documentElement.style.setProperty("--accent-color",list[list.length-1].color);

list.forEach((card,index)=>{
const div=document.createElement("div");
div.className="list-item";
div.style.backgroundColor=card.color;

const nameDiv=document.createElement("div");
nameDiv.className="list-item-name";
nameDiv.style.flexGrow="1";
nameDiv.style.textAlign="left";
nameDiv.textContent=card.name;
nameDiv.addEventListener("click",()=>openDetail(index));

const del=document.createElement("button");
del.className="delete-btn-mini";
del.textContent="削除";
del.addEventListener("click",()=>deleteCard(index));

const sortBox=document.createElement("div");
sortBox.className="sort-btns";

const up=document.createElement("button");
up.className="sort-btn";
up.textContent="▲";
up.addEventListener("click",()=>moveCard(index,-1));

const down=document.createElement("button");
down.className="sort-btn";
down.textContent="▼";
down.addEventListener("click",()=>moveCard(index,1));

sortBox.append(up,down);
div.append(nameDiv,del,sortBox);
container.appendChild(div);
});
}

function addCard(){
const name=document.getElementById("nameInput").value;
const num=document.getElementById("cardInput").value.replace(/\s+/g,"");
const color=document.getElementById("colorInput").value;
if(name&&num){
const list=getList();
list.push({name,num,color});
saveList(list);
displayList();
toggleSection();
}
}

function moveCard(index,d){
const list=getList();
const n=index+d;
if(n>=0&&n<list.length){
[list[index],list[n]]=[list[n],list[index]];
saveList(list);
displayList();
}
}

function openDetail(index){
const card=getList()[index];
document.getElementById("detailHeader").style.backgroundColor=card.color;
document.getElementById("detailTitle").innerText=card.name;
document.getElementById("detailView").style.display="flex";
const format=(card.num.length===13&&/^\d+$/.test(card.num))?"EAN13":"CODE128";
JsBarcode("#barcode",card.num,{format,displayValue:true,width:2.2,height:100,fontSize:26,textMargin:12,margin:25,background:"#ffffff"});
}

function closeDetail(){
document.getElementById("detailView").style.display="none";
}

function toggleSection(id){
document.getElementById("addArea").style.display="none";
document.getElementById("backupArea").style.display="none";
if(id)document.getElementById(id).style.display="block";
}

function deleteCard(index){
if(confirm("削除しますか？")){
const list=getList();
list.splice(index,1);
saveList(list);
displayList();
}
}

function getList(){return JSON.parse(localStorage.getItem("cardList")||"[]");}
function saveList(list){localStorage.setItem("cardList",JSON.stringify(list));}
function exportData(){document.getElementById("backupText").value=localStorage.getItem("cardList");}

function importData(){
try{
const code=document.getElementById("importInput").value;
if(!code)return;
const parsed=JSON.parse(code);
if(!Array.isArray(parsed))throw new Error();
saveList(parsed);
displayList();
}catch{alert("無効なコードです");}
}
