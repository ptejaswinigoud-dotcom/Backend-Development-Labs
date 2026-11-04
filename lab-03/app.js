
const express = require('express');
const connectDB = require('./database/database');

const app = express();
app.use(express.json());

let db;

// GET /books - Get all books with search, sorting and filters
app.get('/books', async (req, res) => {
    try {
        const {
            search_q = '',
            order_by = 'id',
            order = 'ASC',
            limit = '10',
            offset = '0',
            min_price,
            max_price
        } = req.query;

        const allowedColumns = ['id', 'title', 'author', 'price'];

        if (!allowedColumns.includes(order_by)) {
            return res.status(400).json({ message: 'Invalid order_by value' });
        }

        const sortOrder = order.toUpperCase();

        if (!['ASC', 'DESC'].includes(sortOrder)) {
            return res.status(400).json({ message: 'Order must be ASC or DESC' });
        }

        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (!Number.isInteger(pageLimit) || pageLimit <= 0 ||
            !Number.isInteger(pageOffset) || pageOffset < 0) {
            return res.status(400).json({ message: 'Invalid limit or offset' });
        }

        const conditions = [];
        const params = [];

        if (search_q) {
            conditions.push('title LIKE ?');
            params.push(`%${search_q}%`);
        }

        if (min_price !== undefined) {
            if (!Number.isFinite(Number(min_price))) {
                return res.status(400).json({ message: 'Invalid min_price' });
            }
            conditions.push('price >= ?');
            params.push(Number(min_price));
        }

        if (max_price !== undefined) {
            if (!Number.isFinite(Number(max_price))) {
                return res.status(400).json({ message: 'Invalid max_price' });
            }
            conditions.push('price <= ?');
            params.push(Number(max_price));
        }

        if (min_price !== undefined && max_price !== undefined &&
            Number(min_price) > Number(max_price)) {
            return res.status(400).json({ message: 'min_price cannot exceed max_price' });
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const sql = `
            SELECT * FROM books
            ${whereClause}
            ORDER BY ${order_by} ${sortOrder}
            LIMIT ? OFFSET ?
        `;

        params.push(pageLimit, pageOffset);

        const books = await db.all(sql, params);

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books' });
    }
});

// GET /books/:id - Get a single book
app.get('/books/:id', async (req, res) => {
    try {
        const book = await db.get(
            'SELECT * FROM books WHERE id = ?',
            [req.params.id]
        );

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch book' });
    }
});

// POST /books - Add a new book
app.post('/books', async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author ||
            price === undefined || price === null ||
            typeof price !== 'number' || !Number.isFinite(price)) {
            return res.status(400).json({
                message: 'Title, author and a valid numeric price are required'
            });
        }

        const result = await db.run(
            'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
            [title, author, price]
        );

        res.status(201).json({
            message: 'Book created successfully',
            id: result.lastID
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create book' });
    }
});

// PUT /books/:id - Update a book
app.put('/books/:id', async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author ||
            price === undefined || price === null ||
            typeof price !== 'number' || !Number.isFinite(price)) {
            return res.status(400).json({
                message: 'Title, author and a valid numeric price are required'
            });
        }

        const result = await db.run(
            'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
            [title, author, price, req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update book' });
    }
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const result = await db.run(
            'DELETE FROM books WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to delete book' });
    }
});

// Start server after connecting to database
async function startServer() {
    try {
        db = await connectDB();

        const PORT = 3000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error);
    }
}

startServer();
