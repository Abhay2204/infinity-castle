# 無限城 | Infinity Castle - Demon Slayer

An immersive 3D web experience exploring the dimensional fortress from Demon Slayer: Kimetsu no Yaiba. Built with React Three Fiber and Three.js.

🔗 **Live Demo**: [https://infinity-castle.vercel.app/](https://infinity-castle.vercel.app/)

## 🏯 Features

- **Scroll-based Navigation**: Descend through the castle depths with smooth scrolling
- **Real-time 3D Rendering**: Optimized WebGL rendering with atmospheric lighting
- **Japanese-inspired Architecture**: Torii gates, shoji screens, and traditional elements
- **Section-based Storytelling**: Explore Muzan's throne room and the Upper Moons
- **Mobile Optimized**: Touch-friendly controls with adaptive performance

## 📍 Sections

1. **Infinity Castle** - The grand entrance with torii gate
2. **Muzan Kibutsuji** - The Demon King's throne room
3. **Upper Moons** - The six most powerful demons
4. **Architecture** - Impossible geometry and portals
5. **Final Battle** - The ultimate confrontation
6. **Nakime** - The Biwa Demon who controls it all
7. **Lore & Secrets** - Hidden truths of the castle

## 🛠 Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## 📱 Mobile Optimizations

### Performance
- Lower resolution rendering (0.5-1 DPR on mobile vs 1-1.5 on desktop)
- Reduced geometry complexity (fewer rooms, bridges, pillars)
- Frame skipping for animations (3x on mobile vs 2x on desktop)
- Fewer particles (10 on mobile vs 20 on desktop)
- Optimized lighting (emissive materials instead of point lights where possible)

### UX
- Touch-based scrolling with momentum
- Section texts disabled by default on mobile (toggle with 👁 button)
- Responsive UI scaling
- Hidden navigation sidebar on mobile
- Optimized viewport settings for mobile browsers

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

- **Desktop**: Scroll with mouse wheel to navigate
- **Mobile**: Swipe up/down to navigate
- **Navigation**: Click section names (desktop) or use depth meter
- **Toggle Texts**: Click 👁 button to show/hide section descriptions

## ⚠️ Performance Notes

Due to heavy use of Three.js elements (dynamic lighting, particles, instanced meshes), this experience may lag on low-end devices. Best experienced on:
- Desktop with dedicated GPU
- Modern smartphones (2020+)
- Tablets with good graphics performance

## 📁 Project Structure

```
├── components/
│   ├── Experience.tsx       # Main 3D canvas setup
│   ├── FloatingIslands.tsx  # Environmental 3D elements
│   ├── PlayerController.tsx # Camera movement & controls
│   ├── Interface.tsx        # UI overlay
│   ├── Sections.tsx         # Story sections with 3D scenes
│   └── AssetLibrary.tsx     # Reusable 3D components
├── store.ts                 # Zustand state management
├── types.ts                 # TypeScript definitions
└── App.tsx                  # Root component
```

## 📄 License

MIT

---

Built with ❤️ for Demon Slayer fans
