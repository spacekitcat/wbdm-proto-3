const playSample = (audioContext, analyser, sampleData, time) => {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = sampleData;
  bufferSource.connect(analyser);
  analyser.connect(audioContext.destination);
  bufferSource.start(time);
};
