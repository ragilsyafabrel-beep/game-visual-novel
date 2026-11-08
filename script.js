const $ = id => document.getElementById(id);

const backgrounds = {
 jalan:"IMG-20261105-WA0081.jpg",
 gerbang:"IMG-20261105-WA0084.jpg",
 lorong:"IMG-20261105-WA0083.jpg",
 atap:"IMG-20261105-WA0082.jpg",
 kelas:"d796e28516610398ee6e036ab7348a35.jpg",
 sore:"86adc67ffa23a8d8eff93de4f61aedcc.jpg"
};

const characterImages = {
 Akari:"Tak berjudul83_0000-51-45_20261105215649.png",
 Renji:"Tak berjudul87_20261105215713.png",
 Haruto:"Tak berjudul86_20261105215827.png",
 Yuna:"Tak berjudul83_20261105215550.png"
};

let player="Pemain",index=0,typing=false,typeTimer=null,skipTimer=null;
let skipOn=false,historyData=[],introduced=[],currentBackground="";
let currentScene=null,paused=false,volume=.65,currentMode="save";
let choicePending=false;

const story = [
 {bg:"jalan",time:"06.45",place:"Jalan Menuju Sekolah",speaker:"Narasi",text:"Pagi itu, udara terasa cukup sejuk. Hari ini adalah hari pertamaku di sekolah baru."},
 {bg:"jalan",time:"06.45",place:"Jalan Menuju Sekolah",speaker:"Narasi",text:"Aku masih belum terbiasa dengan lingkungan ini. Semuanya terasa asing."},
 {bg:"gerbang",time:"07.00",place:"Gerbang Sekolah",speaker:"Narasi",text:"Akhirnya, aku tiba di depan gerbang sekolah."},
 {bg:"gerbang",time:"07.00",place:"Gerbang Sekolah",speaker:"Narasi",text:"Aku menarik napas panjang sebelum melangkah masuk."},
 {bg:"gerbang",time:"07.02",place:"Gerbang Sekolah",speaker:"Akari",text:"Eh? Kamu murid baru, ya?",show:["Akari"]},
 {bg:"gerbang",time:"07.02",place:"Gerbang Sekolah",speaker:"Narasi",text:"Seorang siswi menghampiriku dengan senyum ramah."},
 {bg:"gerbang",time:"07.03",place:"Gerbang Sekolah",speaker:"Akari",text:"Aku Akari. Kamu siapa?"},
 {bg:"gerbang",time:"07.03",place:"Gerbang Sekolah",speaker:"player",text:"Namaku {name}."},
 {bg:"gerbang",time:"07.04",place:"Gerbang Sekolah",speaker:"Akari",text:"Salam kenal, {name}! Kalau begitu, ayo. Aku tunjukkan ruang kelasmu."},
 {bg:"gerbang",time:"07.04",place:"Gerbang Sekolah",speaker:"player",text:"Terima kasih. Aku agak khawatir tersesat."},
 {bg:"gerbang",time:"07.05",place:"Gerbang Sekolah",speaker:"Akari",text:"Tenang saja. Aku sudah hafal sekolah ini."},
 {bg:"lorong",time:"07.10",place:"Lorong Sekolah",speaker:"Narasi",text:"Kami berjalan menyusuri lorong sekolah."},
 {bg:"lorong",time:"07.10",place:"Lorong Sekolah",speaker:"Narasi",text:"Suasana pagi cukup ramai. Beberapa murid sedang bercakap-cakap."},
 {bg:"lorong",time:"07.11",place:"Lorong Sekolah",speaker:"Renji",text:"Wah, wah. Akari membawa murid baru rupanya.",show:["Renji"]},
 {bg:"lorong",time:"07.11",place:"Lorong Sekolah",speaker:"Akari",text:"Renji, jangan mulai."},
 {bg:"lorong",time:"07.12",place:"Lorong Sekolah",speaker:"Renji",text:"Aku belum melakukan apa-apa, lho."},
 {bg:"lorong",time:"07.12",place:"Lorong Sekolah",speaker:"Renji",text:"Jadi, ini murid baru yang dibicarakan itu?"},
 {bg:"lorong",time:"07.12",place:"Lorong Sekolah",speaker:"player",text:"Sepertinya begitu."},
 {bg:"lorong",time:"07.13",place:"Lorong Sekolah",speaker:"Renji",text:"Hahaha. Jawabannya lumayan juga."},
 {bg:"lorong",time:"07.13",place:"Lorong Sekolah",speaker:"Akari",text:"Sudahlah, kita hampir terlambat."},
 {bg:"kelas",time:"07.20",place:"Ruang Kelas",speaker:"Narasi",text:"Kami akhirnya sampai di ruang kelas."},
 {bg:"kelas",time:"07.20",place:"Ruang Kelas",speaker:"Haruto",text:"Oh, kalian sudah datang. Ini murid barunya?",show:["Haruto"]},
 {bg:"kelas",time:"07.21",place:"Ruang Kelas",speaker:"Akari",text:"Iya. Namanya {name}."},
 {bg:"kelas",time:"07.21",place:"Ruang Kelas",speaker:"Haruto",text:"Salam kenal! Aku Haruto. Kalau ada yang ingin ditanyakan, jangan sungkan."},
 {bg:"kelas",time:"07.22",place:"Ruang Kelas",speaker:"player",text:"Salam kenal juga."},
 {bg:"kelas",time:"07.22",place:"Ruang Kelas",speaker:"Haruto",text:"Kamu bisa duduk di sana. Tempatnya masih kosong."},
 {bg:"kelas",time:"07.23",place:"Ruang Kelas",speaker:"Narasi",text:"Aku melihat bangku kosong di dekat jendela."},
 {bg:"kelas",time:"07.23",place:"Ruang Kelas",speaker:"Narasi",text:"Sebelum duduk, aku sempat memperhatikan suasana kelas."},
 {bg:"kelas",time:"07.24",place:"Ruang Kelas",speaker:"Yuna",text:"Hai! Kamu murid baru itu, kan?",show:["Yuna"]},
 {bg:"kelas",time:"07.24",place:"Ruang Kelas",speaker:"Yuna",text:"Aku Yuna. Senang akhirnya bisa bertemu denganmu."},
 {bg:"kelas",time:"07.25",place:"Ruang Kelas",speaker:"player",text:"Senang bertemu denganmu juga."},
 {bg:"kelas",time:"07.25",place:"Ruang Kelas",speaker:"Yuna",text:"Semoga kamu betah di sini, ya."},
 {bg:"kelas",time:"07.26",place:"Ruang Kelas",speaker:"Renji",text:"Hei, jangan lupa. Ada aku juga di kelas ini."},
 {bg:"kelas",time:"07.26",place:"Ruang Kelas",speaker:"Yuna",text:"Justru itu yang bikin suasana jadi ramai."},
 {bg:"kelas",time:"07.27",place:"Ruang Kelas",speaker:"Renji",text:"Kok aku merasa sedang disindir, ya?"},
 {bg:"kelas",time:"07.28",place:"Ruang Kelas",speaker:"Narasi",text:"Aku tidak bisa menahan senyum melihat mereka."},
 {bg:"kelas",time:"07.29",place:"Ruang Kelas",speaker:"Narasi",text:"Untuk pertama kalinya sejak pagi, suasana terasa sedikit lebih nyaman."},
 {bg:"kelas",time:"07.30",place:"Ruang Kelas",speaker:"Haruto",text:"Oh iya, {name}. Nanti saat istirahat, mau ikut kami?"},
 {bg:"kelas",time:"07.30",place:"Ruang Kelas",speaker:"Narasi",text:"Aku berpikir sebentar.",choice:true,choices:[
  {text:"Tentu, aku ikut.",response:"Haruto tersenyum senang. Sepertinya mereka memang cukup ramah."},
  {text:"Boleh, tapi aku mungkin agak canggung.",response:"Akari mengangguk. Ia berkata bahwa aku tidak perlu terburu-buru."}
 ]},
 {bg:"kelas",time:"07.31",place:"Ruang Kelas",speaker:"Narasi",text:"Bel pelajaran akhirnya berbunyi.",sound:"bell"},
 {bg:"kelas",time:"07.31",place:"Ruang Kelas",speaker:"Akari",text:"Sepertinya pelajaran akan segera dimulai."},
 {bg:"kelas",time:"07.32",place:"Ruang Kelas",speaker:"Renji",text:"Yah, padahal aku baru mau mengobrol lebih banyak."},
 {bg:"kelas",time:"07.32",place:"Ruang Kelas",speaker:"Yuna",text:"Nanti saat istirahat saja."},
 {bg:"kelas",time:"09.45",place:"Ruang Kelas",speaker:"Narasi",text:"Beberapa jam berlalu. Pelajaran pagi terasa cukup panjang."},
 {bg:"lorong",time:"10.00",place:"Lorong Sekolah",speaker:"Narasi",text:"Saat istirahat, aku keluar kelas bersama mereka."},
 {bg:"lorong",time:"10.01",place:"Lorong Sekolah",speaker:"Haruto",text:"Bagaimana? Sudah mulai terbiasa dengan kelas ini?"},
 {bg:"lorong",time:"10.01",place:"Lorong Sekolah",speaker:"player",text:"Lumayan. Kalian semua cukup mudah diajak bicara."},
 {bg:"lorong",time:"10.02",place:"Lorong Sekolah",speaker:"Renji",text:"Tentu saja. Kami ini orang-orang yang luar biasa."},
 {bg:"lorong",time:"10.02",place:"Lorong Sekolah",speaker:"Yuna",text:"Jangan terlalu percaya diri."},
 {bg:"lorong",time:"10.03",place:"Lorong Sekolah",speaker:"Akari",text:"Hahaha. Kalian tidak pernah berubah."},
 {bg:"kelas",time:"11.45",place:"Ruang Kelas",speaker:"Narasi",text:"Setelah istirahat, pelajaran kembali dimulai."},
 {bg:"kelas",time:"12.30",place:"Ruang Kelas",speaker:"Narasi",text:"Hari semakin siang. Aku mulai merasa lebih nyaman berada di kelas ini."},
 {bg:"kelas",time:"13.00",place:"Ruang Kelas",speaker:"Haruto",text:"Kalau ada tugas yang belum kamu pahami, nanti kita bisa belajar bersama."},
 {bg:"kelas",time:"13.01",place:"Ruang Kelas",speaker:"player",text:"Wah, terima kasih. Itu akan sangat membantu."},
 {bg:"kelas",time:"13.02",place:"Ruang Kelas",speaker:"Haruto",text:"Tidak masalah."},
 {bg:"kelas",time:"14.00",place:"Ruang Kelas",speaker:"Narasi",text:"Bel pulang akhirnya terdengar."},
 {bg:"kelas",time:"14.00",place:"Ruang Kelas",speaker:"Yuna",text:"Akhirnya selesai juga!"},
 {bg:"kelas",time:"14.01",place:"Ruang Kelas",speaker:"Renji",text:"Hari ini rasanya panjang sekali."},
 {bg:"kelas",time:"14.01",place:"Ruang Kelas",speaker:"Akari",text:"Kamu mau langsung pulang, {name}?"},
 {bg:"kelas",time:"14.02",place:"Ruang Kelas",speaker:"player",text:"Sepertinya aku ingin melihat-lihat sekolah sebentar."},
 {bg:"atap",time:"14.15",place:"Atap Sekolah",speaker:"Narasi",text:"Aku berjalan menuju atap sekolah untuk mencari udara segar.",ambience:"wind"},
 {bg:"atap",time:"14.16",place:"Atap Sekolah",speaker:"Narasi",text:"Dari sini, suasana sekolah terlihat cukup tenang."},
 {bg:"atap",time:"14.17",place:"Atap Sekolah",speaker:"Akari",text:"Oh, ternyata kamu di sini."},
 {bg:"atap",time:"14.17",place:"Atap Sekolah",speaker:"player",text:"Aku hanya ingin mencari udara segar."},
 {bg:"atap",time:"14.18",place:"Atap Sekolah",speaker:"Akari",text:"Aku mengerti. Hari pertama memang bisa terasa melelahkan."},
 {bg:"atap",time:"14.19",place:"Atap Sekolah",speaker:"Haruto",text:"Kami mencarimu tadi. Ternyata kamu di sini."},
 {bg:"atap",time:"14.19",place:"Atap Sekolah",speaker:"Renji",text:"Jangan-jangan kamu sengaja kabur dari kami."},
 {bg:"atap",time:"14.20",place:"Atap Sekolah",speaker:"Yuna",text:"Renji, jangan asal bicara."},
 {bg:"atap",time:"14.21",place:"Atap Sekolah",speaker:"Narasi",text:"Mereka berdiri di dekatku. Entah kenapa, keberadaan mereka membuatku merasa tidak terlalu sendirian."},
 {bg:"atap",time:"14.22",place:"Atap Sekolah",speaker:"Haruto",text:"Besok kita bertemu lagi, ya, {name}."},
 {bg:"atap",time:"14.22",place:"Atap Sekolah",speaker:"Akari",text:"Sampai besok!"},
 {bg:"atap",time:"14.23",place:"Atap Sekolah",speaker:"Narasi",text:"Aku mengangguk kecil."},
 {bg:"sore",time:"15.00",place:"Lingkungan Sekolah",speaker:"Narasi",text:"Matahari mulai turun. Hari pertamaku di sekolah baru akhirnya berakhir."},
 {bg:"sore",time:"15.05",place:"Lingkungan Sekolah",speaker:"Narasi",text:"Aku memandang langit sore dan tersenyum kecil."},
 {bg:"sore",time:"15.10",place:"Lingkungan Sekolah",speaker:"Narasi",text:"Mungkin, tempat ini bisa menjadi awal yang baru bagiku."}
];

function showScreen(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 $(id).classList.add("active");
 $("ending").style.display="none";
}
function hideScreens(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
}
function startNewGame(){
 showScreen("nameScreen");
 $("nameInput").value="";
}
function beginStory(){
 player=$("nameInput").value.trim()||"Pemain";
 index=0;historyData=[];introduced=[];currentBackground="";
 hideScreens();$("ending").style.display="none";
 $("topbar").style.display="flex";$("dialogueArea").style.display="block";
 paused=false;stopSkip();playLine();
}
function setBackground(bg){
 if(!bg||currentBackground===bg)return;
 currentBackground=bg;
 $("shade").style.opacity="1";
 setTimeout(()=>{
  $("background").src=backgrounds[bg]||"";
  $("shade").style.opacity="0";
  updateAmbience(bg);
 },430);
}
function updateAmbience(bg){
 stopAmbience();
 if(bg==="atap")playAudio("windAudio");
 if(["lorong","gerbang","kelas"].includes(bg))playAudio("schoolAudio");
}
function stopAmbience(){
 ["windAudio","schoolAudio"].forEach(id=>{
  $(id).pause();$(id).currentTime=0;
 });
}
function playAudio(id){
 const a=$(id);a.volume=volume;a.play().catch(()=>{});
}
function changeVolume(v){
 volume=Number(v)/100;
 document.querySelectorAll("audio").forEach(a=>a.volume=volume);
}
function renderCharacters(scene){
 $("characters").innerHTML="";
 if(scene.show)scene.show.forEach(n=>{if(!introduced.includes(n))introduced.push(n)});
 const sides={Akari:"left-1",Renji:"right-1",Haruto:"left-2",Yuna:"right-2"};
 introduced.forEach(name=>{
  const img=document.createElement("img");
  img.src=characterImages[name];img.alt=name;
  img.className="character char-"+sides[name]+" "+(scene.speaker===name?"bright":"dim");
  $("characters").appendChild(img);
 });
}
function displayName(s){return s==="player"?player:s}
function playLine(){
 if(index>=story.length){finishStory();return}
 const scene=story[index];currentScene=scene;choicePending=false;
 $("sceneInfo").textContent=scene.time+" — "+scene.place;
 setBackground(scene.bg);renderCharacters(scene);
 $("speaker").textContent=displayName(scene.speaker);
 $("choices").style.display="none";$("choices").innerHTML="";
 const text=scene.text.replaceAll("{name}",player);
 $("dialogueText").textContent="";$("dialogueBox").scrollTop=0;
 if(scene.sound==="bell")playAudio("bellAudio");
 let i=0;typing=true;
 $("typingAudio").volume=volume;
 $("typingAudio").play().catch(()=>{});
 clearInterval(typeTimer);
 typeTimer=setInterval(()=>{
  if(paused)return;
  $("dialogueText").textContent+=text.charAt(i++);
  if(i>=text.length)finishTyping(scene);
 },skipOn?1:28);
}
function finishTyping(scene){
 clearInterval(typeTimer);typing=false;
 $("typingAudio").pause();$("typingAudio").currentTime=0;
 $("dialogueText").textContent=scene.text.replaceAll("{name}",player);
 if(scene.choice){stopSkip();showChoices(scene)}
 else if(skipOn)scheduleSkip();
}
function advanceDialogue(){
 if(paused||$("ending").style.display==="flex"||document.querySelector(".screen.active"))return;
 playAudio("tapAudio");
 if(typing){clearInterval(typeTimer);finishTyping(currentScene);return}
 if(choicePending)return;
 addHistory();index++;playLine();
}
function addHistory(){
 if(!currentScene)return;
 historyData.push({name:displayName(currentScene.speaker),text:currentScene.text.replaceAll("{name}",player)});
}
function showChoices(scene){
 choicePending=true;const area=$("choices");
 area.innerHTML="";area.style.display="flex";
 scene.choices.forEach(choice=>{
  const btn=document.createElement("button");btn.textContent=choice.text;
  btn.onclick=()=>{
   addHistory();choicePending=false;stopSkip();
   $("dialogueText").textContent=choice.response;
   area.style.display="none";
   currentScene={speaker:"Narasi",text:choice.response};
   $("speaker").textContent="Narasi";
   $("characters").querySelectorAll(".character").forEach(c=>c.className="character dim");
   setTimeout(()=>{index++;playLine()},1200);
  };
  area.appendChild(btn);
 });
}
function toggleSkip(){
 if(paused||choicePending)return;
 skipOn=!skipOn;
 $("skipButton").textContent=skipOn?"SKIP: ON":"SKIP: OFF";
 if(skipOn){
  if(typing){clearInterval(typeTimer);finishTyping(currentScene)}
  else scheduleSkip();
 }else clearTimeout(skipTimer);
}
function scheduleSkip(){
 clearTimeout(skipTimer);
 if(!skipOn||paused||choicePending)return;
 skipTimer=setTimeout(()=>{
  if(!skipOn||paused||choicePending)return;
  addHistory();index++;playLine();
 },150);
}
function stopSkip(){
 skipOn=false;clearTimeout(skipTimer);
 $("skipButton").textContent="SKIP: OFF";
}
function togglePause(){
 if(paused){resumeGame();return}
 paused=true;clearInterval(typeTimer);clearTimeout(skipTimer);
 $("typingAudio").pause();showScreen("pauseScreen");
}
function resumeGame(){
 hideScreens();paused=false;
 $("topbar").style.display="flex";$("dialogueArea").style.display="block";
 if(typing)playLine();else if(skipOn)scheduleSkip();
}
function openHistory(){
 if(typing){clearInterval(typeTimer);finishTyping(currentScene)}
 paused=true;clearTimeout(skipTimer);
 const list=$("historyList");list.innerHTML="";
 historyData.slice().reverse().forEach(item=>{
  const div=document.createElement("div");div.className="history-item";
  div.innerHTML="<b>"+escapeHTML(item.name)+"</b><br>"+escapeHTML(item.text);
  list.appendChild(div);
 });
 if(!historyData.length)list.textContent="Belum ada percakapan.";
 showScreen("historyScreen");
}
function closeHistory(){
 hideScreens();paused=false;
 $("topbar").style.display="flex";$("dialogueArea").style.display="block";
 if(skipOn)scheduleSkip();
}
function openSave(){
 currentMode="save";$("saveTitle").textContent="SAVE GAME";
 renderSlots();paused=true;clearTimeout(skipTimer);showScreen("saveScreen");
}
function openLoad(){
 currentMode="load";$("saveTitle").textContent="LOAD GAME";
 renderSlots();showScreen("saveScreen");
}
function closeSave(){
 if(!currentScene){showScreen("titleScreen");return}
 hideScreens();paused=false;
 $("topbar").style.display="flex";$("dialogueArea").style.display="block";
 if(skipOn)scheduleSkip();
}
function renderSlots(){
 const box=$("saveSlots");box.innerHTML="";
 for(let i=1;i<=5;i++){
  const raw=localStorage.getItem("haribaru_slot_"+i);
  const btn=document.createElement("button");btn.className="slot";
  if(raw){
   const data=JSON.parse(raw);
   const img=document.createElement("img");img.src=data.background||"";
   const info=document.createElement("div");info.className="slot-info";
   info.innerHTML="<b>Slot "+i+"</b><br>"+escapeHTML(data.player)+" — Adegan "+(data.index+1);
   btn.append(img,info);
  }else btn.textContent="Slot "+i+" — Kosong";
  btn.onclick=()=>useSlot(i);box.appendChild(btn);
 }
}
function useSlot(slot){
 const key="haribaru_slot_"+slot;
 if(currentMode==="save"){
  if(!currentScene){alert("Mulai cerita terlebih dahulu.");return}
  const data={player,index,background:backgrounds[currentBackground],historyData,introduced,currentBackground};
  localStorage.setItem(key,JSON.stringify(data));
  alert("Game berhasil disimpan di Slot "+slot+"!");
  renderSlots();return;
 }
 const raw=localStorage.getItem(key);
 if(!raw){alert("Slot ini masih kosong.");return}
 const data=JSON.parse(raw);
 player=data.player;index=data.index;historyData=data.historyData||[];
 introduced=data.introduced||[];currentBackground="";
 paused=false;stopSkip();hideScreens();
 $("ending").style.display="none";
 $("topbar").style.display="flex";$("dialogueArea").style.display="block";
 playLine();
}
function openSettings(){
 $("volumeControl").value=volume*100;showScreen("settingsScreen");
}
function closeSettings(){showScreen("pauseScreen")}
function openGallery(){
 if(localStorage.getItem("haribaru_finished")!=="yes"){alert("Selesaikan cerita terlebih dahulu.");return}
 hideScreens();$("ending").style.display="none";
 $("galleryScreen").classList.add("active");
}
function closeGallery(){
 hideScreens();$("ending").style.display="flex";
}
function returnToTitle(){
 clearInterval(typeTimer);clearTimeout(skipTimer);stopSkip();stopAmbience();
 $("typingAudio").pause();paused=false;typing=false;currentScene=null;
 index=0;currentBackground="";choicePending=false;
 hideScreens();$("ending").style.display="none";
 $("topbar").style.display="none";$("dialogueArea").style.display="none";
 $("characters").innerHTML="";$("background").src="";
 $("titleScreen").classList.add("active");
}
function finishStory(){
 clearInterval(typeTimer);clearTimeout(skipTimer);typing=false;paused=false;
 stopSkip();stopAmbience();$("typingAudio").pause();
 localStorage.setItem("haribaru_finished","yes");
 $("topbar").style.display="none";$("dialogueArea").style.display="none";
 $("characters").innerHTML="";hideScreens();
 $("shade").style.opacity="1";
 setTimeout(()=>{
  $("ending").style.display="flex";$("shade").style.opacity="0";
 },500);
}
function escapeHTML(text){
 return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden){$("typingAudio").pause();stopAmbience()}
});
