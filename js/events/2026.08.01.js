// variables
let maxGuests = 30;
let plusOnesPending = true;

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
// import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set } from "firebase/database";
// import { text } from "node:stream/consumers";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU7BpLleFeMUxTfv99MF1xALRe7zb-eRc",
  authDomain: "zoycebean.firebaseapp.com",
  databaseURL: "https://zoycebean-default-rtdb.firebaseio.com",
  projectId: "zoycebean",
  storageBucket: "zoycebean.firebasestorage.app",
  messagingSenderId: "911572583038",
  appId: "1:911572583038:web:ee1e9f6a2bfd03ec370e2f"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let rsvpForm = document.getElementById("rsvp-form");
updateRsvpBox();

rsvpForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendRsvp();
});

async function sendRsvp() {
    var name = document.getElementById("rsvp-name").value.toLowerCase().trim();
    var rsvpPassword = document.getElementById("rsvp-password").value.toLowerCase().trim();
    var email = document.getElementById("rsvp-email").value;
    var phoneNumber = document.getElementById("rsvp-phone-number").value;
    var rsvpStatus = document.querySelector("input[name='rsvp-status']:checked").value;
    var plusOne = document.querySelector("input[name='plus-one']:checked").value;

    if (await verifyNameAndPassword(name, rsvpPassword)) {
        console.log("verified true");
        var listRef = database.ref('guests/' + name);
        listRef.set({
            password: rsvpPassword,
            email: email,
            phoneNumber: phoneNumber,
            rsvpStatus: rsvpStatus,
            plusOne: plusOne
        });
        document.getElementById("rsvp-error").innerHTML = ""
        updateRsvpBox();
    }
    else {
        console.log("verified false");
        document.getElementById("rsvp-error").innerHTML = "<p>you either entered the wrong password or someone has the same name (try adding an initial or spell it differently)<p>"
    }
};

async function verifyNameAndPassword(name, password) {
    guestList = await retrieveGuestList();
    if (guestList[3].includes(name)) {
        console.log("guest has RSVPed before")
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var fetchedData = database.ref("guests/" + name);
                fetchedData.on("value", (snapshot) => {
                    var data = snapshot.val();
                    console.log(data);
                    console.log("og password:" + data.password);
                    if (data.password) {
                        if (data.password == password) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        reject(false);
                    }
                })

            }, 2000)
        })
    } else {
        return true;
    }
}

async function updateRsvpBox() {
    document.getElementById("rsvp-form-box").style.display = "none";
    document.getElementById("rsvp-max-guests-text").style.display = "none";

    guestList = await retrieveGuestList();
    var yesGuests = guestList[0];
    var noGuests = guestList[1];
    var maybeGuests = guestList[2];

    if (yesGuests.length >= maxGuests) { // reached max guests
        document.getElementById("rsvp-max-guests-text").style.display = "block";
    } else { // 
        document.getElementById("rsvp-form-box").style.display = "block";
    }

    const guestCountText = document.getElementById("rsvp-remaining-count");
    guestCountText.textContent = (maxGuests - yesGuests.length) + "/" + maxGuests + " spots remain";

    document.getElementById("rsvp-yes-guests-div").innerHTML = "<p><u>yes</u></p>" + buildHtmlFromGuestList(yesGuests);
    document.getElementById("rsvp-no-guests-div").innerHTML = "<p><u>no</u></p>" + buildHtmlFromGuestList(noGuests);
    document.getElementById("rsvp-maybe-guests-div").innerHTML = "<p><u>maybe</u></p>" + buildHtmlFromGuestList(maybeGuests);
}

function retrieveGuestList() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var fetchedData = database.ref("guests/");
            fetchedData.on("value", (snapshot) => {
                var yesGuests = [];
                var maybeGuests = [];
                var noGuests = [];
                var allGuests = [];
                var data = snapshot.val();
                for (var name in data) {
                    var rsvpStatus = data[name].rsvpStatus;
                    if (rsvpStatus=="yes") {
                        yesGuests.push(name);
                        allGuests.push(name);
                        if (data[name].plusOne=="yes") {
                            if (plusOnesPending) {
                                maybeGuests.push(name + "'s +1");
                            } else {
                                yesGuests.push(name + "'s +1");
                            }
                        }
                    } else if (rsvpStatus=="maybe") {
                        maybeGuests.push(name);
                        allGuests.push(name);
                    } else {
                        noGuests.push(name);
                        allGuests.push(name);
                    }
                }
                guestList = [yesGuests, noGuests, maybeGuests, allGuests];

                if (guestList) {
                    resolve(guestList);
                } else {
                    reject(guestList);
                }
            })

        }, 2000)
    })
};

function buildHtmlFromGuestList(guestList) {
    var htmlText = "";
    for (let i = 0; i < guestList.length; i++) {
        htmlText += "<p>" + guestList[i] + "</p>"
    }
    return htmlText;
}