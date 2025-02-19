from cryptography.fernet import Fernet
from flask import request, jsonify
import json
from psycopg2.extras import RealDictCursor
import re  # Add this at the top with other imports

class CRUD:
    def __init__(self, app, postgres, encryption_key):
        self.app = app
        self.postgres = postgres
        self.encryption_key = encryption_key
        self.cipher = Fernet(encryption_key)  # Create a cipher instance with the key
        
        # Columns to encrypt, like password, secret, etc.
        self.encrypted_columns = ['password']

    def encrypt_data(self, data):
        """Encrypt sensitive data before saving to the database."""
        for column, value in data.items():
            if column in self.encrypted_columns:
                data[column] = self.cipher.encrypt(value.encode()).decode()  # Encrypt and encode as string
        return data

    def decrypt_data(self, data):
        """Decrypt sensitive data after fetching from the database."""
        for column, value in data.items():
            if column in self.encrypted_columns:
                data[column] = self.cipher.decrypt(value.encode()).decode()  # Decrypt and decode
        return data

    def add_logic(self, resource_name, query):
        @self.app.route(f'/api/{resource_name}', methods=['GET'], endpoint=f'{resource_name.lower()}_create')
        def join():
            return self.join(query)
    def add_route(self, resource_name):
        # POST endpoint to create a resource
        @self.app.route(f'/api/{resource_name}', methods=['POST'], endpoint=f'{resource_name.lower()}_create')
        def create():
            return self.create(resource_name)
        
        # GET endpoint to fetch resources
        @self.app.route(f'/api/{resource_name}', methods=['GET'], endpoint=f'{resource_name.lower()}_read')
        def read():
            return self.read(resource_name)
        
        # GET endpoint to fetch a specific resource by ID
        @self.app.route(f'/api/{resource_name}/<item_id>', methods=['GET'], endpoint=f'{resource_name.lower()}_read_by_id')
        def read_by_id(item_id):
            return self.read(resource_name, item_id)
        
        # PATCH route for partial updates
        @self.app.route(f'/api/{resource_name}/<item_id>', methods=['PATCH'], endpoint=f'{resource_name.lower()}_patch')
        def patch(item_id):
            return self.patch(resource_name, item_id)

        # PUT endpoint to update a resource by ID
        @self.app.route(f'/api/{resource_name}/<item_id>', methods=['PUT'], endpoint=f'{resource_name.lower()}_update')
        def update(item_id):
            return self.update(resource_name, item_id)
        
        # DELETE endpoint to delete a resource by ID
        @self.app.route(f'/api/{resource_name}/<item_id>', methods=['DELETE'], endpoint=f'{resource_name.lower()}_delete')
        def delete(item_id):
            return self.delete(resource_name, item_id)

    # Create (Insert a new entry)
    def create(self, resource_name):
        data = request.get_json()
        
        # Special validation for ICS
        if resource_name.lower() == 'ics':
            # Validate ICS number format
            if not re.match(r'^ICS-\d{4}-\d{3}$', data.get('ics_no', '')):
                return jsonify({'error': 'Invalid ICS number format. Must be ICS-YYYY-###'}), 400
            
            # Validate Fund Cluster format
            if not re.match(r'^FC-\d{4}-\d{3}$', data.get('fund_cluster', '')):
                return jsonify({'error': 'Invalid Fund Cluster format. Must be FC-YYYY-###'}), 400
        
        # Encrypt sensitive columns
        data = self.encrypt_data(data)

        # Extract column names and values dynamically
        columns = data.keys()
        values = tuple(data.values())
        
        # Generate the SQL query dynamically
        columns_str = ', '.join(columns)
        placeholders = ', '.join(['%s'] * len(columns))
        
        query = f"INSERT INTO {resource_name.lower()} ({columns_str}) VALUES ({placeholders})"
        
        try:
            cursor = self.postgres.cursor()
            cursor.execute(query, values)
            self.postgres.commit()
            cursor.close()
            return jsonify({'message': f'{resource_name} created successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    def read(self, resource_name, item_id=None):
        try:
            cursor = self.postgres.cursor(cursor_factory=RealDictCursor)
            
            query = f"SELECT * FROM {resource_name.lower()}"
            print(f"Executing query: {query}")
            
            cursor.execute(query)
            results = cursor.fetchall()
            print(f"Query results: {results}")
            
            cursor.close()
            return jsonify(results), 200
        except Exception as e:
            print(f"Error in read method: {e}")
            return jsonify({"error": str(e)}), 500


    # Update (Update an entry in the table)
    def update(self, resource_name, item_id):
        data = request.get_json()
        data = self.encrypt_data(data)
        
        # Dynamically create SET clauses for the SQL query
        set_clauses = ', '.join([f"{column} = %s" for column in data.keys()])
        values = tuple(data.values()) + (item_id,)
        
        # Special case for ICS table
        if resource_name.lower() == 'ics':
            query = f"UPDATE {resource_name.lower()} SET {set_clauses} WHERE ics_no = %s"
        else:
            query = f"UPDATE {resource_name.lower()} SET {set_clauses} WHERE id = %s"
        
        cursor = self.postgres.cursor()
        cursor.execute(query, values)
        self.postgres.commit()
        cursor.close()

        return jsonify({'message': f'{resource_name} updated successfully'}), 200

    # Delete (Delete an entry from the table)
    def delete(self, resource_name, item_id):
        cursor = self.postgres.cursor()
        
        # Special case for ICS table which uses ics_no as primary key
        if resource_name.lower() == 'ics':
            query = f"DELETE FROM {resource_name.lower()} WHERE ics_no = %s"
        else:
            # Default case for other tables using id as primary key
            query = f"DELETE FROM {resource_name.lower()} WHERE id = %s"
        
        cursor.execute(query, (item_id,))
        self.postgres.commit()
        cursor.close()

        return jsonify({'message': f'{resource_name} deleted successfully'}), 200
    
    # Partial Update (PATCH)
    def patch(self, resource_name, item_id):
        data = request.get_json()

        # Encrypt sensitive columns
        data = self.encrypt_data(data)
        
        # Dynamically create SET clauses for the SQL query
        set_clauses = ', '.join([f"{column} = %s" for column in data.keys()])
        values = tuple(data.values()) + (item_id,)
        
        query = f"UPDATE {resource_name.lower()} SET {set_clauses} WHERE id = %s"
        
        cursor = self.postgres.cursor()
        cursor.execute(query, values)
        self.postgres.commit()
        cursor.close()

        return jsonify({'message': f'{resource_name} partially updated successfully'}), 200

    def join(self, query):
        cursor = self.postgres.cursor(cursor_factory=RealDictCursor)
        # Handle item_id, if it's provided
        cursor.execute(query)
        
        # Fetch the result rows and format them as a list of dictionaries
        results = cursor.fetchall()
        
        # Exclude sensitive columns
        for result in results:
            for column in self.encrypted_columns:
                if column in result:
                    del result[column]

        cursor.close()
        
        # Return the results as JSON
        return jsonify(results), 200
