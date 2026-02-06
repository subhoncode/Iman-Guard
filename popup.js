const input = document.getElementById('domainInput');
const btn = document.getElementById('addRuleBtn');
const list = document.getElementById('rulesList');

const START_ID = 1000;

async function refreshList() {
  list.innerHTML = '';
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  
  rules.forEach(rule => {
    const div = document.createElement('div');
    div.className = 'rule-item';

    const cleanName = decodeURIComponent(rule.condition.urlFilter.replace(/\*/g, ''));
    div.innerHTML = `
      <span>${cleanName}</span>
      <button class="del-btn" data-id="${rule.id}">Delete</button>
    `;
    list.appendChild(div);
  });

  document.querySelectorAll('.del-btn').forEach(b => {
    b.onclick = async (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [id] });
      await refreshList();
    };
  });
}

async function addDomain() {
  let domain = input.value.trim();
  if (!domain) return;

  const storage = await chrome.storage.local.get(['lastRuleId']);
  let lastId = storage.lastRuleId || START_ID;
  const newId = lastId + 1;

  const encodedDomain = encodeURIComponent(domain);

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      "id": newId,
      "priority": 1,
      "action": { "type": "redirect", "redirect": { "extensionPath": "/blocked.html" } },
      "condition": { "urlFilter": `*${encodedDomain}*`, "resourceTypes": ["main_frame"] }
    }]
  });

  await chrome.storage.local.set({ lastRuleId: newId });

  input.value = '';
  await refreshList();
}


btn.onclick = addDomain;

input.onkeydown = (e) => {
  if (e.key === 'Enter') {
    addDomain();
  }
};


refreshList();