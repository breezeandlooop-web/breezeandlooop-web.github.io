(() => {
  const KEY = "breeze-slip.v1";
  const STAGES = [
    "Brief locked",
    "Materials in",
    "On the hook",
    "Blocked",
    "Ready",
    "Packed",
    "Shipped",
    "Collected"
  ];
  const CLOSED = { Shipped: 1, Collected: 1 };
  const METHODS = ["Cash", "Bank transfer", "Local wallet", "Card"];
  const app = document.getElementById("app");

  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => "s" + Math.random().toString(36).slice(2, 8);
  const money = (n) => "BBD " + (Math.round((+n || 0) * 100) / 100);
  const usd = (n) => "USD " + (Math.round((+n || 0) * 50) / 100);
  const shift = (d) => {
    const x = new Date();
    x.setDate(x.getDate() + d);
    return x.toISOString().slice(0, 10);
  };
  const pretty = (iso) => {
    if (!iso) return "No date";
    return new Date(iso + "T12:00:00").toLocaleDateString("en-BB", {
      day: "numeric",
      month: "short"
    });
  };
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function make(customer, piece, where, due, price, paid, method, stage) {
    return {
      id: uid(),
      customer: customer,
      piece: piece,
      where: where,
      due: due,
      price: price,
      paid: paid,
      method: method,
      stage: stage,
      notes: "",
      phone: ""
    };
  }

  function seed() {
    const s = {
      studio: "Breeze & Loop",
      place: "Oistins, Christ Church",
      orders: [
        make("Amina Clarke", "Sea-glass market tote", "Ship to Toronto", shift(9), 220, 110, "Bank transfer", "On the hook"),
        make("Devon Alleyne", "Navy bucket hat", "Collect Saturday, Fish Fry", shift(3), 95, 40, "Cash", "Materials in"),
        make("Priya Shah", "Lookbook shawl, clay stripe", "London hold for December", shift(40), 310, 150, "Bank transfer", "Brief locked"),
        make("Leah Holdipp", "Baby blanket, foam + sand", "Worthing pickup", shift(-1), 180, 180, "Local wallet", "Ready")
      ]
    };
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }

  function load() {
    try {
      const r = JSON.parse(localStorage.getItem(KEY));
      if (r && r.orders) return r;
    } catch (e) {}
    return seed();
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  let state = load();

  function dueOf(x) {
    return Math.max(0, x.price - x.paid);
  }
  function isLate(x) {
    return x.due && x.due < today() && !CLOSED[x.stage];
  }
  function route() {
    const p = location.hash.replace(/^#/, "").split("/").filter(Boolean);
    if (p[0] === "new") return { n: "new" };
    if (p[0] === "order") return { n: "order", id: p[1] };
    if (p[0] === "s") return { n: "pub", id: p[1] };
    if (p[0] === "studio") return { n: "studio" };
    return { n: "board", f: p[0] || "flight" };
  }
  function go(h) {
    location.hash = h;
  }

  function chip(id, label, on) {
    return (
      '<button class="chip' +
      (on === id ? " on" : "") +
      '" type="button" data-go="#/' +
      id +
      '">' +
      label +
      "</button>"
    );
  }

  function card(x) {
    const d = dueOf(x);
    const pill =
      d === 0
        ? '<span class="pill paid">Paid</span>'
        : '<span class="pill due">Due ' + money(d) + "</span>";
    return (
      '<button class="card" type="button" data-go="#/order/' +
      x.id +
      '"><div class="k"><span>' +
      esc(x.customer) +
      '</span><span class="' +
      (isLate(x) ? "late" : "") +
      '">' +
      (isLate(x) ? "Late · " : "") +
      pretty(x.due) +
      "</span></div><h3>" +
      esc(x.piece) +
      '</h3><div class="pills"><span class="pill">' +
      esc(x.stage) +
      "</span>" +
      pill +
      '<span class="money">' +
      money(x.paid) +
      " / " +
      money(x.price) +
      "</span></div></button>"
    );
  }

  function viewBoard(f) {
    const all = state.orders.slice().sort(function (a, b) {
      return (a.due || "9").localeCompare(b.due || "9");
    });
    const flight = all.filter(function (x) {
      return !CLOSED[x.stage] && x.stage !== "Ready";
    });
    const ready = all.filter(function (x) {
      return x.stage === "Ready" || x.stage === "Packed";
    });
    const moneyDue = all.filter(function (x) {
      return dueOf(x) > 0;
    });
    const closed = all.filter(function (x) {
      return CLOSED[x.stage];
    });
    const map = { flight: flight, ready: ready, money: moneyDue, closed: closed };
    const list = map[f] || flight;
    const owe = moneyDue.reduce(function (s, x) {
      return s + dueOf(x);
    }, 0);
    app.innerHTML =
      '<div class="top"><div><span class="word">Breeze Slip</span><span class="sub">' +
      esc(state.studio) +
      '</span></div><button class="chip" type="button" data-go="#/studio">Studio</button></div>' +
      "<h1>On the hook</h1>" +
      '<p class="lede">WhatsApp stays the shop. This is the slip you used to keep in your head.</p>' +
      '<div class="stats"><div class="stat"><b>' +
      flight.length +
      "</b><span>In flight</span></div><div class=\"stat\"><b>" +
      ready.length +
      "</b><span>Ready</span></div><div class=\"stat\"><b>" +
      money(owe) +
      "</b><span>Still due</span></div></div>" +
      '<div class="filters">' +
      chip("flight", "In flight", f) +
      chip("ready", "Ready", f) +
      chip("money", "Money due", f) +
      chip("closed", "Closed", f) +
      "</div><div class=\"list\">" +
      (list.map(card).join("") || "<p class='lede'>Quiet board.</p>") +
      '</div><button class="fab" type="button" data-go="#/new">New slip</button>';
    bind();
  }

  function viewNew() {
    const opts = METHODS.map(function (m) {
      return "<option>" + m + "</option>";
    }).join("");
    app.innerHTML =
      '<button class="back" type="button" data-go="#/flight">← Board</button>' +
      "<h1>New slip</h1><p class=\"lede\">Name, piece, price. Then back to the hook.</p>" +
      '<form id="nf">' +
      '<label><span>Customer</span><input name="customer" required placeholder="Who is this for?"></label>' +
      '<label><span>Piece</span><input name="piece" required placeholder="Sea-glass tote"></label>' +
      '<div class="row"><label><span>Price BBD</span><input name="price" type="number" min="0" required placeholder="180"></label>' +
      '<label><span>Paid today</span><input name="paid" type="number" min="0" placeholder="0"></label></div>' +
      '<div class="row"><label><span>Due</span><input name="due" type="date"></label>' +
      '<label><span>Rail</span><select name="method">' +
      opts +
      "</select></label></div>" +
      '<label><span>Where / how it leaves</span><input name="where" placeholder="Collect Oistins"></label>' +
      '<button class="fab" type="submit">Save slip</button></form>';
    bind();
    document.getElementById("nf").onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(e.target);
      const price = +f.get("price") || 0;
      const row = make(
        String(f.get("customer") || "").trim(),
        String(f.get("piece") || "").trim(),
        String(f.get("where") || "").trim(),
        String(f.get("due") || ""),
        price,
        +f.get("paid") || 0,
        String(f.get("method") || "Bank transfer"),
        "Brief locked"
      );
      state.orders.unshift(row);
      save();
      go("#/order/" + row.id);
    };
  }

  function viewOrder(id) {
    const x = state.orders.filter(function (v) {
      return v.id === id;
    })[0];
    if (!x) {
      app.innerHTML =
        '<button class="back" type="button" data-go="#/flight">← Board</button><h1>Slip gone</h1>';
      bind();
      return;
    }
    const d = dueOf(x);
    const stages = STAGES.map(function (s) {
      return (
        '<button class="chip' +
        (x.stage === s ? " on" : "") +
        '" type="button" data-stage="' +
        s +
        '">' +
        s +
        "</button>"
      );
    }).join("");
    const opts = METHODS.map(function (m) {
      return (
        "<option" +
        (m === x.method ? " selected" : "") +
        ">" +
        m +
        "</option>"
      );
    }).join("");
    app.innerHTML =
      '<button class="back" type="button" data-go="#/flight">← Board</button>' +
      '<div class="k"><span>' +
      esc(x.customer) +
      '</span><span class="' +
      (isLate(x) ? "late" : "") +
      '">' +
      pretty(x.due) +
      "</span></div><h1>" +
      esc(x.piece) +
      '</h1><p class="lede">' +
      esc(x.where || "No pickup note yet.") +
      '</p><div class="box"><div class="big">' +
      money(x.paid) +
      ' <span class="tiny">/ ' +
      money(x.price) +
      '</span></div><div class="tiny">' +
      usd(x.paid) +
      " paid · " +
      (d ? money(d) + " still due" : "Balance clear.") +
      " · " +
      usd(x.price) +
      " full</div></div><h2>Stage</h2>" +
      '<div class="filters" style="flex-wrap:wrap;margin-top:10px" id="stages">' +
      stages +
      "</div><h2 style=\"margin-top:18px\">Log money</h2>" +
      '<form id="pf" class="row"><label><span>Amount BBD</span><input name="amt" type="number" min="1" required placeholder="' +
      (d || "") +
      '"></label><label><span>Rail</span><select name="method">' +
      opts +
      '</select></label></form>' +
      '<button class="btn p" type="button" id="addpay">Add payment</button>' +
      '<button class="btn" type="button" id="share">Copy WhatsApp status</button>' +
      '<button class="btn" type="button" data-go="#/s/' +
      x.id +
      '">Open customer page</button>' +
      '<form id="nf2"><label><span>Studio notes</span><textarea name="notes">' +
      esc(x.notes) +
      '</textarea></label><label><span>Phone</span><input name="phone" value="' +
      esc(x.phone) +
      '" placeholder="+1 246"></label>' +
      '<button class="btn" type="submit">Save notes</button></form>';
    bind();
    document.getElementById("stages").onclick = function (e) {
      const b = e.target.closest("[data-stage]");
      if (!b) return;
      x.stage = b.getAttribute("data-stage");
      save();
      render();
    };
    document.getElementById("addpay").onclick = function () {
      document.getElementById("pf").requestSubmit();
    };
    document.getElementById("pf").onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(e.target);
      x.paid += +f.get("amt") || 0;
      x.method = String(f.get("method") || x.method);
      save();
      render();
    };
    document.getElementById("nf2").onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(e.target);
      x.notes = String(f.get("notes") || "");
      x.phone = String(f.get("phone") || "");
      save();
    };
    document.getElementById("share").onclick = function () {
      const url = location.href.split("#")[0] + "#/s/" + x.id;
      const t =
        state.studio +
        "\n" +
        x.piece +
        "\nStage: " +
        x.stage +
        "\n" +
        (x.due ? "Ready aim: " + pretty(x.due) + "\n" : "") +
        "Paid " +
        money(x.paid) +
        " of " +
        money(x.price) +
        " (" +
        usd(x.paid) +
        " of " +
        usd(x.price) +
        ").\n" +
        url;
      if (navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {});
      const phone = String(x.phone || "").replace(/[^\d]/g, "");
      location.href = "https://wa.me/" + (phone || "") + "?text=" + encodeURIComponent(t);
    };
  }

  function viewPub(id) {
    const x = state.orders.filter(function (v) {
      return v.id === id;
    })[0];
    if (!x) {
      app.innerHTML =
        "<h1>This slip has gone quiet.</h1><p class=\"lede\">Ask the maker for a fresh link.</p>";
      return;
    }
    const i = Math.max(0, STAGES.indexOf(x.stage));
    const d = dueOf(x);
    const line = STAGES.map(function (s, n) {
      const mark = n < i ? "✓ " : n === i ? "● " : "○ ";
      return mark + s;
    }).join("<br>");
    app.innerHTML =
      '<p class="sub" style="text-align:center">' +
      esc(state.studio) +
      '</p><h1 style="text-align:center;margin-top:12px">' +
      esc(x.piece) +
      '</h1><p class="lede" style="text-align:center">For ' +
      esc(x.customer.split(" ")[0]) +
      " · " +
      esc(state.place) +
      '</p><div class="box"><div class="k"><span>Now</span><span>' +
      (x.due ? "Aim " + pretty(x.due) : "") +
      "</span></div><h2>" +
      esc(x.stage) +
      '</h2><div class="tiny" style="margin-top:10px">' +
      line +
      '</div></div><div class="box"><div class="k"><span>Money</span></div><div class="big">' +
      money(x.paid) +
      " / " +
      money(x.price) +
      '</div><p class="tiny">' +
      usd(x.paid) +
      " paid · " +
      (d ? money(d) + " still due" : "Balance clear.") +
      '</p></div><p class="lede" style="text-align:center">Made by hand. No app to install.</p>';
  }

  function viewStudio() {
    app.innerHTML =
      '<button class="back" type="button" data-go="#/flight">← Board</button>' +
      "<h1>Studio</h1><form id=\"sf\">" +
      '<label><span>Studio name</span><input name="studio" value="' +
      esc(state.studio) +
      '"></label><label><span>Place</span><input name="place" value="' +
      esc(state.place) +
      '"></label><button class="btn p" type="submit">Save studio</button></form>' +
      '<button class="btn" type="button" id="dl">Download this month CSV</button>' +
      '<button class="btn" type="button" id="reseed">Reload samples</button>';
    bind();
    document.getElementById("sf").onsubmit = function (e) {
      e.preventDefault();
      const f = new FormData(e.target);
      state.studio = String(f.get("studio") || state.studio);
      state.place = String(f.get("place") || state.place);
      save();
    };
    document.getElementById("dl").onclick = csv;
    document.getElementById("reseed").onclick = function () {
      if (!confirm("Reload sample slips?")) return;
      localStorage.removeItem(KEY);
      state = seed();
      go("#/flight");
    };
  }

  function csv() {
    const head =
      "date,customer,piece,stage,price_bbd,paid_bbd,due_bbd,price_usd,paid_usd,method,due_date,where";
    const lines = state.orders.map(function (x) {
      return [
        today(),
        x.customer,
        x.piece,
        x.stage,
        x.price,
        x.paid,
        dueOf(x),
        x.price / 2,
        x.paid / 2,
        x.method,
        x.due,
        x.where
      ]
        .map(function (v) {
          return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
        })
        .join(",");
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[head].concat(lines).join("\n")]));
    a.download = "breeze-slip.csv";
    a.click();
  }

  function bind() {
    const nodes = app.querySelectorAll("[data-go]");
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].onclick = function (e) {
        e.preventDefault();
        go(this.getAttribute("data-go"));
      };
    }
  }

  function render() {
    const r = route();
    if (r.n === "new") return viewNew();
    if (r.n === "order") return viewOrder(r.id);
    if (r.n === "pub") return viewPub(r.id);
    if (r.n === "studio") return viewStudio();
    viewBoard(r.f);
  }

  window.addEventListener("hashchange", render);
  render();
})();
