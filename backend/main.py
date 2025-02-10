from datetime import datetime
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL
import psycopg2
import os
from dotenv import load_dotenv

from cryptography.fernet import Fernet
import argparse

load_dotenv()

parser = argparse.ArgumentParser(description="Flask Backend API")
parser.add_argument('--db', type=str, default=None, help='Use Database: postgres | mysql')

args = parser.parse_args()

if args.db is None:
    print('Please specify database using --db')

app = Flask(__name__)

if args.db == 'mysql':
    app.config['MYSQL_HOST'] = os.getenv('DB_HOST')
    app.config['MYSQL_USER'] = os.getenv('DB_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('DB_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('DB_NAME')

    db = MySQL(app)
    from core.controllers.mySQL import CRUD
    print('Server running on MySQL')
elif args.db == 'psql':
    app.config['POSTGRES_HOST'] = os.getenv('DB_HOST')
    app.config['POSTGRES_USER'] = os.getenv('DB_USER')  
    app.config['POSTGRES_PASSWORD'] = os.getenv('DB_PASSWORD')
    app.config['POSTGRES_DB'] = os.getenv('DB_NAME')
    app.config['POSTGRES_PORT'] = os.getenv('DB_PORT')
    db = psycopg2.connect(
        host=app.config['POSTGRES_HOST'],
        user=app.config['POSTGRES_USER'],
        password=app.config['POSTGRES_PASSWORD'],
        dbname=app.config['POSTGRES_DB'],
        port= app.config['POSTGRES_PORT'] or 5432
    )
    from core.controllers.postgreSQL import CRUD
    print('Server running on PostgreSQL')
else:
    print(f'{args.db} is not supported')
    exit()

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
crud = CRUD(app, db,key)
# Dynamically add routes for each resource
for resource in resources:
    crud.add_route(resource)

CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
