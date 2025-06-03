window.addEventListener("DOMContentLoaded", () => {
  const { webUtils } = require("electron");
  const playListFolder = document.getElementById("playlist-folder-input");
  const choosePlaylistBtn = document.querySelector(".choose-playlist");
  let playlistFiles = [];
  let audioFile = null;
  const audio = document.getElementById("audio");
  const songTitle = document.querySelector(".title");
  const songCover = document.querySelector(".song-cover");
  const playPauseButton = document.querySelector(".play-pause");
  const progressBar = document.querySelector(".progress-bar");
  const filledProgressBar = document.querySelector(".progress-bar-filled");
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".previous");
  const shuffleButton = document.querySelector(".shuffle");
  const loopButton = document.querySelector(".loop");
  let isShuffled = false;
  let isLooping = false;
  let currentIndex = 0;

  const loadAndPlayAudio = async (file) => {
    // load audio file
    audio.src = URL.createObjectURL(file);
    audioPath = webUtils.getPathForFile(file);
    // Fetch metadata for the file

    const metadata = window.readMetaData(file, audioPath);
    metadata.then((data) => {
      if (data) {
        songCover.src = data.cover || "assets/song-cover.png";
        songTitle.textContent = data.title || file.name;
        songTitle.title = songTitle.textContent;
      }
    });

    audio.load();
    audio.play();
  };

  choosePlaylistBtn.addEventListener("click", () => {
    playListFolder.click();
  });

  playListFolder.addEventListener("change", function () {
    // Filter all audio files from selected folder
    const files = Array.from(this.files).filter((file) =>
      file.type.startsWith("audio/")
    );
    if (files.length === 0) {
      alert("No audio files found in the selected folder.");
      return;
    }
    playlistFiles = files;
    // Load the first audio file + show its metadata
    currentIndex = 0;
    audioFile = files[currentIndex];
    loadAndPlayAudio(audioFile);
  });

  audio.addEventListener("ended", () => {
    if (isShuffled) {
      currentIndex = Math.floor(Math.random() * playlistFiles.length);
      audioFile = playlistFiles[currentIndex];
      loadAndPlayAudio(audioFile);
    } else if (isLooping) {
      loadAndPlayAudio(audioFile);
    } else {
      currentIndex++;
      if (currentIndex < playlistFiles.length) {
        audioFile = playlistFiles[currentIndex];
        loadAndPlayAudio(audioFile);
      }
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < playlistFiles.length - 1) {
      currentIndex++;
      audioFile = playlistFiles[currentIndex];
      loadAndPlayAudio(audioFile);
    } else {
      currentIndex = 0;
      audioFile = playlistFiles[currentIndex];
      loadAndPlayAudio(audioFile);
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      audioFile = playlistFiles[currentIndex];
      loadAndPlayAudio(audioFile);
      songTitle.title = audioFile.name;
    } else {
      currentIndex = playlistFiles.length - 1;
      audioFile = playlistFiles[currentIndex];
      loadAndPlayAudio(audioFile);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    const duration = audio.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    document.querySelector(".end-time").textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  });

  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    document.querySelector(".init-time").textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    filledProgressBar.style.width = `${(currentTime / audio.duration) * 100}%`;
  });

  progressBar.addEventListener("click", (event) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    audio.currentTime = percentage * audio.duration;
    filledProgressBar.style.width = `${percentage * 100}%`;
  });

  progressBar.addEventListener("mouseover", (event) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const hoveredTime = percentage * audio.duration;
    const minutes = Math.floor(hoveredTime / 60);
    const seconds = Math.floor(hoveredTime % 60);

    progressBar.title = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  playPauseButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
  audio.addEventListener("play", () => {
    playPauseButton.src = "assets/pause-button.svg";
  });
  audio.addEventListener("pause", () => {
    playPauseButton.src = "assets/play-button.svg";
  });
  audio.addEventListener("ended", () => {
    playPauseButton.src = "assets/play-button.svg";
  });

  loopButton.addEventListener("click", () => {
    isLooping = !isLooping;
    isShuffled = false;
    shuffleButton.classList.remove("active");
    loopButton.classList.toggle("active", isLooping);
  });

  shuffleButton.addEventListener("click", () => {
    isShuffled = !isShuffled;
    isLooping = false;
    loopButton.classList.remove("active");
    shuffleButton.classList.toggle("active", isShuffled);
  });
});
