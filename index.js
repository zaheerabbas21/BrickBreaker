const setting = document.getElementById("setting");
const settingClose = document.getElementById("settings-close");
const musicBtn = document.getElementById("music-btn");
const defaultContainer = document.getElementById("default-content");
const settingsContainer = document.getElementById("settings-container");

function handleSettingEvent(e) {
  defaultContainer.style.display = "none";
  settingsContainer.style.display = "block";
}

function handleCloseEvent(e) {
  settingsContainer.style.display = "none";
  defaultContainer.style.display = "flex";
}

setting.addEventListener("click", handleSettingEvent);
settingClose.addEventListener("click", handleCloseEvent);
