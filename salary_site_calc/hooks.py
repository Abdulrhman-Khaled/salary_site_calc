app_name = "salary_site_calc"
app_title = "Salary Site Calc"
app_publisher = "bodykh"
app_description = "Calc salary per day based on shift type"
app_email = "bodykh@itqan-kw.net"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/salary_site_calc/css/salary_site_calc.css"
# app_include_js = "/assets/salary_site_calc/js/salary_site_calc.js"

# include js, css files in header of web template
# web_include_css = "/assets/salary_site_calc/css/salary_site_calc.css"
# web_include_js = "/assets/salary_site_calc/js/salary_site_calc.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "salary_site_calc/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
    "Salary Slip" : "overrides/salary_slip/salary_slip.js",
}

# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "salary_site_calc.utils.jinja_methods",
# 	"filters": "salary_site_calc.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "salary_site_calc.install.before_install"
# after_install = "salary_site_calc.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "salary_site_calc.uninstall.before_uninstall"
# after_uninstall = "salary_site_calc.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "salary_site_calc.utils.before_app_install"
# after_app_install = "salary_site_calc.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "salary_site_calc.utils.before_app_uninstall"
# after_app_uninstall = "salary_site_calc.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "salary_site_calc.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Employee Attendance Tool": "salary_site_calc.overrides.employee_attendance_tool"
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"salary_site_calc.tasks.all"
# 	],
# 	"daily": [
# 		"salary_site_calc.tasks.daily"
# 	],
# 	"hourly": [
# 		"salary_site_calc.tasks.hourly"
# 	],
# 	"weekly": [
# 		"salary_site_calc.tasks.weekly"
# 	],
# 	"monthly": [
# 		"salary_site_calc.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "salary_site_calc.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "salary_site_calc.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "salary_site_calc.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["salary_site_calc.utils.before_request"]
# after_request = ["salary_site_calc.utils.after_request"]

# Job Events
# ----------
# before_job = ["salary_site_calc.utils.before_job"]
# after_job = ["salary_site_calc.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"salary_site_calc.auth.validate"
# ]
