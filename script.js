window.addEventListener('load', init, false);

ReactDOM.render(<Page />, document.getElementById('root'));

let audioContext;

const bpm = 180;
const timeSeconds = 60;
const quarterNotesPerBar = 4;
const calculateNoteInterval = () => timeSeconds / bpm;
const calculateBarLength = () => calculateNoteInterval() * quarterNotesPerBar;

let barCue = [];
let audioSampleDataCache = [];
function init() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  } catch (e) {
    alert('Web Audio API is not supported on your browser: ' + e);
  }
}

let playing = false;
var playForMe = () => {
  console.log('Got play command');

  if (playing) {
    console.log('Already playing');
    return;
  }
  playing = true;
  document.getElementById("#play").setAttribute('disabled', true);
  console.log('play');

  const noteCount = 5;
   const randomSampleOne = Math.round(
     (audioSampleDataCache.length - 1) * Math.random()
   );
   const randomSampleTwo = Math.round(
     (audioSampleDataCache.length - 1) * Math.random()
   );
   const randomSampleThree = Math.round(
     (audioSampleDataCache.length - 1) * Math.random()
   );
   const randomSampleFour = Math.round(
     (audioSampleDataCache.length - 1) * Math.random()
   );
  for (let note = 0; note < noteCount; ++note) {
    barCue.push(audioSampleDataCache[randomSampleOne]);
    barCue.push(audioSampleDataCache[randomSampleTwo]);
    barCue.push(audioSampleDataCache[randomSampleThree]);
    barCue.push(audioSampleDataCache[randomSampleFour]);
  }
    
  const barMax = 5;
  let currentBar = 0;
  const scheduleAhead = 1;
  let intervalHandle = 0;

  let intervalCallback = () => {
    let shouldHavePlayed = Math.round(
      audioContext.currentTime / calculateBarLength()
    );

    console.log(shouldHavePlayed);

    if (currentBar >= barMax) {
      clearInterval(intervalHandle);
      document.getElementById('#sample-name').innerText = '';
      playing = false;
      document.getElementById('#play').removeAttribute('disabled');
      return;
    }
    if (currentBar < shouldHavePlayed + scheduleAhead) {
      const playTime =
        startTime + currentBar * quarterNotesPerBar * calculateNoteInterval();

      document.getElementById('#sample-name').innerText = '';
      barCue
        .slice(0)
        .reverse()
        .forEach((item, index) => {
          let li = document.createElement('li');
          li.innerText = item.metaData.file;
          if (index < 4) {
            li.className = 'highlight';
          }
          document.getElementById('#sample-name').append(li);
        });

      playSample(audioContext, barCue.pop().audioData, playTime);
      playSample(
        audioContext, barCue.pop().audioData,
        playTime + calculateNoteInterval()
      );
      playSample(audioContext,
        barCue.pop().audioData,
        playTime + calculateNoteInterval() * 2
      );
      playSample(audioContext,
        barCue.pop().audioData,
        playTime + calculateNoteInterval() * 3
      );
      ++currentBar;
    }
  };

  var startTime = audioContext.currentTime + 1.2;
  intervalHandle = setInterval(intervalCallback, 1200);
};
