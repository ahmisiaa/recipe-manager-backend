const Recipe = require('../models/Recipe');

const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category, prepTime } = req.body;

        if (!title || !instructions) {
            return res.status(400).json({ error: 'Please include at least a title and instructions.' });
        }

        const recipe = await Recipe.create({
            user: req.user.id, 
            title,
            description,
            ingredients,
            instructions,
            category,
            prepTime,
        });

        res.status(201).json(recipe);

    } catch (error) {
        res.status(500).json({ error: 'Server error during recipe creation.' });
    }
};

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id });
        res.status(200).json(recipes);
        
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching recipes.' });
    }
};

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized to view this recipe.' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching recipe.' });
    }
};

const updateRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized to update this recipe.' });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true, 
        });

        res.status(200).json(updatedRecipe);

    } catch (error) {
        res.status(500).json({ error: 'Server error updating recipe.' });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found.' });
        }

        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Not authorized to delete this recipe.' });
        }

        await Recipe.deleteOne({ _id: req.params.id }); 
        
        res.status(200).json({ message: 'Recipe removed successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting recipe.' });
    }
};


module.exports = {
    createRecipe,
    getRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
};