#!/bin/bash
# Run this once the new stretch-video.mp4 is in place
# Auto-detect black bar crop values, then crop and overwrite
INPUT="stretch-video.mp4"
CROP=$(ffmpeg -i "$INPUT" -vf cropdetect=24:2:0 -frames:v 60 -f null - 2>&1 | awk '/crop=/{print $NF}' | tail -1)
echo "Detected crop: $CROP"
ffmpeg -i "$INPUT" -vf "$CROP" -c:v libx264 -preset fast -crf 18 -c:a copy cropped.mp4
mv cropped.mp4 "$INPUT"
echo "Done — $INPUT updated"
