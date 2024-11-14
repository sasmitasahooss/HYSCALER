const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/userModel');

module.exports.registerUser =async (req, res) => {
    try {
        
         const {name, email, password} = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);
         const employee = await Employee.create({name, email, password: hashedPassword});
         res.status(200).json({message: "User registered successfully", employee});
         console.log(employee);
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Email already exists", error: error.message });
        console.log(error)
    }
};



// Login route for employees
module.exports.loginUser = async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const passwordMatch = await bcrypt.compare(req.body.password, employee.password);
        if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: employee._id }, process.env.SESSION_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            resCode: 200,
            role: employee.role,
            id: employee._id,
            token: token
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
