/**
 * Main.js
 *
 * @since 1.0.0
 */
import 'objectFitPolyfill';
import 'smoothscroll';

import objectFitImages from 'object-fit-images';
import Raven from 'raven-js';

import { toggleActiveClick } from './modules/click';
import { domReady } from './utils/dom-ready';

domReady(function() {
  if (process.env.NODE_ENV === 'production') {
    Raven.config().install();
  }

  objectFitImages();
  toggleActiveClick();
});
