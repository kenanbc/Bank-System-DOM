import { Banka } from "./banka.js";
import { CheckingRacun } from "./banka.js";
import { SavingsRacun } from "./banka.js";
import { Racun } from "./banka.js";

const banka = new Banka("Mese Selimovica 1");

// user-i napravljeni kao primjer
const user1 = CheckingRacun.kreirajCheckingRacun(
 "Mujo Mujic",
  700,
  "a",
  "a",
  banka
);
const user2 = CheckingRacun.kreirajCheckingRacun(
  "Niko Nikic",
  500,
  "niko456",
  "pass456",
  banka
);

//login

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = banka.nadjiRacun(undefined, username);

    if (username === user.username && password === user.password){
      alert("Uspješno ste prijavljeni!");
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.href = "./index.html";
    } else {
      alert("Pogrešno uneseno ime ili password.");
    }
  });
  