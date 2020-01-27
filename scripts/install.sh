#!/usr/bin/env bash
set -euxo pipefail

cd backend
echo "Backend: installing..."
npm install
cd ..

cd frontend
echo "Frontend: installing..."
npm install
cd ..
