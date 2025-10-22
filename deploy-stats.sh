#!/bin/bash

# Deploy Stats Integration Script
# Run this script after authenticating with: firebase login

set -e  # Exit on error

echo "=========================================="
echo "WHS Bowling - Deploy Stats Integration"
echo "=========================================="
echo ""

# Check if firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Error: Firebase CLI not found"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Error: Not logged into Firebase"
    echo "Run: firebase login"
    exit 1
fi

echo "✓ Firebase CLI ready"
echo ""

# Verify project
echo "Current Firebase project:"
firebase use
echo ""

read -p "Is this the correct project? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run: firebase use willard-tigers-bowling"
    exit 1
fi

echo ""
echo "Step 1: Deploying Firestore rules and indexes..."
echo "=========================================="
firebase deploy --only firestore:rules,firestore:indexes

echo ""
echo "✓ Firestore rules and indexes deployed"
echo ""

echo "Step 2: Deploying Cloud Functions..."
echo "=========================================="
echo "Note: First deployment may take 5-10 minutes"
echo ""
firebase deploy --only functions

echo ""
echo "✓ Cloud Functions deployed"
echo ""

echo "Step 3: Testing manual trigger..."
echo "=========================================="

# Get project ID
PROJECT_ID=$(firebase use | grep -o '\[.*\]' | tr -d '[]')

if [ -z "$PROJECT_ID" ]; then
    echo "⚠ Warning: Could not detect project ID"
    echo "Please manually test with:"
    echo "curl -X POST \"https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/triggerPublicStatsUpdate\""
else
    FUNCTION_URL="https://us-central1-${PROJECT_ID}.cloudfunctions.net/triggerPublicStatsUpdate?programId=willard-tigers"

    echo "Triggering stats update..."
    echo "URL: $FUNCTION_URL"
    echo ""

    RESPONSE=$(curl -s -X POST "$FUNCTION_URL")
    echo "Response:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""

    # Check if successful
    if echo "$RESPONSE" | grep -q '"success": *true'; then
        echo "✓ Manual trigger successful"
    else
        echo "⚠ Warning: Manual trigger may have failed"
        echo "Check function logs with: firebase functions:log"
    fi
fi

echo ""
echo "Step 4: Verification"
echo "=========================================="
echo ""
echo "To verify deployment:"
echo ""
echo "1. Check Firestore Console:"
echo "   - Collection: publicStats"
echo "   - Document: willard-tigers"
echo ""
echo "2. View function logs:"
echo "   firebase functions:log --only updatePublicStats"
echo ""
echo "3. Test public API:"
if [ -n "$PROJECT_ID" ]; then
    echo "   curl \"https://us-central1-${PROJECT_ID}.cloudfunctions.net/getPublicStats?programId=willard-tigers\""
else
    echo "   curl \"https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/getPublicStats?programId=willard-tigers\""
fi
echo ""

echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify stats in Firestore Console"
echo "2. Monitor function logs for 24 hours"
echo "3. Integrate into WHS Site UI"
echo ""
echo "Documentation:"
echo "- DEPLOY_STATS_INTEGRATION.md"
echo "- STATS_INTEGRATION_IMPLEMENTATION.md"
echo ""
