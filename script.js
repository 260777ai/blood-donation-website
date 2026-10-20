/* LifeDrop - small demonstration interactions.
   Nothing is sent or stored anywhere. */

/* ---------- Eligibility checker ---------- */
(function () {
  var form = document.getElementById("eligibility-form");
  var result = document.getElementById("elig-result");
  if (!form) return;

  function show(type, title, items, note) {
    var html = '<p class="result-title">' + title + "</p>";
    if (items.length) {
      html += "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
    }
    html += "<p>" + note + "</p>";
    result.className = "result " + type;
    result.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var age = parseFloat(form.age.value);
    var weight = parseFloat(form.weight.value);
    var hb = parseFloat(form.hb.value);
    var last = form.last.value;

    if (isNaN(age) || isNaN(weight) || !last) {
      result.className = "result no";
      result.innerHTML = '<p class="result-title">Some answers are missing</p><p>Please enter your age, weight and last donation.</p>';
      return;
    }

    var reasons = [];
    var checks = [];

    if (age < 18) reasons.push("You must be at least 18 years old to donate.");
    if (age > 65) reasons.push("Donors are generally accepted up to 65 years of age.");
    if (weight < 45) reasons.push("You need to weigh at least 45 kg.");
    if (last === "recent") reasons.push("You need to wait at least 3 months between donations.");
    if (!isNaN(hb) && hb < 12.5) reasons.push("Your haemoglobin should be at least 12.5 g/dL.");

    var conditions = form.querySelectorAll('input[name="cond"]:checked');
    for (var i = 0; i < conditions.length; i++) {
      checks.push(conditions[i].value + ".");
    }

    if (reasons.length) {
      show("no", "Not eligible right now", reasons,
        "This is only an indication. You can check again when things change, and the doctor at a blood bank can advise you.");
    } else if (checks.length) {
      show("warn", "Please check with a doctor first", checks,
        "These need a doctor's opinion or a waiting period before you donate.");
    } else {
      var extra = isNaN(hb) ? [ "Your haemoglobin will be tested before donation." ] : [];
      show("ok", "You look eligible to donate", extra,
        "Great! The doctor will confirm on the day. Why not register as a volunteer donor below?");
    }
  });
})();

/* ---------- Blood group chips highlight table rows ---------- */
(function () {
  var chips = document.querySelectorAll(".chip");
  var rows = document.querySelectorAll("#group-table tbody tr");

  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", function () {
      var group = chip.getAttribute("data-group");
      var wasOn = chip.getAttribute("aria-pressed") === "true";

      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      rows.forEach(function (r) { r.classList.remove("highlight"); });

      if (!wasOn) {
        chip.setAttribute("aria-pressed", "true");
        rows.forEach(function (r) {
          if (r.getAttribute("data-group") === group) r.classList.add("highlight");
        });
      }
    });
  });
})();

/* ---------- Demo registration form ---------- */
(function () {
  var form = document.getElementById("register-form");
  var message = document.getElementById("form-message");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = form.querySelectorAll("input[type=text], input[type=number], input[type=tel], input[type=email], select");
    var firstBad = null;

    fields.forEach(function (f) {
      var bad = !f.checkValidity();
      f.classList.toggle("invalid", bad);
      if (bad && !firstBad) firstBad = f;
    });

    var consent = document.getElementById("consent");
    if (!firstBad && !consent.checked) firstBad = consent;

    if (firstBad) {
      message.className = "form-message error";
      message.textContent = "Please complete all fields correctly (donors must be 18 to 65) and tick the confirmation box.";
      firstBad.focus();
      return;
    }

    message.className = "form-message success";
    message.textContent = "Thank you! This is a demo, so your details were not sent or saved anywhere.";
    form.reset();
  });
})();