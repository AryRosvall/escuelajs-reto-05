const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";

let next_fetch;

const paintData = (data, next) => {
  let output;
  if (data) {
    const characters = data;
    output = characters
      .map(character => {
        return `
        <article class="Card">
          <img src="${character.image}" />
          <h2>${character.name}<span>${character.species}</span></h2>
        </article>
      `;
      })
      .join("");
  }
  if (!next) {
    output += `<div class="NoMore"><h2>¡Fin del camino!</h2><div/>`;
    intersectionObserver.unobserve($observe);
  }
  let newItem = document.createElement("section");
  newItem.classList.add("Items");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
};

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      let next;
      if (response.info.next) {
        localStorage.setItem("next_fetch", response.info.next);
        next = true;
      } else {
        next = false;
      }
      paintData(response.results, next);
    })
    .catch(error => console.log(error));
};

const loadData = async () => {
  let url;
  next_fetch = localStorage.getItem("next_fetch");
  url = next_fetch ? next_fetch : API;
  await getData(url);
};

const intersectionObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);

window.addEventListener("beforeunload", () => localStorage.clear());
