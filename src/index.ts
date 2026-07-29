import 'styles/global.css';
import 'styles/ui.css';
import 'styles/alpha.css';
// import 'styles/neo.css';

import App from 'app/app';

const { search } = window.location;

new App(window.localStorage)
  .start(new URLSearchParams(search).get("level"), search);
