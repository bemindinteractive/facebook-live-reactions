RTMP_SERVER=$1

if ! [[ -n "$RTMP_SERVER" ]]; then
  echo "You need to pass the RTMP_SERVER address (as string)"
  exit 1
fi

ffmpeg \
-re -y \
-loop 1 \
-f image2 \
-i output.png \
-i ./app/assets/audio.wav \
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
$RTMP_SERVER
