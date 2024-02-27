import { startLeaderGeneration } from "./tagleaderboard.js";
import * as discs from "./discs.js";

if (document.readyState !== "loading") {
  console.log("ready...");
  setTimeout(discs.LoadRandomDiscData, 0);
  setTimeout(startLeaderGeneration, 0);
} else {
  console.log("waiting for dom...");
  document.addEventListener("DOMContentLoaded", LoadRandomDiscData);
}
