import frappe
from frappe import _
from frappe.utils import flt
import erpnext

from salary_site_calc.overrides.salary_slip.salary_slip import (
    fetch_attendance,
    get_last_salary_structure
)

salary_slip = frappe.qb.DocType("Salary Slip")
salary_detail = frappe.qb.DocType("Salary Detail")


def execute(filters=None):
    if not filters:
        filters = {}

    currency = filters.get("currency")
    company_currency = erpnext.get_company_currency(filters.get("company"))

    salary_slips = get_salary_slips(filters, company_currency)
    if not salary_slips:
        return [], []

    earning_types, ded_types = get_earning_and_deduction_types(salary_slips)
    columns = get_columns(earning_types, ded_types)

    doj_map = get_employee_doj_map()

    data = []
    for ss in salary_slips:
        # Fetch attendance and site percentage
        attendance_records = fetch_attendance(ss.employee, ss.start_date, ss.end_date)
        site_days = len(attendance_records)
        office_days = flt(ss.payment_days) - site_days

        structure = get_last_salary_structure(ss.employee) or {}
        site_percentage = flt(structure.get("custom_site_percentage", 0))

        # Get basic salary and calculate site bonus
        basic_amount = frappe.db.get_value(
            "Salary Detail",
            {
                "parent": ss.name,
                "salary_component": "Basic",
                "parentfield": "earnings"
            },
            "amount"
        ) or 0

        salary_per_day = basic_amount / ss.payment_days if ss.payment_days else 0
        site_bonus = site_days * (site_percentage * salary_per_day / 100)
        new_basic = basic_amount + site_bonus

        # Get all earnings and deductions
        earnings = frappe.get_all("Salary Detail", filters={
            "parent": ss.name, "parentfield": "earnings"
        }, fields=["salary_component", "amount"])

        deductions = frappe.get_all("Salary Detail", filters={
            "parent": ss.name, "parentfield": "deductions"
        }, fields=["salary_component", "amount"])

        for e in earnings:
            if e.salary_component == "Basic":
                e.amount = new_basic

        total_earnings = sum(flt(e.amount) for e in earnings)
        total_deductions = sum(flt(d.amount) for d in deductions)
        net_pay = total_earnings - total_deductions

        row = {
            "salary_slip_id": ss.name,
            "employee": ss.employee,
            "employee_name": ss.employee_name,
            "data_of_joining": doj_map.get(ss.employee),
            "branch": ss.branch,
            "department": ss.department,
            "designation": ss.designation,
            "company": ss.company,
            "start_date": ss.start_date,
            "end_date": ss.end_date,
            "leave_without_pay": ss.leave_without_pay,
            "payment_days": ss.payment_days,
            "custom_days_on_site": site_days,
            "custom_days_on_office": office_days,
            "custom_total_site": site_days * salary_per_day + site_bonus,
            "custom_total_office": office_days * salary_per_day,
            "currency": currency or company_currency,
            "total_loan_repayment": ss.total_loan_repayment,
            "gross_pay": total_earnings,
            "total_deduction": total_deductions,
            "net_pay": net_pay
        }

        for e in earning_types:
            row[frappe.scrub(e)] = next((flt(x.amount) for x in earnings if x.salary_component == e), 0)

        for d in ded_types:
            row[frappe.scrub(d)] = next((flt(x.amount) for x in deductions if x.salary_component == d), 0)

        data.append(row)

    return columns, data


def get_earning_and_deduction_types(salary_slips):
    salary_component_and_type = {_("Earning"): [], _("Deduction"): []}

    for salary_component in get_salary_components(salary_slips):
        component_type = get_salary_component_type(salary_component)
        salary_component_and_type[_(component_type)].append(salary_component)

    return sorted(salary_component_and_type[_("Earning")]), sorted(salary_component_and_type[_("Deduction")])


def get_columns(earning_types, ded_types):
    columns = [
        {"label": _("Salary Slip ID"), "fieldname": "salary_slip_id", "fieldtype": "Link", "options": "Salary Slip", "width": 150},
        {"label": _("Employee"), "fieldname": "employee", "fieldtype": "Link", "options": "Employee", "width": 120},
        {"label": _("Employee Name"), "fieldname": "employee_name", "fieldtype": "Data", "width": 140},
        {"label": _("Date of Joining"), "fieldname": "data_of_joining", "fieldtype": "Date", "width": 80},
        {"label": _("Branch"), "fieldname": "branch", "fieldtype": "Link", "options": "Branch", "width": 120},
        {"label": _("Department"), "fieldname": "department", "fieldtype": "Link", "options": "Department", "width": 120},
        {"label": _("Designation"), "fieldname": "designation", "fieldtype": "Link", "options": "Designation", "width": 120},
        {"label": _("Company"), "fieldname": "company", "fieldtype": "Link", "options": "Company", "width": 120},
        {"label": _("Start Date"), "fieldname": "start_date", "fieldtype": "Date", "width": 90},
        {"label": _("End Date"), "fieldname": "end_date", "fieldtype": "Date", "width": 90},
        {"label": _("Leave Without Pay"), "fieldname": "leave_without_pay", "fieldtype": "Float", "width": 50},
        {"label": _("Payment Days"), "fieldname": "payment_days", "fieldtype": "Float", "width": 100},
    ]

    for earning in earning_types:
        columns.append({
            "label": earning,
            "fieldname": frappe.scrub(earning),
            "fieldtype": "Currency",
            "options": "currency",
            "width": 120,
        })

    columns.append({
        "label": _("Gross Pay"),
        "fieldname": "gross_pay",
        "fieldtype": "Currency",
        "options": "currency",
        "width": 120,
    })

    for deduction in ded_types:
        columns.append({
            "label": deduction,
            "fieldname": frappe.scrub(deduction),
            "fieldtype": "Currency",
            "options": "currency",
            "width": 120,
        })

    columns.extend([
        {"label": _("Loan Repayment"), "fieldname": "total_loan_repayment", "fieldtype": "Currency", "options": "currency", "width": 120},
        {"label": _("Total Deduction"), "fieldname": "total_deduction", "fieldtype": "Currency", "options": "currency", "width": 120},
        {"label": _("Net Pay"), "fieldname": "net_pay", "fieldtype": "Currency", "options": "currency", "width": 120},
        {"label": _("Days on Site"), "fieldname": "custom_days_on_site", "fieldtype": "Float", "width": 100},
        {"label": _("Days on Office"), "fieldname": "custom_days_on_office", "fieldtype": "Float", "width": 100},
        {"label": _("Total Site Amount"), "fieldname": "custom_total_site", "fieldtype": "Currency", "options": "currency", "width": 130},
        {"label": _("Total Office Amount"), "fieldname": "custom_total_office", "fieldtype": "Currency", "options": "currency", "width": 130},
        {"label": _("Currency"), "fieldtype": "Data", "fieldname": "currency", "options": "Currency", "hidden": 1},
    ])

    return columns


def get_salary_components(salary_slips):
    return (
        frappe.qb.from_(salary_detail)
        .where((salary_detail.amount != 0) & (salary_detail.parent.isin([d.name for d in salary_slips])))
        .select(salary_detail.salary_component)
        .distinct()
    ).run(pluck=True)


def get_salary_component_type(salary_component):
    return frappe.db.get_value("Salary Component", salary_component, "type", cache=True)


def get_salary_slips(filters, company_currency):
    doc_status = {"Draft": 0, "Submitted": 1, "Cancelled": 2}
    query = frappe.qb.from_(salary_slip).select(salary_slip.star)

    if filters.get("docstatus"):
        query = query.where(salary_slip.docstatus == doc_status[filters["docstatus"]])
    if filters.get("from_date"):
        query = query.where(salary_slip.start_date >= filters["from_date"])
    if filters.get("to_date"):
        query = query.where(salary_slip.end_date <= filters["to_date"])
    if filters.get("company"):
        query = query.where(salary_slip.company == filters["company"])
    if filters.get("employee"):
        query = query.where(salary_slip.employee == filters["employee"])
    if filters.get("currency") and filters["currency"] != company_currency:
        query = query.where(salary_slip.currency == filters["currency"])

    return query.run(as_dict=1) or []


def get_employee_doj_map():
    employee = frappe.qb.DocType("Employee")
    result = frappe.qb.from_(employee).select(employee.name, employee.date_of_joining).run()
    return frappe._dict(result)
