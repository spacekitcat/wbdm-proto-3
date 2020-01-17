const fetchManifest = () =>
  window
    .fetch(`http://static.spacekitcat.com/wbdm3/config/manifest.json`, {
      cache: 'force-cache',
      cache: 'reload'
    })
    .then(response => response.json());
