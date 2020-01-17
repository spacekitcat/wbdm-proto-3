const decodeResponseBuffer = audioData =>
  audioContext.decodeAudioData(audioData);

const fetchAndCacheSample = sampleName =>
  window
    .fetch(`http://static.spacekitcat.com/wbdm3/samples/${sampleName}`, {
      cache: 'force-cache'
    })
    .then(response => response.arrayBuffer())
    .then(decodeResponseBuffer);

const loadSamples = manifestJson =>
  Promise.all(
    manifestJson.samples.map(async item => {
      let audioData = await fetchAndCacheSample(item.file);
      return { audioData: audioData, metaData: item };
    })
  );

let audioSampleDataCache = [];
const initSampleCache = manifestJson => {
  loadSamples(manifestJson).then(samples => {
    audioSampleDataCache = samples;
    console.log(`Loaded ${audioSampleDataCache.length} into the sample cache`);
  });
};

const selectRandomSample = () => {
  let sampleIndex = Math.round((audioSampleDataCache.length - 1) * Math.random());

  return audioSampleDataCache[sampleIndex];

}
