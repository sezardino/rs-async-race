import './styles/index.css';

import { ApplicationUrls } from './const/router';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { WinnersPage } from './pages/winners';
import Router from './router';

const rootElement = document.getElementById('app') as HTMLElement;

new Router({
  root: rootElement,
  routes: {
    [ApplicationUrls.home]: HomePage,
    [ApplicationUrls.winners]: WinnersPage,
  },
  notFoundRoute: NotFoundPage,
});
