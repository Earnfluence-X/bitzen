# Bitzen - Campus Coin Exchange

Dark premium peer-to-peer micro-currency app for college campuses.
Spring green and gold aesthetic. Crypto wallet feel.

## Design System

| Token | Value |
|-------|-------|
| Background | #0b0e14 |
| Surface | #0f1219 |
| Primary | #00FF7F (Spring Green) |
| Coin | #FFD700 (Gold) |
| Danger | #FF6B6B (Red) |
| Font | Inter |
| Card Radius | 18-24px |
| Button Radius | 60px (pill) |
| Balance Font Size | 44px |

## Features

- Send/receive coins via 6-digit transfer codes
- Post and claim gigs with category badges
- Daily login bonus with streak tracking
- Real-time activity feed with colored indicators
- Gold coin with B logo
- Sound effects and coin animations
- Bottom sheet modals with drag handle
- Dark mode (always on)
- User profiles with stats grid
- Referral system with unique codes
- Gig rating after completion
- User reputation scores
- Toast notifications
- Skeleton loading states
- PIN verification support

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + Framer Motion
- Zustand (state management with persistence)
- Web Audio API (sound effects)

## Getting Started

```bash
npm install
npm run dev
```

## Firebase Integration

The app is architected for Firebase integration. Currently uses local Zustand
state with persistence for standalone operation. To connect Firebase:

1. Create a Firebase project
2. Add your config to `.env.local`
3. Uncomment Firebase initialization in `src/lib/firebase.ts`
4. Deploy Cloud Functions from `functions/` directory

## Project Structure

```
src/
  components/
    auth/        - Onboarding, Login, Signup
    dashboard/   - Balance card, Quick actions, Activity feed
    gigs/        - Gigs board, Gig cards, Gig form, Rating
    layout/      - App shell, Header, Bottom nav, Toast
    profile/     - Profile screen, Stats, Daily bonus, Referral
    send/        - Send flow with code generation
    receive/     - Receive flow with code input
    ui/          - Coin animation, Skeleton
  lib/
    store.ts     - Zustand state management
    utils.ts     - Utility functions
    soundEngine.ts - Web Audio sound effects
    firebase.ts  - Firebase configuration
  types/
    index.ts     - TypeScript type definitions
```

## License

MIT
