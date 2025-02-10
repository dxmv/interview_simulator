import pdfplumber
from io import BytesIO

def extract_text_from_pdf(file):
    '''
    Extract text from a pdf file
    '''
    with pdfplumber.open(BytesIO(file.read())) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text
