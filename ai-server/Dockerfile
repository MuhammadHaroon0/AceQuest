FROM python:3.11.9-slim
WORKDIR /app

RUN python -m pip install --upgrade pip

COPY requirements.txt .
RUN pip install --default-timeout=100 -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]


