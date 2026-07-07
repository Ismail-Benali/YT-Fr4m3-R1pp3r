<img width="2000" height="2000" alt="input-onlinepngtools" src="https://github.com/user-attachments/assets/7266c0fa-04a4-41cc-933b-b69707ac4f71" />


> **High-Precision YouTube Frame Extractor & Video Analysis Tool**

![Version](https://img.shields.io/badge/version-3.0-red)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 Overview

**YT Fr4m3 R1pp3r** is a lightweight browser userscript designed for high-precision frame extraction and visual video analysis.

The tool captures frames at configurable intervals (default **0.5 seconds**) and packages them into a compressed ZIP archive, making it useful for:

- Digital investigations
- Video analysis
- Visual documentation
- Timeline reconstruction
- Content inspection
- Research workflows

---

## ✨ Features

- 📷 High-quality frame extraction
- ⏱ Automatic capture every 0.5 seconds
- 📸 Manual frame capture
- 📦 ZIP export
- 🖼 Contact Sheet generation
- ⚡ requestVideoFrameCallback support
- 🔄 Automatic fallback for unsupported browsers
- 💾 Memory optimized using Blob objects
- 🗜 DEFLATE ZIP compression
- 📊 Live statistics panel
- 🎚 Adjustable JPEG quality
- 🎥 Resolution detection
- 📈 Estimated data size
- 🎬 FPS estimation
- 🚦 Video error detection
- 🔄 YouTube SPA navigation support

---

## 🖥 Interface

The userscript adds a floating control panel including:

- Start Auto Capture
- Stop & Export ZIP
- Capture Current Frame
- Quality Selector
- Resolution Monitor
- FPS Monitor
- Captured Frames Counter
- Estimated Data Size
- Status Indicator

---

## 📁 ZIP Structure

```
OSINT_Frames.zip
│
├── Contact_Sheet.jpg
│
└── OSINT_Frames/
    ├── frame_0000_50.jpg
    ├── frame_0001_00.jpg
    ├── frame_0001_50.jpg
    ├── frame_0002_00.jpg
    └── ...
```

---

## ⚙ Technologies

- JavaScript ES6
- HTML5 Canvas API
- JSZip
- requestVideoFrameCallback
- Blob API
- File API
- Tampermonkey

---

## 🚀 Installation

1. Install **Tampermonkey**.
2. Create a new userscript.
3. Paste the source code.
4. Save.
5. Open a supported video page.
6. Start extracting frames.

---

## ⚡ Performance

The current version includes several optimizations:

- Reusable Canvas
- Blob-based image storage
- Reduced memory consumption
- Asynchronous image processing
- Automatic cleanup
- Browser compatibility fallback
- DEFLATE compression
- Navigation handling

---

## 📊 Output

Each extracted frame is named using its timestamp.

Example:

```
frame_0000_50.jpg
frame_0001_00.jpg
frame_0001_50.jpg
```

This makes chronological analysis straightforward.

---

## 📌 Use Cases

- Video frame inspection
- Visual timeline analysis
- Research documentation
- Educational demonstrations
- Digital media analysis
- Content review

---

## 🛣 Roadmap

- [ ] PNG export
- [ ] CSV report
- [ ] JSON metadata report
- [ ] OCR support
- [ ] Face detection
- [ ] Object detection
- [ ] Duplicate frame filtering
- [ ] Custom capture intervals
- [ ] Dark/Light themes
- [ ] Batch processing

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**H3l!0s_T3k**

GitHub

https://github.com/Ismail-Benali

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.
