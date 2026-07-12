const selectedAlbum = document.getElementById("album");
const display = document.getElementById("album-display");
const albumTitle = document.getElementById("album-title");
const albumDate = document.getElementById("album-date");
const mapContainer = document.getElementById("map");
const photosContainer = document.getElementById("photos");
const albumProfile = document.getElementById("album-profile");

selectedAlbum.addEventListener("change", displayAlbum);

const coordinates = new Map();
coordinates.set("gila", [33.435548, -108.437523]);
coordinates.set("rodman", [43.859663, -75.919576]);
const cameraStartAndEnd = new Map();
cameraStartAndEnd.set("rodman", {"start": 470, "end": 542})
cameraStartAndEnd.set("gila", {"start": 368, "end": 442})

let map = null;
let marker = null;

function displayAlbum() {

    const albumName = selectedAlbum.value;
    console.log(`Current album value: ${albumName}`);

    if (albumName !== "") {
        mapContainer.style.display = "block";
        mapContainer.classList.add("map-active");
        albumProfile.classList.add("album-profile-active");

        displayInfo(albumName);
        displayMap(albumName, coordinates);
        displayPhotos(albumName);
    } else {
        if (map) {
            map.remove();
            map = null;
            marker = null;
        }
        mapContainer.style.display = "none";
        mapContainer.classList.remove("map-active");
        albumProfile.classList.remove("album-profile-active");
        albumTitle.textContent = "";
        albumDate.textContent = "";
    }

}

function displayInfo(albumName) {
    switch (albumName) {
        case "gila":
            albumTitle.textContent = "Gila National Forest";
            albumDate.textContent = "2025.5.10-17";
            break;
        case "rodman":
            albumTitle.textContent = "Zoar Tapatree Farm";
            albumDate.textContent = "2025.7.8-26";
            break;
    }
}

function displayMap(albumName, coordinates) {
    const curr_coordinates = coordinates.get(albumName);
    if (!map) {
        map = L.map("map").setView(curr_coordinates, 8);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    } else {
        map.setView(curr_coordinates, 8);
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker(curr_coordinates).addTo(map);
}

function displayPhotos(albumName) {
    photosContainer.innerHTML = "";

    const range = cameraStartAndEnd.get(albumName);

    for (let i = range.start; i <= range.end; i++) {
        let filename = `DSCN${String(i).padStart(4, "0")}.JPG`;
        console.log(filename);
        const img = document.createElement("img");
        img.src = `images/${albumName}/${filename}`;
        img.onerror = () => img.remove();

        img.classList.add("album-photo");
        photosContainer.appendChild(img);
    }
}