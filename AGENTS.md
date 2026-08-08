# Project Coding Guidelines & Rules

## 1. Character Avatar Protections
- **Thanh Hà Túc Vũ**: The avatar for this character is strictly locked to the downloaded high-resolution file `./src/assets/images/tuc_vu_doc_avatar.png` (originally from the provided Google Doc). Under no circumstances should this image be updated, replaced, or reset back to any preset or AI-generated image.
- **Client-Side Sync Enforcements**: In `App.tsx`, whenever data is loaded or synced from Firebase (Firestore), we must always map over the documents and override the `avatar` property for any initial characters (like "Thanh Hà Túc Vũ") to use their local, immutable import asset.
- **Image Positioning**: The image is formatted with `object-cover object-[center_15%] scale-[1.35] origin-[center_15%]` in `CharacterCard.tsx`, `CharacterDetailModal.tsx`, and `LoveQuestionWidget.tsx` to perfectly center, zoom in on the face, and display the character's face beautifully without showing the excess bottom area. Maintain this positioning and scaling.
- **Strict Layout Constraints (Global Lock)**: The visual layout, frame dimensions, overlay elements (like the stamp/postmark seal on the detail card, background card structures, and text contrast overlays), and precise crop parameters for all current and future character avatars are strictly locked. No developer or assistant may alter this visual signature.

