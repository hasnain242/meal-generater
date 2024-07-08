const search = document.getElementById("search");
const form = document.getElementById("submit"); 
const generate = document.getElementById("generate");
const resultsHeading = document.getElementById("results-heading");
const meals = document.getElementById("meals");
const selectedMeal = document.getElementById("selected-meal");

function searchMeal(e) {
  e.preventDefault();

  const searchText = search.value.trim();

  if (searchText) {
    fetchMeals(searchText);
    search.value = "";
    selectedMeal.innerHTML = "";
  } else {
    alert("Please enter a search keyword");
  }
}

function fetchMeals(searchText) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displaySearchResults(searchText, data.meals);
    })
    .catch((err) => {
      console.error(err);
      resultsHeading.innerHTML = `<h2>Error fetching results. Please try again later.</h2>`;
    });
}

function displaySearchResults(searchText, mealsData) {
  if (mealsData === null) {
    resultsHeading.innerHTML = `<h2>No results found for "${searchText}"</h2>`;
    meals.innerHTML = "";
  } else {
    resultsHeading.innerHTML = `<h2>Search results for "${searchText}"</h2>`;
    meals.innerHTML = mealsData
      .map(
        (meal) => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealid="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `
      )
      .join("");
  }
}

function getMeal(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMealDetails(meal);
    })
    .catch((err) => {
      console.error(err);
      resultsHeading.innerHTML = `<h2>Error fetching meal details. Please try again later.</h2>`;
    });
}

function displayMealDetails(meal) {
  meals.innerHTML = "";
  resultsHeading.innerHTML = "";
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  selectedMeal.innerHTML = `
        <div class="selected-meal-details">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="selected-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
            </div>
            <div class="selected-meal-instructions">
                <p>${meal.strInstructions}</p>
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients
                      .map((ingredient) => `<li>${ingredient}</li>`)
                      .join("")}
                </ul>
            </div>
        </div>
    `;
}
function random() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMealDetails(meal);
    });
}

form.addEventListener("submit", searchMeal);

meals.addEventListener("click", (e) => {
  const path = e.composedPath();
  const mealInfo = path.find(
    (item) => item.classList && item.classList.contains("meal-info")
  );
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
    getMeal(mealId);
  }
});
generate.addEventListener("click", random);
