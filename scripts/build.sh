#!/usr/bin/env bash
set -eo pipefail
CI=false

cd backend
echo "Backend: compiling..."
npm run build
echo "Backend: linting..."
npm run lint

cd ..
cd frontend
echo "Frontend: compiling..."
npm run build
echo "Frontend: linting..."
npm run lint