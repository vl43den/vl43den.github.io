---
layout: post
title:  "TJCTF Audio Steganography Challenge"
date:   2025-06-09 14:30:00 +00:00
tags:   [forensics, audio, steganography, ctf, tjctf]
---

# Hidden Message in Audio - TJCTF 2025

## Challenge Overview

**Challenge Name:** Sound Secrets  
**Category:** Forensics/Steganography  
**Points:** 250  
**Description:** *"We intercepted this audio file from an agent, but it sounds like regular noise. Our intelligence suggests there might be a hidden message inside. Can you recover the flag?"*

## Initial Analysis

When I first downloaded the challenge file (`recovered_flag.wav`), I opened it with an audio player. As mentioned in the challenge description, it sounded like regular noise without any obvious patterns or messages. This immediately suggested that the flag wasn't hidden in the audible content itself but likely concealed using steganography techniques.

## Understanding Audio Steganography

Audio steganography is the practice of hiding data within audio files. Common techniques include:

1. **LSB (Least Significant Bit)** encoding
2. **Phase coding**
3. **Echo hiding**
4. **Spectral analysis** - hiding information in the frequency spectrum

Given that the audio sounded like noise, I suspected that visual inspection of the audio might reveal patterns not discernible to the human ear.

## Tools and Approach

I decided to use Python with libraries specialized for audio analysis:
- `numpy` for numerical operations
- `matplotlib` for visualization
- `wave` for handling WAV audio files

My approach was to generate a spectrogram of the audio file. A spectrogram is a visual representation of the spectrum of frequencies as they vary with time, allowing us to see patterns that we can't hear.

## The Solution

Here's the Python code I wrote to analyze the audio file:

```python
import matplotlib.pyplot as plt
import numpy as np
import wave

# Load the WAV file
with wave.open('/mnt/data/recovered_flag.wav', 'rb') as wf:
    sr = wf.getframerate()
    nframes = wf.getnframes()
    audio = np.frombuffer(wf.readframes(nframes), dtype=np.int16)

# Generate a spectrogram
plt.figure(figsize=(6,4))
Pxx, freqs, bins, im = plt.specgram(audio, NFFT=1024, Fs=sr, noverlap=512, cmap='gray_r')
plt.xlabel('Time (s)')
plt.ylabel('Frequency (Hz)')
plt.title('Spectrogram of recovered_flag.wav')
plt.colorbar(label='Intensity (dB)')
plt.tight_layout()

# Save the spectrogram as an image for inspection
spec_path = '/mnt/data/spectrogram.png'
plt.savefig(spec_path, dpi=150)
spec_path
```

When I ran this code and examined the resulting spectrogram, I was amazed to see text appear in the frequency domain! The spectrogram clearly showed the flag:

```
tjctf{THIS-EASTER-EGG-IS-PRETTY-COOL}
```

## How It Works

This technique of hiding messages in spectrograms works by carefully manipulating the audio frequencies:

1. The creator starts with text or an image they want to hide
2. They convert this to frequency patterns using tools that modify specific frequency bands
3. The resulting audio sounds like noise to the human ear
4. When viewed as a spectrogram, the hidden patterns become visible

## Lessons Learned

This challenge taught me several important lessons:

1. **Always visualize data**: Sometimes information is hidden in plain sight, just in a different domain
2. **Consider multiple dimensions**: Data can be encoded in time, frequency, amplitude, or phase
3. **Use appropriate tools**: The right visualization can instantly reveal what seems like random noise

## Additional Resources

For those interested in learning more about audio steganography:

- [Spectral Analysis in Audio Processing](https://en.wikipedia.org/wiki/Spectrogram)
- [Digital Signal Processing for Audio Applications](https://www.dspguide.com/)
- [Steganography Techniques in CTFs](https://ctf101.org/forensics/what-is-steganography/)

This was my first experience with audio steganography in a CTF, and it showed me how seemingly random noise can contain hidden messages when analyzed with the right approach.
