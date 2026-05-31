#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
KEYCLOAK_URL="http://localhost:8180"
MAX_WAIT=120

echo "Starting Keycloak E2E test container..."
docker compose -f "$COMPOSE_FILE" up -d

echo "Waiting for Keycloak to be ready (max ${MAX_WAIT}s)..."
elapsed=0
until curl -sf "$KEYCLOAK_URL/realms/aura" > /dev/null 2>&1; do
  if [ "$elapsed" -ge "$MAX_WAIT" ]; then
    echo "ERROR: Keycloak failed to start within ${MAX_WAIT}s"
    docker compose -f "$COMPOSE_FILE" logs keycloak
    exit 1
  fi
  sleep 2
  elapsed=$((elapsed + 2))
  printf "."
done

echo ""
echo "Keycloak is ready at $KEYCLOAK_URL"
echo "  Admin console: $KEYCLOAK_URL/admin (admin/admin)"
echo "  Realm:         $KEYCLOAK_URL/realms/aura"
echo "  OIDC config:   $KEYCLOAK_URL/realms/aura/.well-known/openid-configuration"
echo ""
echo "Test users:"
echo "  Parent:   test-parent@example.com / TestPassword123!"
echo "  Educator: test-educator@example.com / TestPassword123!"
