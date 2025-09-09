const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const User = require('../models/User');
const UserDTO = require('../dto/UserDTO');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const insert = await pool.query(
            'INSERT INTO users(name,email,password,role,avatar) VALUES($1,$2,$3,$4,$5) RETURNING *',
            [name, email, hashed, 'USER', '/uploads/default-avatar.png']
        );

        res.json({ message: 'Register success', user: new UserDTO(new User(insert.rows[0])) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra user tồn tại
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const user = result.rows[0];

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        // 3. Sinh JWT
        const token = jwt.sign(
            { userId: user.userid, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login success',
            token,
            user: new UserDTO(new User(user))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { register, login };
