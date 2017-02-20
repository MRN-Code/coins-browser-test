'use strict';

/**
 * Hide the Zendesk widget.
 * @module
 *
 * This code is executed client-side via Webdriver.io's `execute`. {@link
 * http://webdriver.io/api/protocol/execute.html}
 */
module.exports = function hideZendeskWidget() {
  /* eslint-disable no-undef */
  const zendeskWidget = document.getElementById('launcher');
  /* eslint-enable no-undef */

  if (zendeskWidget) {
    zendeskWidget.hidden = true;
  }
};

