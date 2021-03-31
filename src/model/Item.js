const mongoose = require('mongoose');

/**
 * The model of an item
 * @module Item
 */

/**
 * A schema in our database
 */
const itemSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
        max: 255
    }
});

module.exports = mongoose.model('Item', itemSchema);