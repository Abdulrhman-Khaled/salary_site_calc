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
        const employee = frm.doc.employee;
        frappe.db.get_list('Salary Structure Assignment', {
            filters: { 'employee': employee },
            limit_page_length: 1
        }).then((salary_structure_docs) => {
            if (salary_structure_docs.length > 0) {
                const salary_structure_doc = salary_structure_docs[0];
                console.log(salary_structure_doc['name']);

                // Fetch the full document using the name
                frappe.get_doc('Salary Structure Assignment', salary_structure_doc['name']).then((salary_doc) => {
                    console.log(salary_doc);
                }).catch(error => {
                    console.error('Error fetching salary structure document:', error);
                });
            } else {
                console.warn('No Salary Structure Assignment found for this employee.');
            }
        }).catch(error => {
            console.error('Error fetching salary structure list:', error);
        });
    }
});