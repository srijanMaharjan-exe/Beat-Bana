document.addEventListener("DOMContentLoaded", () => {
    // User Menu Toggle
    const userMenuTrigger = document.querySelector(".user-menu-trigger")
    const userMenu = document.querySelector(".user-menu")
  
    userMenuTrigger.addEventListener("click", () => {
      userMenu.classList.toggle("active")
    })
  
    // Close user menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu-container")) {
        userMenu.classList.remove("active")
      }
    })
  
    // Profile Tab Navigation
    const profileNavItems = document.querySelectorAll(".profile-nav-item")
    const profileTabs = document.querySelectorAll(".profile-tab")
  
    profileNavItems.forEach((item) => {
      item.addEventListener("click", () => {
        const tabId = item.dataset.tab
  
        // Update active nav item
        profileNavItems.forEach((navItem) => {
          navItem.classList.remove("active")
        })
        item.classList.add("active")
  
        // Show the selected tab
        profileTabs.forEach((tab) => {
          tab.classList.remove("active")
        })
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  
    // Sort Dropdown
    const sortButton = document.querySelector(".sort-button")
    const sortMenu = document.querySelector(".sort-menu")
    const sortOptions = document.querySelectorAll(".sort-option")
  
    if (sortButton) {
      sortButton.addEventListener("click", () => {
        sortMenu.classList.toggle("active")
      })
  
      // Close sort menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".sort-dropdown")) {
          sortMenu.classList.remove("active")
        }
      })
  
      // Sort option selection
      sortOptions.forEach((option) => {
        option.addEventListener("click", () => {
          sortOptions.forEach((opt) => opt.classList.remove("active"))
          option.classList.add("active")
          sortButton.innerHTML = `<i class="fas fa-sort"></i> Sort by: ${option.textContent} <i class="fas fa-chevron-down"></i>`
          sortMenu.classList.remove("active")
        })
      })
    }
  
    // Beat Play Button
    const beatPlayButtons = document.querySelectorAll(".beat-play-btn")
  
    beatPlayButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation()
  
        // Toggle play/pause icon
        const icon = button.querySelector("i")
        if (icon.classList.contains("fa-play")) {
          // Reset all other buttons
          beatPlayButtons.forEach((btn) => {
            btn.querySelector("i").classList.remove("fa-pause")
            btn.querySelector("i").classList.add("fa-play")
          })
  
          // Set this button to playing
          icon.classList.remove("fa-play")
          icon.classList.add("fa-pause")
  
          // In a real app, this would play the audio
          console.log("Playing beat")
        } else {
          icon.classList.remove("fa-pause")
          icon.classList.add("fa-play")
  
          // In a real app, this would pause the audio
          console.log("Paused beat")
        }
      })
    })
  
    // Character Counter for Bio
    const bioTextarea = document.getElementById("bio")
    const bioCharCount = document.getElementById("bio-char-count")
    const maxChars = 200
  
    if (bioTextarea) {
      bioTextarea.addEventListener("input", () => {
        const remainingChars = maxChars - bioTextarea.value.length
        bioCharCount.textContent = remainingChars
  
        if (remainingChars < 0) {
          bioCharCount.style.color = "var(--error)"
          bioTextarea.value = bioTextarea.value.substring(0, maxChars)
          bioCharCount.textContent = "0"
        } else if (remainingChars < 20) {
          bioCharCount.style.color = "var(--warning)"
        } else {
          bioCharCount.style.color = "var(--text-secondary)"
        }
      })
  
      // Initialize character count
      bioCharCount.textContent = maxChars - bioTextarea.value.length
    }
  
    // Edit Avatar/Cover Buttons
    const editAvatarBtn = document.querySelector(".edit-avatar-btn")
    const editCoverBtn = document.querySelector(".edit-cover-btn")
    const imageUploadModal = document.getElementById("image-upload-modal")
    const modalClose = document.querySelector(".modal-close")
    const modalCancel = document.querySelector(".modal-cancel")
  
    if (editAvatarBtn) {
      editAvatarBtn.addEventListener("click", () => {
        imageUploadModal.classList.add("active")
      })
    }
  
    if (editCoverBtn) {
      editCoverBtn.addEventListener("click", () => {
        imageUploadModal.classList.add("active")
      })
    }
  
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        imageUploadModal.classList.remove("active")
      })
    }
  
    if (modalCancel) {
      modalCancel.addEventListener("click", () => {
        imageUploadModal.classList.remove("active")
      })
    }
  
    // Image Upload Preview
    const imageUploadInput = document.getElementById("image-upload")
    const uploadPreview = document.querySelector(".upload-preview")
    const uploadArea = document.querySelector(".upload-area")
    const previewImage = document.getElementById("upload-preview-image")
    const cancelUploadBtn = document.querySelector(".cancel-upload")
  
    if (imageUploadInput) {
      imageUploadInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
  
        if (file) {
          const reader = new FileReader()
  
          reader.onload = (event) => {
            previewImage.src = event.target.result
            uploadArea.style.display = "none"
            uploadPreview.style.display = "block"
          }
  
          reader.readAsDataURL(file)
        }
      })
    }
  
    if (cancelUploadBtn) {
      cancelUploadBtn.addEventListener("click", () => {
        uploadArea.style.display = "block"
        uploadPreview.style.display = "none"
        imageUploadInput.value = ""
      })
    }
  
    // Drag and Drop for Image Upload
    const uploadAreaElement = document.querySelector(".upload-area")
  
    if (uploadAreaElement) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        uploadAreaElement.addEventListener(eventName, preventDefaults, false)
      })
  
      function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
      }
      ;["dragenter", "dragover"].forEach((eventName) => {
        uploadAreaElement.addEventListener(eventName, highlight, false)
      })
      ;["dragleave", "drop"].forEach((eventName) => {
        uploadAreaElement.addEventListener(eventName, unhighlight, false)
      })
  
      function highlight() {
        uploadAreaElement.classList.add("highlight")
      }
  
      function unhighlight() {
        uploadAreaElement.classList.remove("highlight")
      }
  
      uploadAreaElement.addEventListener("drop", handleDrop, false)
  
      function handleDrop(e) {
        const dt = e.dataTransfer
        const files = dt.files
  
        if (files.length) {
          imageUploadInput.files = files
          const event = new Event("change")
          imageUploadInput.dispatchEvent(event)
        }
      }
    }
  
    // Form Submission
    const editProfileForm = document.querySelector(".edit-profile-form")
  
    if (editProfileForm) {
      editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Show loading state
        const saveButton = editProfileForm.querySelector(".save-button")
        const originalText = saveButton.textContent
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
        saveButton.disabled = true
  
        // Simulate saving (would be replaced with actual API call)
        setTimeout(() => {
          // Show success message
          saveButton.innerHTML = '<i class="fas fa-check"></i> Saved!'
          saveButton.style.backgroundColor = "var(--success)"
  
          // Reset button after a delay
          setTimeout(() => {
            saveButton.textContent = originalText
            saveButton.style.backgroundColor = ""
            saveButton.disabled = false
          }, 2000)
        }, 1500)
      })
    }
  
    // Create Beat Button
    const createBeatBtn = document.querySelector(".create-beat-btn")
  
    if (createBeatBtn) {
      createBeatBtn.addEventListener("click", () => {
        window.location.href = "../beatmaker/index.html"
      })
    }
  })
  