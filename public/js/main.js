const SHOW_BTN = document.getElementById("show-media");
const HIDE_BTN = document.getElementById("hide-media");
const VIDEO_MEDIA = document.getElementById("video-media");
const AUDIO_MEDIA = document.getElementById("audio-media");

SHOW_BTN.addEventListener("click", showMedia);
HIDE_BTN.addEventListener("click", hideMedia);

function showMedia() {
  VIDEO_MEDIA.style.display = "block";
  AUDIO_MEDIA.style.display = "block";
}

function hideMedia() {
  VIDEO_MEDIA.style.display = "none";
  AUDIO_MEDIA.style.display = "none";
}
