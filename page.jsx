class Page extends React.Component {
  constructor(props) {
    super(props);

    this.bpm = 140;
    this.timeSeconds = 60;
    this.quarterNotesPerBar = 1;

    this.state = {
      isLoaded: false,
      playbackQueue: [],
      current: '',
      currentSample: null
    };
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

  schedule(start, note) {
    const { playbackQueue } = this.state;
    let sample = selectRandomSample();
    let when =
      start + note * this.quarterNotesPerBar * this.calculateNoteInterval();

    playSample(this.audioContext, sample.audioData, when);
    playbackQueue.push({ sample, when });
    this.setState({ playbackQueue });
  }

  playDrumsEventHandler() {
    const { playbackQueue } = this.state;

    console.log('bang your drum!');
    let start = this.audioContext.currentTime;
    for (let i = 0; i < 18; ++i) {
      this.schedule(start, i);
    }
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
      this.setState({ current: null });
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
            <h1>LOADING</h1>
          </div>
        )}
      </div>
    );
  }
}
