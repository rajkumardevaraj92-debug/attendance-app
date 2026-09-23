const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.status(200).json({
            status: "healthy",
            database: "connected"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});

app.get("/api/employees", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                employee_id,
                name,
                email,
                department
            FROM employees
            ORDER BY employee_id
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to retrieve employees"
        });
    }
});

app.post("/api/employees", async (req, res) => {
    try {
        const {
            name,
            email,
            department
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: "Name and email are required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO employees
            (name, email, department)
            VALUES (?, ?, ?)
            `,
            [
                name,
                email,
                department
            ]
        );

        res.status(201).json({
            message: "Employee created",
            employee_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to create employee"
        });
    }
});

app.get("/api/attendance", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                a.attendance_id,
                e.employee_id,
                e.name,
                e.department,
                a.attendance_date,
                a.status
            FROM attendance a
            JOIN employees e
                ON a.employee_id = e.employee_id
            ORDER BY a.attendance_date DESC,
                     e.name
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to retrieve attendance"
        });
    }
});

app.post("/api/attendance", async (req, res) => {
    try {
        const {
            employee_id,
            attendance_date,
            status
        } = req.body;

        if (!employee_id || !attendance_date || !status) {
            return res.status(400).json({
                error: "Employee, date and status are required"
            });
        }

        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({
                error: "Invalid attendance status"
            });
        }

        await db.query(
            `
            INSERT INTO attendance
            (
                employee_id,
                attendance_date,
                status
            )
            VALUES (?, ?, ?)

            ON DUPLICATE KEY UPDATE
                status = VALUES(status)
            `,
            [
                employee_id,
                attendance_date,
                status
            ]
        );

        res.status(201).json({
            message: "Attendance saved"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to save attendance"
        });
    }
});

app.use(express.static(
    path.join(__dirname, "../frontend")
));

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Attendance application running on port ${PORT}`
    );
});
