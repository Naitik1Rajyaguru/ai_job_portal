# backend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mongo_handler
import re
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

users_collection = mongo_handler.get_users_collection()
companies_collection = mongo_handler.get_companies_collection()
jobs_collection = mongo_handler.get_jobs_collection()

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
        return jsonify({'message': 'Registration successful', 'user': {'email': email, 'role': role, 'orgName': org_name}}), 201


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
        return jsonify({'message': 'Login successful', 'user': {'email': company['email'], 'role': company['role'], 'orgName': company['orgName']}}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/addjob', methods=['POST'])
def add_job():
    data = request.get_json()
    job_details = data.get('jobList')
    admin_email = data.get('adminEmail') # Get email from request

    if not job_details:
        return jsonify({'message': 'Job details are required'}), 400
    if not admin_email:
        return jsonify({'message': 'Admin email is required'}), 400
    
    company = companies_collection.find_one({'email': admin_email})
    if not company:
        return jsonify({'message': 'Company not found'}), 404

    jobs_collection.insert_one({
        'company_id': str(company['_id']),
        'job_details': job_details
    })

    return jsonify({'message': 'Job added successfully'}), 201


@app.route('/api/getjobs', methods=['POST'])
def get_jobs():
    data = request.get_json()
    admin_email = data.get('adminEmail')

    if not admin_email:
        return jsonify({'message': 'Admin email is required'}), 400

    company = companies_collection.find_one({'email': admin_email})
    if not company:
        return jsonify({'message': 'Company not found'}), 404

    jobs = jobs_collection.find({
        'company_id': str(company['_id'])
    })

    job_list = []
    for job in jobs:
        job['_id'] = str(job['_id']) # Convert ObjectId to string
        job_list.append(job)

    return jsonify({'jobs': job_list, 'companyName': company.get('orgName')}), 200


@app.route('/api/deletejob', methods=['POST'])
def delete_job():
    data = request.get_json()
    job_id = data.get('jobId')

    if not job_id:
        return jsonify({'message': 'Job ID is required'}), 400

    try:
        result = jobs_collection.delete_one({'_id': ObjectId(job_id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Job deleted successfully'}), 200
        else:
            return jsonify({'message': 'Job not found'}), 404
    except Exception as e:
        return jsonify({'message': f'Error deleting job: {str(e)}'}), 500

 


if __name__ == '__main__':
    app.run(debug=True)