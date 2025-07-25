---
title: "🤚 Gesture Launcher (goreallymental)"
date: 2025-01-25
tags:
  - python
  - computer-vision
  - opencv
  - mediapipe
  - gesture-recognition
  - linux
source: https://github.com/vl43den/goreallymental
demo: false
featured: true
---

**Control your computer with hand gestures!** A Python application that uses computer vision to detect hand gestures and launch applications via webcam.

## ✨ Features

- 🎯 **Real-time hand detection** using Google's MediaPipe
- 👆 **Finger counting** (0-5 fingers) for gesture recognition
- 🚀 **Customizable app launching** via JSON configuration
- ⏱️ **5-second cooldown** to prevent accidental launches
- 📹 **Visual feedback** with hand landmarks overlay
- 🎨 **Clean interface** showing gesture status and available commands
- ⚙️ **Easy configuration** - edit gestures without touching code

## 🎮 Default Gestures

| Gesture | Fingers | Action |
|---------|---------|--------|
| ✊ Fist | 0 | Open Terminal |
| ☝️ Point | 1 | Open File Manager |
| ✌️ Peace | 2 | Open Firefox |
| 🤟 Three | 3 | Open VS Code |
| 🖖 Four | 4 | Open Text Editor |
| ✋ Open Hand | 5 | Open Thunderbird |

## 🛠️ Technology Stack

- **Python 3.11+** - Core language
- **OpenCV** - Computer vision and camera handling
- **MediaPipe** - Google's hand detection and tracking
- **JSON** - Configuration management
- **subprocess** - Application launching

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vl43den/goreallymental.git
   cd goreallymental
   ```

2. **Set up Python environment**
   ```bash
   conda create -n gesture_env python=3.11
   conda activate gesture_env
   conda install -c conda-forge opencv
   pip install mediapipe
   ```

3. **Run the application**
   ```bash
   python gesture_launcher.py
   ```

4. **Start gesturing!** ✋
   - Position your hand in front of the webcam
   - Hold up fingers (0-5) to trigger actions
   - Press **ESC** to exit

## ⚙️ Customization

The application uses a `gestures.json` file to map finger counts to shell commands. You can easily customize which applications launch for each gesture:

```json
{
    "0": "gnome-terminal",
    "1": "nautilus ~/Documents",
    "2": "firefox https://github.com",
    "3": "code .",
    "4": "gedit",
    "5": "spotify"
}
```

## 🔧 Technical Implementation

- **Hand Detection**: MediaPipe Hands solution with 21 landmark points
- **Finger Detection**: Compares fingertip Y-coordinates with joint positions
- **Thumb Special Case**: Uses X-coordinate comparison for thumb detection
- **Performance**: 30+ FPS processing with minimal CPU usage
- **Cooldown**: `time.monotonic()` for precise timing

## 📄 License

This project is licensed under the MIT License - making it free to use, modify, and distribute.

## 🎯 Use Cases

- **Accessibility**: Hands-free computer control
- **Presentations**: Launch applications without touching keyboard
- **Demo purposes**: Impressive computer vision showcase
- **Development**: Learning OpenCV and MediaPipe
- **Automation**: Quick access to frequently used applications

---

**Made with luv and Python**
