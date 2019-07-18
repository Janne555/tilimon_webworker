#!/bin/bash
npx babel src --out-dir cjs --ignore "src/**/*.test.js"
npm run build
npm run dev