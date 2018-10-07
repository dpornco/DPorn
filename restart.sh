#!/bin/bash

set -e
set -o pipefail

cd "$(dirname "$0")"

touch "$(pwd)/livePosts.json"
mkdir "logs" 2> /dev/null || true

WD="--workingDir $(pwd)"
PID="--pidFile $(pwd)/pid"
XUID="--uid \"$(pwd)\""

/usr/local/bin/forever restart $WD $PID $XUID \
	-a -l "$(pwd)/logs/forever.log" -o "$(pwd)/logs/out.log" -e "$(pwd)/logs/err.log" \
	"$(pwd)/bin/www"

