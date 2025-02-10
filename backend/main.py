from datetime import datetime
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL
from core.crud import CRUD
from cryptography.fernet import Fernet
app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ams'

mysql = MySQL(app)

# List of resource names
resources = [
    'departments', 'offices', 'users', 'procurement_modes', 
    'funding_sources', 'budgets', 'user_budgets', 'ppmp', 
    'ppmp_approvers', 'app', 'app_approvers', 'purchase_requests', 
    'purchase_request_approvers', 'procurement_process', 'contracts', 
    'inspection_acceptance', 'payments'
]

key = Fernet.generate_key()
# Instantiate CRUD object
crud = CRUD(app, mysql,key)

# Dynamically add routes for each resource
for resource in resources:
    crud.add_route(resource)

CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
