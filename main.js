document.addEventListener("DOMContentLoaded", () => {
  // Reveal animation for timeline cards
  ;(() => {
    const cards = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view")
        })
      },
      { threshold: 0.18 },
    )
    cards.forEach((c) => obs.observe(c))
  })()

  const svg = document.getElementById("worldSvg")
  const mapFrame = document.getElementById("mapFrame")
  const card = document.getElementById("countryCard")
  const cardTitle = document.getElementById("cardTitle")
  const cardBody = document.getElementById("cardBody")

  if (!svg) return

  let activeCountry = null
  let hoverBridge = null

  function getCombinedBBox(elements) {
    const rects = elements.map((el) => el.getBoundingClientRect())
    return {
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
      top: Math.min(...rects.map((r) => r.top)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
    }
  }

  function showCountry(id, elems) {
    if (activeCountry === id) return
    activeCountry = id

    const allShapes = svg.querySelectorAll("path, polygon, rect, circle, ellipse")
    const focusedSet = new Set(elems)

    allShapes.forEach((s) => {
      if (focusedSet.has(s)) {
        s.classList.add("focused")
        s.style.fill = `url(#flag-${id})`
      } else {
        s.classList.add("dimmed")
      }
    })
    document.querySelectorAll(".pin").forEach((p) => {
      p.style.visibility = "hidden"
    })

    const c = countries[id]
    cardTitle.textContent = c?.name || id
    cardBody.innerHTML = c?.societies.map((x) => `<div>• ${x}</div>`).join("") || ""

    const bbox = getCombinedBBox(elems)
    const mapRect = mapFrame.getBoundingClientRect()
    const cardW = Math.min(360, mapRect.width * 0.44)
    const gap = 18

    let left = bbox.right - mapRect.left + gap
    if (left + cardW > mapRect.width) {
      left = bbox.left - mapRect.left - cardW - gap
    }
    let top = bbox.top - mapRect.top - 20
    top = Math.max(10, Math.min(top, mapRect.height - 160))

    card.style.width = cardW + "px"
    card.style.left = left + "px"
    card.style.top = top + "px"
    card.style.display = "block"

    // Hover bridge
    if (!hoverBridge) {
      hoverBridge = document.createElement("div")
      hoverBridge.className = "hover-bridge"
      mapFrame.appendChild(hoverBridge)
      hoverBridge.addEventListener("mouseleave", tryClose)
      card.addEventListener("mouseleave", tryClose)
    }
    hoverBridge.style.left = Math.min(bbox.right - mapRect.left, left) + "px"
    hoverBridge.style.top = Math.min(bbox.top - mapRect.top, top) + "px"
    hoverBridge.style.width = Math.abs(left - (bbox.right - mapRect.left)) + cardW + "px"
    hoverBridge.style.height = Math.max(card.offsetHeight, bbox.bottom - bbox.top) + "px"

    // Remove any old country-specific classes
    card.classList.remove(...card.classList)
    card.classList.add("country-card")
    card.classList.add(`card-${id}`)
  }

  function hideCountry() {
    activeCountry = null
    const allShapes = svg.querySelectorAll("path, polygon, rect, circle, ellipse")
    allShapes.forEach((s) => {
      s.classList.remove("focused", "dimmed")
      s.style.fill = ""
    })
    card.style.display = "none"
    if (hoverBridge) hoverBridge.style.width = "0"
  }

  function tryClose() {
    const countryElems = activeCountry ? Array.from(svg.querySelectorAll(`#${activeCountry}, .${activeCountry}`)) : []
    const isHoveringCountry = countryElems.some((el) => el.matches(":hover"))
    const isHoveringCard = card.matches(":hover")
    const isHoveringBridge = hoverBridge && hoverBridge.matches(":hover")

    if (!isHoveringCountry && !isHoveringCard && !isHoveringBridge) {
      hideCountry()
    }

    document.querySelectorAll(".pin").forEach((p) => {
      p.style.visibility = activeCountry ? "hidden" : "visible"
    })
  }

  // Show pins back when nothing is focused
  document.querySelectorAll(".pin").forEach((p) => {
    p.style.visibility = "visible"
  })

  // Attach events
  Object.keys(countries).forEach((id) => {
    const elems = Array.from(svg.querySelectorAll(`#${id}, .${id}`))
    if (!elems.length) return

    elems.forEach((el) => {
      el.classList.add("hoverable")
      el.addEventListener("mouseenter", () => showCountry(id, elems))
      el.addEventListener("mouseleave", tryClose)
    })
  })
})

const countries = {
  egypt: {
    name: "Egypt",
    flag: "SVG/Egypt.svg",
    continent: "africa",
    pin: { x: 57, y: 35 },
    societies: [
      "Egyptian Society of Vascular Surgery — Board Member (2000)",
      "Egyptian Society of Diabetology — Member (2002)",
    ],
  },
  india: {
    name: "India",
    flag: "SVG/India.svg",
    continent: "asia",
    pin: { x: 71, y: 38 },
    societies: ["International Diabetic Foot Salvage Fellowship — Board Member (2019)"],
  },
  france: {
    name: "France",
    flag: "SVG/France.svg",
    continent: "europe",
    pin: { x: 49, y: 23 },
    societies: [
      "International Union of Angiology — Member (1999)",
      "European Society for Vascular Surgery — Member (2000)",
    ],
  },
  italy: {
    name: "Italy",
    flag: "SVG/Italy.svg",
    continent: "europe",
    pin: { x: 52, y: 25 },
    societies: ["International Union of Angiology — Member (1999)"],
  },
  germany: {
    name: "Germany",
    flag: "SVG/Germany.svg",
    continent: "europe",
    pin: { x: 51, y: 21 },
    societies: ["European Society for Vascular Surgery — Member (2000)"],
  },
  usa: {
    name: "USA",
    flag: "SVG/USA.svg",
    continent: "north-america",
    pin: { x: 23, y: 26 },
    societies: [
      "International Society of Vascular Surgery — Member (1998)",
      "Society of Interventional Radiology — Member (2009)",
    ],
  },
}

Object.entries(countries).forEach(([id, data]) => {
  if (!data.pin) return
  const pin = document.createElement("div")
  pin.className = `pin pin-${id} in-view`
  pin.style.left = data.pin.x + "%"
  pin.style.top = data.pin.y + "%"
  pin.dataset.continent = data.continent
  pin.dataset.baseX = data.pin.x
  pin.dataset.baseY = data.pin.y

  const mapFrame = document.getElementById("mapFrame")
  mapFrame.appendChild(pin)
  console.log("[v0] Added pin:", id, data.pin)
})

let resizeTimeout
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    console.log("[v0] Map resized, pins repositioned automatically")
  }, 250)
})

// Continent filter
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cont = btn.dataset.continent
    document.querySelectorAll(".pin").forEach((pin) => {
      if (cont === "all" || pin.dataset.continent === cont) {
        pin.style.display = "block"
      } else {
        pin.style.display = "none"
      }
    })
  })
})

function playVideoAndRedirect(event, videoFile, url) {
  event.preventDefault()

  const overlay = document.getElementById("videoOverlay")
  const video = document.getElementById("navVideo")
  const source = document.getElementById("videoSource")

  console.log("[v0] Loading video:", videoFile)

  source.src = videoFile
  video.load()
  overlay.style.display = "flex"

  video
    .play()
    .then(() => {
      console.log("[v0] Video started playing.")
    })
    .catch((err) => {
      console.error("[v0] Video play failed:", err)
      window.location.href = url
    })

  video.onended = () => {
    console.log("[v0] Video ended, redirecting to:", url)
    window.location.href = url
  }
}

// Hamburger menu toggle
const navToggle = document.querySelector(".nav-toggle")
const navLinks = document.querySelector(".nav-links")

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true"
    navToggle.setAttribute("aria-expanded", !isExpanded)
    navToggle.classList.toggle("active")
    navLinks.classList.toggle("active")
  })
}
