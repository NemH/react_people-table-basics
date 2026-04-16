import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { Root } from './Root';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <html className="has-navbar-fixed-top">
    <Router>
      <Root />
    </Router>
  </html>,
);
