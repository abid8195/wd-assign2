/* ==========================================================================
   CineSwin - script.js
   COS10005 Web Development, Assignment 2
   Author: Abid Us Sobhan (s103802241)

   Contents
   1. Movie data (single source of truth for booking, recommendations, watchlist)
   2. Small helpers
   3. Watchlist (bonus)
   4. Recommendation page
   5. Registration validation
   6. Booking page (dynamic behaviour + validation)
   7. Start-up

   Carry-over approach: movies.html and recommend.html link to
   booking.html?movie=<id>. booking.html reads the query string with
   URLSearchParams and pre-selects that option in the Movie dropdown.
   ========================================================================== */

/* ==========================================================================
   1. MOVIE DATA
   ========================================================================== */

const MOVIES = [
  {
    id: "inception",
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genres: ["Sci-Fi", "Action"],
    rating: "M",
    minAge: 15,
    runtime: 148,
    price: 18,
    tags: ["friends", "date", "solo"],
    sessions: ["10:30", "14:00", "19:30"],
    image: "images/movie1.jpg"
  },
  {
    id: "dark-knight",
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genres: ["Action", "Crime"],
    rating: "M",
    minAge: 15,
    runtime: 152,
    price: 18,
    tags: ["friends", "solo"],
    sessions: ["11:00", "15:00", "20:00"],
    image: "images/movie2.jpg"
  },
  {
    id: "interstellar",
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genres: ["Sci-Fi", "Drama"],
    rating: "M",
    minAge: 15,
    runtime: 169,
    price: 19,
    tags: ["date", "solo", "friends"],
    sessions: ["10:00", "14:30", "19:00"],
    image: "images/movie3.jpg"
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    director: "Christopher Nolan",
    year: 2023,
    genres: ["Drama", "Biography"],
    rating: "M",
    minAge: 15,
    runtime: 180,
    price: 20,
    tags: ["solo", "date"],
    sessions: ["11:30", "15:30", "19:45"],
    image: "images/movie4.jpg"
  },
  {
    id: "goodfellas",
    title: "Goodfellas",
    director: "Martin Scorsese",
    year: 1990,
    genres: ["Crime", "Drama"],
    rating: "R18+",
    minAge: 18,
    runtime: 146,
    price: 16,
    tags: ["friends", "solo"],
    sessions: ["12:00", "16:30", "21:00"],
    image: "images/movie5.jpg"
  },
  {
    id: "departed",
    title: "The Departed",
    director: "Martin Scorsese",
    year: 2006,
    genres: ["Crime", "Thriller"],
    rating: "MA15+",
    minAge: 15,
    runtime: 151,
    price: 16,
    tags: ["friends", "solo", "date"],
    sessions: ["13:00", "17:00", "20:30"],
    image: "images/movie6.jpg"
  },
  {
    id: "hugo",
    title: "Hugo",
    director: "Martin Scorsese",
    year: 2011,
    genres: ["Adventure", "Family"],
    rating: "PG",
    minAge: 8,
    runtime: 126,
    price: 14,
    tags: ["family", "date"],
    sessions: ["10:00", "13:00", "16:00"],
    image: "images/movie7.jpg"
  },
  {
    id: "wolf",
    title: "The Wolf of Wall Street",
    director: "Martin Scorsese",
    year: 2013,
    genres: ["Comedy", "Crime"],
    rating: "R18+",
    minAge: 18,
    runtime: 180,
    price: 17,
    tags: ["friends"],
    sessions: ["14:00", "18:00", "21:15"],
    image: "images/movie8.jpg"
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    director: "Hayao Miyazaki",
    year: 2001,
    genres: ["Animation", "Fantasy"],
    rating: "PG",
    minAge: 8,
    runtime: 125,
    price: 13,
    tags: ["family", "solo", "date"],
    sessions: ["10:30", "13:30", "16:30"],
    image: "images/movie9.jpg"
  },
  {
    id: "paddington-2",
    title: "Paddington 2",
    director: "Paul King",
    year: 2017,
    genres: ["Comedy", "Family"],
    rating: "G",
    minAge: 0,
    runtime: 103,
    price: 12,
    tags: ["family", "friends", "date"],
    sessions: ["10:00", "12:30", "15:00"],
    image: "images/movie10.jpg"
  },
  {
    id: "spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    director: "Bob Persichetti, Peter Ramsey and Rodney Rothman",
    year: 2018,
    genres: ["Animation", "Action"],
    rating: "PG",
    minAge: 8,
    runtime: 117,
    price: 14,
    tags: ["family", "friends", "date"],
    sessions: ["11:00", "14:15", "17:30"],
    image: "images/movie11.jpg"
  }
];

/* ==========================================================================
   2. SMALL HELPERS
   ========================================================================== */

/** Shortcut for document.getElementById. */
function $(id) {
  return document.getElementById(id);
}

/** Find a movie object by its id (returns undefined if not found). */
function findMovie(id) {
  return MOVIES.find(function (m) { return m.id === id; });
}

/** Format a number as dollars, e.g. 14.4 -> "$14.40". */
function money(value) {
  return "$" + value.toFixed(2);
}

/** Convert "19:30" into "7:30 PM" for display. */
function formatTime(t) {
  var parts = t.split(":");
  var h = parseInt(parts[0], 10);
  var suffix = h < 12 ? "AM" : "PM";
  return ((h + 11) % 12 + 1) + ":" + parts[1] + " " + suffix;
}

/** Show (or clear) an error message for a field and flag it for screen readers. */
function setError(fieldId, message) {
  var field = $(fieldId);
  var box = $(fieldId + "-error");
  if (box) { box.textContent = message; }
  if (field) {
    if (message) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    }
  }
  return message === "";
}

/** Escape text before putting it into innerHTML. */
function esc(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   3. WATCHLIST (BONUS) - stored in localStorage as a JSON array of movie ids
   ========================================================================== */

var WATCH_KEY = "cineswinWatchlist";

/** Read the saved ids; falls back to an empty list if storage is blocked or corrupt. */
function getWatchlist() {
  try {
    var data = JSON.parse(localStorage.getItem(WATCH_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveWatchlist(list) {
  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(list));
  } catch (e) { /* storage unavailable: the list just won't persist */ }
}

/** Add the movie if missing, remove it if present. */
function toggleWatch(id) {
  var list = getWatchlist();
  var index = list.indexOf(id);
  if (index === -1) { list.push(id); } else { list.splice(index, 1); }
  saveWatchlist(list);
}

/** Update the little counter on the "Watchlist" navigation link. */
function updateWatchBadge() {
  var badge = $("watch-count");
  if (!badge) { return; }
  var count = getWatchlist().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}

/** Make every "Add to Watchlist" button show its current state. */
function refreshWatchButtons() {
  var list = getWatchlist();
  document.querySelectorAll(".watch-btn").forEach(function (btn) {
    var saved = list.indexOf(btn.dataset.movie) !== -1;
    btn.setAttribute("aria-pressed", saved ? "true" : "false");
    btn.textContent = saved ? "Remove from Watchlist" : "Add to Watchlist";
  });
}

/** Draw the cards on watchlist.html. */
function renderWatchlist() {
  var grid = $("watch-grid");
  if (!grid) { return; }
  var movies = getWatchlist().map(findMovie).filter(Boolean);
  $("watch-empty").hidden = movies.length > 0;
  $("clear-watch").hidden = movies.length === 0;
  grid.innerHTML = movies.map(function (m) {
    return '<article class="card mini-card">' +
      '<img src="' + m.image + '" alt="Poster for ' + esc(m.title) + '" width="300" height="450">' +
      '<div class="card-body"><h3>' + esc(m.title) + '</h3>' +
      '<p class="meta">' + m.genres.join(" / ") + ' &middot; ' + m.rating + ' &middot; ' + m.runtime + ' min</p>' +
      '<p class="actions"><a class="btn" href="booking.html?movie=' + m.id + '">Book Tickets</a> ' +
      '<button type="button" class="btn btn-secondary remove-btn" data-movie="' + m.id + '">Remove</button></p>' +
      '</div></article>';
  }).join("");
}

/** One delegated click listener handles watchlist buttons on every page. */
function initWatchlist() {
  updateWatchBadge();
  refreshWatchButtons();
  renderWatchlist();

  document.addEventListener("click", function (event) {
    var addBtn = event.target.closest(".watch-btn");
    var removeBtn = event.target.closest(".remove-btn");
    if (addBtn) {
      toggleWatch(addBtn.dataset.movie);
    } else if (removeBtn) {
      toggleWatch(removeBtn.dataset.movie);
    } else if (event.target.id === "clear-watch") {
      saveWatchlist([]);
    } else {
      return;
    }
    updateWatchBadge();
    refreshWatchButtons();
    renderWatchlist();
  });
}

/* ==========================================================================
   4. RECOMMENDATION PAGE - rule-based scoring
   ========================================================================== */

/* Rule 1 (hard filter): which age ratings each age group may be shown. */
var ALLOWED_RATINGS = {
  child: ["G", "PG"],
  teen: ["G", "PG", "M"],
  adult: ["G", "PG", "M", "MA15+", "R18+"]
};

/**
 * Score every movie for the chosen preferences and return the best three.
 * Scoring rules (higher = better match):
 *   +5  the movie belongs to the chosen genre
 *   +3  the movie suits the chosen viewing preference (tag on the movie)
 *   +2  child viewers get an extra boost for G / PG movies
 *   +1  family or child viewings prefer shorter movies (130 minutes or less)
 *   +1  teens get a small boost for animation and action titles
 */
function getRecommendations(genre, age, viewing) {
  var allowed = ALLOWED_RATINGS[age];
  var results = [];

  MOVIES.forEach(function (movie) {
    if (allowed.indexOf(movie.rating) === -1) { return; }   // rule 1

    var score = 0;
    var reasons = [];

    if (movie.genres.indexOf(genre) !== -1) {
      score += 5;
      reasons.push("Matches your favourite genre (" + genre + ")");
    }
    if (movie.tags.indexOf(viewing) !== -1) {
      score += 3;
      var labels = { family: "a family outing", date: "date night", friends: "watching with friends", solo: "a solo screening" };
      reasons.push("Great for " + labels[viewing]);
    }
    if (age === "child" && (movie.rating === "G" || movie.rating === "PG")) {
      score += 2;
      reasons.push("Child-friendly (" + movie.rating + ")");
    }
    if ((age === "child" || viewing === "family") && movie.runtime <= 130) {
      score += 1;
      reasons.push("Shorter running time (" + movie.runtime + " min)");
    }
    if (age === "teen" && (movie.genres.indexOf("Animation") !== -1 || movie.genres.indexOf("Action") !== -1)) {
      score += 1;
      reasons.push("Popular with teen audiences");
    }
    results.push({ movie: movie, score: score, reasons: reasons });
  });

  // Highest score first; cheaper ticket wins a tie so the order is stable.
  results.sort(function (a, b) {
    return b.score - a.score || a.movie.price - b.movie.price;
  });
  return results.slice(0, 3);
}

function initRecommend() {
  var form = $("recommend-form");
  if (!form) { return; }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var genre = $("genre").value;
    var ageInput = form.querySelector('input[name="age"]:checked');
    var age = ageInput ? ageInput.value : "";
    var viewing = $("viewing").value;

    var ok = true;
    ok = setError("genre", genre ? "" : "Please choose a preferred genre.") && ok;
    $("age-error").textContent = age ? "" : "Please choose an age group.";
    ok = (age !== "") && ok;
    ok = setError("viewing", viewing ? "" : "Please choose a viewing preference.") && ok;
    if (!ok) { $("results").hidden = true; return; }

    var picks = getRecommendations(genre, age, viewing);
    var exact = picks.filter(function (p) { return p.movie.genres.indexOf(genre) !== -1; }).length;
    $("results-summary").textContent = exact > 0
      ? "Top " + picks.length + " picks for " + genre + " fans (" + age + ", " + viewing + ")."
      : "No " + genre + " movie is suitable for the " + age + " age group, so here are the closest alternatives.";

    $("results-grid").innerHTML = picks.map(function (p, i) {
      var m = p.movie;
      return '<article class="card mini-card">' +
        '<img src="' + m.image + '" alt="Poster for ' + esc(m.title) + '" width="300" height="450">' +
        '<div class="card-body"><h3>' + (i + 1) + '. ' + esc(m.title) + '</h3>' +
        '<p class="meta">' + m.genres.join(" / ") + ' &middot; ' + m.rating + ' &middot; ' + money(m.price) + '</p>' +
        '<ul class="reasons">' + p.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul>' +
        '<p class="actions"><a class="btn" href="booking.html?movie=' + m.id + '">Book Tickets</a> ' +
        '<button type="button" class="btn btn-secondary watch-btn" data-movie="' + m.id + '" aria-pressed="false">Add to Watchlist</button></p>' +
        '</div></article>';
    }).join("");

    $("results").hidden = false;
    refreshWatchButtons();
    $("results").scrollIntoView({ behavior: "smooth" });
  });
}

/* ==========================================================================
   5. REGISTRATION FORM VALIDATION
   ========================================================================== */

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Each validator returns true when the field is valid and shows an error otherwise. */
var registerChecks = {
  username: function () {
    var v = $("username").value.trim();
    if (v === "") { return setError("username", "Username is required."); }
    if (v.length < 5) { return setError("username", "Username must be at least 5 characters."); }
    if (!/^[A-Za-z0-9_]+$/.test(v)) { return setError("username", "Use letters, numbers and underscores only."); }
    return setError("username", "");
  },
  email: function () {
    var v = $("email").value.trim();
    if (v === "") { return setError("email", "Email address is required."); }
    if (!EMAIL_PATTERN.test(v)) { return setError("email", "Enter a valid email address, e.g. name@example.com."); }
    return setError("email", "");
  },
  phone: function () {
    var v = $("phone").value.trim();
    if (v === "") { return setError("phone", "Phone number is required."); }
    if (!/^[0-9]+$/.test(v)) { return setError("phone", "Phone number must contain digits only."); }
    if (v.length < 8 || v.length > 15) { return setError("phone", "Phone number must be 8 to 15 digits."); }
    return setError("phone", "");
  },
  password: function () {
    var v = $("password").value;
    if (v === "") { return setError("password", "Password is required."); }
    var missing = [];
    if (v.length < 10) { missing.push("at least 10 characters"); }
    if (!/[A-Z]/.test(v)) { missing.push("an uppercase letter"); }
    if (!/[a-z]/.test(v)) { missing.push("a lowercase letter"); }
    if (!/[0-9]/.test(v)) { missing.push("a number"); }
    if (!/[^A-Za-z0-9]/.test(v)) { missing.push("a special character"); }
    if (missing.length > 0) { return setError("password", "Password needs " + missing.join(", ") + "."); }
    return setError("password", "");
  },
  confirm: function () {
    var v = $("confirm").value;
    if (v === "") { return setError("confirm", "Please confirm your password."); }
    if (v !== $("password").value) { return setError("confirm", "Passwords do not match."); }
    return setError("confirm", "");
  },
  gender: function () {
    var chosen = document.querySelector('#register-form input[name="gender"]:checked');
    $("gender-error").textContent = chosen ? "" : "Please select a gender.";
    return chosen !== null;
  },
  genres: function () {
    var chosen = document.querySelectorAll('#register-form input[name="genres"]:checked');
    $("genres-error").textContent = chosen.length > 0 ? "" : "Please select at least one preferred genre.";
    return chosen.length > 0;
  },
  country: function () {
    return setError("country", $("country").value ? "" : "Please select your country or region.");
  }
};

function initRegister() {
  var form = $("register-form");
  if (!form) { return; }

  // Validate a single field as soon as the user leaves it.
  ["username", "email", "phone", "password", "confirm", "country"].forEach(function (name) {
    $(name).addEventListener("blur", registerChecks[name]);
  });
  // Re-check the confirmation whenever the password changes.
  $("password").addEventListener("input", function () {
    if ($("confirm").value !== "") { registerChecks.confirm(); }
  });
  form.querySelectorAll('input[name="gender"]').forEach(function (r) { r.addEventListener("change", registerChecks.gender); });
  form.querySelectorAll('input[name="genres"]').forEach(function (c) { c.addEventListener("change", registerChecks.genres); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();                 // always block; only show success when everything passes
    var allValid = true;
    var firstBad = null;
    Object.keys(registerChecks).forEach(function (name) {
      var ok = registerChecks[name]();
      if (!ok && !firstBad) { firstBad = name; }
      allValid = allValid && ok;
    });
    $("reg-success").hidden = true;
    if (!allValid) {
      var target = $(firstBad) || form.querySelector('input[name="' + firstBad + '"]');
      if (target) { target.focus(); }
      return;
    }
    $("reg-success").hidden = false;
    form.reset();
    $("reg-success").scrollIntoView({ behavior: "smooth" });
  });
}

/* ==========================================================================
   6. BOOKING PAGE - dynamic behaviour and validation
   ========================================================================== */

/* Ticket type multiplies the movie's base price. */
var TICKET_FACTOR = { adult: 1, student: 0.8, child: 0.6 };
var CARD_LENGTH = { visa: 16, mastercard: 16, amex: 15 };

/** Today's date as YYYY-MM-DD in the visitor's local time zone. */
function todayString() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mm + "-" + dd;
}

/** Fill the movie dropdown and pre-select the movie carried in the URL (?movie=id). */
function populateMovies() {
  var select = $("movie");
  MOVIES.forEach(function (m) {
    var option = document.createElement("option");
    option.value = m.id;
    option.textContent = m.title + " (" + m.rating + ") - " + money(m.price);
    select.appendChild(option);
  });
  // Both movies.html and recommend.html link here as booking.html?movie=<id>.
  var chosen = new URLSearchParams(window.location.search).get("movie");
  if (chosen && findMovie(chosen)) { select.value = chosen; }
}

/** Rebuild the session-time dropdown for the selected movie. */
function updateTimes() {
  var movie = findMovie($("movie").value);
  var select = $("time");
  var previous = select.value;
  select.innerHTML = "";
  var first = document.createElement("option");
  first.value = "";
  first.textContent = movie ? "Select a session" : "Select a movie first";
  select.appendChild(first);
  if (movie) {
    movie.sessions.forEach(function (t) {
      var option = document.createElement("option");
      option.value = t;
      option.textContent = formatTime(t);
      select.appendChild(option);
    });
    if (movie.sessions.indexOf(previous) !== -1) { select.value = previous; }
  }
}

/** Recalculate unit price and total from movie, ticket type and quantity. */
function updateCost() {
  var movie = findMovie($("movie").value);
  var qty = parseInt($("tickets").value, 10);
  var unit = movie ? movie.price * TICKET_FACTOR[$("tickettype").value] : 0;
  var total = unit * (qty > 0 ? qty : 0);
  $("unit-price").textContent = money(unit);
  $("total-price").textContent = money(total);
  $("cost").value = total.toFixed(2);
}

/** Show the voucher box or the card box depending on the payment method. */
function updatePaymentFields() {
  var chosen = document.querySelector('#booking-form input[name="payment"]:checked');
  var method = chosen ? chosen.value : "";
  var voucher = method === "voucher";
  var online = method === "online";

  $("voucher-box").hidden = !voucher;
  $("card-box").hidden = !online;
  // Disabled fields are skipped by validation and are not submitted.
  $("voucher").disabled = !voucher;
  $("cardtype").disabled = !online;
  $("cardnumber").disabled = !online;
  if (!voucher) { setError("voucher", ""); }
  if (!online) { setError("cardnumber", ""); }
  $("payment-error").textContent = "";
}

/** Card length depends on card type (Amex = 15, others = 16). */
function updateCardLength() {
  var length = CARD_LENGTH[$("cardtype").value];
  $("cardnumber").maxLength = length;
  $("card-hint").textContent = "Use a fake test number. Digits only, exactly " + length + " digits.";
}

/** Keep the billing email in step with the email field when "Same as" is ticked. */
function syncBilling() {
  var same = $("same-email").checked;
  $("billing").readOnly = same;
  if (same) {
    $("billing").value = $("email").value;
    setError("billing", "");
  }
}

var bookingChecks = {
  fullname: function () {
    return setError("fullname", $("fullname").value.trim() ? "" : "Full name is required.");
  },
  email: function () {
    var v = $("email").value.trim();
    if (v === "") { return setError("email", "Email address is required."); }
    if (!EMAIL_PATTERN.test(v)) { return setError("email", "Enter a valid email address."); }
    return setError("email", "");
  },
  phone: function () {
    var v = $("phone").value.trim();
    if (v === "") { return setError("phone", "Phone number is required."); }
    if (!/^[0-9]+$/.test(v)) { return setError("phone", "Phone number must contain digits only."); }
    if (v.length < 10) { return setError("phone", "Phone number must have at least 10 digits."); }
    return setError("phone", "");
  },
  movie: function () {
    return setError("movie", $("movie").value ? "" : "Please select a movie.");
  },
  date: function () {
    var d = $("date").value;
    if (d === "") { return setError("date", "Please choose a screening date."); }
    if (d < todayString()) { return setError("date", "The screening date cannot be in the past."); }
    return setError("date", "");
  },
  time: function () {
    var t = $("time").value;
    if (t === "") { return setError("time", "Please choose a screening time."); }
    var d = $("date").value;
    // Combine date and time; if it is earlier than right now the session has already started.
    if (d !== "" && new Date(d + "T" + t + ":00") < new Date()) {
      return setError("time", "That session has already started. Choose a later time or date.");
    }
    return setError("time", "");
  },
  tickets: function () {
    var raw = $("tickets").value.trim();
    var n = Number(raw);
    if (raw === "" || !Number.isInteger(n)) { return setError("tickets", "Enter a whole number of tickets."); }
    if (n <= 0) { return setError("tickets", "Number of tickets must be greater than 0."); }
    if (n > 20) { return setError("tickets", "You can book at most 20 tickets at a time."); }
    return setError("tickets", "");
  },
  payment: function () {
    var chosen = document.querySelector('#booking-form input[name="payment"]:checked');
    $("payment-error").textContent = chosen ? "" : "Please choose a payment method.";
    return chosen !== null;
  },
  voucher: function () {
    if ($("voucher").disabled) { return true; }
    return setError("voucher", /^[0-9]{12}$/.test($("voucher").value.trim()) ? "" : "Voucher code must be exactly 12 digits.");
  },
  cardnumber: function () {
    if ($("cardnumber").disabled) { return true; }
    var v = $("cardnumber").value.trim();
    var length = CARD_LENGTH[$("cardtype").value];
    if (v === "") { return setError("cardnumber", "Card number is required."); }
    if (!/^[0-9]+$/.test(v)) { return setError("cardnumber", "Card number must contain digits only."); }
    if (v.length !== length) { return setError("cardnumber", "This card type needs exactly " + length + " digits."); }
    return setError("cardnumber", "");
  },
  billing: function () {
    var v = $("billing").value.trim();
    if (v === "") { return setError("billing", "Billing email address is required."); }
    if (!EMAIL_PATTERN.test(v)) { return setError("billing", "Enter a valid billing email address."); }
    return setError("billing", "");
  }
};

function initBooking() {
  var form = $("booking-form");
  if (!form) { return; }

  $("date").min = todayString();
  populateMovies();
  updateTimes();
  updateCost();
  updateCardLength();
  updatePaymentFields();

  $("movie").addEventListener("change", function () { updateTimes(); updateCost(); });
  $("tickettype").addEventListener("change", updateCost);
  $("tickets").addEventListener("input", updateCost);
  $("cardtype").addEventListener("change", updateCardLength);
  form.querySelectorAll('input[name="payment"]').forEach(function (r) {
    r.addEventListener("change", updatePaymentFields);
  });
  $("same-email").addEventListener("change", syncBilling);
  $("email").addEventListener("input", function () { if ($("same-email").checked) { syncBilling(); } });

  // Validate individual fields when the user leaves them.
  ["fullname", "email", "phone", "movie", "date", "time", "tickets", "voucher", "cardnumber", "billing"].forEach(function (name) {
    $(name).addEventListener("blur", bookingChecks[name]);
  });
  $("date").addEventListener("change", function () { bookingChecks.date(); if ($("time").value) { bookingChecks.time(); } });

  form.addEventListener("submit", function (event) {
    var errors = [];
    var firstBad = null;
    Object.keys(bookingChecks).forEach(function (name) {
      if (!bookingChecks[name]()) {
        var label = $(name + "-error");
        errors.push(label.textContent);
        if (!firstBad) { firstBad = name; }
      }
    });
    updateCost();

    var summary = $("form-summary");
    if (errors.length > 0) {
      event.preventDefault();               // block submission until every error is fixed
      summary.hidden = false;
      summary.innerHTML = "<p>Please fix the following before booking:</p><ul>" +
        errors.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
      var target = $(firstBad) || form.querySelector('input[name="' + firstBad + '"]');
      if (target) { target.focus(); }
      summary.scrollIntoView({ behavior: "smooth" });
    } else {
      summary.hidden = true;                // valid: let the browser POST the form to Mercury
    }
  });
}

/* ==========================================================================
   7. START-UP - each init function does nothing if its page elements are absent
   ========================================================================== */

initWatchlist();
initRecommend();
initRegister();
initBooking();
