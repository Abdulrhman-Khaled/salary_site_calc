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
                    fetch_last_salary_structure(frm.doc.employee, async function (sitePercentage) {
                        if (sitePercentage !== null) {
                            const earnings = frm.doc.earnings;

                            if (earnings && earnings.length > 0) {
                                const earning = earnings[0];
                                const salaryPerDay = earning.amount / frm.doc.payment_days;
                                const newAmount = earning.amount + (attendanceRecordsLength * (sitePercentage * salaryPerDay / 100));

                                const paymentOfficeDays = frm.doc.payment_days - attendanceRecordsLength;
                                const paymentSiteDays = attendanceRecordsLength;

                                earning.amount = newAmount;

                                frm.doc.base_gross_pay = newAmount;
                                frm.doc.gross_pay = newAmount;
                                frm.doc.net_pay = newAmount;
                                frm.doc.base_net_pay = newAmount;
                                frm.doc.rounded_total = Math.round(newAmount);
                                frm.doc.base_rounded_total = Math.round(newAmount);
                                const amountInWords = await getMoneyInWords(newAmount);
                                frm.doc.total_in_words = amountInWords;
                                frm.doc.base_total_in_words = amountInWords;

                                frm.doc.custom_total_office = paymentOfficeDays * salaryPerDay;
                                frm.doc.custom_total_site = paymentSiteDays * salaryPerDay + (paymentSiteDays * (sitePercentage * salaryPerDay / 100));

                                frappe.model.set_value(earning.doctype, earning.name, "amount", newAmount);

                                frm.doc.custom_days_on_site = paymentSiteDays;
                                frm.doc.custom_days_on_office = paymentOfficeDays;

                                frm.doc.gross_year_to_date = newAmount;
                                frm.doc.base_gross_year_to_date = newAmount;
                                frm.doc.year_to_date = newAmount;
                                frm.doc.base_year_to_date = newAmount;
                                frm.doc.month_to_date = newAmount;
                                frm.doc.base_month_to_date = newAmount;

                                frm.refresh_field("earnings");
                                frm.refresh_field("base_gross_pay");
                                frm.refresh_field("gross_pay");
                                frm.refresh_field("net_pay");
                                frm.refresh_field("base_net_pay");
                                frm.refresh_field("rounded_total");
                                frm.refresh_field("base_rounded_total");
                                frm.refresh_field("total_in_words");
                                frm.refresh_field("base_total_in_words");
                                frm.refresh_field("custom_total_office");
                                frm.refresh_field("custom_total_site");
                                frm.refresh_field("custom_days_on_site");
                                frm.refresh_field("custom_days_on_office");
                                frm.refresh_field("gross_year_to_date");
                                frm.refresh_field("base_gross_year_to_date");
                                frm.refresh_field("year_to_date");
                                frm.refresh_field("base_year_to_date");
                                frm.refresh_field("month_to_date");
                                frm.refresh_field("base_month_to_date");
                                frm.save();
                            } else {
                                console.error("No earnings found in salary slip.");
                            }
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
    },

    onload: function (frm) {
        frm.set_df_property('employee', 'read_only', 1);
    },

    onload_post_render: function (frm) {
        if (frm.doc.status == "Submitted" || (frm.doc.status == "Draft" && frm.doc.employee)) {
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
                                const earnings = frm.doc.earnings;

                                if (earnings && earnings.length > 0) {
                                    const earning = earnings[0];
                                    const salaryPerDay = earning.amount / frm.doc.payment_days;
                                    const newAmount = earning.amount + (attendanceRecordsLength * (sitePercentage * salaryPerDay / 100));

                                    const paymentOfficeDays = frm.doc.payment_days - attendanceRecordsLength;
                                    const paymentSiteDays = attendanceRecordsLength;

                                    earning.amount = newAmount;

                                    frm.doc.base_gross_pay = newAmount;
                                    frm.doc.gross_pay = newAmount;
                                    frm.doc.net_pay = newAmount;
                                    frm.doc.base_net_pay = newAmount;
                                    frm.doc.rounded_total = Math.round(newAmount);
                                    frm.doc.base_rounded_total = Math.round(newAmount);
                                    const amountInWords = await getMoneyInWords(newAmount);
                                    frm.doc.total_in_words = amountInWords;
                                    frm.doc.base_total_in_words = amountInWords;

                                    frm.doc.custom_total_office = paymentOfficeDays * salaryPerDay;
                                    frm.doc.custom_total_site = paymentSiteDays * salaryPerDay + (paymentSiteDays * (sitePercentage * salaryPerDay / 100));

                                    frappe.model.set_value(earning.doctype, earning.name, "amount", newAmount);

                                    frm.doc.custom_days_on_site = paymentSiteDays;
                                    frm.doc.custom_days_on_office = paymentOfficeDays;

                                    frm.doc.gross_year_to_date = newAmount;
                                    frm.doc.base_gross_year_to_date = newAmount;
                                    frm.doc.year_to_date = newAmount;
                                    frm.doc.base_year_to_date = newAmount;
                                    frm.doc.month_to_date = newAmount;
                                    frm.doc.base_month_to_date = newAmount;

                                    frm.refresh_field("earnings");
                                    frm.refresh_field("base_gross_pay");
                                    frm.refresh_field("gross_pay");
                                    frm.refresh_field("net_pay");
                                    frm.refresh_field("base_net_pay");
                                    frm.refresh_field("rounded_total");
                                    frm.refresh_field("base_rounded_total");
                                    frm.refresh_field("total_in_words");
                                    frm.refresh_field("base_total_in_words");
                                    frm.refresh_field("custom_total_office");
                                    frm.refresh_field("custom_total_site");
                                    frm.refresh_field("custom_days_on_site");
                                    frm.refresh_field("custom_days_on_office");
                                    frm.refresh_field("gross_year_to_date");
                                    frm.refresh_field("base_gross_year_to_date");
                                    frm.refresh_field("year_to_date");
                                    frm.refresh_field("base_year_to_date");
                                    frm.refresh_field("month_to_date");
                                    frm.refresh_field("base_month_to_date");
                                    frm.save();

                                } else {
                                    console.error("No earnings found in salary slip.");
                                }
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
                            const earnings = frm.doc.earnings;

                            if (earnings && earnings.length > 0) {
                                const earning = earnings[0];
                                const salaryPerDay = earning.amount / frm.doc.payment_days;
                                const newAmount = earning.amount + (attendanceRecordsLength * (sitePercentage * salaryPerDay / 100));

                                const paymentOfficeDays = frm.doc.payment_days - attendanceRecordsLength;
                                const paymentSiteDays = attendanceRecordsLength;

                                earning.amount = newAmount;

                                frm.doc.base_gross_pay = newAmount;
                                frm.doc.gross_pay = newAmount;
                                frm.doc.net_pay = newAmount;
                                frm.doc.base_net_pay = newAmount;
                                frm.doc.rounded_total = Math.round(newAmount);
                                frm.doc.base_rounded_total = Math.round(newAmount);
                                const amountInWords = await getMoneyInWords(newAmount);
                                frm.doc.total_in_words = amountInWords;
                                frm.doc.base_total_in_words = amountInWords;

                                frm.doc.custom_total_office = paymentOfficeDays * salaryPerDay;
                                frm.doc.custom_total_site = paymentSiteDays * salaryPerDay + (paymentSiteDays * (sitePercentage * salaryPerDay / 100));

                                frappe.model.set_value(earning.doctype, earning.name, "amount", newAmount);

                                frm.doc.custom_days_on_site = paymentSiteDays;
                                frm.doc.custom_days_on_office = paymentOfficeDays;

                                frm.doc.gross_year_to_date = newAmount;
                                frm.doc.base_gross_year_to_date = newAmount;
                                frm.doc.year_to_date = newAmount;
                                frm.doc.base_year_to_date = newAmount;
                                frm.doc.month_to_date = newAmount;
                                frm.doc.base_month_to_date = newAmount;

                                frm.refresh_field("earnings");
                                frm.refresh_field("base_gross_pay");
                                frm.refresh_field("gross_pay");
                                frm.refresh_field("net_pay");
                                frm.refresh_field("base_net_pay");
                                frm.refresh_field("rounded_total");
                                frm.refresh_field("base_rounded_total");
                                frm.refresh_field("total_in_words");
                                frm.refresh_field("base_total_in_words");
                                frm.refresh_field("custom_total_office");
                                frm.refresh_field("custom_total_site");
                                frm.refresh_field("custom_days_on_site");
                                frm.refresh_field("custom_days_on_office");
                                frm.refresh_field("gross_year_to_date");
                                frm.refresh_field("base_gross_year_to_date");
                                frm.refresh_field("year_to_date");
                                frm.refresh_field("base_year_to_date");
                                frm.refresh_field("month_to_date");
                                frm.refresh_field("base_month_to_date");
                                frm.save();

                            } else {
                                console.error("No earnings found in salary slip.");
                            }
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
    },

    after_submit: function (frm) {
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
                            const earnings = frm.doc.earnings;

                            if (earnings && earnings.length > 0) {
                                const earning = earnings[0];
                                const salaryPerDay = earning.amount / frm.doc.payment_days;
                                const newAmount = earning.amount + (attendanceRecordsLength * (sitePercentage * salaryPerDay / 100));

                                const paymentOfficeDays = frm.doc.payment_days - attendanceRecordsLength;
                                const paymentSiteDays = attendanceRecordsLength;

                                earning.amount = newAmount;

                                frm.doc.base_gross_pay = newAmount;
                                frm.doc.gross_pay = newAmount;
                                frm.doc.net_pay = newAmount;
                                frm.doc.base_net_pay = newAmount;
                                frm.doc.rounded_total = Math.round(newAmount);
                                frm.doc.base_rounded_total = Math.round(newAmount);
                                const amountInWords = await getMoneyInWords(newAmount);
                                frm.doc.total_in_words = amountInWords;
                                frm.doc.base_total_in_words = amountInWords;

                                frm.doc.custom_total_office = paymentOfficeDays * salaryPerDay;
                                frm.doc.custom_total_site = paymentSiteDays * salaryPerDay + (paymentSiteDays * (sitePercentage * salaryPerDay / 100));

                                frappe.model.set_value(earning.doctype, earning.name, "amount", newAmount);

                                frm.doc.custom_days_on_site = paymentSiteDays;
                                frm.doc.custom_days_on_office = paymentOfficeDays;

                                frm.doc.gross_year_to_date = newAmount;
                                frm.doc.base_gross_year_to_date = newAmount;
                                frm.doc.year_to_date = newAmount;
                                frm.doc.base_year_to_date = newAmount;
                                frm.doc.month_to_date = newAmount;
                                frm.doc.base_month_to_date = newAmount;

                                frm.refresh_field("earnings");
                                frm.refresh_field("base_gross_pay");
                                frm.refresh_field("gross_pay");
                                frm.refresh_field("net_pay");
                                frm.refresh_field("base_net_pay");
                                frm.refresh_field("rounded_total");
                                frm.refresh_field("base_rounded_total");
                                frm.refresh_field("total_in_words");
                                frm.refresh_field("base_total_in_words");
                                frm.refresh_field("custom_total_office");
                                frm.refresh_field("custom_total_site");
                                frm.refresh_field("custom_days_on_site");
                                frm.refresh_field("custom_days_on_office");
                                frm.refresh_field("gross_year_to_date");
                                frm.refresh_field("base_gross_year_to_date");
                                frm.refresh_field("year_to_date");
                                frm.refresh_field("base_year_to_date");
                                frm.refresh_field("month_to_date");
                                frm.refresh_field("base_month_to_date");
                                frm.save();
                            } else {
                                console.error("No earnings found in salary slip.");
                            }
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
