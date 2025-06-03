async function readMetaData(file, filePath) {
  try {
    const online = await window.getOnlineMetadata(filePath);
    console.log("Online metadata fetched:", online);
    const offline = await window.getOfflineMetadata(file);
    console.log("Offline metadata fetched:", offline);

    const title = online ? online.title || offline.title : offline.title;
    const artist = online ? online.artist || offline.artist : offline.artist;
    const cover = online ? online.cover || offline.cover : offline.cover;

    console.log("Metadata used:", { title, artist, cover });

    return {
      title:
        title +
        (artist ? ` - ${artist}` : "Unknown Artist"),
      cover: cover,
    };
  } catch (error) {
    console.warn("fetching metadata failed", error);
  }
}

window.readMetaData = readMetaData;
