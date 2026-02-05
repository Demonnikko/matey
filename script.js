// Вспомогательная функция для пауз (promisified timeout)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Универсальная функция наблюдения за блоками
const observeBlock = (blockId, callback) => {
  const block = document.getElementById(blockId);
  let played = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !played) {
          played = true;
          callback();
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(block);
};

// Функция эффекта печатной машинки
const typeWriter = (element, speed = 40) => {
  return new Promise((resolve) => {
    const html = element.innerHTML;
    element.innerHTML = "";
    element.classList.add("appear"); // Делаем контейнер видимым

    let i = 0;
    let isTag = false;

    function type() {
      if (i < html.length) {
        let char = html.charAt(i);

        if (char === "<") isTag = true;
        element.innerHTML += char;
        if (char === ">") isTag = false;

        i++;

        if (isTag) type();
        else setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
};

// Настройка стандартных видео-блоков (2, 3, 4)
const setupVideoBlock = (suffix = "") => {
  const container = document.getElementById("videoContainer" + suffix);
  const message = document.getElementById("videoMessage" + suffix);
  const indicator = document.getElementById(
    "videoScrollIndicator" + suffix,
  );

  observeBlock("videoBlock" + suffix, async () => {
    await wait(300);
    container.classList.add("appear"); // Видео появляется

    await wait(3000);
    container.classList.add("disappear"); // Заглушка исчезает

    await wait(1500);
    await typeWriter(message); // Печатаем текст

    indicator.classList.add("visible"); // Стрелка
  });
};

// Инициализация блоков 2, 3, 4
setupVideoBlock(""); // Блок 2 (без суффикса в ID)
setupVideoBlock("3"); // Блок 3
setupVideoBlock("4"); // Блок 4

// Обработка финального блока (Блок 5)
observeBlock("videoBlock5", async () => {
  const container = document.getElementById("videoContainer5");
  const msg1 = document.getElementById("videoMessage5");
  const msg2 = document.getElementById("videoMessage5b");
  const finalInfo = document.getElementById("finalInfo");

  await wait(300);
  container.classList.add("appear");

  await wait(3000);
  container.classList.add("disappear");

  await wait(1500);
  await typeWriter(msg1); // Печатаем первый текст

  await wait(2000); // Пауза для чтения первой части
  msg1.style.transition = "opacity 0.5s ease";
  msg1.style.opacity = "0";

  await wait(500); // Промежуток
  await typeWriter(msg2); // Печатаем второй текст

  await wait(2000); // Пауза для чтения второй части
  msg2.style.transition = "opacity 0.5s ease";
  msg2.style.opacity = "0";

  await wait(1000); // Промежуток перед финалом
  finalInfo.classList.add("appear"); // Финал
  triggerExplosion();
});

// Создание золотых частиц
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;
  const sizes = ["small", "small", "small", "medium", "medium", "large"];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    particle.className = `particle ${size}`;
    particle.style.left = Math.random() * 100 + "%";
    particle.style.bottom = Math.random() * 20 - 10 + "vh";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = Math.random() * 5 + 8 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Автоматическое открытие кулис
window.addEventListener("load", () => {
  createParticles();

  // Убираем прелоадер через 500мс (быстрее)
  setTimeout(() => {
    document.getElementById("preloader").classList.add("fade-out");

    // Показываем частицы и декорации сразу
    const particles = document.getElementById("particles");
    particles.classList.add("visible");

    // Показываем подсказки внизу первого блока
    setTimeout(() => {
      const scrollIndicator = document.getElementById("scrollIndicator");
      if (scrollIndicator) {
        scrollIndicator.classList.add("visible");
      }
    }, 1000);
  }, 500);
});

// Эффект искр при нажатии на кнопки
function spawnSparks(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const spark = document.createElement("div");
    spark.className = "btn-spark";

    spark.style.left = centerX + "px";
    spark.style.top = centerY + "px";

    const angle = Math.random() * Math.PI * 2;
    const velocity = 50 + Math.random() * 100;

    const tx = Math.cos(angle) * velocity + "px";
    const ty = Math.sin(angle) * velocity + "px";

    spark.style.setProperty("--tx", tx);
    spark.style.setProperty("--ty", ty);

    spark.style.animation = `sparkFly ${0.5 + Math.random() * 0.5}s ease-out forwards`;

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 1000);
  }
}

// Эффект взрыва частиц для финала
function triggerExplosion() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    particle.className = "explosion-particle";

    const size = Math.random() * 6 + 4 + "px"; // 4-10px
    particle.style.width = size;
    particle.style.height = size;

    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";

    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 250; // Радиус разлета

    const tx = Math.cos(angle) * velocity + "px";
    const ty = Math.sin(angle) * velocity + "px";

    particle.style.setProperty("--tx", tx);
    particle.style.setProperty("--ty", ty);

    const duration = 0.8 + Math.random() * 0.8;
    particle.style.animation = `sparkFly ${duration}s ease-out forwards`;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), duration * 1000);
  }
}

document
  .querySelectorAll(".buy-tickets-btn, .final-button")
  .forEach((btn) => {
    btn.addEventListener("touchstart", spawnSparks, { passive: true });
    btn.addEventListener("mouseenter", spawnSparks);
  });
