import Posts from "../models/posts.model.js";
import Users from "../models/users.model.js";
import Category from "../models/category.js";

class CategoryController {
    // Read all categories
    static async read(req, res) {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            console.error('Error reading categories:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update a category by ID
    static async update(req, res) {
        const categoryId = req.params.id;
        const { name } = req.body;
        try {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            category.name = name;
            await category.save();
            res.json({ message: 'Category updated successfully', data: category });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default CategoryController;
