---
title: Linux sheet music and MIDI authoring with Frescobaldi/Lilypond
date: 2021-05-05T00:00:00+07:00
tag:
  - linux
  - frescobaldi
  - lilypond
  - music
  - rosegarden
---

An easy way to author music on Linux, with both sheet music and [MIDI](https://wiki.archlinux.org/title/MIDI), is to use [Lilypond](http://lilypond.org/), a text-based sheet music language. A GUI editor for Lilypond is [Frescobaldi](https://www.frescobaldi.org/index.html), which is available for all three major platforms.

Furthermore, you will need to install a MIDI player. I use [Timidity++](https://wiki.archlinux.org/title/Timidity%2B%2B) for this.

If you want a more complex music studio, you might try [Rosegarden](https://www.rosegardenmusic.com/).

<!-- excerpt -->

This is an example Lilypond file, that covers

- Chords
- Lyrics
- Repeats
- MIDI player
- Transpose

```lua
\version "2.22.1"

\header {
  title = "My Heart Will Go On"
  composer = "Theme from Titanic (1997)"
  tagline = \markup {
    Engraved at
    \simple #(strftime "%Y-%m-%d" (localtime (current-time)))
    with \with-url #"http://lilypond.org/"
    \line { LilyPond \simple #(lilypond-version) (http://lilypond.org/) }
  }
}

vocal = <<
\new ChordNames \with {midiInstrument = "acoustic guitar (nylon)"} {
  \chordmode {
    \repeat volta 2 {
      e1 b a e2 b
      e1 b a
    }
    \alternative {
      { a1 }
      { a2 gis:m }
    }
    
    cis1:m b a b cis:m b a gis2:m fis:m
    cis1:m b a b cis:m b a b2 a e1
  }
}

\new Voice = "one" \relative e' {
  \tempo 4 = 120
  \key e \major
  
  \repeat volta 2 {
    e4. e8 e4 e
    dis e2 e4
    dis e2 fis4
    gis2 fis
    e4. e8 e4 e
    dis e2 e4
    b1(
  }
  \alternative {
    { cis1) }
    { cis2 cis4( dis }
  }
  
  \break
  
  e1) fis2. b,4
  b'2 a4 gis8 fis~
  fis2 gis4 a
  gis2 fis4 e
  
  \break
  
  dis e2 dis4
  cis2.~( cis8 dis16 cis
  b2 a2)
  
  \break
  
  e'1 fis2. b,4
  b'2 a4 gis8 fis~
  fis2 gis4 a
  gis2 fis4 e
  
  \break
  
  dis e2 dis4
  dis e2 fis4
  gis2 fis e1
  
  \bar "|."
}

\new Lyrics \lyricsto "one" {
  <<
  {
    Eve -- ry night in my dreams
    I see you, I feel you.
    That is how I know you, go on.
  }
  
  \new Lyrics {
    \set associatedVoice = "one"
    Far a -- cross the dis -- tance
    And spa -- ces, be -- tween us
    You have come to show you, go on.
    \skip 1
    Near, far, wher -- e -- ver you are
    I be -- lieve that the heart does, go on

    Once more you o -- pen the door,
    and you're here in my heart,
    and my heart will go on, and on
  }
  >>
}
>>

\score {
  \transpose e e {
    \vocal
  }

  \layout {}
}

\score {
  \unfoldRepeats {
    \vocal
  }
  \midi {}
}
```

And, the exported PDF - [my-heart-will-go-on.pdf](https://github.com/patarapolw/music/blob/807974ef35764dbfa0e8b17a11eb1f8f517f1bca/_docs/Titanic/my-heart-will-go-on.pdf).
