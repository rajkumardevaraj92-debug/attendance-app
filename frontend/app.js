const employeeForm =
    document.getElementById("employeeForm");

const attendanceForm =
    document.getElementById("attendanceForm");

const employeeTable =
    document.getElementById("employeeTable");

const attendanceTable =
    document.getElementById("attendanceTable");

const employeeSelect =
    document.getElementById("employee");


/*
    Load employees
*/
async function loadEmployees() {

    const response =
        await fetch("/api/employees");

    const employees =
        await response.json();


    employeeTable.innerHTML = "";

    employeeSelect.innerHTML =
        `<option value="">Select Employee</option>`;


    employees.forEach(employee => {

        employeeTable.innerHTML += `

            <tr>

                <td>
                    ${employee.employee_id}
                </td>

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.department || ""}
                </td>

            </tr>

        `;


        employeeSelect.innerHTML += `

            <option value="${employee.employee_id}">

                ${employee.name}

            </option>

        `;

    });
}


/*
    Add employee
*/
employeeForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const employee = {

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            department:
                document.getElementById("department").value
        };


        const response =
            await fetch(
                "/api/employees",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(employee)
                }
            );


        const result =
            await response.json();


        alert(result.message || result.error);


        if (response.ok) {

            employeeForm.reset();

            loadEmployees();

        }

    }
);


/*
    Mark attendance
*/
attendanceForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const attendance = {

            employee_id:
                document.getElementById(
                    "employee"
                ).value,

            attendance_date:
                document.getElementById(
                    "attendanceDate"
                ).value,

            status:
                document.getElementById(
                    "status"
                ).value

        };


        const response =
            await fetch(
                "/api/attendance",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(attendance)
                }
            );


        const result =
            await response.json();


        alert(result.message || result.error);


        if (response.ok) {

            loadAttendance();

        }

    }
);


/*
    Load attendance
*/
async function loadAttendance() {

    const response =
        await fetch("/api/attendance");

    const records =
        await response.json();


    attendanceTable.innerHTML = "";


    records.forEach(record => {

        attendanceTable.innerHTML += `

            <tr>

                <td>
                    ${record.name}
                </td>

                <td>
                    ${record.department || ""}
                </td>

                <td>
                    ${record.attendance_date}
                </td>

                <td>
                    ${record.status}
                </td>

            </tr>

        `;

    });
}


/*
    Initial loading
*/
loadEmployees();

loadAttendance();