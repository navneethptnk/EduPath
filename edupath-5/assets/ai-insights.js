// assets/ai-insights.js
// Transparent AI-assisted insights for quiz results
// - Defaults to local, rule-based analysis (no network calls)
// - Optionally calls an external AI endpoint if window.EDUPATH_AI_CONFIG is defined
// - Never includes personal information; only quiz type, selected answer values, and aggregate signals

(function () {
  function frequency(arr) {
    const f = {};
    for (const v of arr) {
      if (!v) continue;
      f[v] = (f[v] || 0) + 1;
    }
    return f;
  }

  function computeSignals(answers, careerMapping) {
    const values = answers.map(a => a && a.answer).filter(Boolean);
    const valueFreq = frequency(values);

    // For each career family, find matched keywords and counts
    const careerSignals = Object.fromEntries(
      Object.entries(careerMapping).map(([key, cfg]) => {
        const matched = (cfg.keywords || [])
          .map(k => ({ keyword: k, count: valueFreq[k] || 0 }))
          .filter(x => x.count > 0)
          .sort((a, b) => b.count - a.count);
        const total = matched.reduce((s, x) => s + x.count, 0);
        return [key, { matched, total }];
      })
    );

    return { valueFreq, careerSignals };
  }

  // Render a transparent explanation using only local signals
  function renderLocal(container, results, ctx, signals) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return;

    const top = results.careerMatches || [];

    const html = `
      <div class="space-y-4">
        <div class="p-3 rounded bg-blue-50 text-blue-900 text-sm">
          This section explains why these recommendations were shown, based on your answers. No external AI calls were made.
        </div>
        ${top
          .map(c => {
            const sig = signals.careerSignals[c.title?.toLowerCase()?.includes('engineer') ? 'engineering' :
              c.title?.toLowerCase()?.includes('science') ? 'science' :
              c.title?.toLowerCase()?.includes('business') ? 'business' :
              c.title?.toLowerCase()?.includes('creative') ? 'creative' :
              c.title?.toLowerCase()?.includes('communication') ? 'communication' :
              c.title?.toLowerCase()?.includes('health') ? 'healthcare' : null];

            // Try a safer lookup by matching stream/careers to mapping keys when the title heuristic fails
            const fallbackKey = Object.keys(ctx.careerMapping || {}).find(k => (ctx.careerMapping[k].title === c.title)) ||
                                 Object.keys(ctx.careerMapping || {}).find(k => (ctx.careerMapping[k].careers || []).includes((c.careers || [])[0]));
            const effectiveSig = sig || (fallbackKey ? signals.careerSignals[fallbackKey] : null) || { matched: [], total: 0 };

            const evidence = effectiveSig.matched.slice(0, 5).map(m => `<code class="px-1 py-0.5 bg-gray-100 rounded">${m.keyword}</code> × ${m.count}`).join(', ');
            return `
              <div class="border rounded p-4">
                <div class="flex items-center justify-between mb-1">
                  <div class="font-semibold">${c.icon || ''} ${c.title}</div>
                  <div class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Match: ${c.percentage}%</div>
                </div>
                <p class="text-sm text-gray-700">${c.description || ''}</p>
                <div class="mt-2 text-sm">
                  <div class="font-medium">Evidence from your answers</div>
                  ${effectiveSig.matched.length > 0 ? `<div class="text-gray-700">${evidence}</div>` : `<div class="text-gray-500">No direct keyword overlaps detected; shown due to relative scoring.</div>`}
                </div>
              </div>
            `;
          })
          .join('')}
        <details class="mt-2">
          <summary class="cursor-pointer font-medium">How this is computed</summary>
          <div class="mt-2 text-sm text-gray-700">
            <ul class="list-disc ml-5 space-y-1">
              <li>Your selections are mapped to internal keywords (e.g., math_advanced, challenge_technical).</li>
              <li>We count keyword frequency and compare against each career family’s keyword set.</li>
              <li>Scores are normalized by total answered questions to produce the match percentage shown above.</li>
              <li>Transparency: the keywords displayed under “Evidence” are exactly what contributed to each match.</li>
            </ul>
          </div>
        </details>
      </div>
    `;

    el.innerHTML = html;
  }

  async function maybeCallExternalAI(results, ctx, signals) {
    const cfg = (window.EDUPATH_AI_CONFIG || {});
    if (!cfg.endpoint) return null; // no external configured

    // Prepare minimal, non-identifying payload
    const payload = {
      quiz_type: results.type,
      answers: (ctx.answers || []).map(a => a && a.answer).filter(Boolean),
      top_careers: (results.careerMatches || []).map(c => ({ title: c.title, match: c.percentage })),
      value_frequency: signals.valueFreq,
      // Provide only aggregate context; do not send personal identifiers
      // Include a request for transparent, source-grounded reasoning
      request: {
        objective: "Explain WHY these careers were matched based on the selected keywords and their counts.",
        constraints: [
          "Be concise and avoid speculation",
          "Only use provided answers and frequencies",
          "List the specific keywords that contributed"
        ]
      }
    };

    try {
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {})
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(cfg.timeout || 8000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(() => ({}));
      return {
        provider: cfg.provider || 'external-ai',
        host: (() => { try { return new URL(cfg.endpoint).host; } catch { return 'external'; } })(),
        content: data.explanation || data.content || data.text || JSON.stringify(data).slice(0, 1200)
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async function render(containerId, results, ctx) {
    const target = document.getElementById(containerId);
    if (!target) return;

    const signals = computeSignals(ctx.answers || [], ctx.careerMapping || {});

    // Always render local transparent rationale first
    renderLocal(target, results, ctx, signals);

    // If external AI is configured, append its explanation below with full transparency
    const cfg = (window.EDUPATH_AI_CONFIG || {});
    if (!cfg.endpoint) return;

    // Append an AI block placeholder
    const ext = document.createElement('div');
    ext.className = 'mt-4 p-3 rounded border';
    ext.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">AI</span>
        <span class="text-sm font-medium">External AI explanation</span>
      </div>
      <div class="text-xs text-gray-600 mb-2">
        Transparency: Will call ${(() => { try { return new URL(cfg.endpoint).host; } catch { return 'configured endpoint'; } })()} with anonymized quiz data (answer values and aggregate counts only).
      </div>
      <div data-ai-external-status class="text-sm text-gray-700">Contacting provider…</div>
    `;
    target.appendChild(ext);

    const status = ext.querySelector('[data-ai-external-status]');
    const ai = await maybeCallExternalAI(results, ctx, signals);
    if (!ai) return;
    if (ai.error) {
      status.innerHTML = `<span class="text-red-700">External AI failed: ${ai.error}. Showing local analysis only.</span>`;
    } else {
      status.innerHTML = `
        <div class="prose max-w-none">
          <div class="mb-1 text-xs text-gray-500">Provider: ${ai.provider} • Host: ${ai.host}</div>
          <div>${(typeof ai.content === 'string' ? ai.content : JSON.stringify(ai.content))}</div>
        </div>
      `;
    }
  }

  window.AIInsights = { render };
})();
