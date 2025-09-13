# 🎵 Music Setup Guide

## 📁 Adding Background Music

### 1. Create Audio Directory

```bash
mkdir -p public/audio
```

### 2. Add Your Music File

Place your background music file in `public/audio/background-music.mp3`

**Recommended audio formats:**

- **MP3** (most compatible)
- **WAV** (high quality)
- **OGG** (good compression)

### 3. File Requirements

- **Duration**: 2-5 minutes (it will loop automatically)
- **Volume**: The code sets volume to 30% by default
- **Size**: Keep under 5MB for good loading performance
- **Format**: MP3 recommended for best browser compatibility

### 4. Music Sources

**Free music options:**

- [Freesound.org](https://freesound.org) - Creative Commons sounds
- [YouTube Audio Library](https://www.youtube.com/audiolibrary) - Free music
- [Incompetech](https://incompetech.com) - Kevin MacLeod's free music
- [Pixabay Music](https://pixabay.com/music/) - Free background music

### 5. Custom Music File

To use a different filename, update the audio source in `components/sections/waitlist-globe.tsx`:

```typescript
const audio = new Audio("/audio/your-music-file.mp3");
```

### 6. Multiple Tracks (Optional)

To add multiple tracks that rotate:

```typescript
const tracks = ["/audio/track1.mp3", "/audio/track2.mp3", "/audio/track3.mp3"];
const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
const audio = new Audio(randomTrack);
```

## 🎛️ Button Features

✅ **Play/Pause Toggle**: Click to start/stop music  
✅ **Visual Feedback**: Different icons for play/pause states  
✅ **Hover Effects**: Smooth scaling animation  
✅ **Glass Effect**: Beautiful backdrop blur styling  
✅ **Auto-loop**: Music repeats automatically  
✅ **Volume Control**: Set to 30% to not be intrusive  
✅ **Error Handling**: Graceful fallback if audio fails to load

## 🎨 Styling

The button features:

- **Glass morphism design** with backdrop blur
- **Smooth hover animations** with scale effects
- **Play/Pause icons** that change dynamically
- **Responsive positioning** in the top-right corner
- **Tooltip support** showing current state

## 🔧 Customization

### Change Volume

```typescript
audio.volume = 0.5; // 50% volume (range: 0.0 to 1.0)
```

### Change Button Position

Update the CSS classes in the button container:

```typescript
className = "absolute top-6 left-6 z-20"; // Top-left
className = "absolute bottom-6 right-6 z-20"; // Bottom-right
```

### Change Button Style

Modify the button classes for different appearances:

```typescript
className = "w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full..."; // Orange theme
```

No music file is included by default - add your own to `public/audio/background-music.mp3` to enable the functionality! 🎵
