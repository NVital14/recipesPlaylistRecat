class Recipe {
    userId;
    id;
    category = [];
    title;
    image;
    ingredients = [];
    steps = [];
    duration;
    complexity;
    affordability;
    isFavorite;
    isShared;
    isGlutenFree;
    isLactoseFree;
    isVegan;
    isVegetarian;

    Recipe() {
        this.id = null;
        this.category = null;
        this.title = null;
        this.image = null;
        this.ingredients = null;
        this.steps = null;
        this.time = null;
        this.affordability = null;
        this.complexity = null;
    }

    Recipe(id, category, title, image, ingredients, steps, time, affordability, complexity) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.image = image;
        this.ingredients = ingredients;
        this.steps = steps;
        this.time = time;
        this.affordability = affordability;
        this.complexity = complexity;
    }
}