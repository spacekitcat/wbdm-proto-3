class Page extends React.Component {
  constructor(props) {
    super(props);

    this.bpm = 120;
    this.timeSeconds = 60;
    this.quarterNotesPerBar = 4;

    this.state = { isLoaded: false, playbackQueue: [], current: '', currentSample: null };
    this.playDrumsEventHandler = this.playDrumsEventHandler.bind(this);
    this.timeoutHandler = this.timeoutHandler.bind(this);
  }

  calculateNoteInterval() {
    return this.timeSeconds / this.bpm;
  }

  calculateBarLength() {
    return this.calculateNoteInterval() * this.quarterNotesPerBar;
  }

  initWebAudio() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      alert('Web Audio API is not supported on your browser: ' + e);
    }
  }

  playDrumsEventHandler() {
    const { playbackQueue } = this.state;

    console.log('bang your drum!');
    let sample = selectRandomSample();
    let sample2 = selectRandomSample();
    let sample3 = selectRandomSample();
    let sample4 = selectRandomSample();
    let when = this.audioContext.currentTime + (1 * this.quarterNotesPerBar * this.calculateNoteInterval());
    console.log(when);
    playSample(this.audioContext, sample.audioData, when);
    playSample(
      this.audioContext,
      sample2.audioData,
      when + this.calculateNoteInterval()
    );
    playSample(
      this.audioContext,
      sample3.audioData,
      when + 2 * this.calculateNoteInterval()
    );

    playSample(
      this.audioContext,
      sample4.audioData,
      when + 3 * this.calculateNoteInterval()
    );
    playbackQueue.push({ sample, when });
    playbackQueue.push({ sample: sample2, when: when + this.calculateNoteInterval() });
    playbackQueue.push({ sample: sample3, when: when + 2 * this.calculateNoteInterval() });
    playbackQueue.push({
      sample: sample4,
      when: when + 3 * this.calculateNoteInterval()
    });
    this.setState({ playbackQueue });
  }

  timeoutHandler() {
    const { playbackQueue } = this.state;

    if (
      playbackQueue.length > 0 &&
      playbackQueue[0].when <= this.audioContext.currentTime
    ) {
      const current = playbackQueue.shift();
    } else if (
      playbackQueue.length > 0 &&
      playbackQueue[0].when > this.audioContext.currentTime
    ) {
      const current = playbackQueue[0];
      const sample = current.sample;
      this.setState({
        current: sample.metaData.file
      });
    }

    if (playbackQueue.length === 0) {
      this.setState({current: null})
    }
  }

  componentDidMount() {
    this.initWebAudio();

    fetchManifest()
      .then(initSampleCache(this.audioContext))
      .then(() => {
        this.setState({ isLoaded: true });
      })
      .then(() => {
        window.setInterval(this.timeoutHandler, 200);
      });
  }

  componentWillUpdate() {}

  render() {
    const { isLoaded, current } = this.state;

    return (
      <div className="content">
        {isLoaded ? (
          <div className="drum-view">
            <h1 className="title">Do you like... drums?</h1>
            <p className="sample">{current}</p>
            <input
              id="#play"
              type="button"
              className="play"
              onClick={this.playDrumsEventHandler}
              value="play"></input>
            <div className="samples-container">
              <ul id="#sample-name" className="samples"></ul>
            </div>
          </div>
        ) : (
          <div className="loading-view">
            <h1>Loading...</h1>
          </div>
        )}
      </div>
    );
  }
}
