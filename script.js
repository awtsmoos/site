//B"H
const homeLink = document.getElementById('home-link');
const videosLink = document.getElementById('playlists-link');
const postsLink = document.getElementById('posts-link');
const homeSection = document.getElementById('home');
const videosSection = document.getElementById('playlists');
const postsSection = document.getElementById('posts');

homeLink.addEventListener('click', () => {
  homeSection.classList.remove('hidden');
  videosSection.classList.add('hidden');
  postsSection.classList.add('hidden');
  homeScreen()
});

videosLink.addEventListener('click', () => {
  homeSection.classList.add('hidden');
  videosSection.classList.remove('hidden');
  postsSection.classList.add('hidden');
});

postsLink.addEventListener('click', () => {
  homeSection.classList.add('hidden');
  videosSection.classList.add('hidden');
  postsSection.classList.remove('hidden');
});

function addScript(src,cb) {
    var sc = document.createElement("script")
    sc.src = src;
    document.head.appendChild(sc)
    sc.onload = () => {
        if(typeof(cb) == "function") {
            cb(true)
        }
    }

    sc.onerror = () => {
        if(typeof(cb) == "function") {
            cb()
        }
    }
}

function addScripts(lst) {
    return new Promise((r,j) => {
        var did = 0;
        if(!lst.length) j();
        function get() {
           
            if(did >= lst.length) {
                return r(1)
            } else {

                addScript(lst[did],()=>{
                    did++;
                    get()
                })
            }
            
            
        }
        get()
    })
}

const channelId = 'UCXv28e6HXfkMQNOu8GkaSkA';

addScripts([
    "https://awtsmoos.web.app/__/firebase/9.16.0/firebase-app-compat.js",
    "https://awtsmoos.web.app/__/firebase/9.16.0/firebase-firestore-compat.js",
    "https://awtsmoos.web.app/__/firebase/init.js?useEmulator=true"
]).then(() => {
    console.log("got")
    window.db = firebase.firestore();
    getPlaylists().then(r=>console.log(w=r))
    homeScreen()
})

async function homeScreen() {
    getChannelSectionsFromFirebase(channelId)
    .then(r=>{
        var sc = r.sections;
        var it = sc.items;
        it.forEach(q=>{
            var s =document.createElement("div")
            s.className="channel-section"

            var t = document.createElement("h2")
            t.className="section-header"
            var cnt = document.createElement("div")
            cnt.className="section-content"
        })
    })
}
async function getChannelSectionsFromFirebase(channelId) {
    const channelsRef = db.collection("channels");
    const channelDoc = channelsRef.doc(channelId);
    const channelData = await channelDoc.get();
    return channelData.data().sections;

}
function getPlaylists() {
    // Initialize Firebase

  const playlistsRef = db.collection("playlists");
  
  // Get all playlists from the playlists collection
  return new Promise((r,j) => {
    var lists = [];
    var ind = 0;
    function get() {
        
    }
    
    playlistsRef
    .get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            const playlist = doc.data();
            lists.push(playlist)
      });
      return r(lists)
    })
    .catch(error => {
      console.error("Error reading playlists from Firestore: ", error);
    });
  })
  
}

function getVideos(playlistId, limit = 10, offset = 0) {
    // Get a reference to the Cloud Firestore database
    const db = firebase.firestore();

    // Get a reference to the videos collection
    const videosRef = db.collection("playlists").doc(playlistId).collection("videos");

    // Get the videos from the videos collection
    return videosRef
        .limit(limit)
        .offset(offset)
        .get()
        .then(snapshot => {
        const videos = [];
        snapshot.forEach(doc => {
            const video = doc.data();
            videos.push({
            id: doc.id,
            title: video.title,
            description: video.description
            });
        });
        return videos;
        })
        .catch(error => {
        console.error("Error reading videos from Firestore: ", error);
        });
}