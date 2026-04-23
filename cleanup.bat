@echo off
echo Membersihkan file-file sementara dan skrip yang tidak digunakan...

del /Q /F full_text.txt
del /Q /F KKA_BS_KLS_10.pdf
del /Q /F extract.js
del /Q /F count_pages.js
del /Q /F fix_avatars.js
del /Q /F fix_ui.js
del /Q /F update_avatars.js
del /Q /F setup_sprite_demo.js
del /Q /F apply_gemini_scenes.js
del /Q /F Gemini_Generated_Image_*.png
del /Q /F public\sprite-demo.html

echo.
echo Pembersihan selesai! Anda juga dapat menghapus file cleanup.bat ini.
pause
