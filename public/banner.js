/*!
 *
 * Banner Injection Script
 *
 * ----------------------------------------------------------------------------
 *
 * This file is licensed under the BSD 3-Clause "New" or "Revised" License (SPDX identifier: BSD-3-Clause), made by Midou <https://midou.dev> for TheFrenchGhosty <https://thefrenchghosty.me>, original idea by TheFrenchGhosty <https://thefrenchghosty.me>
 *
 * ----------------------------------------------------------------------------
 *
 * Copyright 2024 Midou, TheFrenchGhosty
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Helper functions for cookies
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Set cookie expiration time
    expires = "; expires=" + date.toUTCString(); // Format expiration date in UTC
  }
  console.log("Cookie is set to expire in " + days + " days!");
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=None; Secure";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length); // Remove leading spaces
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); // Return cookie value
  }
  return null;
}

// Function to delete a specific cookie
function deleteCookie(name) {
  document.cookie =
    name +
    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure";
}

// function to close the banner
function closeBanner(days = 7) {
  // default to 7 days unless specified
  var banner = document.getElementById("banner");
  if (banner) {
    banner.style.display = "none"; // hide the banner
  }
  var hostname = window.location.hostname;
  setCookie("bannerClosed_" + hostname, "true", days); // set cookie with the specified duration
}

// Function to permanently disable the banner with a code
function permanentlyDisableBanner() {
  var code = prompt("Enter the code to permanently disable the banner:");
  if (code === "thanks") {
    // If you're reading this, you can use the code, but please, consider donating if you can :)
    alert("Banner permanently disabled, thank you for donating!");
    closeBanner(365); // probably unlikely that someone would be annoyed by a year
  } else {
    alert("Incorrect code. Please try again.");
  }
}

// Function to check the URL for #debug and delete cookie
function checkDeleteAndDeleteCookies() {
  if (window.location.hash === "#delete") {
    // List of specific cookies to delete
    var cookiesToDelete = ["bannerClosed_" + window.location.hostname];
    for (var i = 0; i < cookiesToDelete.length; i++) {
      deleteCookie(cookiesToDelete[i]);
    }
    alert("cookie deleted!");
  }
}
// Function to inject the banner into the page
function injectBanner() {
  if (getCookie("bannerClosed_" + window.location.hostname)) {
    return; // Do not show the banner if the cookie exists
  }

  var banner = document.createElement("div");
  banner.id = "banner";
  banner.style = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: #1f2022;
    color: white;
    text-align: left;
    padding: 15px;
    z-index: 10000;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.2;
    font-size: 18px;
    letter-spacing: 0.5px;
  `;

  // Apply the same font to all elements within the banner
  // NOTE: the !important takes over the banner.style and everything the original
  // website tries to put in front, don't forget to change that!
  var bannerStyles = document.createElement("style");
  bannerStyles.innerHTML = `
    #banner, #banner * {
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 18px !important;
      color: white !important;
      line-height: 1.2 !important;
      letter-spacing: 0.5px !important;
    }
  `;
  document.head.appendChild(bannerStyles);

  // Create inner content
  var contentDiv = document.createElement("div");
  contentDiv.style = "display: flex; flex-direction: column; max-width: 80%;";
  contentDiv.innerHTML = `
    <p style="margin: 5px 0 0 0;">
      <a href="https://pussthecat.org" style="color: #ffffff; text-decoration: none; border-bottom: solid #ffffff 1px;">PussTheCat.org</a> is proud to have been running ad-free and tracker-free since its creation in 2020. The money all comes from our own pocket and donations.
    </p>
    <p style="margin: 5px 0 0 0;">If it is useful to you, consider donating!</p>
<br>
    <p style="margin: 5px 0;">
      <a href="https://pussthecat.org/donate" style="color: #ffffff; text-decoration: none; border-bottom: solid #ffffff 1px;">Click here to donate!</a>
      <a href="#" id="donation-link" style="color: #ffffff; text-decoration: none; border-bottom: solid #ffffff 1px; font-size: 11px !important; margin: 0 0 0 0.5cm;">Already donated? Click here to permanently disable the banner (requires a code)</a>
    </p>

  `;
  banner.appendChild(contentDiv);

  // Create close button
  var closeButton = document.createElement("button");
  closeButton.id = "close_banner";
  closeButton.style = `
    color: white;
    border: none;
    font-size: 0;
    cursor: pointer;
    padding: 0;
    background-color: #343232;
  `;
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="fill: white; display: block">
      <g fill="none" fill-rule="evenodd">
        <path fill="white" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"></path>
      </g>
    </svg>
  `;
  closeButton.onclick = function () {
    closeBanner(7);
  };
  banner.appendChild(closeButton);

  document.body.appendChild(banner); // Inject the banner into the page

  // Add click event listener for the donation link
  document.getElementById("donation-link").onclick = function (e) {
    e.preventDefault();
    permanentlyDisableBanner();
  };
}

// Dynamically load the script after everything else is loaded
// This helps avoiding breakages in the original website
window.onload = function () {
  checkDeleteAndDeleteCookies();
  injectBanner();
};
