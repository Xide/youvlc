#! /usr/bin/env python3

import sys
import json
import os
import struct

# Read the message length (first 4 bytes).
text_length_bytes = sys.stdin.buffer.read(4)
# Unpack message length as 4 byte integer.
text_length = struct.unpack('i', text_length_bytes)[0]
# Read the text of the message.
text = sys.stdin.buffer.read(text_length).decode('utf-8')
# Decode data to JSON
json = json.loads(text)

command = ' '.join([
    'vlc --one-instance %s' % json['url'],
    '-%s-playlist-enqueue' % ('-no' if not json['queue'] else ''),
    '&'
])

with open('/tmp/youvlc_command', 'w') as f:
    f.write(command)

os.system(command)
