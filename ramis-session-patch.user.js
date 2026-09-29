// ==UserScript==
// @name         RAMIS Session Patch
// @namespace    https://github.com/prashand/TamperRAMIS
// @version      1.0.7
// @description  Auto-patch RAMIS sessionWarning to ping server once, hide dialog, and avoid keeping user logged in forever
// @match        https://eservices.ird.gov.lk/*
// @match        https://www.eservices.ird.gov.lk/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/prashand/TamperRAMIS/main/ramis-session-patch.user.js
// @downloadURL  https://raw.githubusercontent.com/prashand/TamperRAMIS/main/ramis-session-patch.user.js
// ==/UserScript==

/**
 *
 * window.sessionTimeout = 30;                  // 30 minutes until session expires
 * window.sessionTimeoutWarning = 20;           // 20 minutes until warning dialog shows
 * window.sessionTimeoutWarningTimer;           // the timer that triggers the warning dialog
 * window.keepSessionAlive = "/path/to/ping";   // the URL to ping to keep the session alive
 *
*/
(function() {
    'use strict';

    const version = "1.0.7";

    const EXTEND_HRS = 6;

    let setUpHeartbeat = function() {
        /**
         * Use heartbeats to keep session alive
        */

        console.log("[RAMIS Monkey] Setting up heartbeat to keep session alive...");

        let heartbeat_interval = 10 * 60 * 1000; // 10 minutes
        let heartbeat_count = (EXTEND_HRS * 60) / 10; // Number of heartbeats in EXTEND_HRS hours

        let heartbeat = setInterval(() => {
            if (heartbeat_count > 0) {
                console.log(`[RAMIS Monkey] Heartbeat ping ${heartbeat_count} to keep session alive...`);
                $.get(window.keepSessionAlive);
                heartbeat_count--;
                } else {
                    console.log("[RAMIS Monkey] Maximum heartbeats reached. Stopping heartbeats.");
                    clearInterval(heartbeat);
                }
            }, heartbeat_interval);
    }

    console.log(`[RAMIS Monkey] ${version} Initializing...`);
    if (
        window.location.pathname == "/Authentication/LoginEntry"
        || window.location.pathname == "/Authentication/LoginPersonal"
        || window.location.pathname == "/Authentication/LoginForCompany"
        || window.location.pathname == "/Authentication/LoginForClient"
    ) {
        console.log("[RAMIS Monkey] Not logged in – not setting up session keep-alive.");
        return;
    }

    setUpHeartbeat();

})();