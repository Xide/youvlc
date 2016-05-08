#!/bin/sh
# Taken from https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/nativeMessaging/host/install_host.sh
# Copyright 2013 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

set -e

DIR="$( cd "$( dirname "$0" )" && pwd )"

if [ "$(uname -s)" == "Darwin" ]; then
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR="/Library/Google/Chrome/NativeMessagingHosts"
  else
    TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
  fi
else
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR="/etc/opt/chrome/native-messaging-hosts"
  else
    TARGET_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
  fi
fi

HOST_NAME=youvlc

# Create directory to store native messaging host.
mkdir -p "$TARGET_DIR"

# Update host path in the manifest (copying sample).
sed "s#HOST_PATH#$DIR#" "$DIR/app_manifest.json.sample" > "$DIR/app_manifest.json"

# Copy native messaging host manifest.
ln -fs "$DIR/app_manifest.json" "$TARGET_DIR/$HOST_NAME.json"

# Set permissions for the manifest so that all users can read it.
chmod o+r "$TARGET_DIR/$HOST_NAME.json"

echo "Native messaging host $HOST_NAME has been installed."

echo
echo "Please install extension and copy paste ID below."
read -p "Extension ID: " EXT_ID

# Update host path in the manifest (copying sample).
sed -i "s#EXTENSION_ID#$EXT_ID#g" "$DIR/app_manifest.json"
