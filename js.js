function quiz(opt){

    const tpl = `
<div id="kerdesek">
   
    <span  id="kerdes" ></span>
    <div class="valaszok" id="valasz">
        <span class="quiz_valasz" id="valasz1" ></span>
        <span class="quiz_valasz" id="valasz2" ></span>
        <span class="quiz_valasz" id="valasz3" ></span>
    </div>
    <div class="top-layer"></div>
    <button id="tovabb_btn">Következő</button>
    <button id="osszesit_btn">Összesít</button>
    
    
    <div class="eredmeny">
        <div id="helyes"></div>
        <div id="helytelen"></div>
    </div>
    <div id="stopper">00:00:00:00</div>
</div>
`



let parentElement = document.querySelector(opt.parentElement);
let start = document.querySelector('#kezdes_btn');
let valasz = document.querySelector('#valasz');
let ujra = document.querySelector('#ujra');
let osszesitesSzoveg = document.querySelector('#osszesites');
let kerdes;
let topLayer;
let helyes;
let helytelen;
let stopper;
let selected;
let quizValaszok;
let tovabb;
let osszesit;

let element;
let i = 0;

const kezdes = () => {  //kezdő body létrehozása
    osszesitesSzoveg.style.display='none';
    const div = document.querySelector('div');
    div.innerHTML = tpl;

    element = div.firstElementChild;

   parentElement.appendChild(element);  
};

function quiz () {  //quiz lehetséges válaszainak megjelenítése
    let text;
    quizValaszok = document.querySelectorAll(".quiz_valasz");
     for(let valasz of quizValaszok){
         text = valasz.id;
         let elem = opt.answers[i]
         valasz.innerHTML = elem[text];
     }
}

function kerdesFunc (){ //kérdések betöltése
    kerdes = document.querySelector('#kerdes');  
    kerdes.innerText = opt.questions[i].kerdes;
}

//Stopper funkció: Elindítás:
const startClock = () => { 

    stopper = document.querySelector("#stopper");
    let  date = timerId = null;
    date = Date.now() + (1000 * 60 * 60);
    const twoDigit = n => n < 10 ? '0' + n : '' + n;

    if(timerId == null){
        if(date == null)
            date = Date.now() + (1000 * 60 * 60);
    }
    
    timerId = setInterval( () => { 
        const d = new Date();
        d.setTime( d.getTime() - date )

        stopper.textContent = `
            ${twoDigit(d.getHours())}:
            ${twoDigit(d.getMinutes())}:
            ${twoDigit(d.getSeconds())}:
            ${twoDigit(Math.floor(d.getMilliseconds()/10))}
        `
    }, 10);
}

//stopper leállításának függévnye:
const stopClock = () => {
    clearInterval(timerId);
    timerId = null;
};


//select beállítása
const selectFunc = () => {
    for(let valasz of quizValaszok){
        valasz.addEventListener('click', function(){
            selected = document.querySelectorAll(".selected");

            quizValaszok.forEach((element) => {
                element.classList.remove("selected");
            })
            
            valasz.classList.add("selected");
              
        })
    }
    
}

//helyes válasz ellenőrzése, késleltetve a jó megmutatása
function checkFunc (){
    selected = document.querySelector('.selected');
    if(selected){        
        if(selected.innerText == opt.questions[i].valasz){
           helyes.innerText = Number(helyes.innerText)+1;
           selected.classList.add('jo')
        }
        else{
            helytelen.innerText = Number(helytelen.innerText)+1;
            selected.classList.add("rossz")
            
            quizValaszok = document.querySelectorAll(".quiz_valasz");
              
            for(let jo of quizValaszok){
                if(jo.innerText == opt.questions[i].valasz){
                    jo.classList.add("jolenne")
                }
            }
        }
    }
    document.querySelector('.top-layer').style.display = 'block';
}


//játék továbbléptetése:
function nextClick (){
    tovabb = document.querySelector('#tovabb_btn');
    
    selectFunc();
  
    tovabb.addEventListener('click', function(){

        selected = document.querySelector(".selected");
        if(selected){
            kerdesFunc();
            quiz();
            checkFunc();
            delay();

            if( i == kerdesek.length -2){
                osszesit= document.querySelector("#osszesit_btn");
                tovabb.style.display = "none";
                osszesit.style.display = "block"
            }  
        }
    })

}

function delay(){
    setTimeout(function(){ //késleltés beállítása

        if( i < opt.questions.length -1){
        kerdes.innerText = opt.questions[++i].kerdes;
        }
        selected = document.querySelectorAll(".selected");
        quizValaszok = document.querySelectorAll(".quiz_valasz");
        quizValaszok.forEach((element) => {
            element.classList.remove("rossz");
            element.classList.remove("jo");
            element.classList.remove("jolenne");
            element.classList.remove("selected");
       
        })
        quiz(); 
        document.querySelector('.top-layer').style.display = 'none';
    },2000)
}

function vegeFunc (){
    osszesit= document.querySelector("#osszesit_btn");
    osszesit.addEventListener('click', function(){
        selectFunc()
        checkFunc()
        
        setTimeout(function(){ //késleltés beállítása
                  
            stop();
            content.removeChild(element);
            osszesitesSzoveg.style.display='flex';
            osszesitesSzoveg.style.flexDirection = "column";
            osszesitesSzoveg.style.alignItems = "center";
            osszesitesSzoveg.style.justifyContent ="center"
    
            ujra.style.display = "inline-block";
            osszesitesSzoveg.innerHTML =`
            A ${kerdesek.length} kérdésekből összesen
             ${helyes.innerText} helyes          
             ${helytelen.innerText} a helytelen válasz!
            `  
        
        },2000)
        
    })
}

//játék elkezdése
start.addEventListener('click', function(){
    start.style.display = 'none';


    kezdes();
    kerdesFunc();
    quiz();
    
    helyes = document.querySelector('#helyes');
    helyes.innerText = 0;
    helytelen = document.querySelector("#helytelen");
    helytelen.innerText = 0;

    startClock();

    selectFunc();

    nextClick();

    vegeFunc();
    
})

ujra.addEventListener('click', function(){
    location.reload();
})


}