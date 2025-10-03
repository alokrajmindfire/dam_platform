#!/bin/bash

set -euo pipefail

echo "Building microservices Docker images..."

build_service() {
  local service_name=$1
  local image_tag=$2

  echo "Building $service_name..."
  cd "../$service_name" || { echo "Directory $service_name not found"; exit 1; }

  docker build -t "$image_tag" .
  docker push "$image_tag"
  echo "$service_name built and pushed successfully!"
}

build_service "backend" "alokraj889/backend-dam:0.2"

build_service "frontend" "alokraj889/frontend-dam:0.2"

build_service "asset-worker" "alokraj889/asset-worker:0.1"

echo "All images built and pushed successfully!"
