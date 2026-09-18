const products = {
  coins: [
    { id: "coins-500", tag: "coins", rank: "", name: "500 Coinů", amount: null, description: "Pro začátek — vozidlo, drogy nebo dům, jen co se uskutečníte.", price: "5 €" },
    { id: "coins-1200", tag: "coins", rank: "Nejoblíbenější", name: "1 200 Coinů", amount: null, description: "Oblíbený balíček s bonusem +10 % coinů navíc.", price: "10 €" },
    { id: "coins-3000", tag: "coins", rank: "", name: "3 000 Coinů", amount: null, description: "Bonus +20 % — luxusní střecha, supersport a nitro.", price: "25 €" },
    { id: "coins-6500", tag: "coins", rank: "Nejlepší hodnota", name: "6 500 Coinů", amount: null, description: "Bonus +30 % pro náročné hráče. Vlastní firma na dosah.", price: "50 €" }
  ],
  vip: [
    { id: "vip-1", tag: "rank", rank: "VIP", name: "VIP", amount: "30 dní", description: "VIP značka u vozidel, +1 spawnovací místnost, priorita ve frontě.", price: "6 €" },
    { id: "vip-2", tag: "rank", rank: "VIP+", name: "VIP+", amount: "30 dní", description: "Vše z VIP navíc: měsíční balíček coinů a módní doplňky.", price: "12 €" },
    { id: "vip-3", tag: "rank", rank: "VIP++", name: "VIP++", amount: "30 dní", description: "Exkluzivní vozidla a byty, zvýhodněné ceny v obchodě.", price: "25 €" },
    { id: "vip-4", tag: "rank", rank: "GOD", name: "GOD VIP", amount: "30 dní", description: "Maximum benefitů — vše z VIP++ plus osobní support ticket.", price: "45 €" }
  ]
};

function renderProducts() {
  const coinsGrid = document.getElementById("coins-grid");
  const vipGrid = document.getElementById("vip-grid");

  products.coins.forEach((p) => {
    coinsGrid.appendChild(createCard(p, "💎"));
  });
  products.vip.forEach((p) => {
    vipGrid.appendChild(createCard(p, "🌟"));
  });
}

function createCard(p, icon) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.classList.add(p.tag === "rank" ? "vip" : "coin");
  if (p.rank && p.rank !== "VIP" && p.rank !== "GOD VIP") {
    card.classList.add("hot");
  }

  const tag = document.createElement("span");
  tag.className = "product-tag " + p.tag;
  tag.textContent = p.rank || "Coiny";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = icon + " " + p.name;

  const desc = document.createElement("p");
  desc.className = "product-desc";
  desc.textContent = p.description;

  const amount = document.createElement("div");
  amount.className = "product-amount";
  if (p.amount) {
    amount.textContent = p.amount;
  } else {
    amount.innerHTML = "<small>herní měna</small>";
  }

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = p.price;

  const btn = document.createElement("button");
  btn.className = "btn btn-primary product-btn";
  btn.textContent = "Koupit";
  btn.dataset.name = p.name;
  btn.dataset.price = p.price;
  btn.addEventListener("click", () => openModal(p));

  card.appendChild(tag);
  card.appendChild(name);
  card.appendChild(desc);
  card.appendChild(amount);
  card.appendChild(price);
  card.appendChild(btn);
  return card;
}

// ---------- Purchase modal ----------

function openModal(p) {
  const modal = document.getElementById("purchase-modal");
  const product = document.getElementById("modal-product");
  const name = document.getElementById("modal-name");
  const price = document.getElementById("modal-price");

  product.textContent = p.tag === "rank" ? "VIP Status" : "Herní coiny";
  name.textContent = p.name;
  price.textContent = "Cena: " + p.price;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("purchase-modal");
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
}

document.getElementById("modal-close").addEventListener("click", closeModal);

document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// ---------- Config ----------

// Sem vlož svůj e-mail (např. "nabory@triplefivenabory.cz") a přihlášky ti
// začnou chodit na tento e-mail přes FormSubmit (zdarma).
// Dokud je prázdné, přihláška se jen potvrdí a nikam se neposílá.
const FORM_ENDPOINT = "";

// ---------- Application form ----------

function validateForm(data) {
  const msg = document.getElementById("form-msg");
  const nick = data.get("nick").trim();
  const age = Number(data.get("age"));
  const contact = data.get("email").trim();
  const reason = data.get("skills").trim();
  const offer = data.get("offer").trim();
  const agreement = data.get("agreement");

  if (nick.length < 3) {
    return "Herní nick musí mít alespoň 3 znaky.";
  }
  if (age < 16) {
    return "Přihlášku může podat hráč starší 16 let.";
  }
  if (contact.length < 3) {
    return "Vyplň prosím Discord nebo e-mail.";
  }
  if (offer.length < 20) {
    return "„Co můžeš A-T týmu nabídnout" musí mít alespoň 20 znaků.";
  }
  if (reason.length < 30) {
    return "Motivace musí mít alespoň 30 znaků. Napiš prosím víc o sobě.";
  }
  if (!agreement) {
    return "Musíš souhlasit s pravidly serveru a mlčenlivostí.";
  }
  return null;
}

async function submitForm(form, data) {
  const msg = document.getElementById("form-msg");
  const successText = "Přihláška byla odeslána! Náš A-T tým tě brzy zkontaktuje.";

  if (!FORM_ENDPOINT) {
    msg.textContent = successText;
    msg.className = "form-msg success";
    msg.hidden = false;
    form.reset();
    return;
  }

  try {
    const payload = Object.fromEntries(data.entries());
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("network");
    }

    msg.textContent = successText;
    msg.className = "form-msg success";
    form.reset();
  } catch (err) {
    msg.textContent = "Odeslání se nepovedlo. Zkus to prosím za chvíli znovu.";
    msg.className = "form-msg error";
  }
  msg.hidden = false;
}

document.getElementById("apply-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const msg = document.getElementById("form-msg");

  const error = validateForm(data);
  if (error) {
    msg.textContent = error;
    msg.className = "form-msg error";
    msg.hidden = false;
    return;
  }

  submitForm(form, data);
});

// ---------- Animations ----------

function animateCounter(el) {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("cs-CZ");
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".hero-stats").forEach((block) => observer.observe(block));

// ---------- Footer year ----------

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Scroll reveal ----------

function addReveal(target) {
  target.classList.add("reveal");
}

document.querySelectorAll(".section-head, .feature, .product-card, .member, .contact-card").forEach(addReveal);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Init ----------

renderProducts();