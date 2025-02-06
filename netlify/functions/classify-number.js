const axios = require('axios');

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

const DEFINITIONS = {
    perfect_number: "A perfect number is a positive integer that is equal to the sum of its proper divisors (excluding the number itself).",
    armstrong_number: "An Armstrong number is a number that is the sum of its own digits each raised to the power of the number of digits."
};

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const number = parseInt(event.queryStringParameters.number);

        if (isNaN(number)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: "Please provide a valid number"
                })
            };
        }

        if (!/^-?\d+$/.test(event.queryStringParameters.number)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    number,
                    message: "Invalid number format"
                })
            };
        }

        // Determine all number properties
        const classifications = [];
        
        // Check even/odd
        classifications.push(number % 2 === 0 ? "even" : "odd");
        
        // Check perfect number
        if (isPerfect(number)) {
            classifications.push("perfect");
        }
        
        // Check Armstrong number
        if (isArmstrong(number)) {
            classifications.push("armstrong");
        }

        // Check prime number
        if (isPrime(number)) {
            classifications.push("prime");
        }

        try {
            const response = await axios.get(`http://numbersapi.com/${number}/math`);
            classifications.push("fun fact: " + response.data);
        } catch (error) {
            console.error("Error fetching fun fact:", error.message);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: true,
                number: number,
                classifications,
                sum_of_digits: String(number)
                    .split("")
                    .reduce((sum, digit) => sum + Number(digit), 0),
                definitions: DEFINITIONS
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: false,
                message: error.message || "Internal server error"
            })
        };
    }
};
