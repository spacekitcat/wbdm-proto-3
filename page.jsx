class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      playbackQueue: [],
      current: '',
      volume: 0
    };

    this.playDrumsEventHandler = this.playDrumsEventHandler.bind(this);
    this.timeoutHandler = this.timeoutHandler.bind(this);
  }

  calculateNoteInterval() {
    const { bpm } = this.props;
    return 60 / bpm;
  }

  initWebAudio() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
    } catch (e) {
      alert('Web Audio API is not supported on your browser: ' + e);
    }
  }

  schedule(start, note) {
    const { playbackQueue } = this.state;
    let sample = selectRandomSample();
    const alreadyPlayedInterval = note * this.calculateNoteInterval();
    let when = start + alreadyPlayedInterval;

    playSample(this.audioContext, this.analyser, sample.audioData, when);
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

  playbackQueueHeadExpired() {
    const { playbackQueue } = this.state;

    return (
      playbackQueue.length > 0 &&
      playbackQueue[0].when < this.audioContext.currentTime
    );
  }

  playbackQueuePop() {
    const { playbackQueue } = this.state;
    return playbackQueue.shift();
  }

  collectPlaybackQueueGarbage() {
    const { playbackQueue } = this.state;
    while (this.playbackQueueHeadExpired()) this.playbackQueuePop();
  }

  timeoutHandler() {
    const { playbackQueue, volume, isLoaded } = this.state;

    this.collectPlaybackQueueGarbage();

    let current = null;
    if (playbackQueue.length > 0) {
      const c = playbackQueue[0];
      const sample = c.sample;
      current = sample.metaData.file;
    }

    let dataArray = new Float32Array(this.analyser.frequencyBinCount);
    void this.analyser.getFloatTimeDomainData(dataArray);
    const newVolume =
      (8 * dataArray.reduce((sum, i) => sum + i)) / dataArray.length;

    if (newVolume !== volume) {
      this.canvas = document.getElementById('canvas');
      let context = this.canvas.getContext('2d');

      context.fillStyle = 'white';
      context.fillRect(0, 0, this.canvas.clientWidth, 200);
      context.fillStyle = '#00007E';
      context.fillRect(0, 0, newVolume * this.canvas.clientWidth, 200);
      this.setState({ volume: newVolume, current });
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
        window.setInterval(this.timeoutHandler, 100);
      });
  }

  componentWillUpdate() {}

  render() {
    const { isLoaded, current, playbackQueue, volume } = this.state;
    const vol = Math.round(Math.abs(volume) * 120);

    return (
      <div className="content">
        <div className="drum-container">
          {isLoaded ? (
            <div className="drums-widget">
              <h1 className="drums-widget__title">Do you like... drums?</h1>
              <p className="drums-widget__current-sample">{current}</p>
              <input
                id="#play"
                type="button"
                className="drums-widget__play-button"
                onClick={this.playDrumsEventHandler}
                disabled={playbackQueue.length > 0}
                value="PLAY"></input>
              <div className="samples-container">
                <ul id="#sample-name" className="samples"></ul>
              </div>
              <canvas className="drums-widget__volume" id="canvas"></canvas>
            </div>
          ) : (
            <div className="loading-view">
              <h1 className="loading-view__title">LOADING</h1>
            </div>
          )}
        </div>
        <a
          className="github_link"
          href="https://github.com/spacekitcat/wbdm-proto-3">
          github
        </a>
      </div>
    );
  }
}
