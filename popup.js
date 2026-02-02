const input = document.getElementById('domainInput');
const btn = document.getElementById('addRuleBtn');
const list = document.getElementById('rulesList');

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
      refreshList();
    };
  });
}

async function addDomain() {
  let domain = input.value.trim();
  if (!domain) return;

  const encodedDomain = encodeURIComponent(domain);
  const newId = Math.floor(Math.random() * 1000000) + 1;

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      "id": newId,
      "priority": 1,
      "action": { "type": "redirect", "redirect": { "extensionPath": "/blocked.html" } },
      "condition": { "urlFilter": `*${encodedDomain}*`, "resourceTypes": ["main_frame"] }
    }]
  });

  input.value = '';
  refreshList();
}

btn.onclick = addDomain;

input.onkeydown = (e) => {
  if (e.key === 'Enter') {
    addDomain();
  }
};

refreshList();