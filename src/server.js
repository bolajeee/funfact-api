import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const DEFINITIONS = {
    perfect_number: "A perfect number is a positive integer that is equal to the sum of its proper divisors (excluding the number itself).",
    armstrong_number: "An Armstrong number is a number that is the sum of its own digits each raised to the power of the number of digits."
};

const app = express();
app.use(express.json());
app.use(cors());

// Helper function to check if a number is perfect
function isPerfect(num) {
    if (num <= 0) return false;
    let sum = 0;
    for (let i = 1; i < num; i++) {
        if (num % i === 0) {
            sum += i;
        }
    }
    return sum === num;
}

// Helper function to check if a number is Armstrong
function isArmstrong(num) {
    if (num < 0) return false;
    const digits = String(num).split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
    return sum === num;
}

// Helper function to check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

app.get("/api/classify-number", async (req, res) => {
    try {
        const number = parseInt(req.query.number);
        const num = parseInt(number);

        if (isNaN(number)) {
            return res.status(400).json({
                status: false,
                message: "Please provide a valid number"
            });
        }   
        
        if (!/^-?\d+$/.test(number)) {
            return res.status(400).json({
                status: false,
                number,
                message: "Invalid number format",
            });
        }

        // Determine all number properties
        const classifications = [];
        
        // Check even/odd
        classifications.push(num % 2 === 0 ? "even" : "odd");
        
        // Check perfect number
        if (isPerfect(num)) {
            classifications.push("perfect");
        }
        
        // Check Armstrong number
        if (isArmstrong(num)) {
            classifications.push("armstrong");
        }

        // Check prime number
        if (isPrime(num)) {
            classifications.push("prime");
        }

        try {
            const response = await axios.get(`http://numbersapi.com/${num}/math`);
            classifications.push("fun fact: " + response.data);
        } catch (error) {
            console.error("Error fetching fun fact:", error.message);
        }

        res.status(200).json({
            status: true,
            number: num,
            classifications,
            sum_of_digits: String(num)
                .split("")
                .reduce((sum, digit) => sum + Number(digit), 0),
            definitions: DEFINITIONS
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            number: req.query.number,
            message: error.message || "Internal server error",
        });
    }
});

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
    } else {
        console.error('Error starting server:', err.message);
    }
    process.exit(1);
});
