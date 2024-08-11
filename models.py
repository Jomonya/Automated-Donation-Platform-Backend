from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData, Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt
import json

db = SQLAlchemy()



class Charity(db.Model, SerializerMixin):
    tablename = 'charities'

    serialize_only = ("id", "name", "image", "description", "mission_statement", "impact", "goals", "status")
    serialize_rules = ("-users", "-donations")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    description = db.Column(db.String)
    mission_statement = db.Column(db.String)
    goals = db.Column(db.String(120), nullable=False, default='')
    impact = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String, default="pending")
    
    # Donations received by this charity
    donations = db.relationship('Donation', back_populates='charity')

    def totalDonations(self):
        total = sum(donation.amount for donation in self.donations)
        return total

    def getDonations(self):
        return [donation.to_dict() for donation in self.donations]  # Ensure donations are returned as a list of dictionaries

    def to_dict(self):
        charity_dict = super().to_dict()
        charity_dict['donations'] = self.getDonations()
        charity_dict['totalDonatedAmount'] = self.totalDonations()
        return charity_dict
    
    #change the status of a charity request to reviewed
    def review(self):
        self.status = 'reviewed'
        db.session.commit()

    #change the status of a charity request to rapproved
    def approve(self):
        self.status = 'approved'
        db.session.commit()

    #change the status of a charity request to rejected
    def reject(self):
        self.status = 'rejected'
        db.session.commit()

    #change the status of a charity request to pending
    def pending(self):
        self.status = 'pending'
        db.session.commit()

    def repr(self):
        return f'<Charity {self.name} | Image: {self.image}  | Description: {self.description} | Mission Statement: {self.mission_statement}| goals: {self.goals} | impact: {self.impact} | status: {self.status}>'


# User Model
class User(db.Model, SerializerMixin):
    tablename = 'users'

    # Serialization rules
    serialize_only = ("id", "username", "email", "role")
    serialize_rules = ("-charities",'-donations','-_password_hash')

    # Define columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(String(80), nullable=False, unique=True)
    email = db.Column(String(120), nullable=False, unique=True)
    _password_hash = db.Column(db.String)
    role = db.Column(db.String, default="donor")

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    
    
    # Charities that the user has donated to
    """  # Relationship with charities
    charities = db.relationship("Charity", secondary="donations", backref="users") """

    donations = db.relationship('Donation', back_populates='user')

    def totalDonations(self):
        total = sum(donation.amount for donation in self.donations)
        return total
    def get_all_donations_as_json(self):
        # Retrieve all donations related to the user
        donations = self.donations

        # Serialize donations into a dictionary
        donations_dict_list = []
        for donation in donations:
            donation_dict = {
                "id": donation.id,
                "amount": donation.amount,
                "date_time_created": donation.date_time_created.strftime('%Y-%m-%d'),
                "charity_name": donation.charity.name# Add more fields as needed
            }
            donations_dict_list.append(donation_dict)

        # Convert the list of donation dictionaries to JSON
        donations_json = json.dumps(donations_dict_list, indent=2)
        
        return donations_json
    
    def to_dict(self):
        user_dict = super().to_dict()
        user_dict['donations'] = self.get_all_donations_as_json()
        user_dict['totalDonatedAmount'] = self.totalDonations()
        return user_dict

   
    
    
    def repr(self):
        return f'User {self.username} is created successfully'

    

#a donation can be made with a user, to a charity, so we require user_id and charity_id as foreign keys
class Donation(db.Model, SerializerMixin):
    tablename = 'donations'
    id = db.Column(db.Integer, primary_key=True)

    # Serialization rules
    serialize_only = ("id", "amount", "date_time_created", "charity_id", "user_id")
    serialize_rules = ("-users",'-charities')
    
    amount = db.Column(db.Float, nullable=False)
     # Date and time when the donation was created
    date_time_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Foreign key for the charity that received the donation
    charity_id = db.Column(db.Integer(), db.ForeignKey('charity.id'), nullable=False)
    # Foreign key for the user who made the donation
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='donations')
    charity = db.relationship('Charity', back_populates='donations')

    

    
    def repr(self):
        return '<Donation %r>' % self.id