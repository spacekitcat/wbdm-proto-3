class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoaded: false, playbackQueue: [] };
    this.playDrumsEventHandler = this.playDrumsEventHandler.bind(this);
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
    console.log('bang your drum!');
    let sample = selectRandomSample();
    let when = this.audioContext.currentTime + 1;
    console.log(when);
    playSample(this.audioContext, sample.audioData, when);
    //playbackQueue.push({ sample, when })
  }

  componentDidMount() {
    this.initWebAudio();

    fetchManifest()
      .then(initSampleCache(this.audioContext))
      .then(() => {
        this.setState({ isLoaded: true });
      });
  }

  render() {
    const { isLoaded } = this.state;

    return (
      <div className="content">
        {isLoaded ? (
          <div className="drum-view">
            <h1 className="title">Do you like... drums?</h1>
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
