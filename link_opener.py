#! /usr/bin/env python

import sys
import json
import os

#Initial block size, 4 on my laptop so fuck off nice code
sys.stdin.read(4)

# Horrible code, yet a simple JSON load inf loop :/
# TODO fix this by corrctly parsing size (lines above)
res = ''
while '}' not in res:
  chunk = sys.stdin.read(1)
  res += chunk

res = json.loads(res)
os.system('vlc %s &' % res['text'])
