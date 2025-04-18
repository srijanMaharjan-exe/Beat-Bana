document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const playButton = document.getElementById("play-button")
    const stopButton = document.getElementById("stop-button")
    const loopButton = document.getElementById("loop-button")
    const metronomeButton = document.getElementById("metronome-button")
    const tempoSlider = document.getElementById("tempo-slider")
    const volumeSlider = document.getElementById("volume-slider")
    const tabButtons = document.querySelectorAll(".tab-button")
    const soundCategories = document.querySelectorAll(".sound-category")
    const timelineCells = document.querySelectorAll(".timeline-cell")
    const effectsButton = document.getElementById("effects-button")
    const effectsPanel = document.getElementById("effects-panel")
    const closeEffects = document.getElementById("close-effects")
    const helpButton = document.getElementById("help-button")
    const tutorialOverlay = document.getElementById("tutorial-overlay")
    const startCreatingButton = document.getElementById("start-creating")
    const dontShowAgain = document.getElementById("dont-show-again")
    const saveButton = document.getElementById("save-button")
    const exportButton = document.getElementById("export-button")
    const saveModal = document.getElementById("save-modal")
    const exportModal = document.getElementById("export-modal")
    const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-cancel")
    const modalSaveButton = document.querySelector(".modal-save")
    const modalExportButton = document.querySelector(".modal-export")
    const projectName = document.getElementById("project-name")
    const bpmDisplay = document.getElementById("bpm-display")
    const timeDisplay = document.getElementById("time-display")
    const sliders = document.querySelectorAll(".slider")
    const previewButtons = document.querySelectorAll(".preview-button")
    const soundItems = document.querySelectorAll(".sound-item")
    const addTrackButton = document.getElementById("add-track-button")
    const clearAllButton = document.getElementById("clear-all-button")
    const trackMuteButtons = document.querySelectorAll(".track-mute")
    const trackSoloButtons = document.querySelectorAll(".track-solo")
  
    // App State
    let isPlaying = false
    let isLooping = false
    let isMetronomeOn = false
    let currentBeat = 0
    let tempo = 120
    let volume = 80
    let playInterval
    const beatCount = 8
    let currentTime = 0
    const activeSounds = []
  
    // Initialize the app
    function init() {
      // Show tutorial if it's the first visit
      if (!localStorage.getItem("beatbana_tutorial_seen")) {
        tutorialOverlay.style.display = "flex"
      } else {
        tutorialOverlay.style.display = "none"
      }
  
      // Update slider values
      updateSliderValues()
    }
  
    // Update all slider values display
    function updateSliderValues() {
      sliders.forEach((slider) => {
        const valueDisplay = slider.nextElementSibling
        if (valueDisplay) {
          valueDisplay.textContent = slider.value
        }
      })
    }
  
    // Play/Pause the beat
    function togglePlay() {
      if (isPlaying) {
        pauseBeat()
      } else {
        playBeat()
      }
    }
  
    // Play the beat
    function playBeat() {
      isPlaying = true
      playButton.classList.add("playing")
  
      // Calculate beat duration in ms based on tempo (BPM)
      const beatDuration = 60000 / tempo
  
      // Clear any existing interval
      clearInterval(playInterval)
  
      // Start the playback
      playInterval = setInterval(() => {
        // Highlight the current beat
        highlightBeat(currentBeat)
  
        // Play sounds for the current beat
        playBeatSounds(currentBeat)
  
        // Update time display
        updateTimeDisplay()
  
        // Move to next beat
        currentBeat = (currentBeat + 1) % beatCount
  
        // If we've completed a loop and looping is off, stop
        if (currentBeat === 0 && !isLooping) {
          pauseBeat()
        }
      }, beatDuration)
    }
  
    // Pause the beat
    function pauseBeat() {
      isPlaying = false
      playButton.classList.remove("playing")
      clearInterval(playInterval)
    }
  
    // Stop the beat (pause and reset position)
    function stopBeat() {
      pauseBeat()
      currentBeat = 0
      currentTime = 0
      updateTimeDisplay()
      clearBeatHighlights()
    }
  
    // Highlight the current beat in the timeline
    function highlightBeat(beatIndex) {
      // Clear previous highlights
      clearBeatHighlights()
  
      // Add highlight to current beat cells
      document.querySelectorAll(`.timeline-cell[data-beat="${beatIndex + 1}"]`).forEach((cell) => {
        cell.classList.add("current-beat")
      })
    }
  
    // Clear all beat highlights
    function clearBeatHighlights() {
      document.querySelectorAll(".timeline-cell.current-beat").forEach((cell) => {
        cell.classList.remove("current-beat")
      })
    }
  
    // Play sounds for the current beat
    function playBeatSounds(beatIndex) {
      // In a real app, this would play the actual sounds
      // For this demo, we'll just log what would be played
      const activeCells = document.querySelectorAll(`.timeline-cell[data-beat="${beatIndex + 1}"].active`)
  
      activeCells.forEach((cell) => {
        const trackId = cell.closest(".timeline-track").id
        console.log(`Playing sound on ${trackId} at beat ${beatIndex + 1}`)
  
        // Visual feedback
        cell.style.backgroundColor = "rgba(255, 75, 140, 0.8)"
        setTimeout(() => {
          cell.style.backgroundColor = ""
        }, 100)
      })
  
      // Play metronome if enabled
      if (isMetronomeOn) {
        console.log(`Metronome tick at beat ${beatIndex + 1}`)
      }
    }
  
    // Update the time display
    function updateTimeDisplay() {
      currentTime += 60 / tempo
      const minutes = Math.floor(currentTime / 60)
      const seconds = Math.floor(currentTime % 60)
      timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
  
    // Toggle loop mode
    function toggleLoop() {
      isLooping = !isLooping
      loopButton.classList.toggle("active", isLooping)
    }
  
    // Toggle metronome
    function toggleMetronome() {
      isMetronomeOn = !isMetronomeOn
      metronomeButton.classList.toggle("active", isMetronomeOn)
    }
  
    // Update tempo
    function updateTempo() {
      tempo = Number.parseInt(tempoSlider.value)
      bpmDisplay.textContent = `${tempo} BPM`
  
      // If currently playing, restart with new tempo
      if (isPlaying) {
        pauseBeat()
        playBeat()
      }
    }
  
    // Update volume
    function updateVolume() {
      volume = Number.parseInt(volumeSlider.value)
      // In a real app, this would adjust the actual audio volume
      console.log(`Volume set to ${volume}%`)
    }
  
    // Switch between sound categories
    function switchTab(event) {
      const tabId = event.target.dataset.tab
  
      // Update active tab button
      tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabId)
      })
  
      // Show the selected category
      soundCategories.forEach((category) => {
        category.classList.toggle("active", category.id === `${tabId}-tab`)
      })
    }
  
    // Toggle a cell in the timeline
    function toggleCell(event) {
      const cell = event.target
      cell.classList.toggle("active")
  
      // In a real app, this would associate a sound with this cell
      if (cell.classList.contains("active")) {
        const trackId = cell.closest(".timeline-track").id
        const beatIndex = Number.parseInt(cell.dataset.beat) - 1
        console.log(`Added sound to ${trackId} at beat ${beatIndex + 1}`)
      }
    }
  
    // Toggle effects panel
    function toggleEffectsPanel() {
      effectsPanel.classList.toggle("active")
    }
  
    // Show tutorial
    function showTutorial() {
      tutorialOverlay.style.display = "flex"
    }
  
    // Close tutorial
    function closeTutorial() {
      tutorialOverlay.style.display = "none"
  
      if (dontShowAgain.checked) {
        localStorage.setItem("beatbana_tutorial_seen", "true")
      }
    }
  
    // Show save modal
    function showSaveModal() {
      saveModal.classList.add("active")
      document.getElementById("save-name").value = projectName.value || "Untitled Beat"
    }
  
    // Show export modal
    function showExportModal() {
      exportModal.classList.add("active")
    }
  
    // Close any modal
    function closeModal() {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active")
      })
    }
  
    // Save the beat
    function saveBeat() {
      const name = document.getElementById("save-name").value
      const genre = document.getElementById("save-genre").value
      const description = document.getElementById("save-description").value
  
      // In a real app, this would save to a database
      console.log(`Saving beat: ${name} (${genre})`)
      console.log(`Description: ${description}`)
  
      // Update project name
      projectName.value = name
  
      // Close modal
      closeModal()
  
      // Show success message
      alert("Beat saved successfully!")
    }
  
    // Export the beat
    function exportBeat() {
      const format = document.querySelector('input[name="export-format"]:checked').value
      const quality = document.getElementById("quality-slider").value
  
      // In a real app, this would export the audio file
      console.log(`Exporting beat as ${format} with quality level ${quality}`)
  
      // Close modal
      closeModal()
  
      // Show success message
      alert(`Beat exported as ${format.toUpperCase()} file!`)
    }
  
    // Preview a sound
    function previewSound(event) {
      const button = event.target.closest(".preview-button")
      if (!button) return
  
      const soundItem = button.closest(".sound-item")
      const soundName = soundItem.dataset.sound
  
      // In a real app, this would play the actual sound
      console.log(`Previewing sound: ${soundName}`)
  
      // Visual feedback
      button.innerHTML = '<i class="fas fa-stop"></i>'
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-play"></i>'
      }, 1000)
    }
  
    // Handle drag start for sound items
    function handleDragStart(event) {
      const soundItem = event.target
      const soundName = soundItem.dataset.sound
  
      // Set data for drag operation
      event.dataTransfer.setData("text/plain", soundName)
  
      // Add dragging class for visual feedback
      soundItem.classList.add("dragging")
    }
  
    // Handle drag end
    function handleDragEnd(event) {
      event.target.classList.remove("dragging")
    }
  
    // Handle drag over for timeline cells
    function handleDragOver(event) {
      event.preventDefault()
      event.target.classList.add("drag-over")
    }
  
    // Handle drag leave for timeline cells
    function handleDragLeave(event) {
      event.target.classList.remove("drag-over")
    }
  
    // Handle drop for timeline cells
    function handleDrop(event) {
      event.preventDefault()
  
      const cell = event.target
      cell.classList.remove("drag-over")
  
      // Get the sound data
      const soundName = event.dataTransfer.getData("text/plain")
  
      // Add the sound to the cell
      if (soundName && cell.classList.contains("timeline-cell")) {
        cell.classList.add("active")
        cell.dataset.sound = soundName
  
        const trackId = cell.closest(".timeline-track").id
        const beatIndex = Number.parseInt(cell.dataset.beat) - 1
        console.log(`Added ${soundName} to ${trackId} at beat ${beatIndex + 1}`)
      }
    }
  
    // Add a new track
    function addTrack() {
      // In a real app, this would add a new track to the timeline
      alert("This feature would add a new track to your beat!")
    }
  
    // Clear all cells
    function clearAll() {
      if (confirm("Are you sure you want to clear all sounds?")) {
        document.querySelectorAll(".timeline-cell.active").forEach((cell) => {
          cell.classList.remove("active")
          delete cell.dataset.sound
        })
        console.log("All sounds cleared")
      }
    }
  
    // Toggle mute for a track
    function toggleMute(event) {
      const button = event.target.closest(".track-mute")
      if (!button) return
  
      button.classList.toggle("active")
      const trackLabel = button.closest(".track-label")
      const trackIndex = Array.from(trackLabel.parentNode.children).indexOf(trackLabel)
  
      // In a real app, this would mute the actual track
      console.log(`Track ${trackIndex + 1} mute: ${button.classList.contains("active")}`)
    }
  
    // Toggle solo for a track
    function toggleSolo(event) {
      const button = event.target.closest(".track-solo")
      if (!button) return
  
      button.classList.toggle("active")
      const trackLabel = button.closest(".track-label")
      const trackIndex = Array.from(trackLabel.parentNode.children).indexOf(trackLabel)
  
      // In a real app, this would solo the actual track
      console.log(`Track ${trackIndex + 1} solo: ${button.classList.contains("active")}`)
    }
  
    // Event Listeners
    playButton.addEventListener("click", togglePlay)
    stopButton.addEventListener("click", stopBeat)
    loopButton.addEventListener("click", toggleLoop)
    metronomeButton.addEventListener("click", toggleMetronome)
    tempoSlider.addEventListener("input", function () {
      this.nextElementSibling.textContent = this.value
    })
    tempoSlider.addEventListener("change", updateTempo)
    volumeSlider.addEventListener("input", function () {
      this.nextElementSibling.textContent = this.value
    })
    volumeSlider.addEventListener("change", updateVolume)
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", switchTab)
    })
  
    timelineCells.forEach((cell) => {
      cell.addEventListener("click", toggleCell)
      cell.addEventListener("dragover", handleDragOver)
      cell.addEventListener("dragleave", handleDragLeave)
      cell.addEventListener("drop", handleDrop)
    })
  
    effectsButton.addEventListener("click", toggleEffectsPanel)
    closeEffects.addEventListener("click", toggleEffectsPanel)
    helpButton.addEventListener("click", showTutorial)
    startCreatingButton.addEventListener("click", closeTutorial)
  
    saveButton.addEventListener("click", showSaveModal)
    exportButton.addEventListener("click", showExportModal)
    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", closeModal)
    })
    modalSaveButton.addEventListener("click", saveBeat)
    modalExportButton.addEventListener("click", exportBeat)
  
    document.addEventListener("click", (event) => {
      if (event.target.closest(".preview-button")) {
        previewSound(event)
      }
  
      if (event.target.closest(".track-mute")) {
        toggleMute(event)
      }
  
      if (event.target.closest(".track-solo")) {
        toggleSolo(event)
      }
    })
  
    soundItems.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart)
      item.addEventListener("dragend", handleDragEnd)
    })
  
    addTrackButton.addEventListener("click", addTrack)
    clearAllButton.addEventListener("click", clearAll)
  
    // Initialize sliders
    sliders.forEach((slider) => {
      slider.addEventListener("input", function () {
        const valueDisplay = this.nextElementSibling
        if (valueDisplay) {
          valueDisplay.textContent = this.value
        }
      })
    })
  
    // Initialize the app
    init()
  })
  