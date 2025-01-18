console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function formatSecondsToMMSS(seconds) {
  // Ensure seconds is a valid number and handle negative inputs
  if (isNaN(seconds) || seconds < 0) {
      return "00:00"
  }

  // Round to the nearest whole number to handle fractional seconds
  seconds = Math.round(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
  currFolder = folder;
  let a = await fetch(`https://khushbu-github.github.io/Dhun-Music/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = [] 
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")){
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


   // Show all the songs in the playlists
   let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
   songUL.innerHTML = ""
   for (const song of songs) {
     songUL.innerHTML = songUL.innerHTML + `<li> 
                     <img class="invert" src="img/music.svg" alt="">
                     <div class="info">
                         <div>${song.replaceAll("%20", " ")}</div>
                     </div>
                     <div class="playNow">
                         <span>Play Now</span>
                         <img class="invert" src="img/play.svg" alt="">
                     </div> 
                   </li>`;
   }
   
 
   //Attaching the event listener to each song
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
     e.addEventListener("click", element => {
     playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
     })
     
   })
   return songs
}

const playMusic = (track, pause=false) => {
  currentSong.src = `/${currFolder}/` + track
  if(!pause){
   currentSong.play()
   play.src = "img/pause.svg" 
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
  let a = await fetch(`https://khushbu-github.github.io/Dhun-Music/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-2)[0]
      // Get the meta data of the folder
      let a = await fetch(`https://khushbu-github.github.io/Dhun-Music/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
              <div class="play">
                <svg height="40px" width="40px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.00 512.00" xml:space="preserve"><g><path fill="#1fdf64" d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256C512,114.625,397.374,0,256,0z"/><path fill="#000000" d="M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"/></g></svg>

              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h3>${response.title}</h3>
              <p>${response.description}</p>
            </div>`
    }
  }
   // Load the playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  })

}

async function main(){
  // get the list of all songs
  await getSongs("songs/ncs")
  playMusic(songs[0], true)

  // Display all the albums in the page
  displayAlbums()
 
  //Attach an event listener to play, next and previous
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "img/pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "img/play.svg"
    }
  })

  //Listen for timeupdate event
  currentSong.addEventListener("timeupdate", ()=>{
    document.querySelector(".songtime").innerHTML = `${formatSecondsToMMSS(currentSong.currentTime)} / ${formatSecondsToMMSS(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 + "%";
  })

  //Add an event listener to seekbar
  document.querySelector(".seekBar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent)/100  
  })

  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //Add an event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })
  
  //Add an event listener to previous and next button
  previous.addEventListener("click", ()=> {
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index-1) >= 0) {
      playMusic(songs[index-1])
    }
  })

  next.addEventListener("click", ()=> {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    if((index+1) < songs.length) {
      playMusic(songs[index+1])
    }
  })

  // Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=> {
    console.log("Setting Volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value)/100
  })
 
  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else {
    e.target.src = e.target.src.replace("mute.svg", "volume.svg")
    currentSong.volume = 0.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }


  })
 
}

main()
