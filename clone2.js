let currentSong = new Audio();
let songs = [];
let currFolder = '';

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder, albumSongs) {
    currFolder = folder;
    songs = albumSongs.map(song => song);

    console.log(songs);

    // Show all the songs in the playlist
    let songsUL = document.querySelector(".songList ul");
    songsUL.innerHTML = "";

    for (const song of songs) {
        let songName = song.split('/').pop();
        songsUL.innerHTML += `<li>
                                <img class="invert" src="assetsClone2/music.svg" alt="">
                                <div class="info">
                                    <div>${songName.replaceAll("%20", " ")}</div>
                                    <div>Harsh</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="assetsClone2/play.svg" alt="">
                                </div></li>`;
    }

    // Attach event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "assetsClone2/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    console.log("displaying albums");
    let response = await fetch('songsList.json');
    let data = await response.json();
    let albums = data.albums;
    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = "";
    for (let album of albums) {
        let folder = album.folder;
        cardContainer.innerHTML += `<div data-folder="${folder}" class="card" data-songs='${JSON.stringify(album.songs)}'>
            <img src="songsClone2/${folder}/${album.cover}" alt="cover">
            <h2>${album.title}</h2>
            <p>${album.description}</p>
        </div>`;
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            let folder = item.currentTarget.dataset.folder;
            let albumSongs = JSON.parse(item.currentTarget.dataset.songs);
            songs = await getSongs(`songsClone2/${folder}`, albumSongs);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    // Display all the albums on the page
    await displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assetsClone2/pause.svg";
        } else {
            currentSong.pause();
            play.src = "assetsClone2/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(decodeURI(currentTrack));
        if ((index - 1) >= 0) {
            setTimeout(() => playMusic(songs[index - 1]), 200);
        } else {
            setTimeout(() => playMusic(songs[songs.length - 1]), 200);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(decodeURI(currentTrack));
        if ((index + 1) < songs.length) {
            setTimeout(() => playMusic(songs[index + 1]), 200);
        } else {
            setTimeout(() => playMusic(songs[0]), 200);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = "assetsClone2/volume.svg";
        }
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("assetsClone2/volume.svg")) {
            e.target.src = "assetsClone2/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = "assetsClone2/volume.svg";
            currentSong.volume = 0.10;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
