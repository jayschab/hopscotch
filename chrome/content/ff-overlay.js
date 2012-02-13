hopscotch.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ hopscotch.showFirefoxContextMenu(e); }, false);
};

hopscotch.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-hopscotch").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { hopscotch.onFirefoxLoad(); }, false);
