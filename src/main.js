"use strict";

const lap = document.getElementById("lap");
const start = document.getElementById("start");
const counter = document.getElementById("counter");
const end = document.getElementById("end");
const reset = document.getElementById("reset");
const display = document.getElementById("display");
const results = document
  .getElementById("result-table")
  .getElementsByTagName("tbody")[0];
let timer;

// Convert miliseconds `ms` to frame count at `fps` frames per second.
//
// Explaining functions in plain English has its merits.
function msToFrames(ms, fps) {
  return Math.floor(ms / (1 / fps) / 1000);
}

function msToDisplay(ms) {
  const hours = Math.floor(ms / 1000 / 3600);
  const minutes = Math.floor((ms / 1000 - hours * 3600) / 60);
  const seconds = Math.floor(ms / 1000 - hours * 3600 - minutes * 60);
  return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(
    2,
    "0"
  )}:${`${seconds}`.padStart(2, "0")}.${ms % 1000}`;
}

// Model

let state = {
  start: undefined,
  end: undefined,
  laps: [],
};

function resetState() {
  clearInterval(timer);
  timer = undefined;
  state = { start: undefined, end: undefined, laps: [] };
  lap.disabled = true;
  end.disabled = true;
  results.innerHTML = "";
}

// State -> Display ("View", except manipulated by "Controller")

function newRow(lap, duration) {
  const tr = document.createElement("tr");
  const elem_lap = document.createElement("td");
  const elem_dur = document.createElement("td");
  const elem_dur_24 = document.createElement("td");
  const elem_dur_60 = document.createElement("td");
  elem_lap.innerText = `${lap}`;
  elem_dur.innerText = `${msToDisplay(duration / 1000)}`;
  elem_dur_24.innerText = `${msToFrames(duration, 24)}`;
  elem_dur_60.innerText = `${msToFrames(duration, 60)}`;
  for (const elem of [elem_lap, elem_dur, elem_dur_24, elem_dur_60]) {
    tr.appendChild(elem);
  }
  return tr;
}

display.render = () => {
  let start_time;
  let end_time;
  if (state.start) {
    start_time = state.start.getTime();
    counter.innerText = `${msToDisplay(new Date().getTime() - start_time)}`;
    if (!timer) {
      timer = setInterval(() => {
        display.render();
      }, 5);
    }
  } else {
    counter.innerText = "0";
  }
  if (state.laps.length > 0) {
    results.innerHTML = "";
    state.laps.forEach((moment, index) => {
      results.append(newRow(index + 1, moment.getTime() - start_time));
    });
  }
  if (state.end) {
    end_time = state.end.getTime();
    results.append(newRow("end", end_time - start_time));
    clearInterval(timer);
    timer = undefined;
  }
};

// * "Controller" (except, after updating model, I also update view here)

// Like interactive commands in Emacs. These are meant to be bound to
// buttons or keypresses.
const App = {
  startTimer: () => {
    resetState();
    lap.disabled = false;
    end.disabled = false;
    state.start = new Date();
    display.render();
  },

  endTimer: () => {
    state.end = new Date();
    lap.disabled = true;
    end.disabled = true;
    display.render();
  },

  newLap: () => {
    state.laps.push(new Date());
    display.render();
  },

  reset: () => {
    resetState();
    display.render();
  },
};

start.addEventListener("click", () => {
  App.startTimer();
});

end.addEventListener("click", () => {
  App.endTimer();
});

lap.addEventListener("click", () => {
  App.newLap();
});

reset.addEventListener("click", () => {
  App.reset();
});
