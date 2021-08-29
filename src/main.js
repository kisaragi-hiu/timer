"use strict";

// Model

let state = {
  start: undefined,
  end: undefined,
  laps: [],
};

function newState() {
  return { start: undefined, end: undefined, laps: [] };
}

// State -> Display ("View", except manipulated by "Controller")

let display = document.getElementById("display");

display.render = (state) => {
  display.innerText = JSON.stringify(state);
};

// * "Controller" (except, after updating model, I also update view here)

let start = document.getElementById("start");

start.addEventListener("click", () => {
  state = newState();
  state.start = new Date();
  display.render(state);
});

let end = document.getElementById("end");

end.addEventListener("click", () => {
  state.end = new Date();
  display.render(state);
});

let lap = document.getElementById("lap");

lap.addEventListener("click", () => {
  state.laps.push(new Date());
  display.render(state);
});

let reset = document.getElementById("reset");

reset.addEventListener("click", () => {
  state = newState();
  display.render(state);
});
