import datetime
import json

import frappe
from frappe.model.document import Document
from frappe.utils import getdate

@frappe.whitelist()
def custom_mark_employee_attendance(
    employee_list: list | str,
    status: str,
    date: str | datetime.date,
    leave_type: str | None = None,
    company: str | None = None,
    late_entry: int | None = None,
    early_exit: int | None = None,
    shift: str | None = None,
    custom_shift_type: str | None = None,
) -> None:
    if not custom_shift_type:
        return

    if isinstance(employee_list, str):
        employee_list = json.loads(employee_list)

    for employee in employee_list:
        leave_type = None  # Resetting leave_type for each employee
        if status == "On Leave" and leave_type:
            leave_type = leave_type

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