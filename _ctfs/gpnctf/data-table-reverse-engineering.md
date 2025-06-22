---
layout: challenge
title: "GPN CTF: Data-Table Reverse Engineering"
date: 2025-06-22 12:00:00 +0000
event: gpnctf
permalink: /writeups/gpnctf/data-table-reverse-engineering/
tags: [reverse-engineering, assembly, python, forensics]
---

## Challenge Overview

The binary loops over a hidden 40-entry table in its `.data` section. Each inner iteration does:

```asm
    imul   rax, r8           ; A *= i
    add    rax, rax          ; A += A
    add    rax, r8           ; A += i
    add    rax, 1            ; A += 1
    mov    rdx, [rip+DATA_TABLE@GOTPCREL]
    mov    rdx, [rdx+rcx*8]  ; load DATA_TABLE[j]
    add    rax, rdx          ; A += DATA_TABLE[j]
```

After each full inner loop for index `i` (0 ≤ j ≤ i), the low byte of `A` is taken as the flag byte.

## Extracting the Table

Dump the raw `.data` section and copy the 320 hex bytes:

```pwsh
objdump -s -j .data the_old_way.exe > data_dump.txt
```

Copy the 40×8 bytes (no spaces) into the Python script below.

## Python Recovery Script

```python
#!/usr/bin/env python3
from struct import unpack

hexdata = (
    "INSERT_ALL_320_HEX_BYTES_HERE"
)
data_bytes = bytes.fromhex(hexdata)
DATA_TABLE = list(unpack("<40Q", data_bytes))

flag_bytes = []
for i in range(40):
    A = 0
    for j in range(i+1):
        # A = A * i + A + i + 1
        A = A * i
        A = A + A
        A = A + i
        A = A + 1
        A = (A + DATA_TABLE[j]) & 0xFFFFFFFFFFFFFFFF
    flag_bytes.append(A & 0xFF)

flag = bytes(flag_bytes).decode('ascii')
print(flag)
```

## Explanation

1. **Table Recovery**  
   We use `objdump -s` to grab the entire `.data` block, then slice out the 320 bytes that form a 40-entry 64-bit table.

2. **Loop Emulation**  
   The script re-implements the inner loop arithmetic and adds the corresponding table entry.

3. **Flag Extraction**  
   For each `i`, the script appends the low byte of `A`. Joining these yields the ASCII flag.

## Conclusion

By dumping the `.data` section and faithfully re-implementing the loop, we recover the 40-byte flag without patching or dynamic tracing.
