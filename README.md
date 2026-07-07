<div align="center">

<img width="220" src="https://github.com/user-attachments/assets/7266c0fa-04a4-41cc-933b-b69707ac4f71" alt="YT Fr4m3 R1pp3r Logo">

# 🎬 YT Fr4m3 R1pp3r

### High-Precision YouTube Frame Extractor & Video Analysis Tool

<p align="center">

<a href="https://github.com/Ismail-Benali/YT-Fr4m3-R1pp3r">
    <img src="https://img.shields.io/github/stars/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
</a>

<a href="https://github.com/Ismail-Benali/YT-Fr4m3-R1pp3r/network/members">
    <img src="https://img.shields.io/github/forks/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
</a>

<a href="https://github.com/Ismail-Benali/YT-Fr4m3-R1pp3r/issues">
    <img src="https://img.shields.io/github/issues/Ismail-Benali/YT-Fr4m3-R1pp3r?style=for-the-badge">
</a>

</p>

<p align="center">

<img src="https://img.shields.io/badge/Version-v3.0-red?style=for-the-badge">
<img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript">
<img src="https://img.shields.io/badge/Tampermonkey-Compatible-green?style=for-the-badge">
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">

</p>

<p align="center">

<a href="https://greasyfork.org/scripts/XXXXXXXX">
<img src="https://img.shields.io/badge/Install-GreasyFork-800000?style=for-the-badge" alt="Greasy Fork">
</a>

<a href="https://openuserjs.org/scripts/H3l!0s_T3k/YT_Fr4m3_R1pp3r">
<img src="https://img.shields.io/badge/Install-OpenUserJS-4B8BBE?style=for-the-badge" alt="OpenUserJS">
</a>

</p>

</div>

---

# 📖 Overview

**YT Fr4m3 R1pp3r** is a lightweight browser userscript designed for high-precision frame extraction and visual video analysis.

The script captures video frames at configurable intervals (default **0.5 seconds**) and automatically exports them into a compressed ZIP archive.

It is intended for:

- Digital investigations
- Video inspection
- Visual documentation
- Timeline reconstruction
- Educational demonstrations
- Research workflows
- General frame-by-frame analysis

---

# ✨ Features

- 📷 High-quality frame extraction
- ⏱ Automatic capture every 0.5 seconds
- 📸 Manual frame capture
- 📦 ZIP export
- 🖼 Automatic Contact Sheet generation
- ⚡ requestVideoFrameCallback support
- 🔄 Automatic browser fallback
- 💾 Memory optimized Blob processing
- 🗜 DEFLATE ZIP compression
- 📊 Live statistics panel
- 🎚 Adjustable JPEG quality
- 🎥 Resolution detection
- 🎬 FPS estimation
- 📈 Estimated output size
- 🚦 Video error detection
- 🔄 YouTube SPA navigation support

---

# 🖥 Interface

The floating control panel provides:

- ▶ Start Auto Capture
- ■ Stop & Export ZIP
- 📷 Capture Current Frame
- 🎚 JPEG Quality Selector
- 📊 Resolution Monitor
- 🎬 FPS Monitor
- 📈 Captured Frames Counter
- 💾 Estimated Output Size
- ✅ Status Indicator

---

# 📁 ZIP Structure

```text
OSINT_Frames.zip
│
├── Contact_Sheet.jpg
│
└── OSINT_Frames/
    ├── frame_0000_50.jpg
    ├── frame_0001_00.jpg
    ├── frame_0001_50.jpg
    ├── frame_0002_00.jpg
    ├── frame_0002_50.jpg
    └── ...
```

---

# ⚙ Technologies

- JavaScript ES6
- HTML5 Canvas API
- JSZip
- Blob API
- File API
- requestVideoFrameCallback
- HTMLVideoElement
- Tampermonkey

---

# 🚀 Installation

1. Install **Tampermonkey**
2. Create a new Userscript
3. Copy the script source
4. Save the Userscript
5. Open a supported video page
6. Press **Start Auto Capture**

---

# ⚡ Performance Optimizations

The current version includes numerous optimizations:

- ✅ Reusable Canvas
- ✅ Blob-based image processing
- ✅ Reduced memory consumption
- ✅ Asynchronous frame encoding
- ✅ Automatic cleanup
- ✅ Browser compatibility fallback
- ✅ DEFLATE ZIP compression
- ✅ Navigation handling
- ✅ Pending Blob synchronization
- ✅ Contact Sheet generation

---

# 📊 Output

Each extracted frame is automatically named using its timestamp.

Example:

```text
frame_0000_50.jpg
frame_0001_00.jpg
frame_0001_50.jpg
frame_0002_00.jpg
```

This makes chronological analysis simple and intuitive.

---

# 📌 Use Cases

- Frame-by-frame inspection
- Educational demonstrations
- Research documentation
- Digital media analysis
- Timeline reconstruction
- Visual investigations
- Content review
- Scene comparison

---

# 🛣 Roadmap

- [ ] PNG Export
- [ ] CSV Report
- [ ] JSON Metadata
- [ ] OCR Support
- [ ] Face Detection
- [ ] Object Detection
- [ ] Duplicate Frame Filtering
- [ ] Adjustable Capture Interval
- [ ] Dark / Light Theme
- [ ] Batch Processing
- [ ] Video Metadata Export
- [ ] AI Image Classification

---

# 📥 Downloads

| Platform | Download |
|-----------|----------|
| 🛢 **Greasy Fork** | **https://greasyfork.org/scripts/XXXXXXXX** |
| 🟦 **OpenUserJS** | **https://openuserjs.org/scripts/H3l!0s_T3k/YT_Fr4m3_R1pp3r** |

---

# ⭐ Support

If you enjoy this project, consider giving it a **⭐ Star** on GitHub.

Contributions, suggestions, and bug reports are always welcome.

---

<div align="center">

Made with ❤️ by **H3l!0s_T3k**

</div>
