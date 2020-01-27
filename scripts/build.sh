#!/usr/bin/env bash
set -euxo pipefail

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
