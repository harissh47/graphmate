#!/bin/sh

# Wait for the database to be ready
until pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Run Flask database migrations if not already done
if [ ! -d "migrations" ]; then
  flask db init
fi
flask db upgrade
flask db migrate -m "Initial migration"
flask db upgrade

# Start the application
exec gunicorn --bind 0.0.0.0:8321 --worker-class gevent --workers 1 --timeout 200 app:app
