let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetchToys();        // Fetch all toys on page load
  setupForm();        // Set up form submit listener
});

// GET: Fetch and render all toys
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toys => toys.forEach(renderToy));
}

// Create toy card in the DOM
function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeBtn = card.querySelector("button");
  likeBtn.addEventListener("click", () => {
    likeToy(toy, card);
  });

  toyCollection.appendChild(card);
}

// Handle form submission (POST request)
function setupForm() {
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(resp => resp.json())
    .then(toy => renderToy(toy)); // Add new toy to DOM

    form.reset();
  });
}

// PATCH: Increase likes
function likeToy(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(resp => resp.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes;
    card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
  });
}

