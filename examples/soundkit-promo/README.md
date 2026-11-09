# SoundKit promo

The 11-second video on [soundza.com/soundkit](https://soundza.com/soundkit), made in Remotion with SoundKit sounds placed by `<SoundzaSound>`.

In a Remotion project with a `components.json`:

```bash
npx shadcn add @soundza/remotion @soundza/air-whoosh @soundza/quick-air-whoosh @soundza/whoosh-for-whip-zoom @soundza/deep-bass-thump @soundza/short-pop @soundza/digital-click @soundza/glockenspiel-success-chime @soundza/reverse-cymbal-crash @soundza/uplifting-success-stinger @soundza/casual-afternoon
npm i @remotion/transitions @remotion/google-fonts
```

Then download the music bed the install prints, copy `KitPromo.tsx` into `src/`, register it as a 1920×1080, 30 fps composition of `KIT_PROMO_FRAMES` frames, and put Soundza's `logo-wordmark.png` in `public/` (or swap in your own logo).
