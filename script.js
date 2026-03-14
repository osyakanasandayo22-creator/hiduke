(function () {
  'use strict';

  const STORAGE_KEY = 'date-interval-events';
  const SETTINGS_KEY = 'date-interval-settings';

  let events = [];
  let selectedId = null;
  let editingEventId = null;

  const addForm = document.getElementById('addForm');
  const addFormSubmit = document.getElementById('addFormSubmit');
  const searchEventsInput = document.getElementById('searchEvents');
  const eventNameInput = document.getElementById('eventName');
  const eventDateInput = document.getElementById('eventDate');
  const eventDescriptionInput = document.getElementById('eventDescription');
  const eventRecurrenceCheck = document.getElementById('eventRecurrence');
  const recurrenceOptions = document.getElementById('recurrenceOptions');
  const eventRecurrenceInterval = document.getElementById('eventRecurrenceInterval');
  const eventRecurrenceType = document.getElementById('eventRecurrenceType');
  const recurrenceEndDateRadio = document.getElementById('recurrenceEndDate');
  const recurrenceEndCountRadio = document.getElementById('recurrenceEndCount');
  const eventRecurrenceEndDate = document.getElementById('eventRecurrenceEndDate');
  const eventRecurrenceCount = document.getElementById('eventRecurrenceCount');
  const dateTrigger = document.getElementById('dateTrigger');
  const datePickerOverlay = document.getElementById('datePickerOverlay');
  const datePickerBackdrop = document.getElementById('datePickerBackdrop');
  const datePickerBox = document.getElementById('datePickerBox');
  const datePickerMonthYear = document.getElementById('datePickerMonthYear');
  const datePickerGrid = document.getElementById('datePickerGrid');
  const datePickerPrev = document.getElementById('datePickerPrev');
  const datePickerNext = document.getElementById('datePickerNext');
  const datePickerClose = document.getElementById('datePickerClose');
  const eventList = document.getElementById('eventList');
  const emptyState = document.getElementById('emptyState');
  const intervalSection = document.getElementById('intervalSection');
  const intervalBackdrop = document.getElementById('intervalBackdrop');
  const intervalTitle = document.getElementById('intervalTitle');
  const intervalReference = document.getElementById('intervalReference');
  const intervalTimeline = document.getElementById('intervalTimeline');
  const intervalList = document.getElementById('intervalList');
  const closeIntervalBtn = document.getElementById('closeInterval');
  const autoDeletePastCheck = document.getElementById('autoDeletePast');
  const displayPeriodSelect = document.getElementById('displayPeriod');
  const optionRange = document.getElementById('optionRange');
  const rangeStartInput = document.getElementById('rangeStart');
  const rangeEndInput = document.getElementById('rangeEnd');
  const intervalDisplayWeek = document.getElementById('intervalDisplayWeek');
  const intervalDisplayDays = document.getElementById('intervalDisplayDays');
  const tabAdd = document.getElementById('tabAdd');
  const tabRange = document.getElementById('tabRange');
  const tabCalendar = document.getElementById('tabCalendar');
  const panelAdd = document.getElementById('panelAdd');
  const panelRange = document.getElementById('panelRange');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerBackBtn = document.getElementById('drawerBackBtn');
  const drawerTitle = document.getElementById('drawerTitle');
  const calendarOverlay = document.getElementById('calendarOverlay');
  const calendarBackdrop = document.getElementById('calendarBackdrop');
  const calendarBox = document.getElementById('calendarBox');
  const calendarMonthYear = document.getElementById('calendarMonthYear');
  const calendarGrid = document.getElementById('calendarGrid');
  const calendarPrev = document.getElementById('calendarPrev');
  const calendarNext = document.getElementById('calendarNext');
  const closeCalendar = document.getElementById('closeCalendar');
  const deleteConfirmOverlay = document.getElementById('deleteConfirmOverlay');
  const deleteConfirmBackdrop = document.getElementById('deleteConfirmBackdrop');
  const deleteConfirmCancel = document.getElementById('deleteConfirmCancel');
  const deleteConfirmOk = document.getElementById('deleteConfirmOk');
  const graphTooltip = document.getElementById('graphTooltip');

  let pendingDeleteId = null;
  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth();

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
  let pickerCurrentYear = new Date().getFullYear();
  let pickerCurrentMonth = new Date().getMonth();

  // 国民の祝日・休日（年ごとの日付）
  const HOLIDAYS = {
    2025: [[1, 1, '元日'], [1, 13, '成人の日'], [2, 11, '建国記念の日'], [2, 23, '天皇誕生日'], [3, 20, '春分の日'], [4, 29, '昭和の日'], [5, 3, '憲法記念日'], [5, 4, 'みどりの日'], [5, 5, 'こどもの日'], [7, 21, '海の日'], [8, 11, '山の日'], [9, 15, '敬老の日'], [9, 23, '秋分の日'], [10, 13, 'スポーツの日'], [11, 3, '文化の日'], [11, 23, '勤労感謝の日']],
    2026: [[1, 1, '元日'], [1, 12, '成人の日'], [2, 11, '建国記念の日'], [2, 23, '天皇誕生日'], [3, 20, '春分の日'], [4, 29, '昭和の日'], [5, 3, '憲法記念日'], [5, 4, 'みどりの日'], [5, 5, 'こどもの日'], [5, 6, '休日'], [7, 20, '海の日'], [8, 11, '山の日'], [9, 21, '敬老の日'], [9, 22, '休日'], [9, 23, '秋分の日'], [10, 12, 'スポーツの日'], [11, 3, '文化の日'], [11, 23, '勤労感謝の日']],
    2027: [[1, 1, '元日'], [1, 11, '成人の日'], [2, 11, '建国記念の日'], [2, 23, '天皇誕生日'], [3, 21, '春分の日'], [3, 22, '休日'], [4, 29, '昭和の日'], [5, 3, '憲法記念日'], [5, 4, 'みどりの日'], [5, 5, 'こどもの日'], [7, 19, '海の日'], [8, 11, '山の日'], [9, 20, '敬老の日'], [9, 23, '秋分の日'], [10, 11, 'スポーツの日'], [11, 3, '文化の日'], [11, 23, '勤労感謝の日']],
    2028: [[1, 1, '元日'], [1, 10, '成人の日'], [2, 11, '建国記念の日'], [2, 23, '天皇誕生日'], [3, 20, '春分の日'], [4, 29, '昭和の日'], [5, 3, '憲法記念日'], [5, 4, 'みどりの日'], [5, 5, 'こどもの日'], [7, 17, '海の日'], [8, 11, '山の日'], [9, 18, '敬老の日'], [9, 23, '秋分の日'], [10, 9, 'スポーツの日'], [11, 3, '文化の日'], [11, 23, '勤労感謝の日']]
  };

  function getHoliday(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const list = HOLIDAYS[y];
    if (!list) return '';
    for (let i = 0; i < list.length; i++) {
      if (list[i][0] === m && list[i][1] === d) return list[i][2];
    }
    return '';
  }

  function loadEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) events = JSON.parse(raw);
      else events = [];
      events = events.map(function (e) {
        return { id: e.id, name: e.name, date: e.date, important: !!e.important, description: e.description || '' };
      });
    } catch (_) {
      events = [];
    }
  }

  function saveEvents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        autoDeletePastCheck.checked = !!s.autoDeletePast;
        displayPeriodSelect.value = s.displayPeriod || 'month';
        if (s.rangeStart) rangeStartInput.value = s.rangeStart;
        if (s.rangeEnd) rangeEndInput.value = s.rangeEnd;
        var intervalMode = s.intervalDisplayMode || 'week';
        if (intervalDisplayWeek) intervalDisplayWeek.checked = (intervalMode === 'week');
        if (intervalDisplayDays) intervalDisplayDays.checked = (intervalMode === 'days');
      } else {
        displayPeriodSelect.value = 'month';
      }
    } catch (_) {}
    toggleRangeVisibility();
  }

  function saveSettings() {
    var intervalMode = (intervalDisplayDays && intervalDisplayDays.checked) ? 'days' : 'week';
    var s = {
      autoDeletePast: autoDeletePastCheck.checked,
      displayPeriod: displayPeriodSelect.value,
      rangeStart: rangeStartInput.value || '',
      rangeEnd: rangeEndInput.value || '',
      intervalDisplayMode: intervalMode
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  function applyAutoDeletePast() {
    if (!autoDeletePastCheck.checked) return;
    var today = getTodayDateStr();
    var before = events.length;
    events = events.filter(function (e) { return e.date >= today; });
    if (events.length !== before) saveEvents();
  }

  function getPeriodRange() {
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var start = '';
    var end = '';
    var period = displayPeriodSelect.value;
    if (period === 'week') {
      var dayOfWeek = t.getDay();
      var monOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      var mon = new Date(t);
      mon.setDate(d + monOffset);
      var sun = new Date(mon);
      sun.setDate(sun.getDate() + 6);
      start = formatDateStr(mon);
      end = formatDateStr(sun);
    } else if (period === 'month') {
      start = y + '-' + String(m + 1).padStart(2, '0') + '-01';
      var lastDay = new Date(y, m + 1, 0).getDate();
      end = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(lastDay).padStart(2, '0');
    } else if (period === 'year') {
      start = y + '-01-01';
      end = y + '-12-31';
    } else if (period === 'range' && rangeStartInput.value && rangeEndInput.value) {
      start = rangeStartInput.value;
      end = rangeEndInput.value;
      if (start > end) { var tmp = start; start = end; end = tmp; }
    } else {
      return null;
    }
    return { start: start, end: end };
  }

  function formatDateStr(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getDisplayEvents() {
    var range = getPeriodRange();
    var list = !range ? events.slice() : events.filter(function (e) {
      return e.date >= range.start && e.date <= range.end;
    });
    list.sort(function (a, b) { return a.date.localeCompare(b.date); });
    return list;
  }

  function toggleRangeVisibility() {
    optionRange.setAttribute('aria-hidden', displayPeriodSelect.value !== 'range');
  }

  function toggleRecurrenceOptionsVisibility() {
    const wrap = document.querySelector('.form-recurrence-wrap');
    if (!wrap) return;
    if (editingEventId) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';
    const open = eventRecurrenceCheck && eventRecurrenceCheck.checked;
    if (recurrenceOptions) recurrenceOptions.setAttribute('aria-hidden', !open);
  }

  /** 繰り返し開始日から終了条件に応じた日付の配列を返す（最大365件）。interval=間隔（1=毎日/毎週、2=2日ごと/2週間ごと…） */
  function getRecurringDates(startDateStr, type, endDateStr, maxCount) {
    const result = [];
    const start = new Date(startDateStr + 'T12:00:00');
    const limit = 365;
    const interval = (eventRecurrenceInterval && parseInt(eventRecurrenceInterval.value, 10)) || 1;
    const safeInterval = Math.max(1, Math.min(99, interval));
    let current = new Date(start.getTime());
    const addDay = function () { current.setDate(current.getDate() + safeInterval); };
    const addWeek = function () { current.setDate(current.getDate() + safeInterval * 7); };
    const addMonth = function () {
      const day = current.getDate();
      current.setDate(1);
      current.setMonth(current.getMonth() + safeInterval);
      const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
      current.setDate(Math.min(day, lastDay));
    };
    const addYear = function () { current.setFullYear(current.getFullYear() + safeInterval); };
    const add = type === 'daily' ? addDay : type === 'weekly' ? addWeek : type === 'monthly' ? addMonth : addYear;

    const toStr = function (d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    };

    const useEndDate = endDateStr && recurrenceEndDateRadio && recurrenceEndDateRadio.checked;
    const endDate = useEndDate ? new Date(endDateStr + 'T12:00:00') : null;
    const count = (!useEndDate && eventRecurrenceCount) ? Math.min(parseInt(eventRecurrenceCount.value, 10) || 10, limit) : limit;

    result.push(toStr(current));
    while (result.length < limit) {
      add();
      if (useEndDate && endDate && current > endDate) break;
      if (!useEndDate && result.length >= count) break;
      result.push(toStr(current));
    }
    return result;
  }

  function getEventsOnDate(dateStr) {
    return events.filter(function (e) { return e.date === dateStr; });
  }

  function addEvent(name, dateStr, description) {
    const id = 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    events.push({ id, name: name.trim(), date: dateStr, important: false, description: (description || '').trim() });
    saveEvents();
    renderList();
  }

  function updateEvent(id, name, dateStr, description) {
    var ev = events.find(function (e) { return e.id === id; });
    if (!ev) return;
    ev.name = name.trim();
    ev.date = dateStr;
    ev.description = (description || '').trim();
    saveEvents();
    renderList();
  }

  function openEditForm(ev) {
    editingEventId = ev.id;
    eventNameInput.value = ev.name;
    eventDateInput.value = ev.date;
    if (eventDescriptionInput) eventDescriptionInput.value = ev.description || '';
    if (eventRecurrenceCheck) eventRecurrenceCheck.checked = false;
    if (recurrenceOptions) recurrenceOptions.setAttribute('aria-hidden', 'true');
    updateDateTriggerLabel();
    if (addFormSubmit) addFormSubmit.textContent = '保存';
    toggleRecurrenceOptionsVisibility();
    openDrawer(panelAdd, '予定を編集');
  }

  function resetAddForm() {
    editingEventId = null;
    eventNameInput.value = '';
    eventDateInput.value = '';
    if (eventDescriptionInput) eventDescriptionInput.value = '';
    if (eventRecurrenceCheck) eventRecurrenceCheck.checked = false;
    if (recurrenceOptions) recurrenceOptions.setAttribute('aria-hidden', 'true');
    if (eventRecurrenceInterval) eventRecurrenceInterval.value = '1';
    if (eventRecurrenceType) eventRecurrenceType.value = 'weekly';
    if (recurrenceEndDateRadio) recurrenceEndDateRadio.checked = true;
    if (eventRecurrenceEndDate) eventRecurrenceEndDate.value = '';
    if (eventRecurrenceCount) eventRecurrenceCount.value = '10';
    if (addFormSubmit) addFormSubmit.textContent = '追加';
    updateDateTriggerLabel();
    toggleRecurrenceOptionsVisibility();
  }

  function toggleEventImportant(id) {
    var ev = events.find(function (e) { return e.id === id; });
    if (!ev) return;
    ev.important = !ev.important;
    saveEvents();
    renderList();
    if (calendarGrid && calendarOverlay && calendarOverlay.getAttribute('aria-hidden') !== 'true') {
      buildCalendarView();
    }
  }

  function removeEvent(id) {
    events = events.filter(function (e) { return e.id !== id; });
    if (selectedId === id) {
      selectedId = 'today';
      renderHomeInterval();
    }
    saveEvents();
    renderList();
  }

  function showDeleteConfirm(eventId) {
    pendingDeleteId = eventId;
    deleteConfirmOverlay.removeAttribute('aria-hidden');
  }

  function hideDeleteConfirm() {
    pendingDeleteId = null;
    deleteConfirmOverlay.setAttribute('aria-hidden', 'true');
  }

  function getDiffInDays(dateStrA, dateStrB) {
    const a = new Date(dateStrA);
    const b = new Date(dateStrB);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / (24 * 60 * 60 * 1000));
  }

  function getIntervalDisplayMode() {
    return (intervalDisplayDays && intervalDisplayDays.checked) ? 'days' : 'week';
  }

  function formatInterval(days, displayMode) {
    if (days === 0) return { text: '同じ日', weeks: 0, days: 0, isPast: false, totalDays: 0 };
    const isPast = days < 0;
    const abs = Math.abs(days);
    const weeks = Math.floor(abs / 7);
    const d = abs % 7;
    const mode = displayMode || getIntervalDisplayMode();
    let text = '';
    if (mode === 'days') {
      text = abs + '日';
    } else {
      if (weeks > 0 && d > 0) text = weeks + '週間' + d + '日';
      else if (weeks > 0) text = weeks + '週間';
      else text = d + '日';
    }
    text += isPast ? '前' : '後';
    return { text, weeks, days: d, isPast, totalDays: abs };
  }

  function formatDateDisplay(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return m + '月' + day + '日';
  }

  function getWeekdayIndex(dateStr) {
    return new Date(dateStr + 'T12:00:00').getDay();
  }

  function formatDateWithWeekday(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const w = getWeekdayIndex(dateStr);
    const wday = WEEKDAYS[w];
    const holiday = getHoliday(dateStr);
    const wclass = w === 0 ? 'weekday-sun' : w === 6 ? 'weekday-sat' : holiday ? 'weekday-holiday' : '';
    let s = formatDateDisplay(dateStr) + '(' + (wclass ? '<span class="' + wclass + '">' + wday + '</span>' : wday) + ')';
    if (holiday) s += ' <span class="weekday-holiday">' + escapeHtml(holiday) + '</span>';
    return s;
  }

  function updateDateTriggerLabel() {
    const v = eventDateInput.value;
    dateTrigger.textContent = v ? formatDateWithWeekday(v).replace(/<[^>]+>/g, '') : '日付を選択';
  }

  function getTodayDateStr() {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function openDatePicker() {
    const v = eventDateInput.value;
    if (v) {
      const [y, m] = v.split('-').map(Number);
      pickerCurrentYear = y;
      pickerCurrentMonth = m - 1;
    } else {
      const t = new Date();
      pickerCurrentYear = t.getFullYear();
      pickerCurrentMonth = t.getMonth();
    }
    datePickerOverlay.setAttribute('aria-hidden', 'false');
    dateTrigger.setAttribute('aria-expanded', 'true');
    buildCalendar();
  }

  function closeDatePicker() {
    datePickerOverlay.setAttribute('aria-hidden', 'true');
    dateTrigger.setAttribute('aria-expanded', 'false');
  }

  const CALENDAR_WEEKS = 6;
  const CALENDAR_CELLS = CALENDAR_WEEKS * 7;

  function buildCalendarView() {
    if (!calendarMonthYear || !calendarGrid) return;
    calendarMonthYear.textContent = calendarYear + '年' + (calendarMonth + 1) + '月';
    const first = new Date(calendarYear, calendarMonth, 1);
    const last = new Date(calendarYear, calendarMonth + 1, 0);
    const startOffset = first.getDay();
    const daysInMonth = last.getDate();
    const todayStr = getTodayDateStr();

    calendarGrid.innerHTML = '';
    for (let i = 0; i < startOffset; i++) {
      const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      const prevLast = new Date(prevYear, prevMonth + 1, 0);
      const d = prevLast.getDate() - startOffset + i + 1;
      const dateStr = prevYear + '-' + String(prevMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const w = new Date(prevYear, prevMonth, d).getDay();
      const cellEvents = getEventsOnDate(dateStr);
      const cell = document.createElement('div');
      cell.className = 'calendar-cell other-month' + (w === 0 ? ' sunday' : w === 6 ? ' saturday' : '') + (cellEvents.length ? ' has-events' : '');
      cell.innerHTML = '<span class="calendar-cell-day">' + d + '</span>' + (cellEvents.length ? '<div class="calendar-cell-events">' + cellEvents.slice(0, 2).map(function (ev) { return '<span class="calendar-cell-event' + (ev.important ? ' important' : '') + '" title="' + escapeHtml(ev.name) + (ev.description ? '\n' + escapeHtml(ev.description) : '') + (ev.important ? ' ★重要' : '') + '">' + (ev.important ? '★ ' : '') + escapeHtml(ev.name) + '</span>'; }).join('') + (cellEvents.length > 2 ? '<span class="calendar-cell-event">…</span>' : '') + '</div>' : '');
      if (cellEvents.length) {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', function () { selectEvent(cellEvents[0].id); closeCalendarOverlay(); });
      }
      calendarGrid.appendChild(cell);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = calendarYear + '-' + String(calendarMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const w = new Date(calendarYear, calendarMonth, d).getDay();
      const cellEvents = getEventsOnDate(dateStr);
      const isToday = dateStr === todayStr;
      const cell = document.createElement('div');
      cell.className = 'calendar-cell' + (w === 0 ? ' sunday' : w === 6 ? ' saturday' : '') + (isToday ? ' today' : '') + (cellEvents.length ? ' has-events' : '');
      cell.setAttribute('data-date', dateStr);
      cell.innerHTML = '<span class="calendar-cell-day">' + d + '</span>' + (cellEvents.length ? '<div class="calendar-cell-events">' + cellEvents.slice(0, 2).map(function (ev) { return '<span class="calendar-cell-event' + (ev.important ? ' important' : '') + '" title="' + escapeHtml(ev.name) + (ev.description ? '\n' + escapeHtml(ev.description) : '') + (ev.important ? ' ★重要' : '') + '">' + (ev.important ? '★ ' : '') + escapeHtml(ev.name) + '</span>'; }).join('') + (cellEvents.length > 2 ? '<span class="calendar-cell-event">…</span>' : '') + '</div>' : '');
      if (cellEvents.length) {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', function () { selectEvent(cellEvents[0].id); closeCalendarOverlay(); });
      }
      calendarGrid.appendChild(cell);
    }
    const totalFilled = startOffset + daysInMonth;
    for (let i = totalFilled; i < CALENDAR_CELLS; i++) {
      const nextD = i - totalFilled + 1;
      const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      const dateStr = nextYear + '-' + String(nextMonth + 1).padStart(2, '0') + '-' + String(nextD).padStart(2, '0');
      const w = new Date(nextYear, nextMonth, nextD).getDay();
      const cellEvents = getEventsOnDate(dateStr);
      const cell = document.createElement('div');
      cell.className = 'calendar-cell other-month' + (w === 0 ? ' sunday' : w === 6 ? ' saturday' : '') + (cellEvents.length ? ' has-events' : '');
      cell.innerHTML = '<span class="calendar-cell-day">' + nextD + '</span>' + (cellEvents.length ? '<div class="calendar-cell-events">' + cellEvents.slice(0, 2).map(function (ev) { return '<span class="calendar-cell-event' + (ev.important ? ' important' : '') + '" title="' + escapeHtml(ev.name) + (ev.description ? '\n' + escapeHtml(ev.description) : '') + (ev.important ? ' ★重要' : '') + '">' + (ev.important ? '★ ' : '') + escapeHtml(ev.name) + '</span>'; }).join('') + (cellEvents.length > 2 ? '<span class="calendar-cell-event">…</span>' : '') + '</div>' : '');
      if (cellEvents.length) {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', function () { selectEvent(cellEvents[0].id); closeCalendarOverlay(); });
      }
      calendarGrid.appendChild(cell);
    }
  }

  function openCalendarOverlay() {
    calendarYear = new Date().getFullYear();
    calendarMonth = new Date().getMonth();
    buildCalendarView();
    if (calendarOverlay) {
      calendarOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCalendarOverlay() {
    if (calendarOverlay) {
      calendarOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function buildCalendar() {
    datePickerMonthYear.textContent = pickerCurrentYear + '年' + (pickerCurrentMonth + 1) + '月';
    const first = new Date(pickerCurrentYear, pickerCurrentMonth, 1);
    const last = new Date(pickerCurrentYear, pickerCurrentMonth + 1, 0);
    const startOffset = first.getDay();
    const daysInMonth = last.getDate();
    const selectedVal = eventDateInput.value;

    datePickerGrid.innerHTML = '';
    for (let i = 0; i < startOffset; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'date-picker-cell empty';
      cell.appendChild(document.createTextNode(''));
      datePickerGrid.appendChild(cell);
    }
    const todayStr = getTodayDateStr();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = pickerCurrentYear + '-' + String(pickerCurrentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const w = new Date(pickerCurrentYear, pickerCurrentMonth, d).getDay();
      const holiday = getHoliday(dateStr);
      const isHoliday = !!holiday;
      const isToday = dateStr === todayStr;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'date-picker-cell' +
        (w === 0 ? ' sunday' : w === 6 ? ' saturday' : '') +
        (isHoliday ? ' holiday' : '') +
        (isToday ? ' today' : '') +
        (dateStr === selectedVal ? ' selected' : '');
      cell.setAttribute('data-date', dateStr);
      if (holiday) cell.setAttribute('title', holiday);
      if (isToday) cell.setAttribute('title', (cell.getAttribute('title') ? cell.getAttribute('title') + ' ' : '') + '今日');
      cell.innerHTML = '<span class="date-picker-day">' + d + '</span>' +
        (isToday ? '<span class="date-picker-today-label">今日</span>' : '') +
        (holiday ? '<span class="date-picker-holiday-name">' + escapeHtml(holiday) + '</span>' : '');
      cell.addEventListener('click', function () {
        eventDateInput.value = dateStr;
        updateDateTriggerLabel();
        closeDatePicker();
      });
      datePickerGrid.appendChild(cell);
    }
    const totalFilled = startOffset + daysInMonth;
    for (let i = totalFilled; i < CALENDAR_CELLS; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'date-picker-cell empty';
      cell.appendChild(document.createTextNode(''));
      datePickerGrid.appendChild(cell);
    }
  }

  function renderList() {
    var displayEvents = getDisplayEvents();
    var refId = selectedId || 'today';
    var ref = refId === 'today'
      ? { id: 'today', name: '今日', date: getTodayDateStr() }
      : events.find(function (e) { return e.id === refId; });
    if (!ref) {
      refId = 'today';
      ref = { id: 'today', name: '今日', date: getTodayDateStr() };
    }
    var todayStr = getTodayDateStr();
    var others = refId === 'today'
      ? displayEvents.slice()
      : [{ id: 'today', name: '今日', date: todayStr }].concat(displayEvents.filter(function (e) { return e.id !== refId; }));
    others.sort(function (a, b) { return a.date.localeCompare(b.date); });

    var searchQuery = (searchEventsInput && searchEventsInput.value.trim()) ? searchEventsInput.value.trim().toLowerCase() : '';
    if (searchQuery) {
      others = others.filter(function (item) {
        if (item.id === 'today') return true;
        return (item.name && item.name.toLowerCase().indexOf(searchQuery) !== -1) ||
          (item.description && item.description.toLowerCase().indexOf(searchQuery) !== -1);
      });
    }

    eventList.innerHTML = '';

    var refW = getWeekdayIndex(ref.date);
    var refHoliday = getHoliday(ref.date);
    var refWdayClass = refHoliday ? ' event-item-holiday' : (refW === 0 ? ' event-item-sun' : refW === 6 ? ' event-item-sat' : '');
    var refLi = document.createElement('li');
    refLi.className = 'event-item event-item-ref' + refWdayClass;
    refLi.setAttribute('data-id', ref.id);
    if (ref.id === 'today') {
      refLi.innerHTML =
        '<span class="event-badge-ref">基準</span>' +
        '<span class="event-name">今日</span>' +
        '<span class="event-date">' + formatDateWithWeekday(ref.date) + '</span>';
      refLi.style.cursor = 'pointer';
      refLi.addEventListener('click', function () { openIntervalOverlay(ref); });
    } else {
      refLi.innerHTML =
        '<span class="event-badge-ref">基準</span>' +
        '<span class="event-name">' + escapeHtml(ref.name) + '</span>' +
        '<div class="event-item-row2">' +
        '<span class="event-date">' + formatDateWithWeekday(ref.date) + '</span>' +
        '<button type="button" class="event-important-btn" aria-label="' + (ref.important ? '重要（クリックで解除）' : '重要にする') + '">' + (ref.important ? '★' : '☆') + '</button>' +
        '<button type="button" class="event-edit-btn" aria-label="編集">✎</button>' +
        '<button type="button" class="event-delete" aria-label="削除">×</button>' +
        '</div>' +
        (ref.description ? '<span class="event-description">' + escapeHtml(ref.description) + '</span>' : '');
      refLi.querySelector('.event-important-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        toggleEventImportant(ref.id);
      });
      refLi.querySelector('.event-edit-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        openEditForm(ref);
      });
      refLi.querySelector('.event-delete').addEventListener('click', function (e) {
        e.stopPropagation();
        showDeleteConfirm(ref.id);
      });
      refLi.addEventListener('click', function (e) {
        if (e.target.classList.contains('event-delete') || e.target.classList.contains('event-important-btn') || e.target.classList.contains('event-edit-btn')) return;
        openIntervalOverlay(ref);
      });
    }
    eventList.appendChild(refLi);

    if (others.length > 0) {
      var dates = [{ id: ref.id, date: ref.date, name: ref.name, isRef: true }];
      others.forEach(function (item) { dates.push({ id: item.id, date: item.date, name: item.name, isRef: false }); });
      dates.sort(function (a, b) { return a.date.localeCompare(b.date); });
      var minT = new Date(dates[0].date + 'T12:00:00').getTime();
      var maxT = new Date(dates[dates.length - 1].date + 'T12:00:00').getTime();
      var refT = new Date(ref.date + 'T12:00:00').getTime();
      var range = maxT - minT || 1;
      var refPosPercent = range > 0 ? ((refT - minT) / range) * 100 : 50;

      var trackWrap = document.createElement('div');
      trackWrap.className = 'interval-graph-track-wrap';
      var track = document.createElement('div');
      track.className = 'interval-graph-track';
      var zonePast = document.createElement('div');
      zonePast.className = 'interval-graph-zone interval-graph-past';
      zonePast.style.width = refPosPercent + '%';
      zonePast.setAttribute('aria-hidden', 'true');
      var zoneFuture = document.createElement('div');
      zoneFuture.className = 'interval-graph-zone interval-graph-future';
      zoneFuture.style.left = refPosPercent + '%';
      zoneFuture.style.width = (100 - refPosPercent) + '%';
      zoneFuture.setAttribute('aria-hidden', 'true');
      var refLine = document.createElement('div');
      refLine.className = 'interval-graph-ref-line';
      refLine.style.left = refPosPercent + '%';
      refLine.innerHTML = '<span class="interval-graph-ref-label">基準</span>';
      track.appendChild(zonePast);
      track.appendChild(refLine);
      track.appendChild(zoneFuture);

      var posGroups = {};
      dates.forEach(function (d) {
        var t = new Date(d.date + 'T12:00:00').getTime();
        var p = range > 0 ? ((t - minT) / range) * 100 : 50;
        var key = p.toFixed(4);
        if (!posGroups[key]) posGroups[key] = { pos: p, items: [] };
        posGroups[key].items.push(d);
      });
      var groups = Object.keys(posGroups).map(function (k) {
        var g = posGroups[k];
        var first = g.items[0];
        return { pos: g.pos, items: g.items, isRef: first.isRef, days: getDiffInDays(ref.date, first.date), isPast: first.date < ref.date };
      });
      groups.forEach(function (grp) {
        var markerWrap = document.createElement('div');
        markerWrap.className = 'interval-graph-marker-wrap' + (grp.isRef ? ' is-ref-wrap' : '');
        markerWrap.style.left = grp.pos + '%';
        var marker = document.createElement('span');
        marker.className = 'interval-graph-marker' + (grp.isRef ? ' is-ref' : (grp.isPast ? ' is-past' : ' is-future'));
        var label = document.createElement('span');
        label.className = 'interval-graph-marker-label';
        if (grp.isRef) {
          label.textContent = '0';
          marker.title = (ref.id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
        } else {
          label.textContent = (grp.days > 0 ? '+' : '') + grp.days;
          marker.title = grp.items.length > 1
            ? grp.items.map(function (it) { return it.id === 'today' ? '今日' : it.name; }).join('、') + ' ' + formatDateDisplay(grp.items[0].date)
            : (grp.items[0].id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
        }
        markerWrap.appendChild(marker);
        markerWrap.appendChild(label);
        var tipText = grp.items.length > 1
          ? grp.items.map(function (it) { return (it.id === 'today' ? '今日' : it.name) + ' ' + formatDateDisplay(it.date); }).join(' / ')
          : (grp.items[0].id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
        markerWrap.addEventListener('click', function (e) {
          e.stopPropagation();
          showGraphTooltip(markerWrap, tipText);
        });
        track.appendChild(markerWrap);
      });

      var axis = document.createElement('div');
      axis.className = 'interval-graph-axis';
      axis.innerHTML =
        '<span class="interval-graph-axis-start">' + formatDateWithWeekday(dates[0].date) + '</span>' +
        '<span class="interval-graph-axis-ref">基準 ' + formatDateDisplay(ref.date) + '</span>' +
        '<span class="interval-graph-axis-end">' + formatDateWithWeekday(dates[dates.length - 1].date) + '</span>';
      trackWrap.appendChild(track);
      trackWrap.appendChild(axis);

      var timelineWrap = document.createElement('li');
      timelineWrap.className = 'home-timeline-row';
      timelineWrap.appendChild(trackWrap);
      eventList.appendChild(timelineWrap);
    }

    others.forEach(function (item) {
      var w = getWeekdayIndex(item.date);
      var holiday = getHoliday(item.date);
      var wdayClass = holiday ? ' event-item-holiday' : (w === 0 ? ' event-item-sun' : w === 6 ? ' event-item-sat' : '');
      var days = getDiffInDays(ref.date, item.date);
      var info = formatInterval(days);
      var intervalText = info.text;
      var li = document.createElement('li');
      li.className = 'event-item' + wdayClass + (item.important ? ' is-important' : '');
      li.setAttribute('data-id', item.id);
      if (item.id === 'today') {
        li.innerHTML =
          '<span class="event-interval ' + (info.isPast ? 'interval-past' : 'interval-future') + '">' + escapeHtml(intervalText) + '</span>' +
          '<span class="event-name">今日</span>' +
          '<span class="event-date">' + formatDateWithWeekday(item.date) + '</span>';
      } else {
        li.innerHTML =
          '<span class="event-interval ' + (info.isPast ? 'interval-past' : 'interval-future') + '">' + escapeHtml(intervalText) + '</span>' +
          '<span class="event-name">' + escapeHtml(item.name) + '</span>' +
          '<div class="event-item-row2">' +
          '<span class="event-date">' + formatDateWithWeekday(item.date) + '</span>' +
          '<button type="button" class="event-important-btn" aria-label="' + (item.important ? '重要（クリックで解除）' : '重要にする') + '">' + (item.important ? '★' : '☆') + '</button>' +
          '<button type="button" class="event-edit-btn" aria-label="編集">✎</button>' +
          '<button type="button" class="event-delete" aria-label="削除">×</button>' +
          '</div>' +
          (item.description ? '<span class="event-description">' + escapeHtml(item.description) + '</span>' : '');
        li.querySelector('.event-important-btn').addEventListener('click', function (e) {
          e.stopPropagation();
          toggleEventImportant(item.id);
        });
        li.querySelector('.event-edit-btn').addEventListener('click', function (e) {
          e.stopPropagation();
          openEditForm(item);
        });
        li.querySelector('.event-delete').addEventListener('click', function (e) {
          e.stopPropagation();
          showDeleteConfirm(item.id);
        });
      }
      li.addEventListener('click', function (e) {
        if (e.target.classList.contains('event-delete') || e.target.classList.contains('event-important-btn') || e.target.classList.contains('event-edit-btn')) return;
        selectEvent(item.id);
      });
      eventList.appendChild(li);
    });

    if (searchQuery && others.length === 0) {
      var noMatchLi = document.createElement('li');
      noMatchLi.className = 'event-list-no-match';
      noMatchLi.textContent = '検索に一致する予定がありません';
      eventList.appendChild(noMatchLi);
    }

    if (displayEvents.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function showGraphTooltip(wrap, text) {
    if (!graphTooltip) return;
    graphTooltip.textContent = text;
    graphTooltip.setAttribute('aria-hidden', 'false');
    graphTooltip.classList.add('is-visible');
    var rect = wrap.getBoundingClientRect();
    requestAnimationFrame(function () {
      var tipRect = graphTooltip.getBoundingClientRect();
      var left = rect.left + (rect.width / 2) - (tipRect.width / 2);
      var top = rect.top - tipRect.height - 8;
      if (top < 8) top = rect.bottom + 8;
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
      graphTooltip.style.left = left + 'px';
      graphTooltip.style.top = top + 'px';
    });
  }

  function hideGraphTooltip() {
    if (!graphTooltip) return;
    graphTooltip.setAttribute('aria-hidden', 'true');
    graphTooltip.classList.remove('is-visible');
  }

  function selectEvent(id) {
    selectedId = id;
    renderList();
  }

  /** 基準予定の詳細と日付間隔をオーバーレイに表示して開く */
  function openIntervalOverlay(ref) {
    if (!intervalSection || !intervalReference || !intervalList || !intervalTimeline) return;
    var displayEvents = getDisplayEvents();
    var todayStr = getTodayDateStr();
    var others = ref.id === 'today'
      ? displayEvents.slice()
      : [{ id: 'today', name: '今日', date: todayStr }].concat(displayEvents.filter(function (e) { return e.id !== ref.id; }));
    others.sort(function (a, b) { return a.date.localeCompare(b.date); });

    intervalTitle.textContent = ref.id === 'today' ? '基準予定の詳細（今日）' : '基準予定の詳細：' + escapeHtml(ref.name);

    var refDetailHtml = '<p class="interval-detail-heading">予定の詳細</p>';
    refDetailHtml += '<p class="interval-ref-name">' + (ref.id === 'today' ? '今日' : escapeHtml(ref.name)) + '</p>';
    refDetailHtml += '<p class="interval-ref-date">' + formatDateWithWeekday(ref.date) + '</p>';
    if (ref.description && ref.description.trim()) {
      refDetailHtml += '<p class="interval-ref-description">' + escapeHtml(ref.description.trim()) + '</p>';
    }
    intervalReference.innerHTML = refDetailHtml;

    var dates = [{ id: ref.id, date: ref.date, name: ref.name, isRef: true }];
    others.forEach(function (item) { dates.push({ id: item.id, date: item.date, name: item.name, isRef: false }); });
    dates.sort(function (a, b) { return a.date.localeCompare(b.date); });
    var minT = new Date(dates[0].date + 'T12:00:00').getTime();
    var maxT = new Date(dates[dates.length - 1].date + 'T12:00:00').getTime();
    var refT = new Date(ref.date + 'T12:00:00').getTime();
    var range = maxT - minT || 1;
    var refPosPercent = range > 0 ? ((refT - minT) / range) * 100 : 50;
    var pastCount = others.filter(function (o) { return o.date < ref.date; }).length;
    var futureCount = others.filter(function (o) { return o.date > ref.date; }).length;
    var sameCount = others.filter(function (o) { return o.date === ref.date; }).length;

    intervalTimeline.innerHTML = '';
    var graphHeading = document.createElement('h3');
    graphHeading.className = 'interval-graph-heading';
    graphHeading.textContent = '日付間隔のグラフ';
    intervalTimeline.appendChild(graphHeading);
    var graphWrap = document.createElement('div');
    graphWrap.className = 'interval-graph-wrap';
    var summary = document.createElement('p');
    summary.className = 'interval-graph-summary';
    if (others.length === 0) {
      summary.textContent = '他に表示する予定がありません';
    } else {
      var parts = [];
      if (pastCount > 0) parts.push('過去 ' + pastCount + ' 件');
      if (sameCount > 0) parts.push('同日 ' + sameCount + ' 件');
      if (futureCount > 0) parts.push('未来 ' + futureCount + ' 件');
      summary.textContent = '基準からの内訳：' + parts.join(' ・ ');
    }
    graphWrap.appendChild(summary);

    var trackWrap = document.createElement('div');
    trackWrap.className = 'interval-graph-track-wrap';
    var track = document.createElement('div');
    track.className = 'interval-graph-track';
    var zonePast = document.createElement('div');
    zonePast.className = 'interval-graph-zone interval-graph-past';
    zonePast.style.width = refPosPercent + '%';
    zonePast.setAttribute('aria-hidden', 'true');
    var zoneFuture = document.createElement('div');
    zoneFuture.className = 'interval-graph-zone interval-graph-future';
    zoneFuture.style.left = refPosPercent + '%';
    zoneFuture.style.width = (100 - refPosPercent) + '%';
    zoneFuture.setAttribute('aria-hidden', 'true');
    var refLine = document.createElement('div');
    refLine.className = 'interval-graph-ref-line';
    refLine.style.left = refPosPercent + '%';
    refLine.innerHTML = '<span class="interval-graph-ref-label">基準</span>';
    track.appendChild(zonePast);
    track.appendChild(refLine);
    track.appendChild(zoneFuture);

    var posGroups = {};
    dates.forEach(function (d) {
      var t = new Date(d.date + 'T12:00:00').getTime();
      var p = range > 0 ? ((t - minT) / range) * 100 : 50;
      var key = p.toFixed(4);
      if (!posGroups[key]) posGroups[key] = { pos: p, items: [] };
      posGroups[key].items.push(d);
    });
    var groups = Object.keys(posGroups).map(function (k) {
      var g = posGroups[k];
      var first = g.items[0];
      return { pos: g.pos, items: g.items, isRef: first.isRef, days: getDiffInDays(ref.date, first.date), isPast: first.date < ref.date };
    });
    groups.forEach(function (grp) {
      var markerWrap = document.createElement('div');
      markerWrap.className = 'interval-graph-marker-wrap' + (grp.isRef ? ' is-ref-wrap' : '');
      markerWrap.style.left = grp.pos + '%';
      var marker = document.createElement('span');
      marker.className = 'interval-graph-marker' + (grp.isRef ? ' is-ref' : (grp.isPast ? ' is-past' : ' is-future'));
      var label = document.createElement('span');
      label.className = 'interval-graph-marker-label';
      if (grp.isRef) {
        label.textContent = '0';
        marker.title = (ref.id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
      } else {
        label.textContent = (grp.days > 0 ? '+' : '') + grp.days;
        marker.title = grp.items.length > 1
          ? grp.items.map(function (it) { return it.id === 'today' ? '今日' : it.name; }).join('、') + ' ' + formatDateDisplay(grp.items[0].date)
          : (grp.items[0].id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
      }
      markerWrap.appendChild(marker);
      markerWrap.appendChild(label);
      var tipText = grp.items.length > 1
        ? grp.items.map(function (it) { return (it.id === 'today' ? '今日' : it.name) + ' ' + formatDateDisplay(it.date); }).join(' / ')
        : (grp.items[0].id === 'today' ? '今日' : grp.items[0].name) + ' ' + formatDateDisplay(grp.items[0].date);
      markerWrap.addEventListener('click', function (e) {
        e.stopPropagation();
        showGraphTooltip(markerWrap, tipText);
      });
      track.appendChild(markerWrap);
    });

    var axis = document.createElement('div');
    axis.className = 'interval-graph-axis';
    axis.innerHTML =
      '<span class="interval-graph-axis-start">' + formatDateWithWeekday(dates[0].date) + '</span>' +
      '<span class="interval-graph-axis-ref">基準 ' + formatDateDisplay(ref.date) + '</span>' +
      '<span class="interval-graph-axis-end">' + formatDateWithWeekday(dates[dates.length - 1].date) + '</span>';
    trackWrap.appendChild(track);
    trackWrap.appendChild(axis);
    graphWrap.appendChild(trackWrap);
    intervalTimeline.appendChild(graphWrap);

    intervalList.innerHTML = '';
    var headingLi = document.createElement('li');
    headingLi.className = 'interval-list-heading';
    headingLi.textContent = '基準からの日付間隔';
    intervalList.appendChild(headingLi);
    others.forEach(function (item) {
      var days = getDiffInDays(ref.date, item.date);
      var info = formatInterval(days);
      var li = document.createElement('li');
      li.className = 'interval-item';
      li.innerHTML =
        '<span class="interval-badge ' + (info.isPast ? 'past' : 'future') + '">' + escapeHtml(info.text) + '</span>' +
        '<span class="interval-name">' + (item.id === 'today' ? '今日' : escapeHtml(item.name)) + '</span>' +
        '<span class="interval-detail">' + formatDateWithWeekday(item.date) + '</span>';
      intervalList.appendChild(li);
    });

    intervalSection.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeIntervalOverlay() {
    if (intervalSection) {
      intervalSection.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function hideIntervalSection() {
    selectedId = 'today';
    renderList();
  }

  if (eventRecurrenceCheck) {
    eventRecurrenceCheck.addEventListener('change', function () {
      const open = eventRecurrenceCheck.checked;
      if (recurrenceOptions) recurrenceOptions.setAttribute('aria-hidden', !open);
      if (open && eventRecurrenceEndDate && !eventRecurrenceEndDate.value && eventDateInput.value) {
        const start = new Date(eventDateInput.value + 'T12:00:00');
        start.setFullYear(start.getFullYear() + 1);
        eventRecurrenceEndDate.value = formatDateStr(start);
      }
      toggleRecurrenceEndInputs();
    });
  }
  function toggleRecurrenceEndInputs() {
    const byDate = recurrenceEndDateRadio && recurrenceEndDateRadio.checked;
    const endDateWrap = document.querySelector('.recurrence-end-date-wrap');
    const countWrap = document.querySelector('.recurrence-end-count-wrap');
    if (endDateWrap) endDateWrap.style.display = byDate ? '' : 'none';
    if (countWrap) countWrap.style.display = byDate ? 'none' : '';
  }
  if (recurrenceEndDateRadio) recurrenceEndDateRadio.addEventListener('change', toggleRecurrenceEndInputs);
  if (recurrenceEndCountRadio) recurrenceEndCountRadio.addEventListener('change', toggleRecurrenceEndInputs);

  dateTrigger.addEventListener('click', function (e) {
    e.preventDefault();
    openDatePicker();
  });
  dateTrigger.addEventListener('focus', function (e) {
    e.preventDefault();
    dateTrigger.blur();
  });
  datePickerBackdrop.addEventListener('click', closeDatePicker);
  datePickerClose.addEventListener('click', closeDatePicker);
  datePickerPrev.addEventListener('click', function () {
    pickerCurrentMonth -= 1;
    if (pickerCurrentMonth < 0) {
      pickerCurrentMonth = 11;
      pickerCurrentYear -= 1;
    }
    buildCalendar();
  });
  datePickerNext.addEventListener('click', function () {
    pickerCurrentMonth += 1;
    if (pickerCurrentMonth > 11) {
      pickerCurrentMonth = 0;
      pickerCurrentYear += 1;
    }
    buildCalendar();
  });

  addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    if (!name || !date) return;
    const description = eventDescriptionInput ? eventDescriptionInput.value : '';
    if (editingEventId) {
      updateEvent(editingEventId, name, date, description);
    } else if (eventRecurrenceCheck && eventRecurrenceCheck.checked) {
      const type = eventRecurrenceType ? eventRecurrenceType.value : 'weekly';
      const endDateStr = eventRecurrenceEndDate ? eventRecurrenceEndDate.value : '';
      const dates = getRecurringDates(date, type, endDateStr);
      dates.forEach(function (d) { addEvent(name, d, description); });
    } else {
      addEvent(name, date, description);
    }
    resetAddForm();
    closeDrawer();
  });

  if (searchEventsInput) {
    searchEventsInput.addEventListener('input', function () { renderList(); });
    searchEventsInput.addEventListener('search', function () { renderList(); });
  }

  closeIntervalBtn.addEventListener('click', closeIntervalOverlay);
  if (intervalBackdrop) intervalBackdrop.addEventListener('click', closeIntervalOverlay);

  autoDeletePastCheck.addEventListener('change', function () {
    saveSettings();
    applyAutoDeletePast();
    renderList();
  });
  displayPeriodSelect.addEventListener('change', function () {
    saveSettings();
    toggleRangeVisibility();
    renderList();
  });
  rangeStartInput.addEventListener('change', function () {
    saveSettings();
    renderList();
  });
  rangeEndInput.addEventListener('change', function () {
    saveSettings();
    renderList();
  });
  if (intervalDisplayWeek) intervalDisplayWeek.addEventListener('change', function () { saveSettings(); renderList(); });
  if (intervalDisplayDays) intervalDisplayDays.addEventListener('change', function () { saveSettings(); renderList(); });

  function openDrawer(contentPanel, titleText) {
    panelAdd.classList.remove('is-visible');
    panelRange.classList.remove('is-visible');
    panelAdd.setAttribute('aria-hidden', 'true');
    panelRange.setAttribute('aria-hidden', 'true');
    contentPanel.classList.add('is-visible');
    contentPanel.setAttribute('aria-hidden', 'false');
    if (drawerTitle) drawerTitle.textContent = titleText;
    if (drawerOverlay) {
      drawerOverlay.classList.add('is-open');
      drawerOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeDrawer() {
    resetAddForm();
    if (drawerOverlay) {
      drawerOverlay.classList.remove('is-open');
      drawerOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    panelAdd.classList.remove('is-visible');
    panelRange.classList.remove('is-visible');
  }
  if (tabCalendar) tabCalendar.addEventListener('click', openCalendarOverlay);
  if (tabAdd) tabAdd.addEventListener('click', function () { resetAddForm(); toggleRecurrenceOptionsVisibility(); openDrawer(panelAdd, '予定を追加'); });
  if (tabRange) tabRange.addEventListener('click', function () { openDrawer(panelRange, '表示範囲'); });
  if (drawerBackBtn) drawerBackBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  if (calendarBackdrop) calendarBackdrop.addEventListener('click', closeCalendarOverlay);
  if (closeCalendar) closeCalendar.addEventListener('click', closeCalendarOverlay);
  if (deleteConfirmBackdrop) deleteConfirmBackdrop.addEventListener('click', hideDeleteConfirm);
  if (deleteConfirmCancel) deleteConfirmCancel.addEventListener('click', hideDeleteConfirm);
  if (deleteConfirmOk) deleteConfirmOk.addEventListener('click', function () {
    if (pendingDeleteId) {
      removeEvent(pendingDeleteId);
      hideDeleteConfirm();
    }
  });
  if (calendarPrev) calendarPrev.addEventListener('click', function () {
    calendarMonth -= 1;
    if (calendarMonth < 0) { calendarMonth = 11; calendarYear -= 1; }
    buildCalendarView();
  });
  if (calendarNext) calendarNext.addEventListener('click', function () {
    calendarMonth += 1;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear += 1; }
    buildCalendarView();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.interval-graph-marker-wrap') && !e.target.closest('.graph-tooltip')) {
      hideGraphTooltip();
    }
  });

  loadEvents();
  loadSettings();
  applyAutoDeletePast();
  updateDateTriggerLabel();
  toggleRecurrenceEndInputs();
  renderList();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').then(function () {
        // 登録成功
      }).catch(function () {
        // 登録失敗（開発時など）
      });
    });
  }
})();
