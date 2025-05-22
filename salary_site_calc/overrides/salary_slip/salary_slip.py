import frappe
from frappe.utils import getdate
from frappe.utils import money_in_words

@frappe.whitelist()
def fetch_attendance(employee, start_date, end_date):
    return get_attendance(employee, start_date, end_date)

def get_attendance(employee, start_date, end_date):
    attendance_records = frappe.get_all(
        'Attendance',
        filters={
            'employee': employee,
            'attendance_date': ['between', [getdate(start_date), getdate(end_date)]],
            'custom_shift_type': 'Site'
        },
        fields=['name', 'attendance_date', 'status', 'custom_shift_type']
    )
    return attendance_records

@frappe.whitelist()
def get_last_salary_structure(employee):
    salary_structure_docs = frappe.get_list('Salary Structure Assignment', 
        filters={'employee': employee},
        order_by='creation desc',
        limit_page_length=1
    )

    if salary_structure_docs:
        last_salary_doc = frappe.get_doc('Salary Structure Assignment', salary_structure_docs[0]['name'])
        return {'custom_site_percentage': last_salary_doc.custom_site_percentage}

    return None

@frappe.whitelist()
def get_money_in_words(amount):
    if isinstance(amount, float) and (amount != amount):
        amount = 0.0
    return money_in_words(amount)