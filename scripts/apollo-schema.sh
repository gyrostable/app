#!/usr/bin/env bash

if [ -f .env.local ]; then
  echo "Importing environment variables from .env.local"
  set -o allexport; source .env.local; set +o allexport
fi

SCHEMA_OUTPUT_FILE="types/subgraph/schema.graphql"

if [ -z "$NEXT_PUBLIC_REACT_APP_SUBGRAPH_POLYGON" ]
then
  echo "NEXT_PUBLIC_REACT_APP_SUBGRAPH_POLYGON must be set"
  exit 1
fi

yarn global add @apollo/rover

rover graph introspect https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2 --output schema.graphql