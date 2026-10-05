# 📸 Photo Guide — Janna's Birthday Website

## Where to put photos

Drop all your photos into this directory:

```
/public/photos/
```

## Supported formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`

WebP is recommended for best performance (smaller file size, same quality).

---

## How to add/remove/reorder photos

All photo configuration lives in one file:

```
/src/config.js
```

Open it and find the `photos` array:

```js
photos: [
  {
    src: "/photos/your-filename.jpg",
    caption: "A short caption (optional).",
    year: "2012",  // optional
  },
  // ...more photos
]
```

### To add a photo:
1. Drop the file into `/public/photos/`
2. Add a new object to the `photos` array
3. Set `src` to `/photos/your-filename.jpg`
4. Optionally add a `caption` and `year`

### To remove a photo:
Delete its object from the `photos` array. (You can leave the file in `/public/photos/` — it just won't be shown.)

### To reorder photos:
Rearrange the objects in the `photos` array. The gallery displays them in order.

---

## Recommended number of photos
- **Minimum:** 3
- **Ideal:** 6–12
- **Maximum:** 20

Too many photos may slow down the page on mobile.

---

## Aspect ratios

Any aspect ratio works — portrait, landscape, or square. The masonry grid handles them automatically.

---

## Naming convention (suggested)

```
janna-01.jpg    ← chronological order
janna-02.jpg
janna-03.jpg
```

Or be descriptive:

```
janna-holiday-2015.jpg
janna-school-2018.jpg
```

---

## What happens with placeholder photos?

If a photo file is missing or can't be loaded, a dark gradient placeholder card appears in its place with the text "Drop photo here". This is intentional — it shows exactly where your photo will go.

---

## Current placeholder entries in config.js

These are the 6 placeholder entries already set up. Replace them with real photos:

| Slot | Filename              | Caption                | Year |
|------|-----------------------|------------------------|------|
| 01   | placeholder-01.jpg    | The beginning.         | 2006 |
| 02   | placeholder-02.jpg    | Still figuring things out. | 2009 |
| 03   | placeholder-03.jpg    | That one holiday.      | 2012 |
| 04   | placeholder-04.jpg    | Middle school era.     | 2015 |
| 05   | placeholder-05.jpg    | Pre-dentistry days.    | 2019 |
| 06   | placeholder-06.jpg    | Just recently.         | 2025 |

Simply replace `placeholder-01.jpg` with the actual filename of your first photo, etc.
