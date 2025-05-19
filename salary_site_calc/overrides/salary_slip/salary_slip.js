frappe.ui.form.on('Salary Slip', {

    employee: function (frm) {
        frappe.call({
            method: "salary_site_calc.overrides.salary_slip.salary_slip.fetch_attendance",
            args: {
                employee: frm.doc.employee,
                start_date: frm.doc.start_date,
                end_date: frm.doc.end_date
            },
            callback: function (response) {
                if (response.message) {
                    console.log("Attendance Records:", response.message.length);
                    fetch_last_salary_structure(frm.doc.employee, frm.doc.name, response.message.length);
                } else {
                    console.error("No records found.");
                }
            },
            error: function (err) {
                console.error("Error fetching attendance:", err);
            }
        });


    }
});

function fetch_last_salary_structure(employee, salarySlip, attendanceRecords) {
    frappe.call({
        method: "salary_site_calc.overrides.salary_slip.salary_slip.get_last_salary_structure",
        args: {
            employee: employee
        },
        callback: function (response) {
            if (response.message) {
                console.log("Site Percentage:", response.message.custom_site_percentage);
                fetch_salary_slip(salarySlip, response.message.custom_site_percentage, attendanceRecords);
            } else {
                console.error("No salary structure found.");
            }
        },
        error: function (err) {
            console.error("Error fetching salary structure:", err);
        }
    });
}

function fetch_salary_slip(salarySlipName, sitePercentage, attendanceRecords) {
    frappe.call({
        method: "frappe.get_doc",
        args: {
            doctype: "Salary Slip",
            name: salarySlipName
        },
        callback: function (response) {
            if (response.message) {
                const salarySlipDoc = response.message;
                update_salary_slip(attendanceRecords, sitePercentage, salarySlipDoc);
            } else {
                console.error("No salary slip found.");
            }
        },
        error: function (err) {
            console.error("Error fetching salary slip:", err);
        }
    });
}

function update_salary_slip(attendanceRecords, sitePercentage, salarySlipDoc) {
    const attendanceLength = attendanceRecords.length;

    const earnings = salarySlipDoc.earnings;

    if (earnings && earnings.length > 0) {
        const earning = earnings[0];

        const defaultAmount = earning.default_amount || 0;
        const newAmount = attendanceLength * sitePercentage * defaultAmount;

        earning.amount = newAmount;

        earning.year_to_date += newAmount;

        console.log("Updated Earnings:", earning);
    } else {
        console.error("No earnings found in salary slip.");
    }
}