# WBDM Prototype 3

[Click here for a demo!](http://static.spacekitcat.com/wbdm3/webapp/index.html)

Previous prototypes show React based sample play back apps with crappy timing, mostly focused on the ui state.

This project sets out to show the following.

- Perfect timer mechanism via
  - Web Audio clock
  - lookahead strategy ([ala, A Tale of Two Clocks](https://www.html5rocks.com/en/tutorials/audio/scheduling/))

The code and the UI are really crappy, but the timing is pretty good. It uses the Web Audio clock to schedule sample playback
when the action button is pressed. It independently keeps track of the scheduled sample playback requests, and outputs the sample name scheduled to play next. It also uses React to render the app and manage the App life cycle.

## Running

You need to add `localhost.spacekitcat.com` to you hosts file

```bash
127.0.0.1 localhost.spacekitcat.com
```

and then serve the code from a webserver

```bash
cd wbdm-proto-3
yarn
yarn start
```

that you can then visit in your web browser at `localhost.spacekitcat.com:8081` (or whatever port it uses).

All of this is required to keep CORS happy when it fetches the audio samples from the S3 bucket at `static.spacekitcat.com`.

I suppose you could try using some browser extension that disables CORS, but I prefer to avoid that and comply with the CORS validation during development. At least it forces me to test it early.

If you run it once, it should cache all the samples locally meaning `index.html` may well just run without CORS issues.

## Deploy setup

An AWS CodePipeline uses GitHub hooks to detect commits to this repository. When commits are detected, the source is deployed to an S3 bucket. The S3 bucket is wired up to a subdomain on spacekitcat.com

## Browser support

Firefox? Yes.

Google Chrome? Yes.

Android (default)? Yes.

Safari? No, it doesn't support Promise-based syntax for [BaseAudioContext.decodeAudioData(...)](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData).

IE? I'm almost certain it won't work for the same reason it doesn't work on Safari.

Edge? I'm not sure, it actually might just work. MDN isn't sure if it supports Promise-based syntax for decodeAudioData. I'll test it when I get a chance.
