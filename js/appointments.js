// ============================================================
//  Hazara University – Appointments Logic
// ============================================================

(function () {
  'use strict';

  const logoPath = 'C:\\Users\\o\\.gemini\\antigravity-ide\\brain\\cbcb0eab-f7a8-4cef-9bff-f072715fb7ce\\hu_logo_1783967488895.png';

  // ── Appointment State ──────────────────────────────────────
  const state = {
    appointments: JSON.parse(localStorage.getItem('hu_appointments') || '[]'),
    selectedOfficial: null,
    selectedDate: null,
    selectedTime: null
  };

  function saveAppointments() {
    localStorage.setItem('hu_appointments', JSON.stringify(state.appointments));
  }

  // ── Generate Calendar (next 7 weekdays) ───────────────────
  function getUpcomingDates(n = 7) {
    const dates = [];
    const d = new Date();
    d.setDate(d.getDate() + 1); // start tomorrow
    while (dates.length < n) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(new Date(d));
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function formatDateFull(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ── Render Officials Grid ──────────────────────────────────
  function renderOfficialsGrid(container, officials) {
    container.innerHTML = officials.map(o => `
      <div class="official-card" data-filter-item data-category="${o.category}" data-id="${o.id}">
        <div class="official-card-header">
          <div class="official-avatar">${o.avatar}</div>
          <div class="official-info">
            <div class="official-name">${o.name}</div>
            <div class="official-title">${o.title}</div>
            <div class="official-dept">${o.faculty}</div>
          </div>
          <div class="badge badge-${o.availability}" style="margin-left:auto;flex-shrink:0;">
            <span class="badge-dot"></span>
            ${o.availability === 'available' ? 'Available' : o.availability === 'limited' ? 'Limited' : 'Busy'}
          </div>
        </div>
        <div class="official-card-body">
          <div class="official-detail">
            <svg class="official-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="official-detail-text">${o.room}</span>
          </div>
          <div class="official-detail">
            <svg class="official-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="official-detail-text">${o.officeHours}</span>
          </div>
          <div class="official-detail">
            <svg class="official-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="official-detail-text">${o.office}</span>
          </div>
        </div>
        <div class="official-card-footer">
          <div class="flex gap-sm" style="flex-wrap:wrap;">
            <a href="mailto:${o.email}" class="btn btn-ghost btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </a>
          </div>
          <button class="btn btn-primary btn-sm" onclick="bookAppointment('${o.id}')" ${o.availability === 'busy' ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book
          </button>
        </div>
      </div>
    `).join('');
  }

  // ── Book Appointment ───────────────────────────────────────
  window.bookAppointment = function(officialId) {
    const official = HU_DATA.officials.find(o => o.id === officialId);
    if (!official) return;
    state.selectedOfficial = official;
    state.selectedDate = null;
    state.selectedTime = null;

    // Populate modal
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    modal.querySelector('#book-official-name').textContent = official.name;
    modal.querySelector('#book-official-title').textContent = official.title + ' — ' + official.office;
    modal.querySelector('#book-official-avatar').textContent = official.avatar;

    // Dates
    const dateGrid = modal.querySelector('.date-grid');
    const dates = getUpcomingDates(9);
    dateGrid.innerHTML = dates.map((d, i) => `
      <div class="date-slot" data-date="${d.toISOString()}" onclick="selectDate(this, '${d.toISOString()}')">
        <div style="font-weight:700;font-size:0.9rem;">${d.toLocaleDateString('en-US', {day:'numeric'})}</div>
        <div style="font-size:0.68rem;color:var(--text-muted);">${d.toLocaleDateString('en-US', {weekday:'short',month:'short'})}</div>
      </div>
    `).join('');

    // Time slots
    const timeSlots = modal.querySelector('.time-slots');
    timeSlots.innerHTML = official.slots.map(t => `
      <div class="time-slot" data-time="${t}" onclick="selectTime(this, '${t}')">${t}</div>
    `).join('');

    openModal('booking-modal-overlay');
  };

  window.selectDate = function(el, iso) {
    document.querySelectorAll('.date-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    state.selectedDate = iso;
  };
  window.selectTime = function(el, time) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    state.selectedTime = time;
  };

  window.confirmBooking = function() {
    const o = state.selectedOfficial;
    if (!o) return;
    if (!state.selectedDate) { showToast('Please select a date.', 'warning'); return; }
    if (!state.selectedTime) { showToast('Please select a time slot.', 'warning'); return; }

    const nameInput = document.getElementById('book-student-name');
    const regInput  = document.getElementById('book-student-reg');
    const purposeInput = document.getElementById('book-purpose');

    if (!nameInput?.value.trim()) { showToast('Please enter your full name.', 'warning'); return; }
    if (!regInput?.value.trim())  { showToast('Please enter your registration number.', 'warning'); return; }

    const appt = {
      id: 'APT' + Date.now(),
      officialId: o.id,
      officialName: o.name,
      officialTitle: o.title,
      office: o.office,
      studentName: nameInput.value.trim(),
      regNo: regInput.value.trim(),
      purpose: purposeInput?.value.trim() || 'General Inquiry',
      date: state.selectedDate,
      time: state.selectedTime,
      status: 'Pending',
      bookedAt: new Date().toISOString()
    };

    state.appointments.unshift(appt);
    saveAppointments();

    closeModal('booking-modal-overlay');
    showBookingConfirmation(appt);

    // Reset
    if (nameInput) nameInput.value = '';
    if (regInput)  regInput.value = '';
    if (purposeInput) purposeInput.value = '';
  };

  function showBookingConfirmation(appt) {
    const confirmModal = document.getElementById('confirm-modal-overlay');
    if (!confirmModal) {
      showToast('Appointment booked successfully! 🎉', 'success');
      return;
    }
    const d = new Date(appt.date);
    confirmModal.querySelector('#confirm-id').textContent = appt.id;
    confirmModal.querySelector('#confirm-official').textContent = appt.officialName + ' — ' + appt.officialTitle;
    confirmModal.querySelector('#confirm-date').textContent = formatDateFull(d);
    confirmModal.querySelector('#confirm-time').textContent = appt.time;
    confirmModal.querySelector('#confirm-office').textContent = appt.office;
    confirmModal.querySelector('#confirm-purpose').textContent = appt.purpose;
    openModal('confirm-modal-overlay');
  }

  // ── Dashboard Appointments ─────────────────────────────────
  function renderDashboardAppointments() {
    const tbody = document.getElementById('appointments-tbody');
    if (!tbody) return;

    const appts = state.appointments;
    if (!appts.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:3rem;color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:1rem;">📅</div>
            No appointments yet. <a href="appointments.html" style="color:var(--accent);">Book your first appointment</a>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = appts.map(a => {
      const d = new Date(a.date);
      const statusColor = a.status === 'Approved' ? 'var(--status-available)' :
                          a.status === 'Rejected' ? 'var(--status-busy)' : 'var(--status-limited)';
      return `
        <tr>
          <td style="font-family:var(--font-mono);font-size:0.78rem;color:var(--accent);">${a.id}</td>
          <td>
            <div style="font-weight:600;color:var(--text-primary);">${a.officialTitle}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${a.officialName}</div>
          </td>
          <td>${a.office}</td>
          <td>${formatDate(d)}, ${a.time}</td>
          <td>${a.purpose}</td>
          <td>
            <span style="color:${statusColor};font-size:0.8rem;font-weight:700;">● ${a.status}</span>
          </td>
        </tr>
      `;
    }).join('');

    // Update stats
    const total = appts.length;
    const upcoming = appts.filter(a => new Date(a.date) > new Date()).length;
    const pending = appts.filter(a => a.status === 'Pending').length;

    const el = (id) => document.getElementById(id);
    if (el('stat-total'))   el('stat-total').textContent   = total;
    if (el('stat-upcoming'))el('stat-upcoming').textContent = upcoming;
    if (el('stat-pending')) el('stat-pending').textContent  = pending;
  }

  // ── Init ───────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.officials-grid');
    if (grid && typeof HU_DATA !== 'undefined') {
      renderOfficialsGrid(grid, HU_DATA.officials);
    }
    renderDashboardAppointments();
  });

})();
