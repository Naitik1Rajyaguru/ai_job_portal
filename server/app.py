# backend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mongo_handler
import re

app = Flask(__name__)
CORS(app)

users_collection = mongo_handler.get_users_collection()
companies_collection = mongo_handler.get_companies_collection()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    org_name = data.get('orgName')

    if not email or not password or not role:
        return jsonify({'message': 'Email, password, and role are required'}), 400

    hashed_password = generate_password_hash(password)

    if role == 'user':
        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'Email already exists'}), 409
        users_collection.insert_one({'email': email, 'password': hashed_password, 'role': role})
        return jsonify({'message': 'Registration successful', 'user': {'email': email, 'role': role}}), 201
    elif role == 'admin':
        if companies_collection.find_one({'email': email}):
            return jsonify({'message': 'Email already exists'}), 409
        companies_collection.insert_one({'email': email, 'password': hashed_password, 'role': role, 'orgName': org_name})
        return jsonify({'message': 'Registration successful', 'user': {'email': email, 'role': role}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': email})
    company = companies_collection.find_one({'email': email})

    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful', 'user': {'email': user['email'], 'role': user['role']}}), 200
    elif company and check_password_hash(company['password'], password):
        return jsonify({'message': 'Login successful', 'user': {'email': company['email'], 'role': company['role']}}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)