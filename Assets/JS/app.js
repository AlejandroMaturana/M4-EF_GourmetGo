// Elementos
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

// Event Listener for Search
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ingredient = searchInput.value.trim();
  if (ingredient) {
    searchRecipes(ingredient);
  }
});

// Función para buscar recetas
const searchRecipes = async (ingredient) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Por si no se encontraron resultados
    if (!data.meals) {
      renderNoResults();
      return;
    }
    const meals = data.meals;
    // Obtener detalles de cada receta
    const detailedMealsPromises = meals.map(async (meal) => {
      const detailResponse = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const detailData = await detailResponse.json();
      return detailData.meals[0];
    });
    const detailedMeals = await Promise.all(detailedMealsPromises);
    renderRecipes(detailedMeals);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    resultsContainer.innerHTML = `<p class="text-center text-danger">Ocurrió un error al buscar recetas. Por favor, intenta de nuevo.</p>`;
  }
};

const renderNoResults = () => {
  resultsContainer.innerHTML = `
      <div class="col-12">
        <p class="text-center fs-4">No se encontraron coincidencias. Intenta con otro ingrediente.</p>
      </div>
    `;
};

// Renderizar recetas
const renderRecipes = (meals) => {
  resultsContainer.innerHTML = "";
  meals.forEach((meal) => {
    const { strMeal, strMealThumb, strInstructions } = meal;

    // Truncar instrucciones para descripción
    const description = strInstructions
      ? strInstructions.slice(0, 250) + "..."
      : "No hay descripción disponible.";

    const recipeCard = `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card recipe-card h-100">
          <img
            src="${strMealThumb}"
            class="card-img-top"
            alt="${strMeal}"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${strMeal}</h5>
            <p class="card-text flex-grow-1">
              ${description}
            </p>
            <a href="#" class="btn btn-primary mt-auto">Ver receta →</a>
          </div>
        </div>
      </div>
    `;

    resultsContainer.innerHTML += recipeCard;
  });
};
