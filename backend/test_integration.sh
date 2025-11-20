#!/bin/bash

echo "=========================================="
echo "Test de Integración - Panel Admin"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health check
echo "1. Testing health endpoint..."
response=$(curl -s http://localhost:5000/api/health)
if [[ $response == *"ok"* ]]; then
    echo -e "${GREEN}✓ Health check OK${NC}"
else
    echo -e "${RED}✗ Health check FAILED${NC}"
fi
echo ""

# Test 2: Config check
echo "2. Testing config endpoint..."
response=$(curl -s http://localhost:5000/api/config)
if [[ $response == *"year"* ]]; then
    echo -e "${GREEN}✓ Config endpoint OK${NC}"
    echo "Response: $response"
else
    echo -e "${RED}✗ Config endpoint FAILED${NC}"
fi
echo ""

# Test 3: Admin check-auth
echo "3. Testing admin check-auth endpoint..."
response=$(curl -s http://localhost:5000/api/admin/check-auth)
if [[ $response == *"authenticated"* ]]; then
    echo -e "${GREEN}✓ Admin check-auth OK${NC}"
    echo "Response: $response"
else
    echo -e "${RED}✗ Admin check-auth FAILED${NC}"
fi
echo ""

# Test 4: Candidatos
echo "4. Testing candidatos endpoint..."
response=$(curl -s http://localhost:5000/api/candidatos)
if [[ $response == *"["* ]]; then
    echo -e "${GREEN}✓ Candidatos endpoint OK${NC}"
else
    echo -e "${RED}✗ Candidatos endpoint FAILED${NC}"
fi
echo ""

echo "=========================================="
echo "Tests completados"
echo "=========================================="
