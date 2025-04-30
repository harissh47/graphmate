@echo off
REM —————— Start frontend ——————
echo Starting frontend…
cd web
start /b npm run dev -- --hostname 0.0.0.0   REM background; binds to all interfaces :contentReference[oaicite:1]{index=1}
cd ..

REM —————— Start backend ——————
echo Starting backend…
cd api
start /b python -m flask run --debug --port=8321 --host=0.0.0.0   REM background; Flask via python -m :contentReference[oaicite:2]{index=2}
cd ..

echo All services started.
