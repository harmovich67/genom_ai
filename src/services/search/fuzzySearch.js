/**
 * High-performance bilingual fuzzy search & similarity scoring
 */

export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    // Normalize Arabic letters
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, ''); // Remove Arabic tashkeel (diacritics)
}

export function calculateSimilarity(query, target) {
  if (!query || !target) return 0;
  const q = normalizeText(query);
  const t = normalizeText(target);

  if (t === q) return 1.0;
  if (t.includes(q)) return 0.85;

  const qWords = q.split(/\s+/).filter(Boolean);
  let matches = 0;
  for (const word of qWords) {
    if (t.includes(word)) matches++;
  }

  return qWords.length > 0 ? (matches / qWords.length) * 0.75 : 0;
}

/**
 * Searches across Genomes, Projects, Bugs, Ideas, and Challenges
 */
export function searchKnowledgeBase({ query, genomes = [], projects = [], bugs = [], ideas = [], challenges = [] }) {
  if (!query || !query.trim()) {
    return { genomes, projects, bugs, ideas, challenges };
  }

  const cleanQuery = normalizeText(query);
  const words = cleanQuery.split(/\s+/).filter(Boolean);

  const filterItem = (item, fieldsToSearch) => {
    const combined = fieldsToSearch.map(f => normalizeText(item[f] || '')).join(' ');
    return words.some(w => combined.includes(w));
  };

  const matchedGenomes = genomes.filter(g =>
    filterItem(g, ['title', 'englishTitle', 'description', 'problem', 'solution', 'technology', 'framework', 'type', 'language']) ||
    (Array.isArray(g.tags) && g.tags.some(t => normalizeText(t).includes(cleanQuery)))
  );

  const matchedProjects = projects.filter(p =>
    filterItem(p, ['name', 'description', 'architectureNotes']) ||
    (Array.isArray(p.stack) && p.stack.some(s => normalizeText(s).includes(cleanQuery)))
  );

  const matchedBugs = bugs.filter(b =>
    filterItem(b, ['title', 'problem', 'error', 'environment', 'solution', 'rootCause'])
  );

  const matchedIdeas = ideas.filter(i =>
    filterItem(i, ['title', 'rawPrompt', 'problem', 'architecture', 'mvp'])
  );

  const matchedChallenges = challenges.filter(c =>
    filterItem(c, ['title', 'category', 'question', 'explanation'])
  );

  return {
    genomes: matchedGenomes,
    projects: matchedProjects,
    bugs: matchedBugs,
    ideas: matchedIdeas,
    challenges: matchedChallenges,
    totalCount: matchedGenomes.length + matchedProjects.length + matchedBugs.length + matchedIdeas.length + matchedChallenges.length
  };
}

/**
 * Signature "Genome Match" engine
 * Compares any code snippet, error message, or query against saved library genomes
 */
export function findBestGenomeMatch(inputContent, genomes = []) {
  if (!inputContent || genomes.length === 0) return null;

  const cleanInput = normalizeText(inputContent);
  let bestMatch = null;
  let highestScore = 0;

  for (const genome of genomes) {
    let score = 0;

    // Check title match
    if (calculateSimilarity(cleanInput, genome.title) > 0.4) score += 40;
    if (calculateSimilarity(cleanInput, genome.englishTitle) > 0.4) score += 40;

    // Check technology/framework
    if (cleanInput.includes(normalizeText(genome.technology))) score += 25;
    if (genome.framework && cleanInput.includes(normalizeText(genome.framework))) score += 20;

    // Check tags
    if (Array.isArray(genome.tags)) {
      for (const tag of genome.tags) {
        if (cleanInput.includes(normalizeText(tag))) score += 15;
      }
    }

    // Check problem / solution / error keywords
    if (genome.problem && calculateSimilarity(cleanInput, genome.problem) > 0.3) score += 20;
    if (genome.relatedBugs && genome.relatedBugs.some(b => cleanInput.includes(normalizeText(b)))) score += 35;

    // Keyword detection (e.g. debounce, webhook, salla, jwt, redis, lock, deadlocks, closure)
    const keywords = ['debounce', 'webhook', 'salla', 'zid', 'jwt', 'redis', 'lock', 'deadlock', 'closure', 'stale', 'rest', 'nonce'];
    for (const kw of keywords) {
      if (cleanInput.includes(kw)) {
        const genomeString = JSON.stringify(genome).toLowerCase();
        if (genomeString.includes(kw)) score += 30;
      }
    }

    if (score > highestScore && score >= 35) {
      highestScore = score;
      bestMatch = genome;
    }
  }

  if (!bestMatch) return null;

  const percentage = Math.min(98, Math.max(68, Math.round(highestScore * 0.95)));

  return {
    matchFound: true,
    matchPercentage: percentage,
    genome: bestMatch,
    whyItMatches: `يطابق هذا العنصر تقنية (${bestMatch.technology}) ومفاهيم (${bestMatch.tags?.slice(0, 3).join('، ')}) المشابهة للحالة الحالية.`
  };
}
