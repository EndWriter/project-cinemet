FROM python:3.13-slim

# Défini la zone de travail
WORKDIR /app

# Copier le requirements
COPY requirements.txt .

# Installer les dépendances déclarées dans le requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]