import { lamScreens } from './lam'
import { tshechuScreens } from './tshechu'
import { menkhangScreens } from './menkhang'

// slug → { screenId: Component }
export const SCREENS = { lam: lamScreens, tshechu: tshechuScreens, menkhang: menkhangScreens }
export const screenFor = (slug, id) => SCREENS[slug]?.[id]
