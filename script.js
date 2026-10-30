const menus = document.querySelectorAll(".menu");

menus.forEach(menu => {
    const button = menu.querySelector(".menu-button");

    button.addEventListener("click", event => {
        event.stopPropagation();

        menus.forEach(other => {
            if (other !== menu) {
                other.classList.remove("open");
            }
        });

        menu.classList.toggle("open");
    });
});

document.addEventListener("click", () => {
    menus.forEach(menu => {
        menu.classList.remove("open");
    });
});

const snowLayer = document.querySelector(".snow-layer");
const snowflakes = ["❄", "❅", "❆", "•"];
let snowStarted = false;
let typedSequence = "";

function startSnow() {
    if (snowStarted) {
        return;
    }

    snowStarted = true;
    document.body.classList.add("dark-mode");
    const textarea = document.querySelector(".notepad textarea");
    const textareaStyle = getComputedStyle(textarea);
    const textareaRect = textarea.getBoundingClientRect();
    const lineHeight = parseFloat(textareaStyle.lineHeight);
    const paddingTop = parseFloat(textareaStyle.paddingTop);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = textareaStyle.font;
    const textLines = textarea.value
        .split("\n")
        .map((text, index) => ({ text: text.trim(), index }))
        .filter(line => line.text.length > 0);

    let flakeIndex = 0;

    const addSnowflake = (delay = 0) => {
        const flake = document.createElement("span");
        flake.className = "snowflake";
        flake.textContent = snowflakes[flakeIndex % snowflakes.length];
        const randomX = Math.random() * window.innerWidth;
        const line = textLines.find(textLine => {
            const lineWidth = context.measureText(textLine.text).width;
            const lineStart = textareaRect.left + textareaRect.width / 2 - lineWidth / 2;
            return randomX >= lineStart && randomX <= lineStart + lineWidth;
        });
        const settleY = line
            ? textareaRect.top + paddingTop + line.index * lineHeight
            : window.innerHeight + 40;

        flake.style.left = `${randomX}px`;
        flake.style.setProperty("--start-x", "0px");
        flake.style.setProperty("--drift", "0px");
        flake.style.setProperty(
            "--settle-y",
            `${settleY}px`
        );
        flake.style.fontSize = `${Math.random() * 10 + 8}px`;
        flake.style.opacity = `${Math.random() * 0.6 + 0.4}`;
        flake.style.animationDuration = `${Math.random() * 8 + 7}s`;
        flake.style.animationDelay = delay
            ? `${Math.random() * -15}s`
            : "0s";
        snowLayer.appendChild(flake);
        flakeIndex += 1;
    };

    for (let index = 0; index < 220; index += 1) {
        addSnowflake(-1);
    }

    setInterval(() => {
        addSnowflake();
    }, 150);
}

const today = new Date();
const month = today.getMonth();
const day = today.getDate();

const candyColors = [
    "brown",
    "cyan",
    "pink",
    "orange",
    "blue",
    "purple",
    "red",
    "yellow",
    "green",
];

function spawnCandies(pumpkin) {
    const rect = pumpkin.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let index = 0; index < 3; index += 1) {
        const candy = document.createElement("img");
        const color = candyColors[Math.floor(Math.random() * candyColors.length)];

        candy.className = "halloween-candy";
        candy.src = `./assets/halloween/candy_${color}.png`;
        candy.alt = "";
        candy.setAttribute("aria-hidden", "true");
        candy.style.left = `${originX - 18}px`;
        candy.style.top = `${originY - 18}px`;
        candy.style.setProperty(
            "--candy-x",
            `${(Math.random() * 160 - 120).toFixed(1)}px`
        );
        candy.style.setProperty(
            "--candy-y",
            `${(-80 - Math.random() * 100).toFixed(1)}px`
        );
        candy.style.setProperty(
            "--candy-rot",
            `${(Math.random() * 360 - 180).toFixed(1)}deg`
        );

        candy.addEventListener("animationend", () => {
            candy.remove();
        });

        document.body.appendChild(candy);
    }
}

if (month === 9 && (day === 30 || day === 31)) {
    const pumpkin = document.querySelector(".halloween-pumpkin");

    if (pumpkin) {
        pumpkin.hidden = false;

        const releaseCandies = event => {
            event.stopPropagation();
            spawnCandies(pumpkin);
        };

        pumpkin.addEventListener("click", releaseCandies);
        pumpkin.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                releaseCandies(event);
            }
        });
    }
}

if (month === 11) {
    startSnow();
}

document.addEventListener("keydown", event => {
    if (event.key.length !== 1) {
        return;
    }

    typedSequence = `${typedSequence}${event.key}`.slice(-4);

    if (typedSequence.toLowerCase() === "snow") {
        startSnow();
        typedSequence = "";
    }
});
