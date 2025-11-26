# Wordle Buddy TODO List

## 1. Core Logic (Dictionary API) ✅
- [x] **API Integration**: Integrate Free Dictionary API (or similar) to fetch word data.
    - [x] Fetch Phonetics, Part of Speech, Definitions.
    - [x] Handle "No Definition Found" state.
- [x] **Caching Layer**:
    - [x] Implement LocalStorage/ChromeStorage caching for API results.
    - [x] Logic: Check Cache -> Call API -> Save to Cache.
- [x] **Fallback Mechanism**:
    - [x] Handle API failures gracefully.

## 2. AI Features (LLM Integration) ✅
- [x] **Simplified Definition**:
    - [x] Prompt LLM to simplify complex dictionary definitions.
- [x] **Example Generation**:
    - [x] Generate 1-2 simple sentences (B1 level) based on the definition.
- [ ] **Multi-language Support**:
    - [ ] Translate definitions/examples to user's target language (CN/JP/etc.).

## 3. UI/UX Refinements
- [x] **Draggable Panel**:
    - [x] Allow users to drag the panel by the header.
    - [ ] Persist panel position (optional).
- [x] **Visual Effects**:
    - [x] Enhance Glassmorphism (Blur + Translucency).
    - [x] Smooth transitions for Dark/Light mode.
- [ ] **Settings Interface**:
    - [ ] UI Language Selector (Auto/EN/CN).
    - [ ] Target Language Selector.
    - [ ] Toggle for "Show Translation".

## 4. Functional Implementation (Current Gaps)
- [x] **Audio Playback**: Fix/Enhance audio player logic.
- [ ] **Settings Dialog**: Create the actual Settings modal.
- [ ] **AI Refresh Action**: Connect "Refresh AI" button to actual logic.
- [ ] **Favorites**: Persist favorites to storage.
- [ ] **Close Action**: Implement unmount/hide logic.
