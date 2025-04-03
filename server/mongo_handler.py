# mongo_handler.py
from pymongo import MongoClient
import config

client = MongoClient(config.MONGODB_URI)
db = client[config.MONGODB_DB]

def get_users_collection():
    return db['users']

def get_companies_collection():
    return db['companies']