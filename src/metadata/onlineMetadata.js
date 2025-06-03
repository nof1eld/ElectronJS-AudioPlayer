const { execFile } = require("child_process");
const path = require("path");
const os = require("os");
// if os is windows, use the fpcalc executable from resources, if os is linux, use the fpcalc file from resources

const fpcalc = os.platform() === "win32"
  ? path.join(__dirname, "../resources/bin/win/fpcalc.exe")
  : path.join(__dirname, "../resources/bin/linux/fpcalc");

// using fpcalc to get audio fingerprint and duration
function getFileFingerprint(filePath) {
  return new Promise((resolve, reject) => {
    execFile(fpcalc, [filePath], (err, stdout) => {
      if (err) return reject(err);
      const fingerprint = stdout.match(/FINGERPRINT=(.+)/)[1].trim();
      const duration = parseInt(stdout.match(/DURATION=(.+)/)[1], 10);
      resolve({ fingerprint, duration });
    });
  });
}

// sending fingerprint and duration to AcoustID API to get metadata (excluding cover image)
const getOnlineMetadata = async (filePath) => {
  try {
    const { fingerprint, duration } = await getFileFingerprint(filePath);
    const params = {
      "client": "zof9XkwKFH",
      "meta": "recordings+releaseids",
      "duration": duration,
      "fingerprint": fingerprint,
    }
    const response = await fetch(`https://api.acoustid.org/v2/lookup?client=${params.client}&meta=${params.meta}&duration=${params.duration}&fingerprint=${params.fingerprint}`);

    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {

      const recording = data.results[0].recordings[0];
      const releaseID = recording.releases[0].id;
      return {
        title: recording.title,
        artist: recording.artists.map((artist) => artist.name).join(", "),
        cover: await getCoverImage(releaseID),
      };
    } else {
      throw new Error("No metadata found");
    }
  } catch (error) {
    console.error("Error fetching online metadata:", error);
    return null;
  }
};

const getCoverImage = async (releaseID) => {
  const response = await fetch(
    `https://coverartarchive.org/release/${releaseID}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cover image");
  }

  const data = await response.json();
  return data.images && data.images.length > 0 ? data.images[0].thumbnails.small : null;
};

window.getOnlineMetadata = getOnlineMetadata;
