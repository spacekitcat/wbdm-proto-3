const decodeResponseBuffer = audioContext => audioData =>
  audioContext.decodeAudioData(audioData);

const fetchAndCacheSample = (audioContext, sampleName) =>
  window
    .fetch(`http://static.spacekitcat.com/wbdm3/samples/${sampleName}`, {
      cache: 'force-cache'
    })
    .then(response => response.arrayBuffer())
    .then(decodeResponseBuffer(audioContext));

const loadSamples = (audioContext, manifestJson) =>
  Promise.all(
    manifestJson.samples.map(async item => {
      let audioData = await fetchAndCacheSample(audioContext, item.file);
      return { audioData: audioData, metaData: item };
    })
  );

let audioSampleDataCache = [];
const initSampleCache = audioContext => manifestJson => {
  return loadSamples(audioContext, manifestJson).then(samples => {
    audioSampleDataCache = samples;
    console.log(`Loaded ${audioSampleDataCache.length} into the sample cache`);
  });
};

const selectRandomSample = () => {
  let sampleIndex = Math.round((audioSampleDataCache.length - 1) * Math.random());

  return audioSampleDataCache[sampleIndex];

}
