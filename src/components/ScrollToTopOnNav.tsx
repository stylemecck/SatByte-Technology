import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Handles scrolling to top on new page navigations while preserving
 * native browser scroll restoration for back/forward (POP) actions.
 */
export function ScrollToTopOnNav() {
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    // Only scroll to top if the user clicked a link (PUSH) or replaced the history (REPLACE)
    // If they hit the browser Back button (POP), let the browser handle restoring scroll.
    if (navType !== 'POP') {
      // Small timeout to allow Framer Motion exit animations to unmount the old page
      // preventing the old page from jarringly snapping to top before disappearing.
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }, 0)
    }
  }, [location.pathname, location.search, navType])

  return null
}
