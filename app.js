const storageKey = "meu-caixa-v2";
const oldStorageKey = "meu-caixa-v1";

const defaultCategories = [
  { id: "moradia", name: "Moradia", budget: 1800, income: false },
  { id: "mercado", name: "Mercado", budget: 900, income: false },
  { id: "transporte", name: "Transporte", budget: 450, income: false },
  { id: "saude", name: "Saude", budget: 350, income: false },
  { id: "lazer", name: "Lazer", budget: 300, income: false },
  { id: "cartao", name: "Cartao", budget: 1200, income: false },
  { id: "empresa", name: "Empresa", budget: 1200, income: false },
  { id: "renda", name: "Renda", budget: 0, income: true },
  { id: "outros", name: "Outros", budget: 250, income: true }
];

const defaultQuickActions = [
  { id: "quick-mercado", label: "Mercado 50", amount: 50, type: "expense", category: "mercado" },
  { id: "quick-uber", label: "Uber 20", amount: 20, type: "expense", category: "transporte" },
  { id: "quick-lanche", label: "Lanche 30", amount: 30, type: "card", category: "lazer" }
];

const defaultTags = [
  { id: "casa", name: "casa" },
  { id: "empresa", name: "empresa" },
  { id: "cliente", name: "cliente" },
  { id: "viagem", name: "viagem" }
];

const subscriptionKeywords = ["netflix", "spotify", "amazon", "prime", "disney", "max", "globoplay", "icloud", "google", "academia", "assinatura"];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  lockScreen: $("#lockScreen"),
  unlockForm: $("#unlockForm"),
  unlockPin: $("#unlockPin"),
  profileButton: $("#profileButton"),
  lockButton: $("#lockButton"),
  balance: $("#balanceValue"),
  income: $("#incomeValue"),
  expense: $("#expenseValue"),
  card: $("#cardValue"),
  daily: $("#dailyValue"),
  score: $("#scoreValue"),
  todayCards: $("#todayCards"),
  scorePanel: $("#scorePanel"),
  calendarGrid: $("#calendarGrid"),
  businessDashboardList: $("#businessDashboardList"),
  tagDashboardList: $("#tagDashboardList"),
  forecastList: $("#forecastList"),
  habitList: $("#habitList"),
  subscriptionList: $("#subscriptionList"),
  duplicateList: $("#duplicateList"),
  emergencyButton: $("#emergencyButton"),
  purchaseForm: $("#purchaseForm"),
  purchaseName: $("#purchaseName"),
  purchaseAmount: $("#purchaseAmount"),
  purchaseResult: $("#purchaseResult"),
  contactDashboardList: $("#contactDashboardList"),
  form: $("#transactionForm"),
  smartEntryForm: $("#smartEntryForm"),
  smartEntryInput: $("#smartEntryInput"),
  voiceButton: $("#voiceButton"),
  continuousVoiceButton: $("#continuousVoiceButton"),
  photoOcrButton: $("#photoOcrButton"),
  aiPreview: $("#aiPreview"),
  aiConfirmActions: $("#aiConfirmActions"),
  confirmAiButton: $("#confirmAiButton"),
  editAiButton: $("#editAiButton"),
  cancelAiButton: $("#cancelAiButton"),
  quickActionList: $("#quickActionList"),
  description: $("#descriptionInput"),
  amount: $("#amountInput"),
  date: $("#dateInput"),
  category: $("#categoryInput"),
  installments: $("#installmentsInput"),
  tags: $("#tagsInput"),
  filter: $("#filterInput"),
  search: $("#searchInput"),
  month: $("#monthInput"),
  budgetList: $("#budgetList"),
  reportList: $("#reportList"),
  compareList: $("#compareList"),
  transactionList: $("#transactionList"),
  template: $("#transactionTemplate"),
  chart: $("#cashflowChart"),
  billForm: $("#billForm"),
  billName: $("#billName"),
  billAmount: $("#billAmount"),
  billDay: $("#billDay"),
  billCategory: $("#billCategory"),
  billList: $("#billList"),
  generateBillsButton: $("#generateBillsButton"),
  subscriptionForm: $("#subscriptionForm"),
  subscriptionName: $("#subscriptionName"),
  subscriptionAmount: $("#subscriptionAmount"),
  subscriptionDay: $("#subscriptionDay"),
  subscriptionCategory: $("#subscriptionCategory"),
  subscriptionSettingsList: $("#subscriptionSettingsList"),
  goalForm: $("#goalForm"),
  goalName: $("#goalName"),
  goalTarget: $("#goalTarget"),
  goalSaved: $("#goalSaved"),
  goalDate: $("#goalDate"),
  goalList: $("#goalList"),
  wishForm: $("#wishForm"),
  wishName: $("#wishName"),
  wishAmount: $("#wishAmount"),
  wishPriority: $("#wishPriority"),
  wishDate: $("#wishDate"),
  wishList: $("#wishList"),
  contactForm: $("#contactForm"),
  contactName: $("#contactName"),
  contactAmount: $("#contactAmount"),
  contactKind: $("#contactKind"),
  contactNote: $("#contactNote"),
  contactList: $("#contactList"),
  adviceList: $("#adviceList"),
  assistantForm: $("#assistantForm"),
  assistantInput: $("#assistantInput"),
  assistantAnswer: $("#assistantAnswer"),
  refreshAdviceButton: $("#refreshAdviceButton"),
  receiptForm: $("#receiptForm"),
  receiptFile: $("#receiptFile"),
  receiptText: $("#receiptText"),
  categoryForm: $("#categoryForm"),
  categoryName: $("#categoryName"),
  categoryBudget: $("#categoryBudget"),
  categoryList: $("#categoryList"),
  tagForm: $("#tagForm"),
  tagName: $("#tagName"),
  tagList: $("#tagList"),
  quickActionForm: $("#quickActionForm"),
  quickName: $("#quickName"),
  quickAmount: $("#quickAmount"),
  quickType: $("#quickType"),
  quickCategory: $("#quickCategory"),
  quickSettingsList: $("#quickSettingsList"),
  pinForm: $("#pinForm"),
  currentPinInput: $("#currentPinInput"),
  pinInput: $("#pinInput"),
  pinConfirm: $("#pinConfirm"),
  smsImportButton: $("#smsImportButton"),
  notificationImportButton: $("#notificationImportButton"),
  notificationSettingsButton: $("#notificationSettingsButton"),
  privacyButton: $("#privacyButton"),
  profileToggleButton: $("#profileToggleButton"),
  offlineModeButton: $("#offlineModeButton"),
  csvExportButton: $("#csvExportButton"),
  jsonExportButton: $("#jsonExportButton"),
  jsonImportInput: $("#jsonImportInput"),
  clearButton: $("#clearButton"),
  toast: $("#toast")
};

const state = loadState();
let pendingAiEntry = null;
let continuousVoiceActive = false;

init();

function init() {
  elements.date.value = todayISO();
  elements.month.value = currentMonth();
  bindEvents();
  fillSelects();
  render();
  if (hasPinConfigured()) lockApp();
  document.body.classList.toggle("privacy-blur", Boolean(state.settings.privacyMode));
  document.body.classList.toggle("offline-only", Boolean(state.settings.offlineOnly));
  registerServiceWorker();
  window.handleVoiceResult = (text) => {
    elements.smartEntryInput.value = text || "";
    processSmartEntry(text || "", true);
  };
  window.handleOcrResult = (text) => {
    elements.smartEntryInput.value = text || "";
    elements.aiPreview.textContent = text ? `Texto lido da foto: ${text.slice(0, 220)}` : "Nao consegui ler texto da foto.";
    elements.aiPreview.classList.add("show");
    if (text) processSmartEntry(text, true);
  };
  window.handleImportedMessages = (payload) => {
    importBankMessages(payload);
  };
}

function bindEvents() {
  $$("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  $$("[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.type = button.dataset.type;
      $$("[data-type]").forEach((item) => item.classList.toggle("active", item === button));
      renderCategoryOptions();
    });
  });

  elements.form.addEventListener("submit", addTransaction);
  elements.profileButton.addEventListener("click", toggleProfile);
  elements.smartEntryForm.addEventListener("submit", addSmartTransaction);
  elements.voiceButton.addEventListener("click", startVoiceInput);
  elements.continuousVoiceButton.addEventListener("click", toggleContinuousVoice);
  elements.photoOcrButton.addEventListener("click", startPhotoOcr);
  elements.confirmAiButton.addEventListener("click", confirmAiEntry);
  elements.editAiButton.addEventListener("click", editAiEntry);
  elements.cancelAiButton.addEventListener("click", cancelAiEntry);
  elements.filter.addEventListener("change", () => renderTransactions());
  elements.search.addEventListener("input", () => renderTransactions());
  elements.month.addEventListener("change", render);
  elements.billForm.addEventListener("submit", addBill);
  elements.generateBillsButton.addEventListener("click", generateMonthlyBills);
  elements.subscriptionForm.addEventListener("submit", addSubscription);
  elements.goalForm.addEventListener("submit", addGoal);
  elements.wishForm.addEventListener("submit", addWish);
  elements.contactForm.addEventListener("submit", addContactRecord);
  elements.categoryForm.addEventListener("submit", addCategory);
  elements.tagForm.addEventListener("submit", addTag);
  elements.quickActionForm.addEventListener("submit", addQuickAction);
  elements.assistantForm.addEventListener("submit", answerAssistant);
  elements.receiptForm.addEventListener("submit", suggestFromReceipt);
  elements.refreshAdviceButton.addEventListener("click", () => {
    renderAdvice();
    showToast("Analise atualizada no aparelho.");
  });
  elements.csvExportButton.addEventListener("click", exportCSV);
  elements.jsonExportButton.addEventListener("click", exportJSON);
  elements.jsonImportInput.addEventListener("change", importJSON);
  elements.pinForm.addEventListener("submit", savePin);
  elements.unlockForm.addEventListener("submit", unlockApp);
  elements.lockButton.addEventListener("click", lockApp);
  elements.privacyButton.addEventListener("click", togglePrivacy);
  elements.smsImportButton.addEventListener("click", importSms);
  elements.notificationImportButton.addEventListener("click", importNotifications);
  elements.notificationSettingsButton.addEventListener("click", openNotificationSettings);
  elements.profileToggleButton.addEventListener("click", toggleProfile);
  elements.offlineModeButton.addEventListener("click", toggleOfflineMode);
  elements.purchaseForm.addEventListener("submit", simulatePurchase);
  elements.emergencyButton.addEventListener("click", toggleEmergencyMode);
  elements.clearButton.addEventListener("click", clearAll);
}

function switchTab(tabName) {
  $$("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
  $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tabName}`));
}

function toggleProfile() {
  state.settings.activeProfile = activeProfile() === "business" ? "personal" : "business";
  saveState();
  render();
  showToast(`Perfil ${profileLabel(activeProfile()).toLowerCase()} ativo.`);
}

function toggleOfflineMode() {
  state.settings.offlineOnly = !state.settings.offlineOnly;
  document.body.classList.toggle("offline-only", Boolean(state.settings.offlineOnly));
  saveState();
  render();
  showToast(state.settings.offlineOnly ? "Modo offline total ativado neste aparelho." : "Modo offline total desativado.");
}

function addTransaction(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.amount.value);
  const installments = Math.max(1, Number(elements.installments.value || 1));
  if (!amount || amount <= 0) return elements.amount.focus();
  const tags = parseTags(elements.tags.value);
  registerTags(tags);

  const base = {
    type: state.ui.type,
    description: elements.description.value.trim(),
    amount: amount / installments,
    category: elements.category.value,
    date: elements.date.value || todayISO(),
    tags,
    profile: activeProfile(),
    group: installments > 1 ? createId() : null
  };

  for (let index = 0; index < installments; index += 1) {
    const date = addMonths(base.date, index);
    state.transactions.unshift({
      ...base,
      id: createId(),
      date,
      installment: installments > 1 ? index + 1 : null,
      installments: installments > 1 ? installments : null
    });
  }

  saveState();
  elements.form.reset();
  elements.date.value = todayISO();
  elements.installments.value = "1";
  elements.tags.value = "";
  renderCategoryOptions();
  render();
  showToast("Lancamento salvo.");
}

function addSmartTransaction(event) {
  event.preventDefault();
  processSmartEntry(elements.smartEntryInput.value, true);
}

function processSmartEntry(text, requireConfirm = false) {
  const parsed = parseSmartText(text);
  if (!parsed) {
    showToast("Nao consegui encontrar um valor na mensagem.");
    return;
  }
  pendingAiEntry = parsed;
  elements.aiPreview.textContent = aiSummary(parsed);
  elements.aiPreview.classList.add("show");
  elements.aiConfirmActions.classList.remove("hidden");
  if (requireConfirm) {
    showToast("Confira e confirme antes de salvar.");
    return;
  }
  confirmAiEntry();
}

function confirmAiEntry() {
  const parsed = pendingAiEntry;
  if (!parsed) return;
  if (isDuplicate(parsed)) {
    showToast("Possivel duplicado detectado. Confira no dashboard.");
  }
  applyParsedEntry(parsed);
  pendingAiEntry = null;
  elements.aiConfirmActions.classList.add("hidden");
  elements.smartEntryInput.value = "";
  render();
  showToast(`${parsed.type === "income" ? "Entrada" : "Gasto"} salvo pela IA.`);
  if (continuousVoiceActive) window.setTimeout(startVoiceInput, 650);
}

function applyParsedEntry(parsed) {
  const contactAction = parsed.contactAction;
  parsed.profile = parsed.profile || activeProfile();
  parsed.tags = parsed.tags || [];
  registerTags(parsed.tags);
  if (contactAction) {
    applyContactAction(contactAction, parsed);
    return;
  }
  const installments = parsed.installments || 1;
  for (let index = 0; index < installments; index += 1) {
    state.transactions.unshift({
      ...parsed,
      id: createId(),
      amount: parsed.amount / installments,
      date: addMonths(parsed.date, index),
      installment: installments > 1 ? index + 1 : null,
      installments: installments > 1 ? installments : null,
      group: installments > 1 ? parsed.group : null
    });
  }
  saveState();
}

function editAiEntry() {
  if (!pendingAiEntry) return;
  elements.description.value = pendingAiEntry.description;
  elements.amount.value = String(pendingAiEntry.amount).replace(".", ",");
  elements.date.value = pendingAiEntry.date;
  state.ui.type = pendingAiEntry.type;
  $$("[data-type]").forEach((item) => item.classList.toggle("active", item.dataset.type === state.ui.type));
  renderCategoryOptions();
  elements.category.value = pendingAiEntry.category;
  elements.installments.value = pendingAiEntry.installments || 1;
  cancelAiEntry();
  switchTab("launch");
}

function cancelAiEntry() {
  pendingAiEntry = null;
  elements.aiConfirmActions.classList.add("hidden");
  elements.aiPreview.classList.remove("show");
}

function startVoiceInput() {
  if (window.Android && typeof window.Android.startVoiceInput === "function") {
    window.Android.startVoiceInput();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Reconhecimento de voz indisponivel neste aparelho.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    elements.smartEntryInput.value = text;
    processSmartEntry(text);
  };
  recognition.onerror = () => showToast("Nao consegui ouvir a mensagem.");
  recognition.start();
}

function toggleContinuousVoice() {
  continuousVoiceActive = !continuousVoiceActive;
  elements.continuousVoiceButton.textContent = continuousVoiceActive ? "Parar voz" : "Voz continua";
  showToast(continuousVoiceActive ? "Modo voz continua ativado." : "Modo voz continua pausado.");
  if (continuousVoiceActive) startVoiceInput();
}

function startPhotoOcr() {
  if (window.Android && typeof window.Android.startPhotoOcr === "function") {
    window.Android.startPhotoOcr();
    return;
  }
  elements.receiptFile.click();
  showToast("Escolha a foto e cole o texto visivel para decifrar.");
}

function runQuickAction(action) {
  state.transactions.unshift({
    id: createId(),
    type: action.type,
    description: action.label,
    amount: action.amount,
    category: action.category,
    date: todayISO(),
    tags: action.tags || [],
    profile: action.profile || activeProfile()
  });
  saveState();
  render();
  showToast(`${action.label} lancado.`);
}

function addBill(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.billAmount.value);
  const day = Math.min(31, Math.max(1, Number(elements.billDay.value || 1)));
  if (!elements.billName.value.trim() || !amount) return;
  state.bills.push({ id: createId(), name: elements.billName.value.trim(), amount, day, category: elements.billCategory.value, profile: activeProfile() });
  saveState();
  elements.billForm.reset();
  fillSelects();
  render();
}

function addSubscription(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.subscriptionAmount.value);
  const day = Math.min(31, Math.max(1, Number(elements.subscriptionDay.value || 1)));
  if (!elements.subscriptionName.value.trim() || !amount) return;
  state.subscriptions.push({
    id: createId(),
    name: elements.subscriptionName.value.trim(),
    amount,
    day,
    category: elements.subscriptionCategory.value,
    profile: activeProfile()
  });
  saveState();
  elements.subscriptionForm.reset();
  render();
}

function generateMonthlyBills() {
  const month = elements.month.value || currentMonth();
  state.bills.forEach((bill) => {
    const date = `${month}-${String(bill.day).padStart(2, "0")}`;
    if (!profileMatches(bill)) return;
    const exists = state.transactions.some((item) => item.billId === bill.id && item.date.startsWith(month) && profileMatches(item));
    if (!exists) {
      state.transactions.unshift({ id: createId(), billId: bill.id, type: "expense", description: bill.name, amount: bill.amount, category: bill.category, date, tags: ["fixa"], profile: activeProfile() });
    }
  });
  saveState();
  render();
  showToast("Contas fixas geradas para o mes.");
}

function addGoal(event) {
  event.preventDefault();
  const target = parseCurrency(elements.goalTarget.value);
  if (!elements.goalName.value.trim() || !target) return;
  state.goals.push({
    id: createId(),
    name: elements.goalName.value.trim(),
    target,
    saved: parseCurrency(elements.goalSaved.value) || 0,
    date: elements.goalDate.value || "",
    profile: activeProfile()
  });
  saveState();
  elements.goalForm.reset();
  renderGoals();
}

function addWish(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.wishAmount.value);
  if (!elements.wishName.value.trim() || !amount) return;
  state.wishes.push({
    id: createId(),
    name: elements.wishName.value.trim(),
    amount,
    priority: elements.wishPriority.value,
    date: elements.wishDate.value || "",
    profile: activeProfile()
  });
  saveState();
  elements.wishForm.reset();
  renderWishes();
}

function addContactRecord(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.contactAmount.value);
  const name = elements.contactName.value.trim();
  if (!name || !amount) return;
  state.contacts.push({
    id: createId(),
    name,
    kind: elements.contactKind.value,
    amount,
    paid: 0,
    note: elements.contactNote.value.trim(),
    date: todayISO(),
    profile: activeProfile()
  });
  saveState();
  elements.contactForm.reset();
  render();
}

function addCategory(event) {
  event.preventDefault();
  const name = elements.categoryName.value.trim();
  if (!name) return;
  state.categories.push({ id: slug(name), name, budget: parseCurrency(elements.categoryBudget.value) || 0, income: false });
  saveState();
  elements.categoryForm.reset();
  fillSelects();
  render();
}

function addTag(event) {
  event.preventDefault();
  const tags = parseTags(elements.tagName.value);
  if (!tags.length) return;
  registerTags(tags);
  saveState();
  elements.tagForm.reset();
  render();
}

function addQuickAction(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.quickAmount.value);
  if (!elements.quickName.value.trim() || !amount) return;
  state.quickActions.push({
    id: createId(),
    label: elements.quickName.value.trim(),
    amount,
    type: elements.quickType.value,
    category: elements.quickCategory.value,
    tags: [],
    profile: activeProfile()
  });
  saveState();
  elements.quickActionForm.reset();
  renderQuickActions();
  renderQuickSettings();
}

function fillSelects() {
  const allOptions = [`<option value="all">Todas</option>`].concat(state.categories.map((category) => `<option value="${category.id}">${category.name}</option>`));
  elements.filter.innerHTML = allOptions.join("");
  const expenseOptions = state.categories.filter((category) => !category.income).map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
  elements.billCategory.innerHTML = expenseOptions;
  elements.subscriptionCategory.innerHTML = expenseOptions;
  elements.quickCategory.innerHTML = state.categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
  renderCategoryOptions();
}

function renderCategoryOptions() {
  const type = state.ui.type;
  const options = state.categories
    .filter((category) => type === "income" ? category.income : !category.income)
    .map((category) => `<option value="${category.id}">${category.name}</option>`)
    .join("");
  elements.category.innerHTML = options;
}

function render() {
  const month = elements.month.value || currentMonth();
  const totals = getTotals(month);
  const score = financialScore(month);
  elements.balance.textContent = formatCurrency(totals.balance);
  elements.income.textContent = formatCurrency(totals.income);
  elements.expense.textContent = formatCurrency(totals.expense);
  elements.card.textContent = formatCurrency(totals.card);
  elements.daily.textContent = formatCurrency(getDailySafe(totals.balance, month));
  elements.score.textContent = `${score.score}/100`;
  elements.profileButton.textContent = activeProfile() === "business" ? "PJ" : "PF";
  elements.profileToggleButton.textContent = `Perfil ${profileLabel(activeProfile())}`;
  elements.offlineModeButton.textContent = state.settings.offlineOnly ? "Offline ligado" : "Offline total";
  document.body.classList.toggle("business-profile", activeProfile() === "business");
  document.body.classList.toggle("offline-only", Boolean(state.settings.offlineOnly));
  renderToday(month, totals);
  renderScore(month);
  renderCalendar(month);
  renderBusiness(month);
  renderTagsDashboard(month);
  renderReport(month, totals);
  renderCompare(month);
  renderBudgets(month);
  renderBills();
  renderSubscriptions();
  renderGoals();
  renderWishes();
  renderContacts();
  renderAdvice();
  renderCategories();
  renderTagsSettings();
  renderQuickActions();
  renderQuickSettings();
  renderTransactions();
  renderChart(month);
}

function renderReport(month, totals) {
  const top = topCategory(month);
  const fixedTotal = state.bills.reduce((sum, bill) => sum + bill.amount, 0);
  elements.reportList.innerHTML = [
    metric("Resultado", formatCurrency(totals.balance), "Entradas menos saidas"),
    metric("Maior gasto", top ? `${top.name}: ${formatCurrency(top.amount)}` : "Sem gastos", "Categoria principal"),
    metric("Fixas previstas", formatCurrency(fixedTotal), "Contas recorrentes"),
    metric("Lancamentos", String(monthlyItems(month).length), "Itens no mes")
  ].join("");
}

function renderToday(month, totals) {
  const projection = forecastMonthEnd(month);
  const habits = habitStats(month);
  const contacts = contactTotals();
  const score = financialScore(month);
  elements.todayCards.innerHTML = [
    metric("Saude financeira", `${score.score}/100`, score.label),
    metric("Previsao fim do mes", formatCurrency(projection.projectedBalance), projection.message),
    metric("Modo semana", formatCurrency(weekSafeAmount()), "Seguro ate domingo"),
    metric("A receber", formatCurrency(contacts.toReceive), "Emprestimos em aberto"),
    metric("A pagar", formatCurrency(contacts.toPay), "Dividas em aberto")
  ].join("");
  elements.forecastList.innerHTML = simpleStatus("Previsao", `Nesse ritmo voce fecha em ${formatCurrency(projection.projectedBalance)}. ${projection.tip}`);
  elements.habitList.innerHTML = [
    metric("Dias sem gasto", String(habits.noSpendDays), "No mes selecionado"),
    metric("Maior dia", habits.biggestDay ? `${formatDate(habits.biggestDay.date)}: ${formatCurrency(habits.biggestDay.amount)}` : "Sem dados", "Pico de gasto")
  ].join("");
  elements.subscriptionList.innerHTML = renderDetectedSubscriptions(month);
  elements.duplicateList.innerHTML = renderDuplicates(month);
  elements.contactDashboardList.innerHTML = renderContactSummary();
}

function renderScore(month) {
  const result = financialScore(month);
  elements.scorePanel.innerHTML = `
    <div class="score-ring" style="--score:${result.score}">
      <strong>${result.score}</strong>
      <span>${result.label}</span>
    </div>
    <div class="score-copy">
      <strong>${profileLabel(activeProfile())}</strong>
      <span>${result.tip}</span>
    </div>
  `;
}

function renderCalendar(month) {
  const days = daysInMonth(month);
  const today = todayISO();
  const totalsByDate = {};
  monthlyItems(month).forEach((item) => {
    const signed = item.type === "income" ? item.amount : -item.amount;
    totalsByDate[item.date] = (totalsByDate[item.date] || 0) + signed;
  });
  state.bills.filter(profileMatches).forEach((bill) => {
    const date = `${month}-${String(bill.day).padStart(2, "0")}`;
    totalsByDate[date] = (totalsByDate[date] || 0) - bill.amount;
  });
  state.subscriptions.filter(profileMatches).forEach((item) => {
    const date = `${month}-${String(item.day).padStart(2, "0")}`;
    totalsByDate[date] = (totalsByDate[date] || 0) - item.amount;
  });
  elements.calendarGrid.innerHTML = days.map((date) => {
    const total = totalsByDate[date] || 0;
    const tone = total > 0 ? "income" : total < 0 ? "expense" : "";
    const day = Number(date.slice(-2));
    return `<button class="calendar-day ${tone} ${date === today ? "today" : ""}" type="button" data-date="${date}"><strong>${day}</strong><span>${total ? signedCurrency(total) : ""}</span></button>`;
  }).join("");
  $$("[data-date]").forEach((button) => {
    button.onclick = () => {
      const date = button.dataset.date;
      const items = monthlyItems(month).filter((item) => item.date === date);
      elements.search.value = date;
      renderTransactions();
      switchTab("launch");
      showToast(items.length ? `${items.length} lancamento(s) em ${formatDate(date)}.` : `Sem lancamentos em ${formatDate(date)}.`);
    };
  });
}

function renderBusiness(month) {
  const totals = getTotals(month, "business");
  const items = monthlyItems(month, "business");
  const clients = items.filter((item) => item.type === "income").length;
  elements.businessDashboardList.innerHTML = [
    simpleStatus("Modo empreendedor", `Receitas ${formatCurrency(totals.income)}, despesas ${formatCurrency(totals.expense + totals.card)} e lucro ${formatCurrency(totals.balance)}.`),
    simpleStatus("Clientes e vendas", clients ? `${clients} entrada(s) de cliente/venda no mes.` : "Sem vendas registradas no mes.")
  ].join("");
}

function renderTagsDashboard(month) {
  const tags = topTags(month);
  elements.tagDashboardList.innerHTML = tags.length
    ? tags.slice(0, 5).map((tag) => simpleStatus(`#${tag.name}`, `${formatCurrency(tag.amount)} em ${tag.count} lancamento(s)`)).join("")
    : empty("Sem tags neste mes.");
}

function renderCompare(month) {
  const previous = previousMonth(month);
  const currentTotals = getTotals(month);
  const previousTotals = getTotals(previous);
  const expenseDiff = currentTotals.expense + currentTotals.card - (previousTotals.expense + previousTotals.card);
  const incomeDiff = currentTotals.income - previousTotals.income;
  const top = topCategory(month);
  elements.compareList.innerHTML = [
    metric("Comparado ao mes anterior", signedCurrency(expenseDiff), "Diferenca de gastos"),
    metric("Entradas vs mes anterior", signedCurrency(incomeDiff), "Diferenca de renda"),
    metric("Categoria que pesa", top ? top.name : "Sem dados", top ? formatCurrency(top.amount) : "Nada no mes"),
    metric("Tendencia", expenseDiff > 0 ? "Gastando mais" : "Gastando menos", `Referencia: ${previous}`)
  ].join("");
}

function renderBudgets(month) {
  const totals = expensesByCategory(monthlyItems(month));
  elements.budgetList.innerHTML = state.categories
    .filter((category) => category.budget > 0 && !category.income)
    .map((category) => {
      const used = totals[category.id] || 0;
      const ratio = Math.min(used / category.budget, 1);
      const status = ratio > 0.9 ? "danger" : ratio > 0.7 ? "warning" : "";
      return progressItem(category.name, used, category.budget, status);
    }).join("") || empty("Nenhum limite mensal cadastrado.");
}

function renderBills() {
  elements.billList.innerHTML = state.bills.filter(profileMatches).map((bill) => simpleItem(bill.name, `${formatCurrency(bill.amount)} - vence dia ${bill.day}`, `bills:${bill.id}`)).join("") || empty("Nenhuma conta fixa cadastrada.");
  bindRemoveButtons();
}

function renderSubscriptions() {
  elements.subscriptionSettingsList.innerHTML = state.subscriptions.filter(profileMatches).map((item) => simpleItem(item.name, `${formatCurrency(item.amount)} - dia ${item.day}`, `subscriptions:${item.id}`)).join("") || empty("Nenhuma assinatura cadastrada.");
  bindRemoveButtons();
}

function renderGoals() {
  elements.goalList.innerHTML = state.goals.filter(profileMatches).map((goal) => {
    const ratio = Math.min(goal.saved / goal.target, 1);
    const status = ratio >= 1 ? "" : ratio < 0.4 ? "warning" : "";
    return progressItem(goal.name, goal.saved, goal.target, status, goal.date ? `Prazo: ${formatDate(goal.date)}` : "");
  }).join("") || empty("Nenhuma meta cadastrada.");
}

function renderWishes() {
  const balance = getTotals(elements.month.value || currentMonth()).balance;
  elements.wishList.innerHTML = state.wishes
    .filter(profileMatches)
    .sort((a, b) => wishRank(a.priority) - wishRank(b.priority) || a.amount - b.amount)
    .map((wish) => {
      const status = balance >= wish.amount ? "Cabe no saldo atual" : `Faltam ${formatCurrency(wish.amount - balance)}`;
      return simpleItem(wish.name, `${formatCurrency(wish.amount)} - ${wish.priority} - ${status}${wish.date ? ` - ${formatDate(wish.date)}` : ""}`, `wishes:${wish.id}`);
    })
    .join("") || empty("Nenhum desejo cadastrado.");
  bindRemoveButtons();
}

function renderContacts() {
  elements.contactList.innerHTML = state.contacts.filter(profileMatches).map((item) => {
    const open = Math.max(item.amount - item.paid, 0);
    const label = item.kind === "lent" ? "Emprestei" : "Eu devo";
    return `<div class="simple-item"><strong>${item.name}</strong><span>${label}: ${formatCurrency(open)} aberto de ${formatCurrency(item.amount)}${item.note ? ` - ${item.note}` : ""}</span><div class="form-row"><button class="text-button" type="button" data-contact-pay="${item.id}">Pagar parte</button><button class="text-button" type="button" data-remove="contacts:${item.id}">Remover</button></div></div>`;
  }).join("") || empty("Nenhum contato ou divida cadastrado.");
  $$("[data-contact-pay]").forEach((button) => {
    button.onclick = () => payContactPrompt(button.dataset.contactPay);
  });
  bindRemoveButtons();
}

function renderDetectedSubscriptions(month) {
  const detected = detectSubscriptions(month);
  const manual = state.subscriptions.filter(profileMatches).map((item) => `${item.name}: ${formatCurrency(item.amount)} todo dia ${item.day}`);
  const lines = manual.concat(detected.map((item) => `${item.name}: ${formatCurrency(item.amount)} detectado`));
  return lines.length ? lines.map((line) => simpleStatus("Radar de assinatura", line)).join("") : empty("Nenhuma assinatura detectada.");
}

function renderDuplicates(month) {
  const duplicates = findDuplicates(month);
  return duplicates.length ? duplicates.map((pair) => simpleStatus("Possivel duplicado", `${pair[0].description} - ${formatCurrency(pair[0].amount)} em ${formatDate(pair[0].date)}`)).join("") : empty("Nenhum duplicado aparente.");
}

function renderContactSummary() {
  const totals = contactTotals();
  if (!state.contacts.filter(profileMatches).length) return empty("Sem emprestimos ou dividas.");
  return [
    simpleStatus("Emprestimos", `Voce tem ${formatCurrency(totals.toReceive)} para receber.`),
    simpleStatus("Dividas", `Voce tem ${formatCurrency(totals.toPay)} para pagar.`)
  ].join("");
}

function simulatePurchase(event) {
  event.preventDefault();
  const amount = parseCurrency(elements.purchaseAmount.value);
  if (!amount) return;
  const month = elements.month.value || currentMonth();
  const after = getTotals(month).balance - amount;
  const daily = getDailySafe(after, month);
  elements.purchaseResult.textContent = `${elements.purchaseName.value || "Compra"} de ${formatCurrency(amount)} deixaria o saldo previsto em ${formatCurrency(after)} e o seguro por dia em ${formatCurrency(daily)}. ${after < 0 ? "Eu nao compraria agora." : "Cabe, mas confira prioridades."}`;
}

function toggleEmergencyMode() {
  state.settings.emergencyMode = !state.settings.emergencyMode;
  saveState();
  render();
  showToast(state.settings.emergencyMode ? "Modo emergencia ativado: foco no essencial." : "Modo emergencia desativado.");
}

function renderAdvice() {
  elements.adviceList.innerHTML = buildAdvice().map((item) => `<div class="advice-item"><strong>${item.title}</strong><span>${item.text}</span></div>`).join("");
}

function renderQuickActions() {
  elements.quickActionList.innerHTML = state.quickActions.filter(profileMatches).map((action) => `<button class="secondary-button" type="button" data-quick="${action.id}">${action.label}<br>${formatCurrency(action.amount)}</button>`).join("");
  $$("[data-quick]").forEach((button) => {
    button.onclick = () => {
      const action = state.quickActions.find((item) => item.id === button.dataset.quick);
      if (action) runQuickAction(action);
    };
  });
}

function renderQuickSettings() {
  elements.quickSettingsList.innerHTML = state.quickActions.filter(profileMatches).map((action) => simpleItem(action.label, `${formatCurrency(action.amount)} - ${getCategory(action.category).name}`, `quickActions:${action.id}`)).join("") || empty("Nenhum botao rapido cadastrado.");
  bindRemoveButtons();
}

function renderCategories() {
  elements.categoryList.innerHTML = state.categories.map((category) => simpleItem(category.name, category.income ? "Entrada" : `Limite: ${formatCurrency(category.budget || 0)}`, category.id === "renda" ? "" : `category:${category.id}`)).join("");
  bindRemoveButtons();
}

function renderTagsSettings() {
  const discovered = getAllTags();
  elements.tagList.innerHTML = discovered.map((tag) => simpleItem(`#${tag.name}`, "Tag personalizada", `tags:${tag.id}`)).join("") || empty("Nenhuma tag criada.");
  bindRemoveButtons();
}

function renderTransactions() {
  const month = elements.month.value || currentMonth();
  const list = state.transactions.filter((item) => {
    const categoryMatch = elements.filter.value === "all" || item.category === elements.filter.value;
    return item.date.startsWith(month) && categoryMatch && matchesSearch(item, elements.search.value);
  });
  elements.transactionList.innerHTML = "";
  if (!list.length) {
    elements.transactionList.innerHTML = empty("Nenhum lancamento encontrado.");
    return;
  }
  list.sort((a, b) => b.date.localeCompare(a.date)).forEach((item) => {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    const category = getCategory(item.category);
    const tagText = item.tags?.length ? ` - ${item.tags.map((tag) => `#${tag}`).join(" ")}` : "";
    node.querySelector(".transaction-icon").textContent = item.type === "income" ? "+" : item.type === "card" ? "C" : "-";
    node.querySelector(".transaction-main strong").textContent = item.installments ? `${item.description} ${item.installment}/${item.installments}` : item.description;
    node.querySelector(".transaction-main span").textContent = `${category.name} - ${formatDate(item.date)}${tagText}`;
    const value = node.querySelector(".transaction-side b");
    value.textContent = `${item.type === "income" ? "+" : "-"} ${formatCurrency(item.amount)}`;
    value.className = item.type === "income" ? "positive" : "negative";
    node.querySelector("button").addEventListener("click", () => {
      state.transactions = state.transactions.filter((entry) => entry.id !== item.id);
      saveState();
      render();
    });
    elements.transactionList.appendChild(node);
  });
}

function renderChart(month) {
  const canvas = elements.chart;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  const days = daysInMonth(month);
  let running = 0;
  const points = days.map((day) => {
    monthlyItems(month).filter((item) => item.date === day).forEach((item) => {
      running += item.type === "income" ? item.amount : -item.amount;
    });
    return running;
  });
  const min = Math.min(0, ...points);
  const max = Math.max(1, ...points);
  const scaleY = (value) => height - 18 - ((value - min) / (max - min || 1)) * (height - 34);
  const scaleX = (index) => 12 + (index / Math.max(points.length - 1, 1)) * (width - 24);
  context.strokeStyle = "rgba(255,255,255,.18)";
  context.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = 18 + i * 28;
    context.beginPath();
    context.moveTo(8, y);
    context.lineTo(width - 8, y);
    context.stroke();
  }
  context.strokeStyle = "#60a5fa";
  context.lineWidth = 4;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  points.forEach((point, index) => index === 0 ? context.moveTo(scaleX(index), scaleY(point)) : context.lineTo(scaleX(index), scaleY(point)));
  context.stroke();
}

function buildAdvice() {
  const month = elements.month.value || currentMonth();
  const totals = getTotals(month);
  const top = topCategory(month);
  const daily = getDailySafe(totals.balance, month);
  const alerts = budgetAlerts(month);
  const advice = [
    { title: totals.balance >= 0 ? "Saldo sob controle" : "Atencao ao saldo", text: totals.balance >= 0 ? `Voce pode gastar perto de ${formatCurrency(daily)} por dia ate fechar o mes.` : `O mes esta negativo em ${formatCurrency(Math.abs(totals.balance))}. Pause gastos variaveis.` },
    { title: "Cartao", text: totals.card > 0 ? `A fatura aberta esta em ${formatCurrency(totals.card)}. Cuidado com parcelas futuras.` : "Nenhuma compra de cartao neste mes." }
  ];
  if (top) advice.push({ title: "Onde cortar", text: `${top.name} pesa mais agora: ${formatCurrency(top.amount)}. Reduzir 10% economizaria ${formatCurrency(top.amount * 0.1)}.` });
  advice.push({ title: "Limites", text: alerts.length ? `${alerts.join(", ")} passou de 80% do limite.` : "Nenhum limite passou de 80%." });
  return advice;
}

function answerAssistant(event) {
  event.preventDefault();
  const question = normalize(elements.assistantInput.value);
  const month = elements.month.value || currentMonth();
  const totals = getTotals(month);
  const top = topCategory(month);
  const score = financialScore(month);
  const contacts = contactTotals();
  const projection = forecastMonthEnd(month);
  const business = getTotals(month, "business");
  const scoped = spendingFromQuestion(question, month);
  const purchaseAmount = findAmount(question);

  if (question.includes("quem me deve") || question.includes("a receber") || question.includes("me deve")) {
    const people = state.contacts.filter((item) => profileMatches(item) && item.kind === "lent" && item.amount > item.paid);
    elements.assistantAnswer.textContent = people.length
      ? people.map((item) => `${item.name}: ${formatCurrency(item.amount - item.paid)}`).join(" | ")
      : "Ninguem te deve dinheiro neste perfil.";
  } else if (question.includes("quanto devo") || question.includes("a pagar") || question.includes("minhas dividas")) {
    elements.assistantAnswer.textContent = contacts.toPay ? `Voce tem ${formatCurrency(contacts.toPay)} em aberto para pagar.` : "Voce nao tem dividas abertas neste perfil.";
  } else if (question.includes("score") || question.includes("saude financeira")) {
    elements.assistantAnswer.textContent = `Seu score financeiro esta em ${score.score}/100 (${score.label}). ${score.tip}`;
  } else if (question.includes("calendario") || question.includes("vencimento") || question.includes("proxim")) {
    elements.assistantAnswer.textContent = nextFinancialEvents(month).join(" | ") || "Nao encontrei eventos financeiros proximos.";
  } else if (question.includes("negocio") || question.includes("empresa") || question.includes("lucro") || question.includes("cliente")) {
    elements.assistantAnswer.textContent = `No modo empreendedor: receitas ${formatCurrency(business.income)}, despesas ${formatCurrency(business.expense + business.card)} e lucro ${formatCurrency(business.balance)}.`;
  } else if (question.includes("pix") || question.includes("comprovante")) {
    elements.assistantAnswer.textContent = "Cole o texto do Pix ou envie a foto na Central IA. Eu tento identificar valor, tipo, pessoa, data, perfil e tags antes de salvar.";
  } else if (question.includes("tag") || question.includes("#")) {
    const tags = topTags(month);
    elements.assistantAnswer.textContent = tags.length ? `Tags do mes: ${tags.map((tag) => `#${tag.name} ${formatCurrency(tag.amount)}`).join(" | ")}.` : "Ainda nao ha tags neste mes.";
  } else if (question.includes("assinatura")) {
    const lines = state.subscriptions.filter(profileMatches).map((item) => `${item.name}: ${formatCurrency(item.amount)}`);
    elements.assistantAnswer.textContent = lines.length ? lines.join(" | ") : "Nenhuma assinatura manual neste perfil.";
  } else if (question.includes("duplicado")) {
    const duplicates = findDuplicates(month);
    elements.assistantAnswer.textContent = duplicates.length ? `${duplicates.length} possivel(is) duplicado(s) no mes.` : "Nao vi duplicados aparentes.";
  } else if (question.includes("fim do mes") || question.includes("previsao")) {
    elements.assistantAnswer.textContent = `Nesse ritmo voce fecha em ${formatCurrency(projection.projectedBalance)}. ${projection.tip}`;
  } else if (purchaseAmount && (question.includes("comprar") || question.includes("compra") || question.includes("cabe"))) {
    const after = totals.balance - parseCurrency(purchaseAmount);
    elements.assistantAnswer.textContent = `Essa compra deixaria o saldo em ${formatCurrency(after)}. ${after < 0 ? "Eu seguraria agora." : "Cabe, mas confira metas e fatura antes."}`;
  } else if (scoped) {
    elements.assistantAnswer.textContent = `${scoped.label}: ${formatCurrency(scoped.amount)} em ${scoped.count} lancamento(s) neste mes.`;
  } else if (question.includes("gastar") || question.includes("hoje")) {
    elements.assistantAnswer.textContent = `Hoje eu ficaria em ate ${formatCurrency(getDailySafe(totals.balance, month))}.`;
  } else if (question.includes("cartao") || question.includes("fatura")) {
    elements.assistantAnswer.textContent = `Seu cartao aberto no mes esta em ${formatCurrency(totals.card)}.`;
  } else if (question.includes("economizar") || question.includes("cortar")) {
    elements.assistantAnswer.textContent = top ? `Comece por ${top.name}. Ela tem ${formatCurrency(top.amount)} no mes.` : "Ainda nao ha gastos suficientes para analisar.";
  } else if (question.includes("meta")) {
    const goals = state.goals.filter(profileMatches);
    elements.assistantAnswer.textContent = goals.length ? `Voce tem ${goals.length} meta(s). A prioridade e a que vence primeiro.` : "Cadastre uma meta para eu acompanhar.";
  } else if (question.includes("offline")) {
    elements.assistantAnswer.textContent = state.settings.offlineOnly ? "O modo offline total esta ativo. O app salva tudo neste aparelho." : "O app ja salva localmente. Ative Offline total nos ajustes para reforcar esse modo.";
  } else {
    elements.assistantAnswer.textContent = `Resumo do perfil ${profileLabel(activeProfile()).toLowerCase()}: saldo ${formatCurrency(totals.balance)}, entradas ${formatCurrency(totals.income)}, saidas ${formatCurrency(totals.expense)}, cartao ${formatCurrency(totals.card)} e score ${score.score}/100.`;
  }
}

function suggestFromReceipt(event) {
  event.preventDefault();
  const text = `${elements.receiptText.value} ${elements.receiptFile.files[0]?.name || ""}`.trim();
  if (!text) {
    showToast("Envie a foto e cole algum texto/valor visivel.");
    return;
  }
  const parsed = parseSmartText(text);
  if (!parsed) {
    showToast("Nao encontrei valor no comprovante.");
    return;
  }
  pendingAiEntry = parsed;
  elements.smartEntryInput.value = text;
  elements.aiPreview.textContent = aiSummary(parsed);
  elements.aiPreview.classList.add("show");
  elements.aiConfirmActions.classList.remove("hidden");
  showToast("Comprovante decifrado. Confira e confirme.");
}

function parseSmartText(text) {
  const raw = String(text || "").trim();
  const normalized = normalize(raw);
  const amountText = findAmount(raw);
  if (!amountText) return null;
  const amount = parseCurrency(amountText);
  if (!amount) return null;

  {
    const pixInfo = inferPixInfo(normalized, raw);
    const incomeWords = ["recebi", "recebido", "entrada", "entrou", "ganhei", "salario", "pix recebido", "venda", "renda", "credito recebido"];
    const cardWords = ["cartao", "credito", "fatura", "parcelei"];
    const type = pixInfo?.type || (hasAny(normalized, incomeWords) ? "income" : hasAny(normalized, cardWords) ? "card" : "expense");
    const profile = inferProfile(normalized, type);
    const category = inferCategory(normalized, type, profile);
    const installments = inferInstallments(normalized);
    const date = inferDate(normalized);
    const description = pixInfo?.description || cleanDescription(raw, amountText) || getCategory(category).name;
    const contactAction = inferContactAction(normalized, raw);
    const tags = inferTags(raw, normalized, category, pixInfo, profile);

    return {
      id: createId(),
      type,
      description,
      amount,
      category,
      date,
      installments,
      tags,
      profile,
      source: pixInfo ? "pix" : hasAny(normalized, ["nota", "cupom", "recibo", "comprovante"]) ? "receipt" : "text",
      contactAction,
      group: installments > 1 ? createId() : null
    };
  }

  const incomeWords = ["recebi", "recebido", "entrada", "entrou", "ganhei", "salario", "salário", "pix recebido", "venda", "renda"];
  const cardWords = ["cartao", "cartão", "credito", "crédito", "fatura", "parcelei"];
  const type = hasAny(normalized, incomeWords) ? "income" : hasAny(normalized, cardWords) ? "card" : "expense";
  const category = inferCategory(normalized, type);
  const installments = inferInstallments(normalized);
  const date = inferDate(normalized);
  const description = cleanDescription(raw, amountText) || getCategory(category).name;
  const contactAction = inferContactAction(normalized, raw);

  return {
    id: createId(),
    type,
    description,
    amount,
    category,
    date,
    installments,
    contactAction,
    group: installments > 1 ? createId() : null
  };
}

function inferPixInfo(normalized, raw) {
  if (!normalized.includes("pix")) return null;
  const received = hasAny(normalized, ["pix recebido", "recebido via pix", "voce recebeu", "recebi pix", "credito pix", "transferencia recebida", "pagador"]);
  const sent = hasAny(normalized, ["pix enviado", "pix realizado", "pagamento pix", "comprovante de pagamento", "transferencia enviada", "debito pix", "paguei pix"]);
  const type = received && !sent ? "income" : "expense";
  const counterparty = extractCounterparty(raw, received);
  const description = `${type === "income" ? "Pix recebido" : "Pix enviado"}${counterparty ? ` - ${counterparty}` : ""}`;
  return { type, counterparty, description };
}

function extractCounterparty(raw, received) {
  const labels = received
    ? ["pagador", "remetente", "de", "nome"]
    : ["favorecido", "destinatario", "recebedor", "para", "nome"];
  const lines = String(raw || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const found = lines.find((line) => labels.some((label) => normalize(line).startsWith(label)));
  if (!found) {
    const match = raw.match(/(?:para|pra|de)\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})?)/i);
    return match ? cleanName(match[1]) : "";
  }
  const [, value = ""] = found.split(/:|-/);
  return cleanName(value || found.replace(/^(pagador|remetente|favorecido|destinatario|recebedor|nome|para|de)\s*/i, ""));
}

function inferProfile(text, type) {
  const businessWords = ["cliente", "fornecedor", "venda", "servico", "serviço", "cnpj", "mei", "empresa", "negocio", "negócio", "orcamento", "orçamento", "nota fiscal", "recebivel", "recebível", "lucro"];
  if (hasAny(text, businessWords)) return "business";
  if (type === "income" && activeProfile() === "business") return "business";
  return activeProfile();
}

function inferTags(raw, normalized, category, pixInfo, profile) {
  const tags = parseTags(raw.match(/#[\wÀ-ÿ-]+/g)?.join(" ") || "");
  if (profile === "business") tags.push("empresa");
  if (pixInfo) tags.push("pix");
  if (pixInfo?.counterparty && profile === "business") tags.push("cliente");
  if (category && category !== "outros") tags.push(category);
  return unique(tags).slice(0, 6);
}

function inferContactAction(normalized, raw) {
  const paymentWords = ["paguei", "pagar parte", "abater", "quitei", "recebi de", "me pagou"];
  const lentWords = ["emprestei", "emprestimo para", "emprestei para"];
  const owedWords = ["devo", "peguei emprestado", "devo para"];
  if (!hasAny(normalized, paymentWords.concat(lentWords, owedWords))) return null;
  const personMatch = raw.match(/(?:para|pra|de)\s+([A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})?)/i);
  const person = personMatch ? personMatch[1].trim() : "Contato";
  if (hasAny(normalized, lentWords)) return { kind: "lent", targetKind: "lent", person };
  if (hasAny(normalized, owedWords)) return { kind: "owed", targetKind: "owed", person };
  const targetKind = normalized.includes("recebi") || normalized.includes("me pagou") ? "lent" : "owed";
  return { kind: "payment", targetKind, person };
}

function findAmount(text) {
  const source = String(text || "");
  const matches = Array.from(source.matchAll(/(?:r\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{2})|(?:r\$\s*)?\d+(?:[\.,]\d{2})?/gi));
  const candidates = matches.filter((match) => source.slice(match.index + match[0].length).trim()[0]?.toLowerCase() !== "x");
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const totalLine = lines.reverse().find((line) => /(total|valor|pago|pagamento|pix|debito|credito|crédito|débito)/i.test(normalize(line)) && /[\.,]\d{2}/.test(line));
  if (totalLine) {
    const lineMatches = Array.from(totalLine.matchAll(/(?:r\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{2})|(?:r\$\s*)?\d+(?:[\.,]\d{2})?/gi));
    if (lineMatches.length) return lineMatches[lineMatches.length - 1][0];
  }
  const withCents = candidates.filter((match) => /[\.,]\d{2}/.test(match[0]));
  const chosen = withCents.length
    ? withCents.sort((a, b) => parseCurrency(b[0]) - parseCurrency(a[0]))[0]
    : candidates[candidates.length - 1];
  return chosen ? chosen[0] : "";
}

function inferCategory(text, type, profile = activeProfile()) {
  const rules = [
    ["mercado", ["mercado", "supermercado", "compras", "atacadao", "atacadão", "assai", "assaí"]],
    ["moradia", ["aluguel", "luz", "agua", "água", "internet", "condominio", "condomínio", "casa"]],
    ["transporte", ["uber", "99", "onibus", "ônibus", "gasolina", "posto", "combustivel", "combustível"]],
    ["saude", ["farmacia", "farmácia", "remedio", "remédio", "medico", "médico", "consulta", "exame"]],
    ["lazer", ["ifood", "lanche", "pizza", "restaurante", "netflix", "cinema", "bar"]],
    ["empresa", ["cliente", "fornecedor", "cnpj", "mei", "empresa", "negocio", "servico", "nota fiscal", "material"]],
    ["cartao", ["cartao", "cartão", "fatura"]]
  ];
  if (type === "income") return "renda";
  const found = rules.find(([, words]) => hasAny(text, words));
  return found ? found[0] : type === "card" ? "cartao" : profile === "business" ? "empresa" : "outros";
}

function inferInstallments(text) {
  const match = text.match(/(\d{1,2})\s*x/);
  return match ? Math.max(1, Number(match[1])) : 1;
}

function inferDate(text) {
  if (text.includes("ontem")) return shiftDate(-1);
  if (text.includes("amanha") || text.includes("amanhã")) return shiftDate(1);
  return todayISO();
}

function cleanDescription(text, amountText) {
  return text
    .replace(amountText, "")
    .replace(/r\$/gi, "")
    .replace(/#[\wÀ-ÿ-]+/g, "")
    .replace(/\b(gastei|paguei|comprei|recebi|entrou|entrada|saida|saída|cartao|cartão|credito|crédito|pix|hoje|ontem|amanha|amanhã)\b/gi, "")
    .replace(/\b\d{1,2}\s*x\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 42);
}

function matchesSearch(item, query) {
  const text = normalize(query);
  if (!text) return true;
  const category = normalize(getCategory(item.category).name);
  const tags = (item.tags || []).join(" ");
  const haystack = normalize(`${item.description} ${category} ${item.type} ${item.date} ${tags} ${profileLabel(item.profile || "personal")}`);
  const amountMatch = text.match(/(?:maior|acima)\s+(?:que\s+)?(\d+(?:[\.,]\d{1,2})?)/);
  if (amountMatch && item.amount <= parseCurrency(amountMatch[1])) return false;
  const lowerMatch = text.match(/(?:menor|abaixo)\s+(?:que\s+)?(\d+(?:[\.,]\d{1,2})?)/);
  if (lowerMatch && item.amount >= parseCurrency(lowerMatch[1])) return false;
  if (text.includes("entrada") && item.type !== "income") return false;
  if ((text.includes("cartao") || text.includes("cartão")) && item.type !== "card") return false;
  if ((text.includes("saida") || text.includes("saída") || text.includes("gasto")) && item.type === "income") return false;
  if (text.includes("ontem") && item.date !== shiftDate(-1)) return false;
  if (text.includes("hoje") && item.date !== todayISO()) return false;
  return text.split(" ").filter(Boolean).every((word) => ["maior", "menor", "acima", "abaixo", "que", "tag"].includes(word) || haystack.includes(word.replace(/^#/, "")));
}

function aiSummary(parsed) {
  if (parsed.contactAction) {
    const action = parsed.contactAction.kind === "payment" ? "pagamento em contato" : parsed.contactAction.kind === "lent" ? "emprestimo" : "divida";
    return `Vou registrar ${action}: ${parsed.contactAction.person} - ${formatCurrency(parsed.amount)}.`;
  }
  const tags = parsed.tags?.length ? ` Tags: ${parsed.tags.map((tag) => `#${tag}`).join(" ")}.` : "";
  return `Vou adicionar: ${parsed.type === "income" ? "entrada" : parsed.type === "card" ? "cartao" : "saida"} de ${formatCurrency(parsed.amount)} em ${getCategory(parsed.category).name}, perfil ${profileLabel(parsed.profile).toLowerCase()}.${tags}`;
}

function isDuplicate(parsed) {
  return state.transactions.some((item) => item.date === parsed.date && item.type === parsed.type && Math.abs(item.amount - parsed.amount) < 0.01 && normalize(item.description) === normalize(parsed.description));
}

function forecastMonthEnd(month) {
  const items = monthlyItems(month).filter((item) => item.type !== "income");
  const totals = getTotals(month);
  const today = new Date();
  const isCurrent = month === currentMonth();
  const day = isCurrent ? today.getDate() : new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const totalDays = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const spent = items.reduce((sum, item) => sum + item.amount, 0);
  const projectedSpending = day ? (spent / day) * totalDays : spent;
  const projectedBalance = totals.income - projectedSpending;
  return {
    projectedBalance,
    message: projectedBalance >= 0 ? "Tendencia positiva" : "Risco de fechar negativo",
    tip: projectedBalance < 0 ? "Ative o modo emergencia e corte variaveis." : "Mantenha o ritmo atual."
  };
}

function weekSafeAmount() {
  const totals = getTotals(currentMonth());
  const date = new Date();
  const dayOfWeek = date.getDay() || 7;
  const daysLeft = Math.max(8 - dayOfWeek, 1);
  return Math.max(totals.balance / daysLeft, 0);
}

function habitStats(month) {
  const days = daysInMonth(month);
  const spentByDay = {};
  monthlyItems(month).filter((item) => item.type !== "income").forEach((item) => {
    spentByDay[item.date] = (spentByDay[item.date] || 0) + item.amount;
  });
  const noSpendDays = days.filter((day) => !spentByDay[day]).length;
  const biggestEntry = Object.entries(spentByDay).sort((a, b) => b[1] - a[1])[0];
  return { noSpendDays, biggestDay: biggestEntry ? { date: biggestEntry[0], amount: biggestEntry[1] } : null };
}

function detectSubscriptions(month) {
  const grouped = {};
  monthlyItems(month).forEach((item) => {
    const key = normalize(item.description);
    if (subscriptionKeywords.some((word) => key.includes(word))) {
      grouped[key] = grouped[key] || { name: item.description, amount: 0 };
      grouped[key].amount += item.amount;
    }
  });
  return Object.values(grouped);
}

function findDuplicates(month) {
  const items = monthlyItems(month);
  const pairs = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i];
      const b = items[j];
      if (a.date === b.date && a.type === b.type && Math.abs(a.amount - b.amount) < 0.01 && normalize(a.description) === normalize(b.description)) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
}

function contactTotals(profile = activeProfile()) {
  return state.contacts.filter((item) => profileMatches(item, profile)).reduce((acc, item) => {
    const open = Math.max(item.amount - item.paid, 0);
    if (item.kind === "lent") acc.toReceive += open;
    else acc.toPay += open;
    return acc;
  }, { toReceive: 0, toPay: 0 });
}

function payContactPrompt(id) {
  const item = state.contacts.find((entry) => entry.id === id);
  if (!item) return;
  const value = parseCurrency(prompt(`Quanto pagar/abater de ${item.name}?`, ""));
  if (!value) return;
  item.paid = Math.min(item.amount, item.paid + value);
  state.transactions.unshift({
    id: createId(),
    type: item.kind === "lent" ? "income" : "expense",
    description: `${item.kind === "lent" ? "Recebido de" : "Pago para"} ${item.name}`,
    amount: value,
    category: item.kind === "lent" ? "renda" : "outros",
    date: todayISO(),
    tags: ["contato"],
    profile: item.profile || activeProfile(),
    contactId: item.id
  });
  saveState();
  render();
}

function applyContactAction(action, parsed) {
  const existing = state.contacts.find((item) => normalize(item.name) === normalize(action.person) && item.kind === action.targetKind && item.amount > item.paid && profileMatches(item, parsed.profile));
  if (action.kind === "payment" && existing) {
    existing.paid = Math.min(existing.amount, existing.paid + parsed.amount);
    state.transactions.unshift({
      id: createId(),
      type: existing.kind === "lent" ? "income" : "expense",
      description: `${existing.kind === "lent" ? "Recebido de" : "Pago para"} ${existing.name}`,
      amount: parsed.amount,
      category: existing.kind === "lent" ? "renda" : "outros",
      date: parsed.date,
      tags: unique(["contato"].concat(parsed.tags || [])),
      profile: existing.profile || parsed.profile || activeProfile(),
      contactId: existing.id
    });
  } else {
    state.contacts.push({
      id: createId(),
      name: action.person,
      kind: action.targetKind,
      amount: parsed.amount,
      paid: 0,
      note: parsed.description,
      date: parsed.date,
      profile: parsed.profile || activeProfile()
    });
  }
  saveState();
}

function simpleStatus(title, text) {
  return `<div class="simple-item"><span>${title}</span><strong>${text}</strong></div>`;
}

function importBankMessages(payload) {
  const messages = Array.isArray(payload) ? payload : parseJSON(payload) || [];
  let count = 0;
  messages.forEach((message) => {
    const parsed = parseSmartText(message);
    if (parsed && !isDuplicate(parsed)) {
      applyParsedEntry(parsed);
      count += 1;
    }
  });
  render();
  showToast(`${count} mensagem(ns) importada(s).`);
}

function togglePrivacy() {
  state.settings.privacyMode = !state.settings.privacyMode;
  saveState();
  document.body.classList.toggle("privacy-blur", Boolean(state.settings.privacyMode));
  showToast(state.settings.privacyMode ? "Valores ocultos." : "Valores visiveis.");
}

function importSms() {
  if (window.Android && typeof window.Android.importSms === "function") {
    window.Android.importSms();
    return;
  }
  showToast("Importacao de SMS funciona no APK Android.");
}

function importNotifications() {
  if (window.Android && typeof window.Android.importNotifications === "function") {
    window.Android.importNotifications();
    return;
  }
  showToast("Importacao de notificacoes funciona no APK Android.");
}

function openNotificationSettings() {
  if (window.Android && typeof window.Android.openNotificationSettings === "function") {
    window.Android.openNotificationSettings();
    return;
  }
  showToast("Ative no Android pela versao APK.");
}

function savePin(event) {
  event.preventDefault();
  const hasPin = Boolean(state.settings.pin || state.settings.pinHash);
  if (hasPin && !verifyPin(elements.currentPinInput.value)) {
    showToast("PIN atual incorreto.");
    return;
  }
  if (!isStrongPin(elements.pinInput.value) || elements.pinInput.value !== elements.pinConfirm.value) {
    showToast("Use PIN com 6+ digitos, sem sequencia simples.");
    return;
  }
  const salt = createId();
  state.settings.pinSalt = salt;
  state.settings.pinHash = hashPin(elements.pinInput.value, salt);
  state.settings.pinChangedAt = new Date().toISOString();
  delete state.settings.pin;
  state.settings.failedUnlocks = 0;
  state.settings.lockUntil = 0;
  saveState();
  elements.pinForm.reset();
  showToast("PIN seguro salvo neste aparelho.");
}

function unlockApp(event) {
  event.preventDefault();
  const now = Date.now();
  if (state.settings.lockUntil && now < state.settings.lockUntil) {
    showToast("Muitas tentativas. Aguarde alguns minutos.");
    return;
  }
  if (verifyPin(elements.unlockPin.value)) {
    elements.lockScreen.classList.remove("active");
    elements.unlockPin.value = "";
    state.settings.failedUnlocks = 0;
    state.settings.lockUntil = 0;
    saveState();
  } else {
    state.settings.failedUnlocks = (state.settings.failedUnlocks || 0) + 1;
    if (state.settings.failedUnlocks >= 5) {
      state.settings.lockUntil = Date.now() + 5 * 60 * 1000;
      showToast("Bloqueado por 5 minutos.");
    } else {
      showToast(`PIN incorreto. Tentativa ${state.settings.failedUnlocks}/5.`);
    }
    saveState();
  }
}

function lockApp() {
  if (!hasPinConfigured()) {
    switchTab("settings");
    showToast("Crie um PIN primeiro.");
    return;
  }
  elements.lockScreen.classList.add("active");
  elements.unlockPin.focus();
}

function exportCSV() {
  const rows = [["data", "tipo", "descricao", "categoria", "valor"], ...state.transactions.map((item) => [item.date, item.type, item.description, getCategory(item.category).name, item.amount.toFixed(2)])];
  download(`meu-caixa-${todayISO()}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

function exportJSON() {
  download(`meu-caixa-backup-${todayISO()}.json`, JSON.stringify(state, null, 2), "application/json;charset=utf-8");
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      Object.assign(state, normalizeState(imported));
      saveState();
      fillSelects();
      render();
      showToast("Backup importado.");
    } catch {
      showToast("Backup invalido.");
    }
  };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm("Apagar todos os dados deste aparelho?")) return;
  localStorage.removeItem(storageKey);
  location.reload();
}

function removeItem(collection, id) {
  if (collection === "tags") {
    state.tags = state.tags.filter((item) => item.id !== id);
    state.transactions.forEach((item) => { item.tags = (item.tags || []).filter((tag) => tag !== id); });
    saveState();
    render();
    return;
  }
  state[collection] = state[collection].filter((item) => item.id !== id);
  saveState();
  render();
}

function removeCategory(id) {
  state.categories = state.categories.filter((item) => item.id !== id);
  state.transactions.forEach((item) => { if (item.category === id) item.category = "outros"; });
  saveState();
  fillSelects();
  render();
}

function bindRemoveButtons() {
  $$("[data-remove]").forEach((button) => {
    button.onclick = () => {
      const [collection, id] = button.dataset.remove.split(":");
      collection === "category" ? removeCategory(id) : removeItem(collection, id);
    };
  });
}

function getTotals(month, profile = activeProfile()) {
  return monthlyItems(month, profile).reduce((acc, item) => {
    if (item.type === "income") acc.income += item.amount;
    else if (item.type === "card") acc.card += item.amount;
    else acc.expense += item.amount;
    acc.balance = acc.income - acc.expense - acc.card;
    return acc;
  }, { income: 0, expense: 0, card: 0, balance: 0 });
}

function monthlyItems(month, profile = activeProfile()) {
  return state.transactions.filter((item) => item.date.startsWith(month) && profileMatches(item, profile));
}

function expensesByCategory(items) {
  return items.filter((item) => item.type !== "income").reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
}

function topCategory(month, profile = activeProfile()) {
  const totals = expensesByCategory(monthlyItems(month, profile));
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  return top ? { ...getCategory(top[0]), amount: top[1] } : null;
}

function budgetAlerts(month) {
  const totals = expensesByCategory(monthlyItems(month));
  return state.categories.filter((category) => category.budget > 0 && (totals[category.id] || 0) / category.budget >= 0.8).map((category) => category.name);
}

function getDailySafe(balance, month) {
  const today = new Date();
  const isCurrent = month === currentMonth();
  const totalDays = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const day = isCurrent ? today.getDate() : 1;
  return Math.max(balance / Math.max(totalDays - day + 1, 1), 0);
}

function loadState() {
  const saved = parseJSON(localStorage.getItem(storageKey));
  if (saved) return normalizeState(saved);
  const old = parseJSON(localStorage.getItem(oldStorageKey));
  return normalizeState({ transactions: Array.isArray(old) ? old : demoTransactions() });
}

function normalizeState(input) {
  const categories = mergeCategories(input.categories?.length ? input.categories : []);
  const tags = mergeTags(input.tags?.length ? input.tags : []);
  return {
    ui: { type: input.ui?.type || "expense" },
    categories,
    tags,
    transactions: (input.transactions?.length ? input.transactions : demoTransactions()).map(normalizeTransaction),
    bills: (input.bills || []).map((item) => ({ ...item, profile: item.profile || "personal" })),
    subscriptions: (input.subscriptions || []).map((item) => ({ ...item, profile: item.profile || "personal" })),
    goals: (input.goals || []).map((item) => ({ ...item, profile: item.profile || "personal" })),
    wishes: (input.wishes || []).map((item) => ({ ...item, profile: item.profile || "personal" })),
    contacts: (input.contacts || []).map((item) => ({ ...item, profile: item.profile || "personal" })),
    quickActions: (input.quickActions?.length ? input.quickActions : [...defaultQuickActions]).map((item) => ({ ...item, tags: item.tags || [], profile: item.profile || "personal" })),
    settings: {
      ...(input.settings || {}),
      activeProfile: input.settings?.activeProfile || "personal",
      offlineOnly: Boolean(input.settings?.offlineOnly)
    }
  };
}

function mergeCategories(existing) {
  const byId = new Map(defaultCategories.map((category) => [category.id, { ...category }]));
  existing.forEach((category) => byId.set(category.id, { ...category }));
  return Array.from(byId.values());
}

function mergeTags(existing) {
  const byId = new Map(defaultTags.map((tag) => [tag.id, { ...tag }]));
  existing.forEach((tag) => byId.set(tag.id, { id: tag.id || slug(tag.name), name: normalizeTagName(tag.name || tag.id) }));
  return Array.from(byId.values());
}

function normalizeTransaction(item) {
  return {
    ...item,
    tags: Array.isArray(item.tags) ? unique(item.tags.map(normalizeTagName).filter(Boolean)) : [],
    profile: item.profile || "personal"
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function demoTransactions() {
  return [
    { id: createId(), type: "income", description: "Salario", amount: 4200, category: "renda", date: todayISO(), tags: ["casa"], profile: "personal" },
    { id: createId(), type: "expense", description: "Mercado da semana", amount: 185.9, category: "mercado", date: todayISO(), tags: ["casa"], profile: "personal" },
    { id: createId(), type: "expense", description: "Internet", amount: 99.9, category: "moradia", date: todayISO(), tags: ["fixa"], profile: "personal" }
  ];
}

function getCategory(id) {
  return state.categories.find((category) => category.id === id) || state.categories.find((category) => category.id === "outros") || { name: "Outros" };
}

function activeProfile() {
  return state.settings.activeProfile === "business" ? "business" : "personal";
}

function profileLabel(profile = activeProfile()) {
  return profile === "business" ? "Empreendedor" : "Pessoal";
}

function profileMatches(item, profile = activeProfile()) {
  return (item.profile || "personal") === profile;
}

function metric(title, value, subtitle) {
  return `<div class="metric"><strong>${value}</strong><span>${title} - ${subtitle}</span></div>`;
}

function simpleItem(title, subtitle, removeToken) {
  const button = removeToken ? `<button class="text-button" type="button" data-remove="${removeToken}">Remover</button>` : "";
  return `<div class="simple-item"><strong>${title}</strong><span>${subtitle}</span>${button}</div>`;
}

function progressItem(name, value, target, status, extra = "") {
  const width = Math.round(Math.min(value / target, 1) * 100);
  return `<div class="budget-item"><div class="budget-line"><strong>${name}</strong><span>${formatCurrency(value)} / ${formatCurrency(target)}</span></div><div class="progress ${status}"><div style="width:${width}%"></div></div>${extra ? `<div class="simple-item"><span>${extra}</span></div>` : ""}</div>`;
}

function empty(text) {
  return `<div class="empty-state">${text}</div>`;
}

function parseJSON(value) {
  try { return JSON.parse(value); } catch { return null; }
}

function parseCurrency(value) {
  return Number(String(value || "").replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return todayISO().slice(0, 7);
}

function addMonths(dateValue, count) {
  const date = new Date(`${dateValue}T12:00:00`);
  date.setMonth(date.getMonth() + count);
  return date.toISOString().slice(0, 10);
}

function previousMonth(month) {
  const date = new Date(`${month}-01T12:00:00`);
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 7);
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysInMonth(month) {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const total = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: total }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`);
}

function createId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalize(text) {
  return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function parseTags(value) {
  return unique(String(value || "")
    .split(/[,\s]+/)
    .map((tag) => normalizeTagName(tag))
    .filter(Boolean));
}

function normalizeTagName(value) {
  return normalize(String(value || "").replace(/^#/, "")).replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24);
}

function registerTags(tags) {
  parseTags(tags.join(" ")).forEach((tag) => {
    if (!state.tags.some((item) => item.id === tag)) {
      state.tags.push({ id: tag, name: tag });
    }
  });
}

function getAllTags() {
  const byId = new Map((state.tags || []).map((tag) => [tag.id, tag]));
  state.transactions.forEach((item) => (item.tags || []).forEach((tag) => byId.set(tag, { id: tag, name: tag })));
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function topTags(month) {
  const stats = {};
  monthlyItems(month).forEach((item) => {
    (item.tags || []).forEach((tag) => {
      stats[tag] = stats[tag] || { name: tag, amount: 0, count: 0 };
      stats[tag].amount += item.type === "income" ? 0 : item.amount;
      stats[tag].count += 1;
    });
  });
  return Object.values(stats).sort((a, b) => b.amount - a.amount || b.count - a.count);
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function cleanName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().replace(/[^\wÀ-ÿ .&'-]/g, "").slice(0, 32);
}

function hasAny(text, words) {
  return words.some((word) => text.includes(normalize(word)));
}

function signedCurrency(value) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatCurrency(value)}`;
}

function wishRank(priority) {
  return { Alta: 1, Media: 2, Baixa: 3 }[priority] || 4;
}

function slug(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || createId();
}

function financialScore(month) {
  const totals = getTotals(month);
  const alerts = budgetAlerts(month);
  const duplicates = findDuplicates(month).length;
  const habits = habitStats(month);
  const contacts = contactTotals();
  let score = 60;
  if (totals.balance > 0) score += 15;
  if (totals.income && (totals.expense + totals.card) / totals.income < 0.75) score += 12;
  if (totals.card / Math.max(totals.income, 1) < 0.25) score += 8;
  if (!alerts.length) score += 8;
  if (habits.noSpendDays >= 8) score += 5;
  if (contacts.toPay === 0) score += 4;
  score -= Math.min(alerts.length * 6, 18);
  score -= Math.min(duplicates * 5, 15);
  if (totals.balance < 0) score -= 25;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 80 ? "forte" : score >= 60 ? "estavel" : score >= 40 ? "atenção" : "critico";
  const tip = score >= 80
    ? "Seu mes esta bem controlado; mantenha limites e reserva."
    : score >= 60
      ? "Bom caminho, mas acompanhe fatura, assinaturas e categorias perto do limite."
      : "Vale reduzir gastos variaveis e revisar compras repetidas agora.";
  return { score, label, tip };
}

function nextFinancialEvents(month) {
  const today = todayISO();
  const events = [];
  state.bills.filter(profileMatches).forEach((bill) => events.push({ date: `${month}-${String(bill.day).padStart(2, "0")}`, text: `${bill.name} ${formatCurrency(bill.amount)}` }));
  state.subscriptions.filter(profileMatches).forEach((item) => events.push({ date: `${month}-${String(item.day).padStart(2, "0")}`, text: `${item.name} ${formatCurrency(item.amount)}` }));
  return events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)
    .map((event) => `${formatDate(event.date)}: ${event.text}`);
}

function spendingFromQuestion(question, month) {
  const words = question.split(" ").filter((word) => word.length > 2 && !["quanto", "gastei", "gasto", "com", "em", "mes", "esse", "essa", "este", "esta"].includes(word));
  const candidates = state.categories.map((item) => ({ label: item.name, term: normalize(item.name) }))
    .concat(getAllTags().map((item) => ({ label: `#${item.name}`, term: item.name })));
  const found = candidates.find((candidate) => question.includes(candidate.term) || words.includes(candidate.term));
  if (!found) return null;
  const items = monthlyItems(month).filter((item) => item.type !== "income" && normalize(`${item.description} ${getCategory(item.category).name} ${(item.tags || []).join(" ")}`).includes(found.term));
  return { label: found.label, amount: items.reduce((sum, item) => sum + item.amount, 0), count: items.length };
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(() => {
    showToast("Offline automatico indisponivel neste navegador.");
  });
}

function hasPinConfigured() {
  return Boolean(state.settings.pin || state.settings.pinHash);
}

function verifyPin(pin) {
  if (!pin) return false;
  if (state.settings.pinHash) return hashPin(pin, state.settings.pinSalt || "") === state.settings.pinHash;
  return state.settings.pin && btoa(`meu-caixa:${pin}`) === state.settings.pin;
}

function isStrongPin(pin) {
  if (!/^\d{6,10}$/.test(pin)) return false;
  if (/^(\d)\1+$/.test(pin)) return false;
  const sequence = "01234567890123456789";
  const reverse = "98765432109876543210";
  return !sequence.includes(pin) && !reverse.includes(pin);
}

function hashPin(pin, salt) {
  let hash = 2166136261;
  const value = `${salt}:meu-caixa:${pin}`;
  for (let round = 0; round < 6000; round += 1) {
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i) + round;
      hash = Math.imul(hash, 16777619);
    }
  }
  return (hash >>> 0).toString(16);
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(cell) {
  return `"${String(cell).replace(/"/g, '""')}"`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2800);
}
