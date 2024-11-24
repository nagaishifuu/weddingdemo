// Initialize AOS (Animate on Scroll)
AOS.init();

// Global music and doorbell setup
const music = document.querySelector(".music"); // Ensure this matches the HTML class or ID
const doorbell = document.querySelector(".doorbell");
let isPlaying = false; // Global state to track music status

// Function to play entrance video and sounds
function playEntranceVideo() {
  const entranceVideo = document.getElementById("entranceVideo");
  const openButton = document.querySelector(".btn-get-started");
  const musicButton = document.getElementById("music-button");

  // Hide the button, play the video, and play doorbell sound
  openButton.style.display = "none";
  entranceVideo.style.display = "block";
  entranceVideo.play();
  doorbell.play();

  // Start background music if not already playing
  if (music && !isPlaying) {
    music.muted = true; // Mute initially to comply with iOS autoplay policy
    music.play().then(() => {
      music.muted = false; // Unmute once playback starts
      isPlaying = true;
      musicButton.innerHTML = '<i class="fas fa-fw fa-compact-disc"></i>';
      musicButton.classList.add("rotate");
    }).catch((error) => {
      console.error("Music autoplay prevented:", error);
      alert("Tap the music button to start playback.");
    });
  }

  // Transition to the next section after video ends
  entranceVideo.addEventListener("ended", () => {
    entranceVideo.style.display = "none";
    document.getElementById("pembuka-section").scrollIntoView({ behavior: "smooth" });

    // Enable scrolling after the video ends by removing the no-scroll class from <body>
    document.body.classList.remove("no-scroll");
  });
}

// Navbar button to toggle music play/pause
function toggleMusic(event) {
  event.preventDefault();
  const musicButton = document.getElementById("music-button");

  if (isPlaying) {
    musicButton.innerHTML = '<i class="fas fa-fw fa-circle-play" style="transform: translateY(6px);"></i>';
    musicButton.classList.remove("rotate");
    music.pause();
  } else {
    musicButton.innerHTML = '<i class="fas fa-fw fa-compact-disc"></i>';
    musicButton.classList.add("rotate");
    music.play().catch((error) => console.error("Error resuming music:", error));
  }
  isPlaying = !isPlaying;
}

// Countdown to Wedding Date
var countdownDate = new Date("Dec 15, 2024 10:30").getTime();
setInterval(function () {
  var now = new Date().getTime();
  var distance = countdownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var second = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown-wedding").innerHTML = `
    <div class="w-auto"><div class="text-center p-2 rounded"><h5>${days}</h5> Days</div></div>
    <div class="w-auto"><div class="text-center p-2 rounded"><h5>${hours}</h5> Hours</div></div>
    <div class="w-auto"><div class="text-center p-2 rounded"><h5>${minute}</h5> Minutes</div></div>
    <div class="w-auto"><div class="text-center p-2 rounded"><h5>${second}</h5> Seconds</div></div>
  `;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown-wedding").innerHTML =
      "<span class='text-center p-3 rounded text-light m-2'><h2>Sudah Dimulai!</h2></span>";
  }
}, 1000);

// Greeting Name in Sambutan
const urlParams = new URLSearchParams(window.location.search);
const panggilan = urlParams.get("p");
const nama = urlParams.get("n");
const namaSambutan = document.querySelector("#nama-sambutan");
namaSambutan.innerText = ` ${panggilan} ${nama}`;

// Disable scrolling on the body initially
document.body.classList.add("no-scroll");

// Add event listener to the "Open Invitations" button to start video and enable scrolling
document.querySelector(".btn-get-started").addEventListener("click", () => {
  playEntranceVideo();
});

// Comment Section Handling
document.getElementById("my-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("nama").value;
  const comment = document.getElementById("ucapan").value;
  const status = document.getElementById("status").value;

  // Create comment element to display immediately
  const commentElement = document.createElement("div");
  commentElement.className = "comment-box";
  commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
  document.getElementById("commentsSection").appendChild(commentElement);

  // Submit comment to Google Sheets
  fetch('https://script.google.com/macros/s/AKfycbwC-5Lepltc8E9pkZx6nzjn7y2yzpavYmFV0gMxGZgsU8_WBgI8ldS2lZH5x7_8v3uB/exec', {
    method: 'POST',
    body: JSON.stringify({ Nama: name, Ucapan: comment, Status: status })
  })
  .then(response => response.text())
  .then(result => {
    if (result === "Success") {
      alert("Berhasil Terkirim");
    } else {
      alert("Terjadi kesalahan, coba lagi nanti.");
    }
    document.getElementById("my-form").reset();
    loadComments(); // Optional: Refresh the comments section after submission
  })
  .catch(error => console.error('Error!', error.message));
});

// Load comments from Google Sheets
async function loadComments() {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwC-5Lepltc8E9pkZx6nzjn7y2yzpavYmFV0gMxGZgsU8_WBgI8ldS2lZH5x7_8v3uB/exec'); // Use the Web App URL here
  const comments = await response.json();

  const commentsSection = document.getElementById("commentsSection");
  commentsSection.innerHTML = ''; // Clear existing comments

  comments.forEach(comment => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment-box";
    commentElement.innerHTML = `<strong>${comment.Nama}</strong>: ${comment.Ucapan}`;
    commentsSection.appendChild(commentElement);
  });
}

// Load comments on page load
window.onload = function () {
  loadComments();
};

// Copy to clipboard
function copyToClipboard() {
  const rekeningText = document.getElementById("nomor-rekening").innerText;
  const tempInput = document.createElement("input");
  tempInput.value = rekeningText.trim();
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  alert("Nomor rekening berhasil disalin.");
}