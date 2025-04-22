const originalPath = window.location.pathname;
const pushState = history.pushState;
const replaceState = history.replaceState;
let pushed = false;
history.pushState = function () {
  if (pushed) return;

  pushed = true;
  setTimeout(() => {
    pushed = false;
    document.querySelector(`[href="${originalPath}"]`).click();
  }, 0);
};

let replaced = false;
history.replaceState = function () {
  if (replaced) return;

  replaced = true;
  setTimeout(() => {
    replaced = false;
    document.querySelector(`[href="${originalPath}"]`).click();
  }, 0);
};

const expandables = ["Language APIs & SDKs", "Evaluation"];
let expanded = [];

const expandAllGroups = () => {
  const groups = document.querySelectorAll(".group");
  groups.forEach((group) => {
    const text = group.textContent.trim();
    if (expandables.includes(text) && !expanded.includes(group)) {
      // group.addEventListener("click", (e) => {
      //   e.stopPropagation();
      // }, { once: true });
      group.click();
      expanded.push(group);
    }
  });

  setTimeout(() => {
    const newGroups = document.querySelectorAll(".group");
    if (newGroups.length > groups.length) {
      expandAllGroups();
    } else {
      setTimeout(() => {
        history.pushState = pushState;
        history.replaceState = replaceState;
      }, 1000);
    }
  }, 0);
};

expandAllGroups();
