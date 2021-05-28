---
title: My Digital Audio Workstation (DAW) setup
date: 2021-05-28T11:27:00+07:00
tag:
  - linux
  - frescobaldi
  - lilypond
  - music
  - rosegarden
  - cadence
  - kxstudio
  - audacity
  - ubuntu-studio
  - lowlatency
  - hydrogen-drumkit
---

Currently, I make audio with MIDI sequencer / WAV on Ubuntu with `ubuntu-studio-installer`. But then

- `ubuntu-studio-installer` is for installing `linux-lowlatency` kernel only.
- I removed Studio Control, and add KXStudio repo and install Cadence for JACK.
  - Cadence for JACK works well with headphones, but not Bluetooth speakers.
- QSynth, with installed SoundFonts for MIDI.
- Instead of Ardour, I use Rosegarden for audio mixing.
- Rosegarden can edit WAV with Audacity, for WAV transformation.
  - Oddly, I can't find a way for Rosegarden to render MIDI, but the can easily be fixed with Cadence Render.
- Hydrogen drumkits, to generate MIDI for drums.
- Frescobaldi, to generate MIDI for piano.
  - Can be simpler to use than Rosegarden's built-in score editor.
- Both Rosegarden and Hydrogen have lots of examples and demos.
- `pavucontrol` or PulseAudio Volume Control, if you need to tweak the loudness.

<!-- excerpt -->

As for Arch variant (I started with Arch), you can install most things from AUR, but you might use `linux-rt` or `linux-zen`, instead of `linux-lowlatency`.

![rosegarden-screenshot](https://res.cloudinary.com/patarapolw/image/upload/v1622175980/polv/Screenshot_at_2021-05-26_12-15-30_a5a5io.png)
