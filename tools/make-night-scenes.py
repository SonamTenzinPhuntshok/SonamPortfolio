"""Turn daytime photos into night scenes + depth maps for the 3D parallax background.

Outputs per photo (into OUT):
  <name>.webp       night colour image
  <name>-depth.png  R = depth (255 = near), G = sky mask, B = warm-light mask
"""
import sys, os
import numpy as np
import cv2
import onnxruntime as ort

SRC = '/home/claude/photos'
OUT = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/night/out'
os.makedirs(OUT, exist_ok=True)

PHOTOS = [
    # file, output name, max width, sky-detect tuning
    ('b7b03f44-image.jpg', 'punakha', 2400, dict(far=0.32, lum=0.5)),
    ('52daf18f-image.jpg', 'tadzong', 2400, dict(far=0.30, lum=0.6)),
    ('791b832a-image.jpg', 'taktsang', 2400, dict(far=0.22, lum=0.45)),
    ('e821d300-image.jpg', 'simtokha', 1600, dict(far=0.28, lum=0.5)),
    ('a59993bc-image.webp', 'buddha', 1800, dict(far=0.22, lum=0.35, mode='far')),
]

sess = ort.InferenceSession('/home/claude/night/models/midas.onnx')


def depth_map(rgb):
    h, w = rgb.shape[:2]
    x = cv2.resize(rgb, (256, 256), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    x = x.transpose(2, 0, 1)[None].astype(np.float32)
    d = sess.run(None, {'0': x})[0][0]
    d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
    lo, hi = np.percentile(d, 1), np.percentile(d, 99)
    return np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)  # 1 = near


def sky_mask(rgb, depth, far, lum_min, mode='color'):
    f = rgb.astype(np.float32) / 255
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    mx, mn = f.max(-1), f.min(-1)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = (mx - mn) / (mx + 1e-6)
    blue = (b > r + 0.04) & (b >= g) & (lum > lum_min)
    cloud = (lum > max(lum_min, 0.55)) & (sat < 0.3)
    cand = (blue | cloud) & (depth < far)
    if mode == 'far':  # everything far and above the horizon is sky (clouds included)
        cand = (depth < far) & (lum > 0.25)
    cand = cv2.morphologyEx(cand.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab = cv2.connectedComponents(cand)
    top = set(np.unique(lab[0, :])) - {0}
    m = np.isin(lab, list(top)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    # clouds/patches fully surrounded by sky are sky too
    from scipy.ndimage import binary_fill_holes
    pad = np.pad(m, ((1, 0), (0, 0)), constant_values=1)  # treat the top edge as sky
    m = binary_fill_holes(pad)[1:].astype(np.uint8) | m
    # fill holes: anything above the sky's lowest point in each column that is also far
    m = m.astype(np.float32)
    return cv2.GaussianBlur(m, (0, 0), 4 if mode == 'far' else 2.5)


def night(rgb, sky, depth):
    h, w = rgb.shape[:2]
    f = rgb.astype(np.float32) / 255
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    mx, mn = f.max(-1), f.min(-1)
    sat = (mx - mn) / (mx + 1e-6)

    # moonlit ground: desaturated, cool, dark — darker the further away (haze)
    moon = lum[..., None] * np.array([0.50, 0.62, 0.95])
    ground = 0.55 * moon * 0.42 + 0.45 * f * 0.2
    ground *= (0.75 + 0.35 * depth[..., None])

    # floodlights on whitewashed walls + glints on gold/red roofs
    white = np.clip((lum - 0.52) / 0.25, 0, 1) * np.clip((0.3 - sat) / 0.2, 0, 1)
    white *= np.clip((r - g + 0.03) / 0.04, 0, 1)  # skip greenish water / grey-green ground
    gold = np.clip((sat - 0.35) / 0.3, 0, 1) * ((r > g) & (g > b)) * np.clip((lum - 0.35) / 0.3, 0, 1)
    warm = np.clip(white + 0.7 * gold, 0, 1) * (1 - sky)
    # lights fall off toward the far background
    warm *= np.clip(depth * 1.6, 0.15, 1)
    warm *= 1 - 0.7 * np.clip((depth - 0.8) / 0.2, 0, 1)  # the very nearest ground stays dim
    warm = cv2.GaussianBlur(warm, (0, 0), 1.2)
    lit = f * np.array([1.0, 0.74, 0.46]) * 0.95
    out = ground * (1 - warm[..., None]) + lit * warm[..., None]
    # soft bloom around lit areas
    bloom = cv2.GaussianBlur(warm, (0, 0), w / 90)
    out += bloom[..., None] * np.array([0.22, 0.12, 0.05])

    # night sky: deep gradient + faint moonlit clouds
    yy = np.linspace(0, 1, h)[:, None]
    top = np.array([0.02, 0.03, 0.09])
    hor = np.array([0.10, 0.08, 0.20])
    grad = top + (hor - top) * np.clip(yy * 1.6, 0, 1)[..., None]
    grad = np.broadcast_to(grad, (h, w, 3))
    cloud = np.clip((lum - 0.5) / 0.5, 0, 1) ** 1.3
    skyc = grad + cloud[..., None] * np.array([0.12, 0.13, 0.19])
    out = out * (1 - sky[..., None]) + skyc * sky[..., None]

    # gentle vignette
    yv, xv = np.mgrid[0:h, 0:w]
    v = ((xv / w - 0.5) ** 2 + (yv / h - 0.5) ** 2)
    out *= (1 - 0.55 * v)[..., None]
    return np.clip(out, 0, 1), warm


for fn, name, maxw, cfg in PHOTOS:
    bgr = cv2.imread(os.path.join(SRC, fn), cv2.IMREAD_COLOR)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    h, w = rgb.shape[:2]
    if w > maxw:
        rgb = cv2.resize(rgb, (maxw, int(h * maxw / w)), interpolation=cv2.INTER_AREA)
    depth = depth_map(rgb)
    sky = sky_mask(rgb, depth, cfg['far'], cfg['lum'], cfg.get('mode', 'color'))
    depth = depth * (1 - sky)  # sky is always farthest
    img, warm = night(rgb, sky, depth)
    out = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(OUT, f'{name}.webp'), out, [cv2.IMWRITE_WEBP_QUALITY, 82])
    # data texture (smaller, smoothed depth avoids tearing)
    dw = 1024
    dh = int(rgb.shape[0] * dw / rgb.shape[1])
    dsm = cv2.GaussianBlur(depth, (0, 0), rgb.shape[1] / 300)
    pack = np.dstack([
        cv2.resize(dsm, (dw, dh)),
        cv2.resize(sky, (dw, dh)),
        cv2.resize(warm, (dw, dh)),
    ])
    cv2.imwrite(os.path.join(OUT, f'{name}-depth.png'), cv2.cvtColor((pack * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
    print(name, rgb.shape[1], rgb.shape[0], 'sky %.2f' % sky.mean())
