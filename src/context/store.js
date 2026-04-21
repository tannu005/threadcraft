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
  environment: 'studio',  // 'studio' | 'sunset' | 'forest' | 'city' | 'night'
  
  // ─── Decals ───
  decals: [], // { id, type, url, texture, position, rotation, scale }
  
  // ─── AI generation ───
  prompt: '',
  aiStyle: 'streetwear',  // 'streetwear' | 'minimalist' | 'luxury' | 'cyber' | 'vintage'
  isGenerating: false,
  generatedImages: [],    // history of generated image URLs

  // ─── UI state ───
  activeTab: 'color',     // 'color' | 'texture' | 'ai' | 'decals' | 'environment'
  isLoading: false,
  showShare: false,
  error: null,

  // ─── Auth state ───
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  savedDesigns: [],

  // ... (previous camera state)
  autoRotate: true,

  // ─── Actions ───
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null, savedDesigns: [] })
  },
  setSavedDesigns: (savedDesigns) => set({ savedDesigns }),
  addSavedDesign: (design) => set((state) => ({ savedDesigns: [design, ...state.savedDesigns] })),

  setColor: (color) => set({ color }),
  setTexture: (texture) => set({ texture }),
  setTextureUrl: (textureUrl) => set({ textureUrl }),
  setRoughness: (roughness) => set({ roughness }),
  setMetalness: (metalness) => set({ metalness }),
  setEnvMapIntensity: (envMapIntensity) => set({ envMapIntensity }),
  setEnvironment: (environment) => set({ environment }),
  
  addDecal: (decal) => set((state) => ({ decals: [...state.decals, decal] })),
  removeDecal: (id) => set((state) => ({ decals: state.decals.filter(d => d.id !== id) })),
  updateDecal: (id, updates) => set((state) => ({
    decals: state.decals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
  })),
  clearDecals: () => set({ decals: [] }),

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
