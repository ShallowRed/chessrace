import 'styles/global.css';
import 'styles/ui.css';
import 'styles/alpha.css';
// import 'styles/neo.css';

import App from 'app/app';

new App(window.localStorage)
  .start(new URLSearchParams(window.location.search).get("level"));
