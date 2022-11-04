#/bin/bash

cd dist/img

# Crush PNGS
for file in *.png; do pngcrush "$file" "${file%.png}-crushed.png" && mv -f "${file%.png}-crushed.png" "$file"; done

# Reduce jpg
mogrify -quality 10 *.jpg