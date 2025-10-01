@echo off
echo Building Tailwind CSS...
tailwindcss.exe -i ./src/input.css -o ./dist/output.css --minify
echo Build complete! CSS optimized and minified.
pause