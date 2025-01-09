import requests
from flask import jsonify


class LLMOpsAPI:
    def __init__(
        self, authToken: str, baseUrl: str, contentType: str = "application/json"
    ):
        self.authToken = authToken
        self.contentType = contentType
        self.baseUrl = baseUrl

        self.headers = {
            "Content-Type": contentType,
            "Authorization": f"Bearer {authToken}",
        }

    def fetch_api(self, query: str, conversation_id: str = ""):
        payload = {
            "inputs": {},
            "query": query,
            "response_mode": "blocking",
            "conversation_id": conversation_id,
            "user": "abc-123",
            "files": [],
        }

        url = self.baseUrl + "/v1/chat-messages"
        headers = self.headers

        response = requests.post(url=url, headers=headers, json=payload)

        if response.status_code == 200:
            return response.json()
        else:
            return (
                jsonify({"error": "Failed to retrieve data from LLMOps API"}),
                response.status_code,
            )
