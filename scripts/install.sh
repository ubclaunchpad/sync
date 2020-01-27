#!/usr/bin/env bash
set -eo pipefail

cd backend
echo "Backend: installing..."
npm install
cd ..

cd frontend
echo "Frontend: installing..."
npm install
cd ..
