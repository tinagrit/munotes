// theme toggle
// modified from https://github.com/KosmosisDire/obsidian-webpage-export

const themeToggle = document.getElementById("theme_toggle");
function setupThemeToggle() {
    function e(e, t=!1) {
        if (themeToggle.checked = e,
        t) {
            var o = document.body.style.transition;
            document.body.style.transition = "none"
        }
        !themeToggle.classList.contains("is-checked") && e ? themeToggle.classList.add("is-checked") : themeToggle.classList.contains("is-checked") && !e && themeToggle.classList.remove("is-checked"),
        e ? (document.body.classList.contains("theme-dark") && document.body.classList.remove("theme-dark"),
        document.body.classList.contains("theme-light") || document.body.classList.add("theme-light")) : (document.body.classList.contains("theme-light") && document.body.classList.remove("theme-light"),
        document.body.classList.contains("theme-dark") || document.body.classList.add("theme-dark")),
        t && setTimeout((function() {
            document.body.style.transition = o
        }
        ), 100),
        localStorage.setItem("theme", e ? "light" : "dark")
    }
    if (themeToggle) {
        if (null != localStorage.getItem("theme")) {
            e("light" == localStorage.getItem("theme"), true)
        } else {
            document.body.classList.contains("theme-light") ? e(true, true) : e(false, true)
        }

        let _themeToggleProcessing = false;
        document.querySelector(".theme-toggle-input")?.addEventListener("change", (t => {
            if (_themeToggleProcessing) return;
            _themeToggleProcessing = true;
            const newState = themeToggle.checked;
            console.log("Theme toggle changed to: " + newState);
            e(newState);
            setTimeout(() => { _themeToggleProcessing = false }, 0);
        }))
    }
}

setupThemeToggle();