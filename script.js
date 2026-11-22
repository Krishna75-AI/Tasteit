
// ==========================================
// TASTEIT - RECIPE FINDER
// ==========================================

// API URL
const API_URL = "https://www.themealdb.com/api/json/v1/1";

// HTML Elements
const searchInput = document.getElementById("search-input");
const cardContainer = document.getElementById("card-container");
const modalOverlay = document.getElementById("modal-overlay");


// ==========================================
// 1. LOAD POPULAR RECIPES
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    fetchPopularRecipes();
});

async function fetchPopularRecipes() {

    cardContainer.innerHTML = "<p>Loading delicious recipes...</p>";

    try {

        const response = await fetch(`${API_URL}/search.php?s=`);

        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();

        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            cardContainer.innerHTML = "<p>No recipes available.</p>";
        }

    } catch (error) {

        console.error("Error:", error);

        cardContainer.innerHTML =
            "<p>Unable to load recipes. Please try again later.</p>";
    }
}


// ==========================================
// 2. SEARCH RECIPES
// ==========================================

async function getValue() {

    const searchValue = searchInput.value.trim();

    if (searchValue === "") {
        alert("Please enter a recipe name!");
        searchInput.focus();
        return;
    }

    cardContainer.innerHTML = "<p>Searching recipes...</p>";

    try {

        const response = await fetch(
            `${API_URL}/search.php?s=${encodeURIComponent(searchValue)}`
        );

        if (!response.ok) {
            throw new Error("Search request failed");
        }

        const data = await response.json();

        if (data.meals) {

            displayRecipes(data.meals);

        } else {

            cardContainer.innerHTML =
                "<p>No recipes found. Try searching for something else!</p>";
        }

    } catch (error) {

        console.error("Search error:", error);

        cardContainer.innerHTML =
            "<p>Something went wrong. Please try again.</p>";
    }
}


// ==========================================
// 3. DISPLAY RECIPE CARDS
// ==========================================

function displayRecipes(recipes) {

    cardContainer.innerHTML = "";

    recipes.forEach(recipe => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img
                src="${recipe.strMealThumb}"
                alt="${recipe.strMeal}"
                class="card-img"
                loading="lazy"
            >

            <h3 class="card-title">
                ${recipe.strMeal}
            </h3>

            <p class="typeofood">
                ${recipe.strCategory || "Delicious Recipe"}
            </p>

            <p class="timep">
                ${recipe.strArea || "International"} Cuisine
            </p>

            <button class="view-btn">
                View Recipe
            </button>
        `;

        // Open recipe details
        card.querySelector(".view-btn").addEventListener("click", () => {
            getRecipeDetails(recipe.idMeal);
        });

        cardContainer.appendChild(card);

    });
}


// ==========================================
// 4. GET RECIPE DETAILS
// ==========================================

async function getRecipeDetails(recipeId) {

    try {

        const response = await fetch(
            `${API_URL}/lookup.php?i=${recipeId}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch recipe details");
        }

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {

            openRecipeModal(data.meals[0]);

        } else {

            alert("Recipe details not found!");
        }

    } catch (error) {

        console.error("Recipe details error:", error);

        alert("Unable to load recipe details. Please try again.");
    }
}


// ==========================================
// 5. OPEN RECIPE MODAL
// ==========================================

function openRecipeModal(recipe) {

    // Recipe image
    const modalImg = document.getElementById("modal-img");

    modalImg.src = recipe.strMealThumb;
    modalImg.alt = recipe.strMeal;

    // Recipe title
    document.getElementById("modal-title").textContent =
        recipe.strMeal;

    // Category
    document.getElementById("modal-category").textContent =
        recipe.strCategory || "Recipe";

    // Cuisine
    document.getElementById("modal-area").textContent =
        recipe.strArea || "International";

    // Cooking instructions
    document.getElementById("modal-instructions").textContent =
        recipe.strInstructions || "No instructions available.";

    // Ingredients
    const ingredientsList =
        document.getElementById("ingredients-list");

    ingredientsList.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {

            const li = document.createElement("li");

            li.textContent =
                `${ingredient} - ${measure || "As required"}`;

            ingredientsList.appendChild(li);
        }
    }

    // YouTube video
    const videoLink = document.getElementById("modal-video");

    if (recipe.strYoutube) {

        videoLink.href = recipe.strYoutube;
        videoLink.style.display = "inline-block";

    } else {

        videoLink.style.display = "none";
    }

    // Show modal
    modalOverlay.classList.add("active");

    // Prevent background scrolling
    document.body.style.overflow = "hidden";
}


// ==========================================
// 6. CLOSE RECIPE MODAL
// ==========================================

function closeModal() {

    modalOverlay.classList.remove("active");

    document.body.style.overflow = "auto";
}


// ==========================================
// 7. CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

modalOverlay.addEventListener("click", (event) => {

    if (event.target === modalOverlay) {

        closeModal();
    }

});


// ==========================================
// 8. CLOSE MODAL USING ESCAPE KEY
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeModal();
    }

});


// ==========================================
// 9. SEARCH USING ENTER KEY
// ==========================================

searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        getValue();
    }

});

