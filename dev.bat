@echo off
title Wishlist Tracker Dev Server
cd /d "%~dp0"
start http://localhost:5173/Wishlist-Tracker/
npm run dev
