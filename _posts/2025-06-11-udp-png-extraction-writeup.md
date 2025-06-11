---
layout: post
title:  "CTF Write-Up: forensics/packet-palette"
date:   2025-06-11 12:00:00 +0000
categories: [ctf]
tags:      [pcap, wireshark, tshark, python, png]
---

## Challenge Description

We’re given a `.pcapng` containing UDP traffic on a non-standard port (1337). At first glance the payloads look like fixed-size blobs with repeating headers. Our goal: reconstruct an embedded PNG to recover the flag.

## Analysis

1. Open the capture in Wireshark.
2. Notice UDP packets on port **1337**. Each begins with the 4-byte ASCII header `0x55 0x53 0x42 0x31` (“USB1”).
3. The rest of each packet is binary “blob” data—suspected to be PNG chunks, since after stripping headers we see `89 50 4E 47 0D 0A 1A 0A…`.

## Solution

### 1) Export raw UDP payloads

Use `tshark` to dump payloads as binary:

```bash
mkdir -p payloads
tshark -r challenge.pcapng \
  -Y "udp.port==1337" \
  -T fields -e data \
  | xxd -r -p \
  > payloads/all.bin
```

This concatenates all UDP data into `payloads/all.bin`.

### 2) Strip the 4-byte “USB1” header per packet

Each packet prepends “USB1” (`0x55 53 42 31`). We can skip every 4 bytes per 1024-byte packet:

```python
# scripts/strip_header.py
with open('payloads/all.bin','rb') as f, open('export.png','wb') as out:
    data = f.read()
    chunks = [ data[i+4 : i+1024] for i in range(0, len(data), 1024) ]
    for chunk in chunks:
        out.write(chunk)
print("Written export.png")
```

_(If packet length varies, detect “USB1” offsets dynamically.)_

### 3) Verify and view the PNG

`export.png` begins with the PNG signature `89 50 4E 47 0D 0A 1A 0A`. Open it in an image viewer, or preview using Python:

```python
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

img = mpimg.imread('export.png')
plt.imshow(img)
plt.axis('off')
plt.show()
```

You should see the image containing your flag.

## Flag

```
tjctf{usb1p_f13g_1ns1d3_3_pr0t0c0l}
```
