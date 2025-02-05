import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { isPerfect, isArmstrong, DEFINITIONS } from "../../utilities/utils.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

export const handler = async (event, context) => {
    const number = req.query.number;
    const num = parseInt(number);

    if (!/^-?\d+$/.test(number)) {
        return res.status(400).json({
            number,
            error: true,
            message: "Invalid number format",
        });
    }

    const properties = {
        is_perfect: isPerfect(num),
        is_armstrong: isArmstrong(num),
    };

    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        const funFact = response.data;

        res.status(200).json({
            number: num,
            properties,
            definitions: DEFINITIONS,
            sum_of_digits: String(num)
                .split("")
                .reduce((sum, digit) => sum + Number(digit), 0),
            fun_fact: funFact,
        });
    } catch (error) {
        res.status(500).json({
            number: num,
            error: true,
            message: "Error fetching fun fact",
        });
    }
}