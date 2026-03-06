#!/bin/bash

# Script to find all placeholder text that needs to be updated before pushing to GitHub

echo "🔍 Searching for placeholders that need updating..."
echo ""

echo "📧 Email addresses to update:"
grep -rn "your.email@example.com" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
grep -rn "@your-domain.com" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
grep -rn "@fitbookauto.com" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
echo ""

echo "👤 GitHub usernames to update:"
grep -rn "yourusername" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
echo ""

echo "📛 Names to update:"
grep -rn "Your Name" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
echo ""

echo "🌐 Generic URLs to review:"
grep -rn "example.com" --exclude-dir=.git --exclude="*.sh" . 2>/dev/null
echo ""

echo "✅ Review complete!"
echo ""
echo "To replace all instances of 'yourusername' at once:"
echo "  find . -type f -not -path './.git/*' -not -path './scripts/*' -exec sed -i '' 's/yourusername/YOUR_USERNAME/g' {} +"
