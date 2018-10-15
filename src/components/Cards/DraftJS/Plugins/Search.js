const contentSearch = (url, callback) => ({value}) => {
  // An import statment would break server-side rendering.
  require('whatwg-fetch'); // eslint-disable-line global-require

  fetch(url)
    .then((response) => response.json())
    .then(callback);
};


export default contentSearch;
