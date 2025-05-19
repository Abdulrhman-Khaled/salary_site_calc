import frappe
from frappe.utils import getdate

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