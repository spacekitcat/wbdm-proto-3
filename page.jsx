class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoaded: false, playbackQueue: [], current: '', currentSample: null };
    this.playDrumsEventHandler = this.playDrumsEventHandler.bind(this);
    this.timeoutHandler = this.timeoutHandler.bind(this);
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
    let when = this.audioContext.currentTime + 4;
    console.log(when);
    playSample(this.audioContext, sample.audioData, when);
    playbackQueue.push({ sample, when });
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
        window.setInterval(this.timeoutHandler, 300);
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
