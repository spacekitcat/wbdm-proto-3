const playSample = (audioContext, sampleData, time) => {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = sampleData;
  bufferSource.connect(audioContext.destination);
  bufferSource.start(time);
};
