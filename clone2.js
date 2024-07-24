console.log("hey");

let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }
    const minutes=Math.floor(seconds/60);
    const remainingSeconds=Math.floor(seconds%60);

    const formattedMinutes=String(minutes).padStart(2,'0');
    const formatttedSeconds=String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formatttedSeconds}`;
}
async function getSongs(folder){
    currFolder = folder;
    let a=await fetch(`/${folder}`);
    // console.log(a.text())
    let response=await a.text();
    // console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as= div.getElementsByTagName("a")
    songs=[];
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith(".mp3")){
            // console.log(element.href.split(`/${folder}/`)[1])
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    console.log(songs)

    //show all the songs in the playlist
    let songsUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songsUL.innerHTML=""

    for(const song of songs){
        songsUL.innerHTML= songsUL.innerHTML + `<li>
                            <img class="invert" src="assetsClone2/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harsh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assetsClone2/play.svg" alt="">
                            </div></li>` ;
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })


    return songs;
}

const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/webdevpro/clone2/songs/" + track)
    currentSong.src=`${currFolder}/` + track;
    if(!pause){
        currentSong.play()
        play.src="assetsClone2/pause.svg"
    }

    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songsClone2/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        console.log(e.href) 
        if (e.href.includes("/songsClone2") && !e.href.includes(".htaccess")) {
            // console.log("hi")
            let folder = e.href.split("/").slice(-2)[0]
            // console.log("hy")
            console.log(folder)
            // Get the metadata of the folder
            let a = await fetch(`songsClone2/${folder}/info.json`)
            console.log("k")
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <img src="assetsClone2/play.svg" alt="">
            </div>
            
            <img src="/www.musified.com/songsClone2/${folder}/cover.jpg" alt="hey">
            
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songsclone2/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}    


async function main(){
 

    // Get the list of all the songs
    await getSongs("songsClone2/ncs")
    playMusic(songs[0], true)

    // Display all the albums on the page
    await displayAlbums()


    // Attach an event listener to play, next and previous
    // play.addEventListener("click", () => {
    //     if (currentSong.paused) {
    //         console.log(currentSong)
    //         play.src="assetsClone2/pause.svg"
    //         currentSong.play()

    //         // console.log("j")
    //         // play.src = "img/pause.svg"
    //     }
    //     else {
    //         currentSong.pause()
    //         play.src = "img/play.svg"
    //     }
    // })


    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="assetsClone2/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="assetsClone2/play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime=((currentSong.duration)* percent)/100
    })

    //add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    // add an event listener for clossing
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // add an event listener for previous and next button
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index-1)>=0){
            playMusic(songs[index-1])
        }


    })
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1)<songs.length-1){
            playMusic(songs[index+1])
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
     // Add event listener to mute the track
     document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("assetsClone2/volume.svg")){
            e.target.src = e.target.src.replace("assetsClone2/volume.svg", "assetsClone2/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("assetsClone2/mute.svg", "assetsClone2/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
    

}
main()
