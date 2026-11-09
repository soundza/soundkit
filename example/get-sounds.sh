#!/usr/bin/env bash
# Downloads the eight sounds the example uses into public/sounds/.
# Needs a free Soundza key: the first command opens a one-click sign-in.
set -e
cd "$(dirname "$0")"
S=../skills/soundza-remotion/scripts/soundza.mjs
node $S signin
node $S add n58u3r7hc54c9jvs5qm1su6s --name whoosh
node $S add cmw123js1008908jkq0xn75ix --name title-hit
node $S add cmvcmbf6rxr815bt4tf7g6xlm --name pop
node $S add cmv5n0d7m013q06l4kqtau4a0 --name tick
node $S add cmv8zj76hjqbl2cjiwm7sg5xn --name ding
node $S add kmciwz5t8ri4nx22o04eu4vd --name riser
node $S add cmvjom2usa7g6b386nqdy9pt0 --name logo-hit
node $S add hf82izfzwmca76u4vjaa1eag --name music
