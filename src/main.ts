import './styles/index.css';

import { ApplicationUrls } from './const/router';
import { DefaultLayout } from './layouts/default';
import { GaragePage } from './pages/garage/garage.page';
import { NotFoundPage } from './pages/not-found';
import { WinnersPage } from './pages/winners';
import { Router } from './router';

const rootElement = document.getElementById('app') as HTMLElement;

new Router({
  root: rootElement,
  routes: {
    [ApplicationUrls.garage]: { page: GaragePage },
    [ApplicationUrls.winners]: { page: WinnersPage },
  },
  notFoundRoute: NotFoundPage,
  defaultLayout: DefaultLayout,
});
