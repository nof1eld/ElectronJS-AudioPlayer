// Using jsmediatags
function getOfflineMetadata(file) {
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



window.getOfflineMetadata = getOfflineMetadata;
