// frappe.ui.form.on('Salary Slip', {
//     onload: function(frm) {

//  frappe.db.get_list('Salary Structure Assignment', {
//                 filters: { 'employee': frm.doc.employee },
//                 limit_page_length: 1
//             }).then((salary_doc) => {
//                 console.log(salary_doc);
//             });

//         // if (frm.doc.shift_type === 'Site') {
//         //     frappe.db.get_doc('Salary Structure Assignment', frm.doc.salary_structure_assignment).then((salary_doc) => {
//         //         const basic_salary = salary_doc.basic_salary;
//         //         const daily_salary = basic_salary / 30;
//         //         const site_percentage = salary_doc.site_percentage;

//         //         // Calculate new salary
//         //         frm.set_value('salary_per_day', daily_salary + (daily_salary * (site_percentage / 100)));
//         //     });
//         // } else {

//         // }
//     }
// });

frappe.ui.form.on('Salary Slip', {

    employee: function (frm) {
        frappe.call({
            method: "salary_slip_calc.overrides.salary_slip.salary_slip.fetch_attendance",
            args: {
                employee: frm.doc.employee,
                start_date: frm.doc.start_date,
                end_date: frm.doc.end_date
            },
            callback: function (response) {
                if (response.message) {
                    console.log("Attendance Records:", response.message);
                } else {
                    console.error("No records found.");
                }
            },
            error: function (err) {
                console.error("Error fetching attendance:", err);
            }
        });
        // frappe.db.get_list('Salary Structure Assignment', {
        //     filters: { 'employee': employee },
        //     limit_page_length: 1
        // }).then((salary_structure_doc) => {
        //     console.log(salary_structure_doc[0]['name']);
        //     frappe.get_doc('Salary Structure Assignment', salary_structure_doc[0]['name']).then((salary_doc) => {
        //         console.log(salary_doc);

        //     })
        // });

    }
});