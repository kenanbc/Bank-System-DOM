// user-i napravljeni kao primjer

const users = [
  { username: "kenan", password: "1234" },
  { username: "tarik", password: "4321" },
];

//login

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      alert("Uspješno ste prijavljeni!");

      window.location.href = "";
    } else {
      alert("Pogrešno uneseno ime ili password.");
    }
  });
