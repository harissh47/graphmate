import os

from flask import Flask


class LocalStorage:
    def __init__(self, app: Flask):
        self.app = app

        folder = self.app.config.get("STORAGE_LOCAL_PATH")
        if not os.path.isabs(folder):
            folder = os.path.join(app.root_path, folder)
        self.folder = folder

    def save(self, filename, data):
        if not self.folder or self.folder.endswith("/"):
            filename = self.folder + filename
        else:
            filename = self.folder + "/" + filename

        folder = os.path.dirname(filename)
        os.makedirs(folder, exist_ok=True)

        with open(os.path.join(os.getcwd(), filename), "wb") as f:
            f.write(data)

    def delete(self, filename):
        if not self.folder or self.folder.endswith("/"):
            filename = self.folder + filename
        else:
            filename = self.folder + "/" + filename
        if os.path.exists(filename):
            os.remove(filename)
