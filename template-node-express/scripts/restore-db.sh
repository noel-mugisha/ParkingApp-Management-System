#!/bin/bash

# Variables
DB_NAME="ne_rest_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_FILE="../backups/ne_rest_db_backup.sql"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file '$BACKUP_FILE' does not exist."
    exit 1
fi

# Confirm restoration
echo "Are you sure you want to restore the database '$DB_NAME' from the backup file '$BACKUP_FILE'? This will overwrite the current data. (yes/no)"
read CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Database restoration aborted."
    exit 0
fi

# Drop the existing database
echo "Dropping existing database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Recreate the database
echo "Recreating database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

# Restore the database
echo "Restoring database '$DB_NAME' from backup file '$BACKUP_FILE'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

# Check if the restoration was successful
if [ $? -eq 0 ]; then
    echo "Database '$DB_NAME' restored successfully from '$BACKUP_FILE'."
else
    echo "Error occurred while restoring database '$DB_NAME'."
fi