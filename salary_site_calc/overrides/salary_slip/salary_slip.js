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
                    const attendanceRecordsLength = response.message.length;
                    fetch_last_salary_structure(frm.doc.employee, function (sitePercentage) {
                        if (sitePercentage !== null) {
                            console.log("Attendance Records:", attendanceRecordsLength);
                            console.log("Site Percentage:", sitePercentage);
                            frm.doc.base_gross_pay = 1000;
                            frm.doc.save();

                        } else {
                            console.error("Failed to get site percentage.");
                        }
                    });
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

function fetch_last_salary_structure(employee, callback) {
    frappe.call({
        method: "salary_site_calc.overrides.salary_slip.salary_slip.get_last_salary_structure",
        args: {
            employee: employee
        },
        callback: function (response) {
            if (response.message) {
                callback(response.message.custom_site_percentage);
            } else {
                console.error("No salary structure found.");
            }
        },
        error: function (err) {
            console.error("Error fetching salary structure:", err);
        }
    });
}

function update_salary_slip(attendanceRecords, sitePercentage) {
    const attendanceLength = attendanceRecords.length;

    const earnings = frappe.model.get_value("Salary Slip", "earnings");

    if (earnings && earnings.length > 0) {
        const earning = earnings[0];

        const defaultAmount = earning.default_amount || 0;
        const newAmount = attendanceLength * sitePercentage * defaultAmount;

        earning.amount = newAmount;
        frappe.model.set_value(earning.doctype, earning.name, "amount", newAmount);
        //frappe.model.set_value("Salary Slip", "Gross Pay", "base_gross_pay", newAmount);
        console.log("Updated Earnings:", earning);
    } else {
        console.error("No earnings found in salary slip.");
    }
}