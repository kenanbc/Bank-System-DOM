import { Banka, banka } from "./banka.js";
import { CheckingRacun } from "./banka.js";
import { SavingsRacun } from "./banka.js";
import { Racun } from "./banka.js";

//login

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = banka.nadjiRacun(undefined, username);
    const transactions = banka.nadjiTransakcije(user.brojRacuna);

    if (username === user.username && password === user.password){
      alert("Uspješno ste prijavljeni!");
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('transactions', JSON.stringify(transactions));
      window.location.href = "./index.html";
    } else {
      alert("Pogrešno uneseno ime ili password.");
    }
  });
  