# Wordle Buddy TODO List

## Functional Implementation
- [ ] **Audio Playback**: Implement real audio playback logic in `WordHeader.tsx` (currently uses `new Audio()` which might need error handling or a better player).
- [ ] **Settings Dialog**: Implement the Settings modal/popover when the Settings button is clicked.
- [ ] **AI Refresh**: Implement the actual API call to refresh the AI definition and examples.
- [ ] **Favorites Persistence**: Ensure favorites are correctly persisted to Chrome Storage (currently using `localStorage`).
- [ ] **Close Action**: Implement the actual close behavior (hide panel/unmount).

## UI Refinements
- [ ] **Transitions**: Add smooth enter/exit animations for the panel.
- [ ] **Draggable**: Make the panel draggable (if requested in the future).
