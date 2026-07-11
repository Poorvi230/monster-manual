 document.querySelector('.high-res-map').addEventListener('click', (event) =>
  {
        const mapBox = event.target.getBoundingClientRect();
        const leftPercent = ((event.clientX - mapBox.left) / mapBox.width) * 100;
        const topPercent = ((event.clientY - mapBox.top) / mapBox.height) * 100;

        alert(`left: ${leftPercent.toFixed(1)}%; top: ${topPercent.toFixed(1)}%;
  `);
    });

const infoScroll = document.getElementById('info-scroll');
const closeBtn = document.getElementById('close-btn');

const scrollTitle = document.getElementById('scroll-title');
const scrollText = document.getElementById('scroll-text');

//Lores DataBaseee
const campDatabase = { 'thalias-tree': {
    title: "Thalia's Pine Tree",
    lore: `Guarded by <span class="magic-word" data-lore= "A copper-colored dragon.">Peleus</span>. It projects a magical border. Created from the sould of <span class="magic word" data-lore="Daughter of Zeus.">Thalia Grace</span>`
},
'canoe-lake': {
      title: "The Canoe Lake",
      lore: `Home to the <span class="magic-word" data-lore="Water spirits who love to flirt and drown things.">Naiads</sapn>. A great place to relax, just don't litter(if u don't wanna drown).`
},
'combat-area': {
    title: "The Arena",
    lore: `Where demigods learn to not die. Watch out for the <span class="magic-word" data-lore="Children of the War God. Do not steal their lunch money.">Ares Cabin</span>-they treat sparring like it's a fight to death.`
},
'big-house': {
    title: "The Big House",
    lore: `Camp HQ! Inside you'll find <span class="magic-word" data-lore="The immortal camp director (he's a centaur)".>Chiron</span> playing pinochle and Mr. D heavily sighing over a diet Coke. Watch out for the leopard head.`
},
'long-island': {
    title: "Long Island Sound",
    lore: `The vast waters stretching beyond camp. Deep down, <span class="magic-word" data-lore="God of the Sea, Earthshaker, Strombringer.">Poseidon's</span> world lies. Good luck if u wanna swim.`
}
 };

 const allStars = document.querySelectorAll('.star');

 allStars.forEach(star => {
 star.addEventListener('click', (event) => {
    const clickedId = event.target.id;
    const locationInfo = campDatabase[clickedId];

    if(locationInfo) {
        scrollTitle.textContent = locationInfo.title;
        scrollText.innerHTML = locationInfo.lore;
        infoScroll.classList.remove('hidden');
    }
 });
 });
 closeBtn.addEventListener('click', () => {
    infoScroll.classList.add('hidden');
 });
