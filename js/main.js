// vogelle - a daily game in progress

let birdNames = []
let bird;
let birds = [];

let guessAmount = 0
let maxGuessAmount = 6

let streak_amount = 0

// amount of birds in the database sorted from most popular 
// min 1 max 344
let difficultyNumber = 25

async function fetchData(){
    difficultyNumber = await parseInt(document.getElementById("diffForm").value);

    const response = await fetch('json/birds.json');
    const data = await response.json();
    birds = await data.birds

    let randomNumber;

    if (streak_amount>0){
        randomNumber = Math.floor(Math.random() * difficultyNumber);

    } else {
        randomNumber = rdmBirdDay(difficultyNumber);
    }

    bird = data.birds[randomNumber];

    console.log(data.birds[randomNumber]);

    let title = "?".repeat(bird.name.length)

    document.getElementById("title").innerHTML = title;
    //    document.getElementById("title").innerHTML = bird.name;
    document.getElementById("birdImage").src = bird.img_link;
    //    document.getElementById("birdSound").src = await bird.sound_link;


    let myContainer = document.getElementById("container");
    let audioEl = document.createElement("audio");
    audioEl.controls = ""
    let sourceEl = document.createElement("source");
    sourceEl.src = await bird.sound_link;
    sourceEl.type = "audio/mpeg";
    await audioEl.appendChild(sourceEl);
    await myContainer.appendChild(audioEl);

    document.getElementById("bird_link").href =  bird.page_link;

    for (let i = 0; i < difficultyNumber; i++) {
        birdNames[i] = data.birds[i].name

        //tempArray.push(await insertGroup(i));

        //        data.birds[i]["bird_length"] = await scrapeData(data.birds[i].page_link, "l");
        //        data.birds[i]["sound_link"] = await scrapeData(data.birds[i].page_link, "s");
        //        console.log(data.birds);
    }
    //console.log(data.birds[0].bird_group);
    //    setTimeout(function(){console.log(data.birds)},5000);
    (streak_amount > 0) ? document.getElementById("streak").innerHTML = streak_amount + "🔥": document.getElementById("streak").innerHTML = "";

    document.getElementsByClassName("win_container")[0].style.display = 'none'

//    retrieveProgress();


}
fetchData();

function nextRound(){
    document.getElementById("myInput").parentElement.parentElement.style.display = "";
    document.getElementById("subCont").innerHTML = "";
    document.getElementById("birdImage").style.filter = "";
    fetchData();
}

function difficultyChange(){
    let choice = parseInt(document.getElementById("diffForm").value);
    if (choice != difficultyNumber) {
        streak_amount = 0;
        nextRound();
    }

    console.log("changed!" + choice);

}

function birdSound(){
    console.log("test");
    var audio = new Audio(bird.sound_link);
    audio.play();
}

function checkAnswer(answer = document.getElementById("myInput").value){
    //    let answer = document.getElementById("myInput").value
    let validAnswer;
    console.log("S:",answer,"A:",bird.name);

    if(answer == bird.name){
        console.log("right answer🎉");
        //disable form
        document.getElementById("myInput").value = "";
        document.getElementById("myInput").parentElement.parentElement.style.display = "none";
        document.getElementsByClassName("win_container")[0].style.display = ''
        streak_amount++
        //animation
        //make everything visible

        guessRevealer(1);

        //submit answer
        let subCont = document.getElementById("subCont");
        let newStroke = document.createElement("div");
        newStroke.classList.add("submission_stroke");

        //Bird image 🐦
        let imgTile = document.createElement("div");
        imgTile.classList.add("submission_tile");
        imgTile.classList.add("submission_tile_g");
        let imgTileImg = document.createElement("img");
        imgTileImg.src = bird.img_link;

        imgTile.appendChild(imgTileImg);

        //Bird Length 📏📏📏
        let lengthTile = document.createElement("div");
        lengthTile.classList.add("submission_tile");
        let lengthTileArrow = document.createElement("div");
        let lengthTileText = document.createElement("h4");

        lengthTileArrow.classList.add("circle");
        lengthTile.classList.add("submission_tile_g");
        lengthTileText.innerHTML = "📏 <br>" + bird.bird_length;

        lengthTile.appendChild(lengthTileArrow);
        lengthTile.appendChild(lengthTileText);


        //Bird group 🌭🍟
        let groupTile = document.createElement("div");
        groupTile.classList.add("submission_tile");
        let groupTileUl = document.createElement("ul");

        let goodGroup = 0;

        for(let i = 0; i < bird.bird_group.length; i++){
            let tempLi = document.createElement("li");
            tempLi.innerHTML = bird.bird_group[i];

            if ( -1 < bird.bird_group.indexOf(bird.bird_group[i])){
                goodGroup++;
            } else {
                tempLi.classList.add("wrong");
            }
            groupTileUl.appendChild(tempLi);
        }

        groupTile.classList.add("submission_tile_g");


        groupTile.appendChild(groupTileUl);


        newStroke.appendChild(imgTile);
        newStroke.appendChild(lengthTile);
        newStroke.appendChild(groupTile);
        //subCont.appendChild(newStroke);

        subCont.insertBefore(newStroke, subCont.firstChild);

        let newName = document.createElement("h3");
        newName.innerHTML = bird.name;

        subCont.insertBefore(newName, subCont.firstChild);

//        storeProgress(bird.id);


    } else {
        //check if the submitted answer is a valid answer
        for (let i = 0; i < birdNames.length; i++) {
            if(birdNames[i] == answer){
                // valid answer
                console.log("Wrong answer");
                validAnswer = true;
                guessAmount++;
                guessRevealer(0);

                document.getElementById("myInput").value = "";

                // check length difference
                let lengthDiff = parseFloat(birds[i].bird_length)/parseFloat(bird.bird_length);

                if(lengthDiff > 1.5){
                    console.log(birds[i].bird_length, "🔽", "🔴");
                } else if (lengthDiff > 1.1){
                    console.log(birds[i].bird_length, "🔽", "🟠");
                } else if (lengthDiff < 0.5){
                    console.log(birds[i].bird_length, "🔼", "🔴");
                }else if (lengthDiff < 0.9){
                    console.log(birds[i].bird_length, "🔼", "🟠");
                }  else {
                    console.log(birds[i].bird_length, "🟩");
                }

                //                console.log(bird.bird_length);

                // check group difference
                //console.log(birds[i].bird_group);
                //console.log(bird.bird_group);
                //
                for(let j = 0; j < birds[i].bird_group.length; j++){
                    //birds[i].bird_group[j]
                    if ( -1 < bird.bird_group.indexOf(birds[i].bird_group[j])){
                        console.log(birds[i].bird_group[j], "🟩")
                    } else {
                        console.log(birds[i].bird_group[j], "🔴")
                    }
                }

                document.getElementById("birdImage").style.filter = "none"

                let subCont = document.getElementById("subCont");
                let newStroke = document.createElement("div");
                newStroke.classList.add("submission_stroke");

                //Bird image 🐦
                let imgTile = document.createElement("div");
                imgTile.classList.add("submission_tile");
                imgTile.classList.add("submission_tile_b");
                let imgTileImg = document.createElement("img");
                imgTileImg.src = birds[i].img_link;

                imgTile.appendChild(imgTileImg);

                //Bird Length 📏📏📏
                let lengthTile = document.createElement("div");
                lengthTile.classList.add("submission_tile");
                let lengthTileArrow = document.createElement("div");

                let lengthTileText = document.createElement("h4");

                if(lengthDiff > 1.5){
                    lengthTileArrow.classList.add("arrow", "down");
                    lengthTileText.innerHTML = birds[i].bird_length + " 📏";

                } else if (lengthDiff > 1.1){
                    lengthTileArrow.classList.add("arrow", "down_o");
                    lengthTile.classList.add("submission_tile_o");
                    lengthTileText.innerHTML = birds[i].bird_length + " 📏";

                } else if (lengthDiff < 0.5){
                    lengthTileArrow.classList.add("arrow", "up");               
                    lengthTileText.innerHTML = "📏 <br>" + birds[i].bird_length;

                }else if (lengthDiff < 0.9){
                    lengthTileArrow.classList.add("arrow", "up_o");
                    lengthTile.classList.add("submission_tile_o");
                    lengthTileText.innerHTML = "📏 <br>" + birds[i].bird_length;

                }  else {
                    lengthTileArrow.classList.add("circle");
                    lengthTile.classList.add("submission_tile_g");
                    lengthTileText.innerHTML = "📏 <br>" + birds[i].bird_length;
                }



                lengthTile.appendChild(lengthTileArrow);
                lengthTile.appendChild(lengthTileText);


                //Bird group 🌭🍟
                let groupTile = document.createElement("div");
                groupTile.classList.add("submission_tile");
                let groupTileUl = document.createElement("ul");

                let goodGroup = 0;

                for(let j = 0; j < birds[i].bird_group.length; j++){
                    let tempLi = document.createElement("li");
                    tempLi.innerHTML = birds[i].bird_group[j];

                    if ( -1 < bird.bird_group.indexOf(birds[i].bird_group[j])){
                        goodGroup++;
                    } else {
                        tempLi.classList.add("wrong");
                    }
                    groupTileUl.appendChild(tempLi);
                }

                if (goodGroup == birds[i].bird_group.length) {
                    groupTile.classList.add("submission_tile_g");

                } else if(goodGroup>0) {
                    groupTile.classList.add("submission_tile_o");
                }
                groupTile.appendChild(groupTileUl);


                newStroke.appendChild(imgTile);
                newStroke.appendChild(lengthTile);
                newStroke.appendChild(groupTile);
                //subCont.appendChild(newStroke);

                subCont.insertBefore(newStroke, subCont.firstChild);

                let newName = document.createElement("h3");
                newName.innerHTML = birds[i].name;

                subCont.insertBefore(newName, subCont.firstChild);

//                storeProgress(birds[i].id);


                break
            }
        }
        if(!validAnswer){
            console.log("not a valid answer");

        }
    }
}

// ## Guess reveal function
function guessRevealer(x){
    // x = 1 : reveal everything
    // x = 0 : normal reveal according to guessAmount

    document.getElementById("birdImage").style.filter = "none"

    if(x==1){
        document.getElementById("title").innerHTML = bird.name;
        guessAmount = 0;
        return
    }

    if (guessAmount>1){

        let n = Math.floor(Math.random() * bird.name.length);
        let letter = bird.name[n];

        console.log("reveal a letter!", n, letter);

        let titleNow = document.getElementById("title").innerHTML
        let titleNext = titleNow.substring(0, n) + letter + titleNow.substring(n + letter.length);


        document.getElementById("title").innerHTML = titleNext;
    }

    //#elements
    //image
    //name
    //sound
    //

}



// ## Autocomplete function

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("myInput"), birdNames);

//## data scraping:

async function scrapeData(myLink, type){
    const response = await fetch(myLink);
    const html = await response.text();
    const parser  = new DOMParser();
    const doc = parser.parseFromString(html, "text/html")

    let returnText;

    // return bird length
    if (type == "l"){
        let mytext = await doc.getElementsByClassName("text-center kleed-onderschr")[0].innerHTML;
        returnText = mytext.slice(0, mytext.search("m")+1)

    } 
    // return sound link
    else if (type == "s"){
        returnText = await doc.getElementsByClassName("geluiden list-unstyled")[0].firstElementChild.dataset.mp3;

    }
    else {
        returnText = "wrong";
    }

    //    console.log(returnText);

    return returnText
}


async function getBirds(myLink, currentPage){
    const response = await fetch(myLink);
    const html = await response.text();
    const parser  = new DOMParser();
    const doc = parser.parseFromString(html, "text/html")

    let list = await doc.getElementsByClassName("link-pijl")
    let listx = await doc.getElementsByClassName("col-md-4 col-sm-6 text-center vogel")

    let newList = [];
    for (let i = 0; i < list.length; i++) {
        newList[i] = {"id": i+(15*currentPage), "name": list[i].innerHTML, "page_link": list[i].href, "img_link": listx[i].children[0].children[0].children[1].src, "sound_link": "", "bird_length": "", "bird_group": [""], "popular_score": currentPage+1}
    }

    //    await console.log(newList);
    return await newList
}

async function birdController(){

    let linkText
    let longList = []

    for (let i = 1; i < 24; i++) {
        linkText = "https://www.vogelbescherming.nl/ontdek-vogels/kennis-over-vogels/vogelgids/?&sortorder=top&pag=" + String(i);
        let slist = await getBirds(linkText, i-1)
        longList.push(...slist);
        console.log(longList);
    }


}

async function getGroup(myLink, pageAmount){
    let newList = [];

    for (let i = 0; i < pageAmount; i++){
        const response = await fetch(myLink+String(i+1));
        const html = await response.text();
        const parser  = new DOMParser();
        const doc = parser.parseFromString(html, "text/html")

        let list = await doc.getElementsByClassName("link-pijl")

        for (let i = 0; i < list.length; i++) {
            newList.push(list[i].innerHTML)
        }
        await console.log(newList);
    }

    return await newList
}

//getGroup("https://www.vogelbescherming.nl/ontdek-vogels/kennis-over-vogels/vogelgids/?&groep=13&sortorder=titelasc&pag=", 5);

//birdController();

async function insertGroup(id){
    const response = await fetch('json/birds.json');
    const data = await response.json();

    let name = data.birds[id].name
    let groupList = []

    for (let i = 0; i < data.groups.length; i++){
        if(data.groups[i].birds.indexOf(name)>-1){
            //console.log();
            groupList.push(data.groups[i].groep);
            //data.birds[id].group

        }
    }
    //    console.log(data.birds[data.birds.bi.indexOf(name)]);
    //    console.log(groupList);
    data.birds[id].bird_group = groupList;
    console.log(data.birds[id]);

    return data.birds[id]
}

function rdmBirdDay(bird_total) {
    function rand_from_seed(x, iterations){
        iterations = iterations || 100;
        for(var i = 0; i < iterations; i++)
            x = (x ^ (x << 1) ^ (x >> 1)) % 10000;
        return x;
    }

    var random = rand_from_seed(~~((new Date)/86400000)); // Seed with the epoch day.
    let randomBirdN = parseInt(Math.round(bird_total * (random / 10000)))

    console.log(bird_total, randomBirdN);

    return randomBirdN
}

//insertGroup(0);
let progress = {
    date: "",
    e: [],
    m: [],
    h: []

}

function storeProgress(id){
    // not in endless mode
    if (streak_amount > 0){
        return
    }

    // get current difficulty
    //  append answer in the right array
    
    let myProgress = JSON.parse(localStorage.getItem("progress"));

    if (difficultyNumber < 30 && myProgress.e[myProgress.e.length-1] != id) {
        //easy
        progress.e.push(id);
    } else if (difficultyNumber < 55) {
        //medium
        progress.m.push(id);
    } else {
        //hard
        progress.h.push(id);
    }

    let progressStr = JSON.stringify(progress);
    localStorage.setItem("progress", progressStr);

    //new Date().toDateString

    //progress.toString()

    console.log(JSON.parse(localStorage.getItem("progress")));


}


//## doesnt work yet
function retrieveProgress(){
    // Check if the stored date is today
    //  check difficulty
    //  Fill with answers
    //  

    let today = new Date();

    today = today.toLocaleDateString();

    if (today == JSON.parse(localStorage.getItem("progress")).date){
        // last changed today
        //  put local storage in object
        
        progress = JSON.parse(localStorage.getItem("progress"));
        
        if (difficultyNumber < 30) {
            //easy
            console.log(progress.e);

            let myProgress = progress.e

            for (let i = 0; i < myProgress.length; i++){

                let birdId = myProgress[i];
                let myBirdName = birdNames[birdId];

                console.log(myBirdName, i);
//                checkAnswer(myBirdName);
            }


        } else if (difficultyNumber < 55) {
            //medium

        } else {
            //hard

        }

    } else {
        // last changed another day
        // empty progress
        progress.date = today;
        let progressStr = JSON.stringify(progress);
        localStorage.setItem("progress", progressStr);

    }

    //tomorrow
    //  let todayy = today
    //  todayy.setDate(today.getDate() + 1);

    console.log(today, JSON.parse(localStorage.getItem("progress")));
}





