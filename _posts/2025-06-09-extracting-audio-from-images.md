---
layout: post
title: "Step-by-step Guide: Extracting WAV files from PNG images"
date: 2025-06-09 15:00:00 +00:00
tags: [forensics, steganography, ctf, tutorial]
---

# Extracting Audio from Images: A Quick Guide

After completing the TJCTF album cover challenge, I wanted to create a quick guide on how to extract hidden audio files from images, as this is a common technique in CTF challenges.

## Tools You'll Need

- binwalk (for file carving/extraction)
- exiftool (optional, for metadata analysis)
- Python with matplotlib, numpy, and wave libraries (for spectrogram analysis)

## Step 1: Initial Analysis

Always start with basic file analysis:

```bash
file image.png      # Verifies file type
exiftool image.png  # Checks metadata
strings image.png   # Looks for readable text
```

## Step 2: Detect Hidden Files with Binwalk

Binwalk is a powerful tool for detecting embedded files:

```bash
binwalk image.png
```

If you see indications of other file formats (like WAV, ZIP, etc.), you can extract them:

```bash
binwalk -e image.png
```

This will create a directory with the extracted files.

## Step 3: Analyze Extracted Audio Files

If you extracted a WAV file, you can analyze it in several ways:

1. Listen to it (might contain audible clues)
2. View its waveform or spectrogram

For spectrogram analysis, you can use the Python code from my TJCTF writeup:

```python
import matplotlib.pyplot as plt
import numpy as np
import wave

# Load the extracted WAV file
with wave.open('extracted_file.wav', 'rb') as wf:
    sr = wf.getframerate()
    nframes = wf.getnframes()
    audio = np.frombuffer(wf.readframes(nframes), dtype=np.int16)

# Generate spectrogram
plt.figure(figsize=(10,6))
plt.specgram(audio, NFFT=1024, Fs=sr, noverlap=512, cmap='inferno')
plt.colorbar(label='Intensity (dB)')
plt.title('Spectrogram Analysis')
plt.xlabel('Time (s)')
plt.ylabel('Frequency (Hz)')
plt.tight_layout()
plt.savefig('spectrogram.png')
plt.show()
```

## Alternative Methods

If binwalk doesn't reveal anything, consider trying:

- steghide (for JPG, BMP, WAV, AU)
- zsteg (for PNG, BMP)
- StegSolve (for visual analysis)

## Conclusion

Image-audio steganography can be complex, but this simple workflow will help you tackle basic challenges. Always remember to try multiple tools and approaches!

Happy hunting!
