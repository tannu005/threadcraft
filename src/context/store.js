// src/context/store.js
// Global state management with Zustand
import { create } from 'zustand'

const useStore = create((set) => ({
  // ─── Model appearance ───
  color: '#ffffff',
  texture: null,          // THREE.Texture object
  textureUrl: null,       // preview URL string
  roughness: 0.5,
  metalness: 0.1,
  envMapIntensity: 1.0,

  // ─── AI generation ───
  prompt: '',
  aiStyle: 'streetwear',  // 'streetwear' | 'minimalist' | 'luxury' | 'cyber' | 'vintage'
  isGenerating: false,
  generatedImages: [],    // history of generated image URLs

  // ─── UI state ───
  activeTab: 'color',     // 'color' | 'texture' | 'ai'
  isLoading: false,
  showShare: false,
  error: null,

  // ─── Camera ───
  autoRotate: true,

  // ─── Actions ───
  setColor: (color) => set({ color }),
  setTexture: (texture) => set({ texture }),
  setTextureUrl: (textureUrl) => set({ textureUrl }),
  setRoughness: (roughness) => set({ roughness }),
  setMetalness: (metalness) => set({ metalness }),
  setEnvMapIntensity: (envMapIntensity) => set({ envMapIntensity }),
  setPrompt: (prompt) => set({ prompt }),
  setAiStyle: (aiStyle) => set({ aiStyle }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  addGeneratedImage: (url) =>
    set((state) => ({ generatedImages: [url, ...state.generatedImages.slice(0, 7)] })),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setShowShare: (showShare) => set({ showShare }),
  setError: (error) => set({ error }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  clearTexture: () => set({ texture: null, textureUrl: null }),
}))

export default useStore
