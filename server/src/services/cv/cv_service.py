import os
import json



class CVService:
    def __init__(self, upload_folder):
        self.upload_folder = upload_folder
        os.makedirs(upload_folder, exist_ok=True)
    
    def save_file(self, file):
        '''
        Saves the file to the upload folder
        '''
        if file.filename == '':
            raise ValueError('No selected file')
            
        filename = file.filename
        file_path = os.path.join(self.upload_folder, filename)
        file.save(file_path)
        return filename
    
    def get_cv_analysis(self):
        '''
        Returns the analysis of the CV
        '''
        return json.load(open(os.path.join(self.upload_folder, "cv_analysis.json"), 'r'))