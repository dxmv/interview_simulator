import os

class CVService:
    def __init__(self, upload_folder):
        self.upload_folder = upload_folder
        os.makedirs(upload_folder, exist_ok=True)
    
    def save_file(self, file):
        if file.filename == '':
            raise ValueError('No selected file')
            
        filename = file.filename
        file_path = os.path.join(self.upload_folder, filename)
        file.save(file_path)
        return filename
    
    def list_files(self):
        files = []
        for filename in os.listdir(self.upload_folder):
            files.append(filename)
        return files