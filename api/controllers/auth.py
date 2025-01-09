# from flask import request, jsonify
# from flask_restful import Resource
# from controllers import api
# from utils.superset_auth import requires_superset_auth
# import logging

# class SupersetAuthVerify(Resource):
#     @requires_superset_auth
#     def get(self):
#         """
#         Endpoint to verify Superset authentication and return user details
#         """
#         user_data = request.user
#         return {
#             "user": {
#                 "id": user_data.get('user_id'),
#                 # "username": user_data.get('username'),
#                 "csrf_token": user_data.get('csrf_token'),
#                 "locale": user_data.get('locale'),
#                 "session_fresh": user_data.get('is_fresh')
#             }
#         }, 200

# api.add_resource(SupersetAuthVerify, '/auth/verify-superset')


#file can be removed since we're handling auth globally