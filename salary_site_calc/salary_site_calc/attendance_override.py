import frappe
from frappe.utils import getdate
import json
import datetime

@frappe.whitelist()
def mark_employee_attendance(
    employee_list: list | str,
    status: str,
    date: str | datetime.date,
    leave_type: str | None = None,
    company: str | None = None,
    late_entry: int | None = None,
    early_exit: int | None = None,
    shift: str | None = None,
    custom_shift_type: str | None = None
) -> None:
    if isinstance(employee_list, str):
        employee_list = json.loads(employee_list)

    for employee in employee_list:
        attendance = frappe.get_doc(
            dict(
                doctype="Attendance",
                employee=employee,
                attendance_date=getdate(date),
                status=status,
                leave_type=leave_type,
                late_entry=late_entry,
                early_exit=early_exit,
                shift=shift,
                custom_shift_type=custom_shift_type
            )
        )
        attendance.insert()
        attendance.submit()
