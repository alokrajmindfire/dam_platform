#!/bin/bash
set -euo pipefail

CLUSTER_NAME="dam-cluster"
NAMESPACE="dam"

if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    echo "Cluster $CLUSTER_NAME already exists. Skipping creation."
else
    echo "Creating Kind cluster..."
    kind create cluster --name $CLUSTER_NAME
fi

echo "Waiting a few seconds for the cluster to be ready..."
sleep 10

echo "Deploying NGINX Ingress Controller for Kind..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

echo "Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

cd ..

echo "Applying ConfigMaps..."
kubectl apply -f k8s/service-configmap.yaml -n $NAMESPACE

echo "Deploying Redis..."
kubectl apply -f k8s/redis.yaml -n $NAMESPACE

echo "Deploying MongoDB..."
kubectl apply -f k8s/mongodb.yaml -n $NAMESPACE

echo "Deploying MinIO..."
kubectl apply -f k8s/minio.yaml -n $NAMESPACE

echo "Deploying Backend..."
kubectl apply -f k8s/deployments/backend.yaml -n $NAMESPACE
kubectl apply -f k8s/services/backend.yaml -n $NAMESPACE

echo "Deploying Frontend..."
kubectl apply -f k8s/deployments/frontend.yaml -n $NAMESPACE
kubectl apply -f k8s/services/frontend.yaml -n $NAMESPACE

echo "Deploying Asset Worker..."
kubectl apply -f k8s/deployments/asset-worker.yaml -n $NAMESPACE
kubectl apply -f k8s/services/asset-worker.yaml -n $NAMESPACE

echo "Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml -n $NAMESPACE

echo "Deploying HPA (if any)..."
kubectl apply -f k8s/hpa.yaml -n $NAMESPACE

echo "Waiting for all pods to be ready..."
kubectl wait --for=condition=ready pod -n $NAMESPACE --all --timeout=300s

echo "Deployment completed!"
kubectl get pods -n $NAMESPACE
kubectl get svc -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo "
If using ingress, add this to your /etc/hosts:

127.0.0.1 dam.local
"
