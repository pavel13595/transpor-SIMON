#!/bin/bash

# Simple script to start a local development server
# Run this script to start the website locally

echo "🚀 Starting SIMON STOCKAGE GLOBAL website..."
echo "📂 Current directory: $(pwd)"

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "🐍 Starting Python 3 server on http://localhost:8000"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Starting Python server on http://localhost:8000"
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    # Check if npx is available
    if command -v npx &> /dev/null; then
        echo "📦 Starting Node.js server on http://localhost:3000"
        npx serve . -p 3000
    else
        echo "❌ Node.js found but npx not available"
        echo "📝 Please install serve: npm install -g serve"
        exit 1
    fi
elif command -v php &> /dev/null; then
    echo "🐘 Starting PHP server on http://localhost:8000"
    php -S localhost:8000
else
    echo "❌ No suitable server found!"
    echo "📝 Please install one of the following:"
    echo "   - Python 3: https://python.org"
    echo "   - Node.js: https://nodejs.org"
    echo "   - PHP: https://php.net"
    echo ""
    echo "💡 Or simply open index.html in your browser"
fi
