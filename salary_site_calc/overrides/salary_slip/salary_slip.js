frappe.ui.form.on('Salary Slip', {
    employee: function (frm) {
        process_salary_calculation(frm);
    },

    onload: function (frm) {
        frm.set_df_property('employee', 'read_only', 1);
    },

    onload_post_render: function (frm) {
        if (frm.doc.status === "Submitted" || (frm.doc.status === "Draft" && frm.doc.employee)) {
            process_salary_calculation(frm);
        }
    },

    posting_date: function (frm) {
        if (frm.doc.posting_date) {
            frm.set_df_property('employee', 'read_only', 0);

        } else {
            frm.set_df_property('employee', 'read_only', 1);
            frm.set_value('employee', null);
        }
    },

    after_save: function (frm) {
        process_salary_calculation(frm);
    },

    after_submit: function (frm) {
        process_salary_calculation(frm);
    }
});

function process_salary_calculation(frm) {
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
                fetch_last_salary_structure(frm.doc.employee, async function (sitePercentage) {
                    if (sitePercentage !== null) {
                        await calculate_salary(frm, attendanceRecordsLength, sitePercentage);
                    } else {
                        console.error("Failed to get site percentage.");
                    }
                });
            } else {
                console.error("No attendance records found.");
            }
        },
        error: function (err) {
            console.error("Error fetching attendance:", err);
        }
    });
}


async function calculate_salary(frm, attendanceRecordsLength, sitePercentage) {
    const earnings = frm.doc.earnings;
    const deductions = frm.doc.deductions || [];

    if (!earnings || earnings.length === 0) {
        console.error("No earnings found in salary slip.");
        return;
    }

    const basicEarning = earnings.find(e => e.salary_component === 'Basic');
    if (!basicEarning) {
        console.error("No Basic Salary component found.");
        return;
    }

    const salaryPerDay = basicEarning.amount / frm.doc.payment_days;
    const siteBonus = attendanceRecordsLength * (sitePercentage * salaryPerDay / 100);
    const newBasicAmount = basicEarning.amount + siteBonus;

    basicEarning.amount = newBasicAmount;

    const totalEarnings = earnings.reduce((total, e) => total + e.amount, 0);
    const totalDeductions = deductions.reduce((total, d) => total + d.amount, 0);
    const netPay = totalEarnings - totalDeductions;

    frm.doc.base_gross_pay = totalEarnings;
    frm.doc.gross_pay = totalEarnings;
    frm.doc.net_pay = netPay;
    frm.doc.base_net_pay = netPay;
    frm.doc.rounded_total = Math.round(netPay);
    frm.doc.base_rounded_total = Math.round(netPay);

    const amountInWords = await getMoneyInWords(netPay);
    frm.doc.total_in_words = amountInWords;
    frm.doc.base_total_in_words = amountInWords;

    const paymentOfficeDays = frm.doc.payment_days - attendanceRecordsLength;
    const paymentSiteDays = attendanceRecordsLength;

    frm.doc.custom_total_office = paymentOfficeDays * salaryPerDay;
    frm.doc.custom_total_site = paymentSiteDays * salaryPerDay + siteBonus;
    frm.doc.custom_days_on_site = paymentSiteDays;
    frm.doc.custom_days_on_office = paymentOfficeDays;

    frm.doc.gross_year_to_date = totalEarnings;
    frm.doc.base_gross_year_to_date = totalEarnings;
    frm.doc.year_to_date = totalEarnings;
    frm.doc.base_year_to_date = totalEarnings;
    frm.doc.month_to_date = totalEarnings;
    frm.doc.base_month_to_date = totalEarnings;

    frappe.model.set_value(basicEarning.doctype, basicEarning.name, "amount", newBasicAmount);

    frm.refresh_fields();
    frm.save();
}


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

function getMoneyInWords(amount) {
    return new Promise((resolve, reject) => {
        frappe.call({
            method: "salary_site_calc.overrides.salary_slip.salary_slip.get_money_in_words",
            args: {
                amount: Math.round(amount)
            },
            callback: function (response) {
                if (response.message) {
                    resolve(response.message);
                } else {
                    reject("No message received");
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}
