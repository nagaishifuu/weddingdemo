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
    music.play().catch((error) => console.error("Music autoplay prevented:", error));
    isPlaying = true;
    musicButton.innerHTML = '<i class="fas fa-fw fa-compact-disc"></i>';
    musicButton.classList.add("rotate");
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
    musicButton.innerHTML = '<i class="fas fa-fw fa-pause" style="transform: translateY(3px);"></i>';
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
var countdownDate = new Date("Dec 14, 2024 10:30").getTime();
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

  const commentElement = document.createElement("div");
  commentElement.className = "comment-box";
  commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;

  document.getElementById("commentsSection").appendChild(commentElement);

  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.push({ name, comment });
  localStorage.setItem("comments", JSON.stringify(comments));

  document.getElementById("my-form").reset();
});

// Load comments from local storage on page load
window.onload = function () {
  const comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.forEach(({ name, comment }) => {
    const commentElement = document.createElement("div");
    commentElement.className = "comment-box";
    commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
    document.getElementById("commentsSection").appendChild(commentElement);
  });
};
