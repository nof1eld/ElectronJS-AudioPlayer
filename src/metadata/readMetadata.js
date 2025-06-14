async function readMetaData(file, filePath) {
  try {
    const offline = await window.getOfflineMetadata(file);
    console.log("Offline metadata fetched:", offline);
    if (offline) {
      title = offline.title === undefined ? null : offline.title;
      artist = offline.artist === undefined ? null : offline.artist;
      cover = offline.cover === undefined ? null : offline.cover;
    }

    const online = await window.getOnlineMetadata(filePath);
    console.log("Online metadata fetched:", online);
    if (online) {
      title = online.title || offline.title;
      artist = online.artist || offline.artist;
      cover = online.cover || offline.cover;
    }

    console.log("Metadata used:", { title, artist, cover });

    return {
      title: title ? title + (artist ? ` - ${artist}` : " - Unknown Artist") : null,
      cover: cover,
    };
  } catch (error) {
    console.warn("fetching metadata failed", error);
  }
}

window.readMetaData = readMetaData;
