// Using jsmediatags
function extractMetadata(file) {
  return new Promise((resolve, reject) => {
    window.jsmediatags.read(file, {
      onSuccess: ({ tags }) => {
        let cover = null;
        if (tags.picture) {
          // Convert picture data to base64
          const { data, format } = tags.picture;
          const base64 = btoa(String.fromCharCode(...data));
          cover = `data:${format};base64,${base64}`;
        }
        resolve({
          title: tags.title,
          artist: tags.artist,
          cover,
        });
      },
      onError: reject,
    });
  });
}

async function readMetaData(file) {
  try {
    const {
      title,
      artist,
      cover,
    } = await extractMetadata(file);
    return {
      title: title + (artist ? ` - ${artist}` : "Unknown Artist"),
      cover: cover,
    };
  } catch (error) {
    console.error("jsmediatags error:", error);
    document.querySelector(".song-cover").src = "assets/song-cover.png";
  }
}

window.extractMetadata = extractMetadata;
window.readMetaData = readMetaData;
