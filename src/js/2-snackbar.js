// Убедись, что пакет установлен: npm i izitoast
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) {
    console.error('Форма .form не найдена в DOM.');
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const delayRaw = fd.get("delay");
    const state = fd.get("state"); // "fulfilled" | "rejected" | null

    const delay = Number(delayRaw);
    if (!Number.isFinite(delay) || delay < 0) {
      iziToast.error({ title: "Error", message: "Укажи delay (мс) — неотрицательное число." });
      return;
    }
    if (state !== "fulfilled" && state !== "rejected") {
      iziToast.error({ title: "Error", message: "Выбери состояние: Fulfilled или Rejected." });
      return;
    }

    createPromise(delay, state === "fulfilled")
      .then((ms) => {
        console.log(`✅ Fulfilled promise in ${ms}ms`);
        iziToast.success({ title: "OK", message: `Fulfilled in ${ms}ms`, position: "topRight" });
      })
      .catch((ms) => {
        console.log(`❌ Rejected promise in ${ms}ms`);
        iziToast.error({ title: "Error", message: `Rejected in ${ms}ms`, position: "topRight" });
      });
  });
});

function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldResolve ? resolve(delay) : reject(delay);
    }, delay);
  });
}
