import frappe
from frappe.utils import flt

def execute(filters=None):
    if not filters:
        filters = {}

    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": "Salary Slip", "fieldname": "name", "fieldtype": "Link", "options": "Salary Slip", "width": 130},
        {"label": "Employee", "fieldname": "employee", "fieldtype": "Link", "options": "Employee", "width": 120},
        {"label": "Employee Name", "fieldname": "employee_name", "fieldtype": "Data", "width": 150},
        {"label": "Start Date", "fieldname": "start_date", "fieldtype": "Date", "width": 100},
        {"label": "End Date", "fieldname": "end_date", "fieldtype": "Date", "width": 100},
        {"label": "Basic", "fieldname": "basic", "fieldtype": "Currency", "width": 100},
        {"label": "Net Pay", "fieldname": "net_pay", "fieldtype": "Currency", "width": 100},
        {"label": "Site Days", "fieldname": "custom_days_on_site", "fieldtype": "Int", "width": 90},
        {"label": "Office Days", "fieldname": "custom_days_on_office", "fieldtype": "Int", "width": 90},
        {"label": "Total Site", "fieldname": "custom_total_site", "fieldtype": "Currency", "width": 120},
        {"label": "Total Office", "fieldname": "custom_total_office", "fieldtype": "Currency", "width": 120},
    ]

def get_data(filters):
    condition = "doc.docstatus = 1"
    if filters.get("employee"):
        condition += " AND doc.employee = %(employee)s"

    salary_slips = frappe.db.sql(f"""
        SELECT
            doc.name,
            doc.employee,
            doc.employee_name,
            doc.start_date,
            doc.end_date,
            doc.net_pay,
            doc.custom_total_site,
            doc.custom_total_office,
            doc.custom_days_on_site,
            doc.custom_days_on_office
        FROM `tabSalary Slip` doc
        WHERE {condition}
        ORDER BY doc.posting_date DESC
    """, filters, as_dict=True)

    for slip in salary_slips:
        slip.basic = frappe.db.get_value("Salary Detail", {
            "parent": slip.name,
            "salary_component": "Basic",
            "parentfield": "earnings"
        }, "amount") or 0.0

    return salary_slips
