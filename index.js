// Aller chercher données météo du lendemain

const tomorrowButton = document.querySelector("#submit-weather");

const tomorrowDiv = document.querySelector("#tomorrow-weather-result");

async function showTomorrowWeather() {
  const response = await fetch(
    "https://www.prevision-meteo.ch/services/json/paris"
  );

  if (response.ok) {
    // Si le statut de la réponse est de 200 à 299
    // On obtient le corps de la réponse en json
    let json = await response.json();

    tomorrowDiv.innerHTML = `<p>Le temps demain, ${json.fcst_day_1.day_long} ${json.fcst_day_1.date}, à Paris : ${json.fcst_day_1.condition}.</p>`;
  } else {
    tomorrowDiv.innerHTML = `<p>Il y a eu une erreur : ${response.status}.</p>`;
  }
}

tomorrowButton.addEventListener("click", showTomorrowWeather);

// Aller chercher infos users Github

const userInput = document.querySelector("#user-input");

const submitUsers = document.querySelector("#submit-users");

const usersList = document.querySelector("#users");

// Quand on clique sur le bouton submit, on crée un tableau d'utilisateurs basé sur la chaîne rentrée par l'utilisateur

submitUsers.addEventListener("click", e => {
  e.preventDefault();

  // Si l'utilisateur rentre du texte dans l'input, on continue

  if (userInput.value !== "") {
    // S'il n'y a pas d'élément dans la liste, on insère un titre h3 avant elle

    if (usersList.firstChild === null) {
      usersList.insertAdjacentHTML(
        "beforebegin",
        `<h3>Informations sur utilisateurs Github</h3>`
      );
    }

    let users = userInput.value.split(", ");

    getUsers(users); // On envoie ce tableau à la fonction getUsers pour aller chercher les données des utilisateurs correspondants
  }
});

function getUsers(names) {
  // Pour chaque user du tableau on fetch les données utilisateurs en passant le nom dans l'URL

  names.forEach(async name => {
    // Si la liste HTML est vide on fetch les données et on la remplit avec les infos des utilisateurs spécifiés

    if (usersList.childNodes.length === 0) {
      let response = await fetch(`https://api.github.com/users/${name}`);

      let json = await response.json(); // On parse la réponse en json

      // Si la requête n'aboutit pas, on affiche un message d'erreur et on n'affiche pas l'utilisateur dont la requête a posé problème

      if (!response.ok) {
        alert("Au moins un utilisateur n'a pu être trouvé.");
      } else {
        // Si la requête a aboutit, on envoie le json reçu vers la fonction displayUserInfo() pour formater les informations de l'utilisateur et les afficher
        displayUserInfo(json);
      }
    }
  });
}

async function displayUserInfo(json) {
  // On crée un template content (modèle de contenu) dans lequel on stocke le contenu HTML des infos de l'utilisateur

  let temp = document.createElement("template");

  temp.innerHTML = `<li><p>${json.login}<p/><p>Créé le : ${json.created_at}<p/> Followers : ${json.followers}</li>`;

  let fragment = temp.content;

  // On ajoute le fragment avec les infos à la liste

  usersList.appendChild(fragment);
}

// Envoyer des données avec requête POST

const input = document.querySelector("#value");

const submitButton = document.querySelector("#submit-post");

async function send(e) {
  // On empêche le bouton submit d'envoyer le formulaire

  e.preventDefault();

  // On envoie une requête POST qui contient le texte entré dans l'input text, converti en JSON

  let response = await fetch("https://mockbin.com/request", {
    method: "POST",
    headers: { "Content-type": "application/JSON;charset=UTF-8" },
    body: JSON.stringify(input.value),
  });

  let result = await response.json();

  const resultDiv = document.querySelector("#result");

  resultDiv.innerHTML = `<p>${result.postData.text}</p>`; // On affiche le texte de la requête POST qui nous est retournée par le site
}

submitButton.addEventListener("click", e => send(e));
