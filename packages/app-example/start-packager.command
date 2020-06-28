#!/bin/bash

# Set terminal title
cd `dirname $0`
echo -en "\\033]0;Metro\\a"
clear

packager_running=$(curl localhost:8081 2>/dev/null | grep -i "react native" | wc -l)
if [[ packager_running -ge 1 ]]; then
  echo "React Native packager is running."
  # How to auto close Terminal window: https://stackoverflow.com/a/17910412
  exit 1
else
  # shellcheck source=/dev/null
  yarn start
fi

if [[ -z "$CI" ]]; then
  echo "Process terminated. Press <enter> to close the window"
  read -r
fi
