# Use a Python base image
FROM python:3.12-slim AS base
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose the application port
EXPOSE 8321

# Add entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

# Command to run the application
# CMD ["gunicorn", "--bind", "0.0.0.0:8321", "--worker-class", "gevent", "--workers", "1", "--timeout", "200", "app:app"]
