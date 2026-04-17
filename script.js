let currentMode = 'opensearch';

function setMode(mode) {
  currentMode = mode;
  document.getElementById('modeToggle').checked = (mode === 'snowflake');
  updateUI();
}

function onToggleChange() {
  currentMode = document.getElementById('modeToggle').checked ? 'snowflake' : 'opensearch';
  updateUI();
}

function updateUI() {
  const isSnowflake = currentMode === 'snowflake';

  document.getElementById('title').textContent = isSnowflake ? 'Generate Snowflake Query' : 'See in OpenSearch';

  document.getElementById('label-opensearch').classList.toggle('active', !isSnowflake);
  document.getElementById('label-snowflake').classList.toggle('active', isSnowflake);

  document.getElementById('btn-opensearch').style.display = isSnowflake ? 'none' : 'block';
  document.getElementById('btn-snowflake').style.display  = isSnowflake ? 'block' : 'none';

  document.getElementById('queryOutput').style.display = 'none';
  document.getElementById('copiedMsg').style.display = 'none';
}

function gerarLinkOpenSearch() {
  const playerId   = document.getElementById("playerId").value.trim();
  const ticketCode = document.getElementById("ticketCode").value.trim();
  const startDate  = document.getElementById("startDate").value;
  const endDate    = document.getElementById("endDate").value;

  if (!playerId || !ticketCode || !startDate || !endDate) {
    alert("Fill all fields!");
    return;
  }

  const from = startDate + "T00:00:00.000Z";
  const to   = endDate   + "T23:59:59.999Z";

  const base = "https://open-search-critical.services.production.betler.superbet.com/_dashboards/app/data-explorer/discover?security_tenant=global";

  const _a = "(discover:(columns:!(metadata.ticket_code,domain,action,amount,summary.uncommitted,summary.committed,transaction_amount_cash.uncommitted,transaction_amount_cash.committed,transaction_id,denied_reason,funding_type,summary.bonus),isDirty:!t,sort:!()),metadata:(indexPattern:b4bd6b80-55f3-11ed-9502-23ca8b926764,view:discover))";

  const _g = "(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'" + from + "',to:'" + to + "'))";

  const _q = "(" +
    "filters:!(" +
      "('$state':(store:appState),meta:(alias:!n,disabled:!f,index:b4bd6b80-55f3-11ed-9502-23ca8b926764,key:customer_id,negate:!f,params:(query:'" + playerId + "'),type:phrase),query:(match_phrase:(customer_id:'" + playerId + "')))," +
      "('$state':(store:appState),meta:(alias:!n,disabled:!f,index:b4bd6b80-55f3-11ed-9502-23ca8b926764,key:domain,negate:!f,params:(query:sportsbook),type:phrase),query:(match_phrase:(domain:sportsbook)))," +
      "('$state':(store:appState),meta:(alias:!n,disabled:!f,index:b4bd6b80-55f3-11ed-9502-23ca8b926764,key:metadata.ticket_code,negate:!f,params:(query:'" + ticketCode + "'),type:phrase),query:(match_phrase:(metadata.ticket_code:'" + ticketCode + "')))" +
    ")," +
    "query:(language:kuery,query:'')" +
  ")";

  const fragment = "#?_a=" + encodeURIComponent(_a) +
                   "&_g=" + encodeURIComponent(_g) +
                   "&_q=" + encodeURIComponent(_q);

  window.open(base + fragment, "_blank");
}

function gerarQuerySnowflake() {
  const playerId   = document.getElementById("playerId").value.trim();
  const ticketCode = document.getElementById("ticketCode").value.trim();
  const startDate  = document.getElementById("startDate").value;
  const endDate    = document.getElementById("endDate").value;

  if (!playerId || !ticketCode || !startDate || !endDate) {
    alert("Preencha todos os campos!");
    return;
  }

  const query =
`SELECT *
FROM dwh.f_wallet_transaction
WHERE player_id = '${playerId}'
  AND ticket_code = '${ticketCode}'
  AND transaction_dt >= '${startDate} 00:00:00'
  AND transaction_dt <= '${endDate} 23:59:59'
ORDER BY transaction_dt;`;

  document.getElementById('queryText').value = query;
  document.getElementById('queryOutput').style.display = 'block';
  document.getElementById('copiedMsg').style.display = 'none';
}

function copiarQuery() {
  const text = document.getElementById('queryText').value;
  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById('copiedMsg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 2000);
  });
}
