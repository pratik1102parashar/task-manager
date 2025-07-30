#!/usr/bin/env bash

host_with_port="$1"
shift
cmd="$@"

host=$(echo "$host_with_port" | cut -d: -f1)
port=$(echo "$host_with_port" | cut -d: -f2)

echo "waiting for $host:$port..."

while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is available — starting app"
exec "$@"
