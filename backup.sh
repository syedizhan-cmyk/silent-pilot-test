#!/bin/bash
# Silent Pilot Website - Automated Backup Script
# Run this weekly to create timestamped backups

echo "🔄 Starting Silent Pilot Website Backup..."
echo ""

# Configuration
BACKUP_NAME="silentpilot-backup-$(date +%Y%m%d-%H%M%S)"
SOURCE_DIR="$HOME/Desktop/Silent Pilot Website"
DEST_DIR="$HOME/Desktop"
BACKUP_FILE="${DEST_DIR}/${BACKUP_NAME}.tar.gz"

# Create backup
echo "📦 Creating backup archive..."
cd "$HOME/Desktop"

tar -czf "$BACKUP_FILE" \
  --exclude='node_modules' \
  --exclude='build' \
  --exclude='dist' \
  --exclude='.temp' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  "Silent Pilot Website" 2>/dev/null

# Check if backup was successful
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully!"
    echo ""
    echo "📊 Backup Details:"
    echo "   File: $BACKUP_FILE"
    echo "   Size: $BACKUP_SIZE"
    echo "   Date: $(date)"
    echo ""
    
    # Count existing backups
    BACKUP_COUNT=$(ls -1 "${DEST_DIR}"/silentpilot-backup-*.tar.gz 2>/dev/null | wc -l)
    echo "📁 Total backups: $BACKUP_COUNT"
    
    # Optional: Keep only last 5 backups to save space
    echo ""
    read -p "🗑️  Keep only last 5 backups? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$DEST_DIR"
        ls -t silentpilot-backup-*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null
        NEW_COUNT=$(ls -1 silentpilot-backup-*.tar.gz 2>/dev/null | wc -l)
        echo "✅ Cleaned up old backups. Remaining: $NEW_COUNT"
    fi
    
    echo ""
    echo "🎉 Backup complete!"
    echo ""
    echo "💡 Tips:"
    echo "   - Store this backup in cloud storage (Google Drive, Dropbox)"
    echo "   - Keep your .env file backed up separately (securely!)"
    echo "   - Test restore occasionally"
    echo ""
else
    echo "❌ Backup failed!"
    exit 1
fi
