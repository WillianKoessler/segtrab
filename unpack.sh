#!/bin/bash

set -Eeuo pipefail

BASE_DIR="${HOME}"
DEPLOY="$BASE_DIR/deploy.tgz"
LOG="$BASE_DIR/deploy.log"
BACKUP_ROOT="$BASE_DIR/bkp"
LOCK_FILE="$BASE_DIR/deploy.lock"
DEPLOYMENT_ACTIVE=0
PHP="$BASE_DIR/php"


# ----------------------------------------------------------------
# Helper Functions
# ----------------------------------------------------------------

rollback() {
    log "ROLLBACK: Restoring Previous Deployment..."

    rm -fr "$BASE_DIR/Laravel" "$BASE_DIR/public_html"
    
    if [[ -d "$BACKUP/Laravel" ]]; then
        mv "$BACKUP/Laravel" "$BASE_DIR/Laravel"
    fi

    if [[ -d "$BACKUP/public_html" ]]; then
        mv "$BACKUP/public_html" "$BASE_DIR/public_html"
    fi

    log "ROLLBACK: Completed."
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] - $*"
}

umask 022

if ! exec >>"$LOG" 2>&1; then
    printf 'ERROR: cannot open log file: %s\n' "$LOG" >&2
    exit 1
fi

on_error() {
    local exit_code=$?
    local line=$1
    local command=$2

    log "ERROR: command failed"
    log "   Exit code : $exit_code"
    log "   Line      : $line"
    log "   Command   : $command"

    if [[ "$DEPLOYMENT_ACTIVE" -eq 1 ]]; then
        rollback
    fi

    exit "$exit_code"
}
trap 'on_error "$LINENO" "$BASH_COMMAND"' ERR

assert() {
    local message="${!#}"
    local args=("${@:1:$(($# - 1))}")

    if ! "${args[@]}"; then
        log "ERROR: $message"
        exit 1
    fi
}

assert_readable() {
    [[ -r "$1" ]] || {
        log "ERROR: cannot read $1"
        exit 1
    }
}

assert_command() {
    command -v "$1" >/dev/null 2>&1 || {
        log "ERROR: $1 is not installed"
        exit 1
    }
}

assert_dir() {
    [[ -d "$1" ]] || {
        log "ERROR: expected directory does not exist: $1"
        exit 1
    }
}

assert_file() {
    [[ -f "$1" ]] || {
        log "ERROR: expected file does not exist: $1"
        exit 1
    }
}

assert_executable() {
    [[ -x "$1" ]] || {
        log "ERROR: executable not found or not executable: $1"
        exit 1
    }
}

# ----------------------------------------------------------------
# Base checks
# ----------------------------------------------------------------

# Early Out
#   Checks if there's something to deploy
#   If there's none, just exit

if [[ ! -f "$DEPLOY" ]]; then
    log "Nothing to deploy."
    exit 0
fi

exec 9>"$LOCK_FILE"
assert_command flock
assert flock -n 9 \
    "Another deployment is already running. Exiting."

echo >"$LOG"
log "================================================================"
log "Starting deployment"
log "Archive: $DEPLOY"
log "================================================================"

log "Checking directories/archive/commands..."
assert_readable "$DEPLOY"
assert_command tar
assert_command df
assert_command du
assert_command awk
assert_dir "$BASE_DIR/Laravel"
assert_dir "$BASE_DIR/public_html"

log "Checking archive contents..."
archive_list=$(tar -tzf "$DEPLOY") || {
    log "ERROR: '$DEPLOY' is not a valid/readable tar.gz archive"
    exit 1
}

log "Checking Laravel in archive..."
assert grep -E '^Laravel(/|$)' <<< "$archive_list" >/dev/null \
    "Archive does not contain Laravel directory"

log "Checking public_html in archive..."
assert grep -E '^public_html(/|$)' <<< "$archive_list" >/dev/null \
    "Archive does not contain public_html directory"

# log "Checking unsafe paths in archive..."
# assert grep -E '(^/|(^|/)\.\.(/|$))' <<< "$archive_list" >/dev/null \
#     "Archive contains unsafe paths"

# ----------------------------------------------------------------
# Create Stage
# ----------------------------------------------------------------

log "Creating temporary stage..."
STAGE="$(mktemp -d "$BASE_DIR/deploy.XXXXX")"
BACKUP="$BACKUP_ROOT/$(date '+%Y%m%d-%H%M%S')"

cleanup_stage() {
    rm -fr "$STAGE"
}
trap cleanup_stage EXIT

log "Staging deployment in $STAGE..."

assert tar -xzf "$DEPLOY" -C "$STAGE" \
    "Failed to extract archive"

assert_dir "$STAGE/Laravel"
assert_dir "$STAGE/public_html"

log "Staging completed successfully."


# ----------------------------------------------------------------
# Check disk space
# ----------------------------------------------------------------

AVAILABLE_KB=$(df -Pk "$BASE_DIR" | awk 'NR==2 {print $4}')
ARCHIVE_KB=$(du -k "$DEPLOY" | awk '{print $1}')

log "Available disk space: ${AVAILABLE_KB} KB"
log "Archive size: ${ARCHIVE_KB} KB"

if (( AVAILABLE_KB < ARCHIVE_KB * 2 )); then
    log "ERROR: insufficient free disk space for deployment"
    exit 1
fi


# ----------------------------------------------------------------
# Create backup
# ----------------------------------------------------------------

log "Creating backup: $BACKUP"

mkdir -p "$BACKUP_ROOT"
mkdir -p "$BACKUP"

DEPLOYMENT_ACTIVE=1

mv "$BASE_DIR/Laravel" "$BACKUP/Laravel"
mv "$BASE_DIR/public_html" "$BACKUP/public_html"

# ----------------------------------------------------------------
# Install staged deployment
# ----------------------------------------------------------------

log "Installing new Application..."

mv "$STAGE/Laravel" "$BASE_DIR/Laravel"
mv "$STAGE/public_html" "$BASE_DIR/public_html"

if [[ -f "$BACKUP/Laravel/.env" ]]; then
    log "Restoring .env..."
    cp "$BACKUP/Laravel/.env" "$BASE_DIR/Laravel/.env"
else
    log "WARNING: previous Laravel/.env does not exist"
fi


# ------------------------------------------------------------
# Basic post-deployment verification
# ------------------------------------------------------------

log "Running post-deployment checks..."

assert_dir "$BASE_DIR/Laravel"
assert_dir "$BASE_DIR/public_html"
assert_file "$BASE_DIR/Laravel/.env"
assert_file "$BASE_DIR/Laravel/artisan"

log "Running Laravel bootstrap check..."
"$PHP" "$BASE_DIR/Laravel/artisan" --version>/dev/null

log "Running Laravel Application check..."
"$PHP" "$BASE_DIR/Laravel/artisan" route:list>/dev/null

log "Running Laravel Database check..."
"$PHP" "$BASE_DIR/Laravel/artisan" db:show>/dev/null

log "Clearing Laravel configuration cache"
"$PHP" "$BASE_DIR/Laravel/artisan" config:clear
"$PHP" "$BASE_DIR/Laravel/artisan" view:clear
"$PHP" "$BASE_DIR/Laravel/artisan" route:clear
"$PHP" "$BASE_DIR/Laravel/artisan" cache:clear

DEPLOYMENT_ACTIVE=0

# ------------------------------------------------------------
# Deployment succeeded
# ------------------------------------------------------------

log "Deployment successful."

rm -f "$LOCK_FILE"
log "Removed $LOCK_FILE"

rm -f "$DEPLOY"
log "Removed $DEPLOY"

log "Backup retained at:"
log "   $BACKUP"
log "================================================================"
log "Deployment finished successfully"
log "================================================================"
