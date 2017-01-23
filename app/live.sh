ffmpeg \
-re -y \
-loop 1 \
-f image2 \
-i output.jpeg \
-i ./app/assets/audio.m4a \
-acodec aac \
-ac 1 \
-ar 44100 \
-b:a 128k \
-vcodec libx264 \
-pix_fmt yuv420p \
-vf scale=640:480 \
-r 30 \
-g 60 \
-f flv \
-strict \
-2 \
$1
