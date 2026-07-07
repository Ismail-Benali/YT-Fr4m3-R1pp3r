<div align="center">

<img width="220" src="https://github.com/user-attachments/assets/7266c0fa-04a4-41cc-933b-b69707ac4f71" alt="YT Fr4m3 R1pp3r Logo">

# 🎬 YT Fr4m3 R1pp3r

### High-Precision YouTube Frame Extraction & Video Analysis Toolkit

A lightweight browser userscript for extracting high-quality frames from YouTube videos with configurable capture intervals, metadata generation, contact sheets, and compressed forensic-ready exports.

<p align="center">

<img src="https://img.shields.io/github/stars/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
<img src="https://img.shields.io/github/forks/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
<img src="https://img.shields.io/github/issues/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
<img src="https://img.shields.io/github/license/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">

</p>

<p align="center">

<img src="https://img.shields.io/badge/Version-v5.0-red?style=for-the-badge">
<img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript">
<img src="https://img.shields.io/badge/Tampermonkey-Compatible-green?style=for-the-badge">
<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge">

</p>

</div>

---

# Overview

**YT Fr4m3 R1pp3r** is a browser userscript that extracts video frames directly from the HTML5 video element used by YouTube.

Designed for researchers, educators, analysts and developers, it provides configurable frame extraction, metadata generation, contact sheets and compressed ZIP exports while remaining lightweight and easy to use.

Unlike traditional screenshot tools, every frame is automatically organized with chronological filenames and exported together with analysis reports.

---

# Features

## Frame Extraction

- High-quality frame extraction
- Automatic capture interval
- Manual frame capture
- JPEG / PNG / WebP support
- Adjustable image quality
- Configurable capture interval
- Automatic duplicate frame filtering

---

## Analysis

- Resolution detection
- Live FPS estimation
- Progress indicator
- Estimated output size
- Capture statistics
- Capture timestamps
- Automatic frame numbering

---

## Export

- ZIP archive generation
- Contact Sheet generation
- JSON metadata report
- CSV frame report
- Chronological filenames
- DEFLATE compression

---

## Performance

- requestVideoFrameCallback support
- Automatic browser fallback
- Blob-based processing
- Canvas reuse
- Reduced memory usage
- Automatic cleanup
- Configurable RAM limit
- Automatic ZIP generation when memory limit is reached

---

## YouTube Compatibility

- SPA navigation support
- Video error detection
- Network stall detection
- HTML5 video support

---

# User Interface

The floating control panel includes:

- ▶ Start Capture
- ■ Stop & Export
- 📷 Manual Capture
- ⚙ Settings Panel

Settings include:

- Capture Interval
- Output Format
- Image Quality
- Maximum RAM Usage

Real-time statistics display:

- Resolution
- FPS
- Current Timestamp
- Total Frames
- Skipped Frames
- Estimated Memory Usage
- Progress Bar

---

# Output Structure

```
Analysis_Frames.zip
│
├── Contact_Sheet.jpg
├── report.json
├── frames_data.csv
│
└── OSINT_Frames/
    ├── 000001_000421_012.500.jpg
    ├── 000002_000421_013.000.jpg
    ├── 000003_000421_013.500.jpg
    └── ...
```

---

# Generated Reports

## report.json

Contains

- Tool version
- Capture timestamps
- Video duration
- Resolution
- Image format
- Compression quality
- Capture interval
- Total extracted frames
- Skipped duplicate frames

---

## frames_data.csv

Each extracted frame includes

| Field | Description |
|-------|-------------|
| Frame | Filename |
| Time | Video timestamp |
| Size | File size |

---

# Installation

## Tampermonkey

1. Install Tampermonkey
2. Create a new Userscript
3. Paste the script
4. Save
5. Open any YouTube video
6. Start capturing

---

# Technologies

- JavaScript ES6
- HTML5 Canvas
- JSZip
- Blob API
- HTMLVideoElement
- requestVideoFrameCallback
- LocalStorage
- Tampermonkey

---

# Performance Optimizations

Version 5 introduces several improvements:

- Fast pixel hash duplicate detection
- Moving average FPS calculation
- Direct contact sheet rendering
- Zero-copy canvas workflow
- Configurable memory limit
- Automatic export protection
- Reduced Blob allocations
- Persistent user settings
- Improved asynchronous processing

---

# Example Filename

```
000183_000421_092.500.jpg
```

Meaning

```
Frame Number : 183
Video Length : 00:04:21
Timestamp    : 92.500 sec
```

---

# Supported Formats

| Format | Supported |
|---------|-----------|
| JPEG | ✔ |
| PNG | ✔ |
| WebP | ✔ |

---

# Typical Use Cases

- Frame-by-frame inspection
- Video documentation
- Research projects
- Educational demonstrations
- Scene comparison
- Timeline reconstruction
- Media review
- Software testing
- Computer vision dataset preparation

---

# Roadmap

- [ ] OCR Integration
- [ ] Face Detection
- [ ] Object Detection
- [ ] Scene Change Detection
- [ ] OCR Report
- [ ] AI Classification
- [ ] Video Metadata Reader
- [ ] Batch Video Processing
- [ ] Dark Theme
- [ ] Localization

---

# License

This project is released under the MIT License.

---

# Contributing

Contributions, ideas and pull requests are welcome.

If you discover a bug or have a feature request, please open an issue.

---

# Disclaimer

This tool captures frames from videos rendered in your own browser.

Users are responsible for complying with applicable copyright laws, platform terms of service, and any other legal or contractual obligations when using this software.

---

<div align="center">

## ⭐ If you find this project useful, consider leaving a Star.

Made by **H3l!0s_T3k**

</div>
