---
title: AI should help early in digitization of public health (e.g. ICD-10)
date: 2020-08-11T00:00:00+07:00
tag:
  - ai
  - openai
  - gpt3
  - nlp
  - icd10
  - speechrecognition
  - ocr
  - opencv
  - objectdetection
  - health
  - medicine
category:
  - pinned
---

I am thinking of what health statisticians would do with ICD10 and related health data. I have seen many talks on [Speech Recognition](https://pypi.org/project/SpeechRecognition/), and digitization of patient's health documents; but I think we can go much further than that.

This is partly that I have heard about OpenAI's GPT-3.

<%- xCard({
  title: 'Giving GPT-3 a Turing Test',
  description: 'I’ve been playing around with OpenAI’s newGPT-3 language model. When I got beta '
    + 'access, the first thing I wondered was, how human is GPT-3? Howclose is it to '
    + '...',
  href: 'https://lacker.io/ai/2020/07/06/giving-gpt-3-a-turing-test.html'
}) %>

<!-- excerpt -->

## Current system is not ideal

Currently, in Thailand, as a physician in a **small** hospital, I am using [HosXP](https://hosxp.net/joomla25/), and there are several problems

- Diagnoses with ICD-10 in outpatients are not accurate and sometimes misleading
  - Not sure if it is always possible to differentiate between new and old patients. -- It is quite accurate in some diseases (e.g. MI, stroke), but not all (e.g. TB (which part of [SIR model](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology)?)).
- Health care workers (HCW) might need both attention and training to use the program accurately, but can't that be easily fixed with AI?
- Not to mention that HosXP is usually detached from several others, e.g. Synapse (X-ray) or INFINITT (X-ray)
- What about the possibility of [Patient Health Record](https://en.wikipedia.org/wiki/Personal_health_record) syncing, from private hospitals (including paper files)?

## AI can help in more data collection, and beyond ICD-10

- Not all data has to be keyed in. Some data may come from analysis. This should be done early on, as if the input data is not accurate or enough, it can be corrected. (Garbage-in, Garbage-out.)
- Also, data cleaning is not fun.

## Warning systems and computer-guided recommendations can only be made if computer can make sense of the data

- For scanned documents, this can be fixed with [Optical character recognition (OCR)](https://en.wikipedia.org/wiki/Optical_character_recognition), [natural language processing (NLP)](https://en.wikipedia.org/wiki/Natural_language_processing), and [computer vision](https://en.wikipedia.org/wiki/Computer_vision).
- For talked advice, and perhaps speech recognition conveniences (e.g. Siri), this can be digitized with [Speech recognition](https://en.wikipedia.org/wiki/Speech_recognition). Some notifications should be done if error was made.

## Caution

- I don't think handwriting recognition reliable enough, it should always be proved with human (the writer himself); or avoid it in the first place (type-in, rather than write).
- Hand-drawings shouldn't be sacrificed. Instead, they should be scanned, and made sense with computer vision.

## Conclusion

First and foremost, I am talking about accuracy of data, and early warning. I don't meant to [infringe on anyone's privacy](https://en.wikipedia.org/wiki/Data_sharing). Of course, that should be carefully thought about, including opt-in / opt-out.
