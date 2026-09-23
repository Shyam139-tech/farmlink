from datetime import date, timedelta
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title='FarmLink Prototype AI')
class PriceInput(BaseModel):
    crop: str
    quantity: float = 500
    location: str = 'Melur'
    quality: str = 'Grade A'
    harvest_date: str | None = None
class ForecastInput(BaseModel):
    crop: str = 'Tomato'
    location: str = 'Madurai'

def estimate(data: PriceInput):
    reference = {'tomato': 24, 'onion': 22, 'banana': 36, 'okra': 32}.get(data.crop.lower(), 25)
    predicted = reference + (3 if data.quality.lower() == 'grade a' else 0)
    return {'reference_price': reference, 'predicted_price': predicted, 'confidence': 87, 'factors': ['Historical seeded prices', 'Prototype demand signal', 'Quantity and location', 'Season and quality'], 'model': 'Prototype Model'}
@app.get('/health')
def health(): return {'ok': True, 'status': 'ok', 'service': 'farmlink-ai', 'mode': 'Prototype Simulation'}
@app.post('/predict-price')
def predict_price(data: PriceInput): return estimate(data)
@app.post('/forecast-demand')
def forecast(data: ForecastInput):
    today = date.today()
    return {'crop': data.crop, 'forecast': [{'date': str(today + timedelta(days=i)), 'predicted_demand': 420 + i * 18, 'available_supply': 360 + i * 8} for i in range(7)], 'model': 'Prototype Forecast'}
@app.post('/match-buyers')
def match_buyers(data: dict):
    return {'matches': [{'name': 'Chennai Fresh Foods', 'score': 94, 'distance': '18 km', 'offer': 28}, {'name': 'Melur Retail Hub', 'score': 87, 'distance': '6 km', 'offer': 26}, {'name': 'Consumer Cluster', 'score': 81, 'distance': '12 km', 'offer': 25}], 'model': 'Prototype Matching Simulation'}
