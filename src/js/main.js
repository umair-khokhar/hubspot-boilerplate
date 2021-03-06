/**
 * Main.js
 *
 * @since 1.0.0
 */
import 'objectFitPolyfill';
import 'smoothscroll';

import objectFitImages from 'object-fit-images';

import { toggleActiveClick } from './modules/click';
import { domReady } from './utils/dom-ready';

domReady(function() {
  objectFitImages();
  toggleActiveClick();
});
