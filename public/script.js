// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  initAnimations()
  initNavbar()
  initMobileMenu()
  initCustomCursor()
  initCarousel()
  initFAQ()
  initBackToTop()
  initCounters()
})

// Initialize animations
function initAnimations() {
  const animateElements = document.querySelectorAll(".animate-on-load")

  setTimeout(() => {
    animateElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("active")
      }, index * 200)
    })
  }, 500)

  const revealElements = document.querySelectorAll(".reveal-element")

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight - 100) {
        const delay = element.getAttribute("data-delay") || 0
        setTimeout(() => {
          element.classList.add("active")
        }, delay)
      }
    })
  }

  window.addEventListener("scroll", revealOnScroll)
  revealOnScroll()
}

// Initialize navbar scroll effect
function initNavbar() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// Initialize mobile menu
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")
  const bars = document.querySelectorAll(".bar")
  const mobileLinks = document.querySelectorAll(".mobile-link")

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")

    if (mobileMenu.classList.contains("active")) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      bars[1].style.opacity = "0"
      bars[2].style.transform = "rotate(-45deg) translate(5px, -5px)"
    } else {
      bars[0].style.transform = "none"
      bars[1].style.opacity = "1"
      bars[2].style.transform = "none"
    }
  })

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      bars[0].style.transform = "none"
      bars[1].style.opacity = "1"
      bars[2].style.transform = "none"
    })
  })
}

// Initialize custom cursor
function initCustomCursor() {
  const cursorDot = document.querySelector(".cursor-dot")
  const cursorOutline = document.querySelector(".cursor-dot-outline")

  if (window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX
      const posY = e.clientY

      cursorDot.style.opacity = "1"
      cursorOutline.style.opacity = "1"

      cursorDot.style.transform = `translate(${posX}px, ${posY}px)`
      cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`
    })

    const hoverElements = document.querySelectorAll("a, button, .feature-card, .mentor-card, .faq-question")

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorDot.style.transform += " scale(1.5)"
        cursorOutline.style.transform += " scale(1.5)"
        cursorOutline.style.backgroundColor = "rgba(67, 97, 238, 0.3)"
      })

      element.addEventListener("mouseleave", () => {
        cursorDot.style.transform = cursorDot.style.transform.replace(" scale(1.5)", "")
        cursorOutline.style.transform = cursorOutline.style.transform.replace(" scale(1.5)", "")
        cursorOutline.style.backgroundColor = "rgba(67, 97, 238, 0.2)"
      })
    })
  }
}

// Initialize testimonial carousel
function initCarousel() {
  const track = document.querySelector(".testimonial-track")
  const slides = document.querySelectorAll(".testimonial-card")
  const dots = document.querySelectorAll(".dot")
  const prevButton = document.querySelector(".carousel-prev")
  const nextButton = document.querySelector(".carousel-next")

  let currentIndex = 0
  const slideWidth = 100

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex)
    })
  }

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length
    updateCarousel()
  })

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length
    updateCarousel()
  })

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index
      updateCarousel()
    })
  })

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length
    updateCarousel()
  }, 5000)

  updateCarousel()
}

// Initialize FAQ accordion
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      item.classList.toggle("active")
    })
  })
}

// Initialize back to top button
function initBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top")

  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("active", window.scrollY > 500)
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Initialize stat counters
function initCounters() {
  const statNumbers = document.querySelectorAll(".stat-number")

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count"))
    const duration = 2000
    const step = Math.ceil(target / (duration / 30))
    let current = 0

    const updateCounter = () => {
      current += step
      if (current > target) {
        current = target
        clearInterval(counterInterval)
      }
      stat.textContent = current.toLocaleString()
    }

    const counterInterval = setInterval(updateCounter, 30)
  })
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      })
    }
  })
})

// Form validation
const forms = document.querySelectorAll("form")
if (forms.length > 0) {
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true
      const inputs = form.querySelectorAll("input[required]")

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.classList.add("error")
        } else {
          input.classList.remove("error")
        }
      })

      if (isValid) {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          const originalText = submitButton.textContent
          submitButton.textContent = "Processing..."
          submitButton.disabled = true

          setTimeout(() => {
            alert("Form submitted successfully!")
            submitButton.textContent = originalText
            submitButton.disabled = false
            form.reset()
          }, 2000)
        }
      }
    })
  })
}
