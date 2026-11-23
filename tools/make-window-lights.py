# Window lights for the night scenes → public/scenes/<id>-lights.png
#   R = window mask, G = soft glow (halo), B = per-window random id
#   (the browser uses the id to switch windows on one by one).
# Windows are found automatically (dark openings in lit walls), then
# curated by hand in window-lights.json: `keep`/`drop` detected boxes,
# plus hand-placed `add` rects, `slits`, `rows` of panes and round `circles`.
# Usage: python3 tools/make-window-lights.py public/scenes/ punakha,tadzong,... "$(cat tools/window-lights.json)"
#   R = window mask, G = soft glow (halo), B = per-window random id (0 elsewhere)
import cv2, numpy as np, sys, json
base = sys.argv[1]
names = sys.argv[2].split(',')
cfg = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
for name in names:
    c = {'abs': 14, 'rel': 0.3, 'zx': 30, 'zy': 150, 'dband': 0.18, 'maxa': 2600, 'mina': 14, 'skip': []}
    c.update(cfg.get(name, {}))
    img = cv2.imread(f'{base}{name}.webp')
    dat = cv2.imread(f'{base}{name}-depth.png')
    H, W = img.shape[:2]
    dat = cv2.resize(dat, (W, H), interpolation=cv2.INTER_LINEAR)
    depth, sky, lit = dat[..., 2] / 255., dat[..., 1] / 255., dat[..., 0] / 255.
    lum = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    s = W / 2400
    wall = (lit > 0.22).astype(np.uint8)
    wall = cv2.morphologyEx(wall, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    med = np.median(depth[wall > 0]) if wall.sum() else 0.5
    zk = cv2.getStructuringElement(cv2.MORPH_RECT, (int(c['zx'] * s) | 1, int(c['zy'] * s) | 1))
    zone = cv2.dilate(wall, zk)
    zone = (zone > 0) & (sky < 0.15) & (np.abs(depth - med) < c['dband'])
    mask = np.zeros((H, W), np.float32)
    rid = np.zeros((H, W), np.float32)
    taken = np.zeros((H, W), bool)
    rng = np.random.default_rng(7)
    kept = 0
    boxes = []
    blur = cv2.GaussianBlur(lum, (0, 0), 1.2)
    for kk in c.get('scales', [24, 48, 90]):
        k = max(5, int(kk * s)) | 1
        close = cv2.morphologyEx(blur, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (k, k)))
        bh = close - blur
        cand = ((bh > c['abs']) & (bh / (close + 8) > c['rel']) & zone).astype(np.uint8)
        cand = cv2.morphologyEx(cand, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        n, lab, st, cen = cv2.connectedComponentsWithStats(cand)
        for i in range(1, n):
            x, y, w, h, a = st[i]
            if a < c['mina'] * s * s or a > c['maxa'] * s * s: continue
            if w < 5 * s or h < 6 * s: continue
            ar = h / max(w, 1)
            if ar < 0.5 or ar > 3.5: continue
            if a / (w * h) < c.get('fill', 0.62): continue
            if taken[y:y + h, x:x + w].any(): continue
            m = (lab[y:y + h, x:x + w] == i)
            inner = blur[y:y + h, x:x + w][m].mean()
            pad = max(3, int(0.6 * min(w, h)))
            ring = blur[max(0, y - pad):y + h + pad, max(0, x - pad):x + w + pad]
            if ring.mean() - inner < c['ring']: continue
            if lit[y:y + h, x:x + w].mean() < c.get('minlit', 0.0) and wall[max(0, y - pad):y + h + pad, max(0, x - pad):x + w + pad].mean() < 0.3: continue
            if any(x0 <= cen[i][0] / W <= x1 and y0 <= cen[i][1] / H <= y1 for x0, y0, x1, y1 in c['skip']): continue
            taken[y:y + h, x:x + w] = True
            boxes.append((x / W, y / H, (x + w) / W, (y + h) / H))
    labels = []
    for bi, (bx0, by0, bx1, by1) in enumerate(boxes):
        if bi in c.get('drop', []): continue
        if 'keep' in c and bi not in c['keep']: continue
        labels.append((bi, bx0, by0))
        x, y, w, h = int(bx0 * W), int(by0 * H), int((bx1 - bx0) * W), int((by1 - by0) * H)
        ix, iy = int(w * 0.08), int(h * 0.06)
        cv2.rectangle(mask, (x + ix, y + iy), (x + w - ix, y + h - iy), 1.0, -1)
        rid[y:y + h, x:x + w] = 0.15 + 0.85 * rng.random()
        kept += 1
    for (x0, y0, x1, y1) in c.get('add', []):
        cv2.rectangle(mask, (int(x0 * W), int(y0 * H)), (int(x1 * W), int(y1 * H)), 1.0, -1)
        rid[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 0.15 + 0.85 * rng.random()
        kept += 1
    for (cx, cy, r) in c.get('circles', []):
        cv2.circle(mask, (int(cx * W), int(cy * H)), max(2, int(r * W)), 1.0, -1)
        R = max(2, int(r * W))
        rid[int(cy * H) - R:int(cy * H) + R, int(cx * W) - R:int(cx * W) + R] = 0.15 + 0.85 * rng.random()
    for (cx, w, y0, y1) in c.get('slits', []):
        x0, x1 = cx - w / 2, cx + w / 2
        cv2.rectangle(mask, (int(x0 * W), int(y0 * H)), (int(x1 * W), int(y1 * H)), 1.0, -1)
        rid[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = 0.15 + 0.85 * rng.random()
    for (x0, y0, x1, y1, nn, gap) in c.get('rows', []):
        X0, Y0, X1, Y1 = x0 * W, y0 * H, x1 * W, y1 * H
        cw = (X1 - X0) / nn
        for j in range(nn):
            a0 = int(X0 + j * cw + cw * gap / 2); a1 = int(X0 + (j + 1) * cw - cw * gap / 2)
            cv2.rectangle(mask, (a0, int(Y0)), (a1, int(Y1)), 1.0, -1)
            rid[int(Y0):int(Y1), a0:a1] = 0.15 + 0.85 * rng.random()
            kept += 1
    n = 0
    rid = cv2.dilate(rid, np.ones((7, 7), np.uint8))  # cover the soft edge of each window
    mask = cv2.GaussianBlur(mask, (0, 0), 0.8 * max(1, s * 1.5))
    glow = cv2.GaussianBlur(mask, (0, 0), 18 * s) * 3.2 + cv2.GaussianBlur(mask, (0, 0), 60 * s) * 6
    glow = np.clip(glow, 0, 1)
    out = np.dstack([rid, glow, mask]) * 255  # BGR order → R=mask, G=glow, B=rid
    out = cv2.resize(out, (1600, int(1600 * H / W)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{base}{name}-lights.png', np.clip(out, 0, 255).astype(np.uint8))
    vis = img.astype(np.float32)
    g = glow[..., None]; mm = mask[..., None]
    vis = vis * (1 + g * 0.6) + g * np.array([20, 90, 160]) * 0.6
    vis = vis * (1 - mm) + mm * np.array([90, 205, 255])
    pv = cv2.resize(np.clip(vis, 0, 255).astype(np.uint8), (1600, int(1600 * H / W)))
    if len(sys.argv) > 4:
        for bi, bx, by in labels:
            cv2.putText(pv, str(bi), (int(bx * 1600), int(by * pv.shape[0]) - 2), 0, 0.42, (0, 0, 0), 3)
            cv2.putText(pv, str(bi), (int(bx * 1600), int(by * pv.shape[0]) - 2), 0, 0.42, (80, 255, 80), 1)
        X = 0.0
        while X < 1:
            cv2.putText(pv, f'{X:.1f}', (int(X * 1600) + 2, 14), 0, 0.45, (255, 255, 0), 1); cv2.line(pv, (int(X * 1600), 0), (int(X * 1600), 8), (255, 255, 0), 2); X += 0.1
        Y = 0.0
        while Y < 1:
            cv2.putText(pv, f'{Y:.1f}', (2, int(Y * pv.shape[0]) + 12), 0, 0.45, (255, 255, 0), 1); Y += 0.1
    cv2.imwrite(f'/tmp/win_{name}.jpg', pv)  # preview
    print(name, n, kept, round(float(med), 2))
