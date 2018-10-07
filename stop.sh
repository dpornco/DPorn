#!/bin/bash

set -e
set -o pipefail

cd "$(dirname "$0")"

WD="--workingDir $(pwd)"
PID="--pidFile $(pwd)/pid"
XUID="--uid \"$(pwd)\""

/usr/local/bin/forever stop $WD $PID $XUID "$(pwd)/bin/www"

