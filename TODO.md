# Wordle Buddy TODO List

## 1. Core Logic (Dictionary API)
- [ ] **API Integration**: Integrate Free Dictionary API (or similar) to fetch word data.
    - [ ] Fetch Phonetics, Part of Speech, Definitions.
    - [ ] Handle "No Definition Found" state.
- [ ] **Caching Layer**:
    - [ ] Implement LocalStorage/ChromeStorage caching for API results.
    - [ ] Logic: Check Cache -> Call API -> Save to Cache.
- [ ] **Fallback Mechanism**:
    - [ ] Handle API failures gracefully.

## 2. AI Features (LLM Integration)
- [ ] **Simplified Definition**:
    - [ ] Prompt LLM to simplify complex dictionary definitions.
- [ ] **Example Generation**:
    - [ ] Generate 1-2 simple sentences (B1 level) based on the definition.
- [ ] **Multi-language Support**:
    - [ ] Translate definitions/examples to user's target language (CN/JP/etc.).

## 3. UI/UX Refinements
- [ ] **Draggable Panel**:
    - [ ] Allow users to drag the panel by the header.
    - [ ] Persist panel position (optional).
- [ ] **Visual Effects**:
    - [ ] Enhance Glassmorphism (Blur + Translucency).
    - [ ] Smooth transitions for Dark/Light mode.
- [ ] **Settings Interface**:
    - [ ] UI Language Selector (Auto/EN/CN).
    - [ ] Target Language Selector.
    - [ ] Toggle for "Show Translation".

## 4. Functional Implementation (Current Gaps)
- [ ] **Audio Playback**: Fix/Enhance audio player logic.
- [ ] **Settings Dialog**: Create the actual Settings modal.
- [ ] **AI Refresh Action**: Connect "Refresh AI" button to actual logic.
- [ ] **Favorites**: Persist favorites to storage.
- [ ] **Close Action**: Implement unmount/hide logic.
