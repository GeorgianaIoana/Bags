#!/bin/bash

echo "🚀 Compilând SCSS..."
npm run compile:sass

echo ""
echo "🌐 Pornind serverul local și ngrok..."
echo "📋 URL-ul public va apărea mai jos - copiază-l pentru prezentare!"
echo ""

# Pornește live-server în background
live-server ./src --port=8080 --no-browser > /dev/null 2>&1 &
LIVE_SERVER_PID=$!

# Așteaptă puțin ca serverul să pornească
sleep 2

# Pornește ngrok
npx ngrok http 8080

# Când ngrok se oprește, oprește și live-server
kill $LIVE_SERVER_PID 2>/dev/null
