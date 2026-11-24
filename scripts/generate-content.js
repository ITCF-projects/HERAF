import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, Marked } from 'marked';
import { templateToDocx } from './template-docx.js';

// Separate instance without the heading-id renderer, for content embedded inside a page
// (concept and governance bodies) where generated ids would collide
const plainMarked = new Marked({ gfm: true, breaks: true });

// Shift markdown headings down so embedded content fits under the page's own headings
function demoteHeadings(markdown, by) {
  return markdown.replace(/^(#{1,6})(\s)/gm, (match, hashes, space) => '#'.repeat(Math.min(6, hashes.length + by)) + space);
}

// Split "## Heading" sections into { Heading: body }
function splitH2Sections(markdown) {
  const sections = {};
  const parts = markdown.split(/^## (.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    sections[parts[i].trim()] = parts[i + 1].trim();
  }
  return sections;
}

// Concept body for the HERAM page: drop the "# Title" line, demote the rest under the page's h3
function conceptBodyHtml(markdown) {
  const body = markdown.replace(/^\s*# [^\n]*\n/, '');
  return plainMarked.parse(demoteHeadings(body, 2));
}

// Governance item parts for the HERAM page. The description is dropped when it only repeats
// the statement, and the "Referens" text is dropped when references are in the frontmatter.
function governanceParts(markdown, statement, references) {
  const sections = splitH2Sections(markdown);
  const normalize = s => (s || '').replace(/\s+/g, ' ').replace(/[.\s]+$/, '').trim().toLowerCase();
  const description = sections['Beskrivning'];
  return {
    descriptionHtml: description && normalize(description) !== normalize(statement) ? plainMarked.parse(description) : null,
    rationaleHtml: sections['Motivering'] ? plainMarked.parse(sections['Motivering']) : null,
    referenceHtml: sections['Referens'] && !(references && references.length) ? plainMarked.parse(sections['Referens']) : null
  };
}

// HERAM intro and concept grouping/order from src/content/heram.md
function readHeramStructure(conceptSlugs) {
  const heramPath = path.join(process.cwd(), 'src/content/heram.md');
  if (!fs.existsSync(heramPath)) {
    return { title: 'HERAM', lead: '', introHtml: '', groups: [{ id: 'begrepp', title: 'Begrepp', description: '', concepts: conceptSlugs }] };
  }
  const { data, content } = matter(fs.readFileSync(heramPath, 'utf-8'));
  const groups = (data.groups || []).map(g => ({
    id: g.id,
    title: g.title,
    description: g.description || '',
    concepts: (g.concepts || []).filter(slug => {
      if (!conceptSlugs.includes(slug)) console.warn(`⚠️  heram.md: concept "${slug}" not found`);
      return conceptSlugs.includes(slug);
    })
  }));
  const listed = new Set(groups.flatMap(g => g.concepts));
  const unlisted = conceptSlugs.filter(slug => !listed.has(slug));
  if (unlisted.length) {
    console.warn(`⚠️  heram.md: concepts not placed in a group: ${unlisted.join(', ')}`);
    groups.push({ id: 'ovriga-begrepp', title: 'Övriga begrepp', description: '', concepts: unlisted });
  }
  return { title: data.title || 'HERAM', lead: data.lead || '', introHtml: plainMarked.parse(content), groups };
}

// Configure marked
marked.use({ async: false });
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure marked renderer for proper heading IDs
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const id = text.toLowerCase()
    .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.setOptions({
  renderer: renderer
});

function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const slug = path.basename(filePath, '.md');
  const htmlContent = marked(markdownContent);
  
  return {
    metadata: data,
    content: markdownContent,
    htmlContent,
    slug
  };
}

// Process guidance markdown file with all special logic
function processGuidanceMarkdown() {
  const guidanceFilePath = path.join(process.cwd(), 'static', 'vagledning.md');
  
  if (!fs.existsSync(guidanceFilePath)) {
    console.warn('Guidance file not found at:', guidanceFilePath);
    return null;
  }

  const content = fs.readFileSync(guidanceFilePath, 'utf-8');

  // Pull out {{diagram:name|caption}} placeholders first so no other processing touches them
  const diagrams = [];
  let processedContent = content.replace(/^\{\{diagram:([\w-]+)\|([^}]*)\}\}[ \t]*$/gm, (match, name, caption) => {
    diagrams.push({ name, caption: caption.trim() });
    return `DIAGRAMPLACEHOLDER${diagrams.length - 1}`;
  });
  processedContent = processedContent.replace(/^\{\{snabbguide\}\}[ \t]*$/gm, 'QUICKGUIDEPLACEHOLDER');

  // Apply all processing functions in correct order
  processedContent = processConcepts(processedContent);
  processedContent = processImages(processedContent);
  processedContent = processPrincipleReferences(processedContent);
  processedContent = processCrossReferences(processedContent);
  processedContent = processHeramReferences(processedContent);
  processedContent = processCallouts(processedContent);

  // Generate HTML
  let htmlContent = marked.parse(processedContent);
  
  // Fix anchor links to match our heading ID format
  htmlContent = htmlContent.replace(/href="#([^"]+)"/g, (match, encodedId) => {
    try {
      // Decode the URL-encoded ID and apply same transformation as heading IDs
      const decodedId = decodeURIComponent(encodedId);
      const normalizedId = decodedId.toLowerCase()
        .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `href="#${normalizedId}"`;
    } catch (e) {
      // If decoding fails, use original
      return match;
    }
  });
  
  // Inline SVG diagrams from src/lib/diagrams/<name>.svg
  htmlContent = htmlContent.replace(/<p>DIAGRAMPLACEHOLDER(\d+)<\/p>/g, (match, index) => {
    const { name, caption } = diagrams[Number(index)];
    const svgPath = path.join(process.cwd(), 'src/lib/diagrams', `${name}.svg`);
    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  Diagram not found: ${svgPath}`);
      return '';
    }
    const svg = fs.readFileSync(svgPath, 'utf-8').trim();
    return `<figure class="diagram diagram-${name}">${svg}<figcaption>${marked.parseInline(caption)}</figcaption></figure>`;
  });

  htmlContent = htmlContent.replace(/<p>QUICKGUIDEPLACEHOLDER<\/p>/, () => buildQuickGuide(content));
  htmlContent = structureSteps(htmlContent);
  htmlContent = collapseIntroduction(htmlContent);

  // Extract sections for navigation (from original content to get clean titles)
  const sections = extractSections(content);
  const version = (content.match(/\*\*Version\s+([^*]+)\*\*/) || [])[1]?.trim() || '';

  return {
    htmlContent,
    sections,
    version,
    title: 'HERAF Vägledning'
  };
}

// Same id rule as the heading renderer above
function headingId(text) {
  return text.toLowerCase()
    .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// {{snabbguide}}: a one-screen overview generated from the guidance itself, so it
// never drifts from it. Steps and phases come from the "### phase" / "#### Steg N"
// headings and the first sentence of each step's "Syfte", the ongoing activities
// from "### Löpande aktiviteter", and the minimum content from the "Måste" rows of
// the table in "## Vad ska en referensarkitektur innehålla?".
function buildQuickGuide(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const phases = [];
  const ongoing = [];
  let h3 = '';
  let h2 = '';

  lines.forEach((line, i) => {
    if (/^## /.test(line)) { h2 = line.slice(3).trim(); h3 = ''; return; }
    if (/^### /.test(line)) { h3 = line.slice(4).trim(); return; }
    const h4 = line.match(/^#### (.+?)\s*$/);
    if (!h4) return;

    const step = h4[1].match(/^Steg (\d+):\s*(.+)$/);
    if (step) {
      // "**Syfte:** ..." before the next heading
      let purpose = '';
      for (let j = i + 1; j < lines.length && !/^#{1,4} /.test(lines[j]); j++) {
        const m = lines[j].match(/^\*\*Syfte:\*\*\s*(.+)$/);
        if (m) { purpose = m[1].split(/(?<=[.!?])\s+/)[0]; break; }
      }
      let phase = phases.find(p => p.title === h3);
      if (!phase) phases.push(phase = { title: h3, id: headingId(h3), steps: [] });
      phase.steps.push({ num: step[1], title: step[2], id: headingId(h4[1]), purpose });
    } else if (h3 === 'Löpande aktiviteter' && h2.startsWith('Process')) {
      ongoing.push({ title: h4[1], id: headingId(h4[1]) });
    }
  });

  const minimumSection = 'Vad ska en referensarkitektur innehålla?';
  const minimum = [...markdown.replace(/\r\n/g, '\n')
    .split(`## ${minimumSection}`)[1]?.split(/\n## /)[0]
    .matchAll(/^\|\s*([^|\n]+?)\s*\|\s*Måste\s*\|/gm) ?? []].map(m => m[1]);

  if (!phases.length) {
    console.warn('⚠️  Quick guide: no "#### Steg N:" headings found');
    return '';
  }

  const inline = (text) => marked.parseInline(text);
  const firstStep = phases[0].steps[0];

  const phaseHtml = phases.map(phase => `
    <div class="qg-phase">
      <p class="qg-phase-title"><a href="#${phase.id}">${inline(phase.title)}</a></p>
      <ol class="qg-steps">${phase.steps.map(s => `
        <li><a class="qg-step" href="#${s.id}"><span class="qg-n">${s.num}</span><span class="qg-text"><span class="qg-title">${inline(s.title)}</span>${s.purpose ? `<span class="qg-purpose">${inline(s.purpose)}</span>` : ''}</span></a></li>`).join('')}
      </ol>
    </div>`).join('');

  const ongoingHtml = ongoing.length ? `
    <p class="qg-ongoing"><a class="qg-label" href="#lopande-aktiviteter">Löpande</a> ${ongoing
      .map((o, i) => {
        const text = i === 0 ? o.title : o.title.charAt(0).toLowerCase() + o.title.slice(1);
        const sep = i === 0 ? '' : i === ongoing.length - 1 ? ' och ' : ', ';
        return `${sep}<a href="#${o.id}">${inline(text)}</a>`;
      }).join('')}.</p>` : '';

  const minimumHtml = minimum.length ? `
    <div class="qg-minimum">
      <p class="qg-minimum-title">Minsta innehåll i en iteration. Varje del kan vara kortfattad.</p>
      <ul>${minimum.map(m => `<li>${inline(m)}</li>`).join('')}</ul>
      <p class="qg-minimum-more"><a href="#${headingId(minimumSection)}">Krav på innehåll</a></p>
    </div>` : '';

  return `<div class="quickguide">${phaseHtml}${ongoingHtml}${minimumHtml}
    <p class="qg-actions"><a class="qg-button" href="mallar/iterationsmall.docx">Iterationsmall (Word)</a> <a href="mallar/iterationsmall.md">Iterationsmall (markdown)</a> <a href="#${firstStep.id}">Steg ${firstStep.num}: ${inline(firstStep.title)}</a></p>
  </div>`;
}

// The introduction is background, not instructions: fold it away so the page
// opens on the quick guide. Links into it (table of contents, cross-references)
// open it, see the guidance page.
function collapseIntroduction(html) {
  return html.replace(
    /(<h2 id="inledning">[\s\S]*?<\/h2>)([\s\S]*?)(?=<hr>|<h2[\s>])/,
    (match, heading, body) =>
      `<details class="intro-details"><summary>${heading}` +
      `<span class="intro-hint">Bakgrund, syfte och definition av referensarkitektur.</span></summary>` +
      `<div class="intro-body">${body.trim()}</div></details>\n`
  );
}

// Give the process steps a fixed structure the page can style:
//   <h4>Steg N: Titel</h4> + Syfte / Aktiviteter / Resultat
// becomes <section class="step"> with a number, a purpose lead, a checklist and an
// outcome row. Markdown stays plain so heraf-agent.md and vagledning.md are unaffected.
function structureSteps(html) {
  const stepPattern = /<h4 id="(steg-(\d+)-[^"]*)">Steg \d+:\s*([\s\S]*?)<\/h4>([\s\S]*?)(?=<h[1-4][\s>]|<hr|$)/g;

  html = html.replace(stepPattern, (match, id, num, title, body) => {
    const structured = body
      .replace(/<p><strong>Syfte:<\/strong>\s*/g, '<p class="step-purpose">')
      .replace(/<p><strong>Aktiviteter<\/strong><\/p>\s*<ul>/g, '<p class="step-sub">Aktiviteter</p>\n<ul class="step-todo">');
    return `<section class="step" data-step="${num}" aria-labelledby="${id}">` +
      `<h4 id="${id}" class="step-heading"><span class="step-num">Steg ${num}</span> <span class="step-title">${title}</span></h4>` +
      `${structured.trim()}</section>\n`;
  });

  // Outcome rows, in steps and in the ongoing activities
  return html.replace(
    /<p><strong>Resultat:<\/strong>\s*/g,
    '<p class="outcome"><span class="outcome-label">Resultat</span> '
  );
}

// Extract section structure from markdown
function extractSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let inTableOfContents = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip the table of contents section
    if (line === '## Innehåll') {
      inTableOfContents = true;
      continue;
    }
    
    // End of table of contents when we hit the horizontal rule or next section
    if (inTableOfContents && (line === '---' || line.startsWith('## ') && line !== '## Innehåll')) {
      inTableOfContents = false;
    }
    
    // Skip lines in table of contents
    if (inTableOfContents) {
      continue;
    }
    
    // Only match actual markdown headings (starting with #)
    const headerMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const id = title.toLowerCase()
        .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      sections.push({ id, title, level });
    }
  }
  
  return sections;
}

// Link concepts only on their first mention within each "## " section, to keep the text readable
function processConcepts(content) {
  return content
    .split(/(?=^## )/m)
    .map(chunk => processConceptsInSection(chunk))
    .join('');
}

function processConceptsInSection(content) {
  const linkedSlugs = new Set();
  // We need to get concepts from the content data we're building
  const conceptsDir = path.join(process.cwd(), 'src/content/concepts');
  
  if (!fs.existsSync(conceptsDir)) {
    return content; // No concepts to process
  }
  
  let processedContent = content;
  const conceptFiles = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
  const conceptMap = new Map();
  
  // Build concept map
  for (const file of conceptFiles) {
    const filePath = path.join(conceptsDir, file);
    const concept = processMarkdownFile(filePath);
    const title = concept.metadata.title?.toLowerCase();
    if (title && title !== 'heram') {
      conceptMap.set(title, concept.slug);
      
      // Add Swedish word forms for common patterns
      // Definite forms (adds -en, -et, -n, -t)
      conceptMap.set(title + 'en', concept.slug);
      conceptMap.set(title + 'et', concept.slug);
      if (!title.endsWith('e')) {
        conceptMap.set(title + 'n', concept.slug);
        conceptMap.set(title + 't', concept.slug);
      }
      
      // Plural forms
      if (!title.endsWith('er') && !title.endsWith('ar')) {
        conceptMap.set(title + 'er', concept.slug);
        conceptMap.set(title + 'ar', concept.slug);
        conceptMap.set(title + 'erna', concept.slug); // definite plural
        conceptMap.set(title + 'arna', concept.slug); // definite plural
      }
    }
  }
  
  // Process concept terms - avoid links already in markdown link format or inside headers
  conceptMap.forEach((slug, conceptTerm) => {
    // More robust regex to avoid matching inside existing markdown links
    // (?<!-) / (?!-): don't match part of a hyphenated word, e.g. "vy" inside "vy-specifikation"
    const regex = new RegExp(`(?<!-)\\b(${conceptTerm})\\b(?!-)(?![^\\[]*\\]\\([^\\)]*\\))(?![^\\(]*\\))`, 'gi');
    
    processedContent = processedContent.replace(regex, (match, ...args) => {
      const offset = args[args.length - 2];
      const fullString = args[args.length - 1];
      
      // Get the line containing this match to check if it's a header
      const beforeMatch = fullString.substring(0, offset);
      const currentLineStart = beforeMatch.lastIndexOf('\n') + 1;
      const currentLineEnd = fullString.indexOf('\n', offset);
      const currentLine = fullString.substring(currentLineStart, currentLineEnd === -1 ? fullString.length : currentLineEnd);
      
      // Check if current line is a header (starts with #)
      if (currentLine.trim().match(/^#{1,6}\s/)) {
        return match; // Don't link if inside a header
      }
      
      // Check if we're inside markdown link text [text](url)
      const textBeforeMatch = fullString.substring(0, offset);

      // Don't link inside [[section cross-references]]
      if (textBeforeMatch.lastIndexOf('[[') > textBeforeMatch.lastIndexOf(']]')) {
        return match;
      }
      
      // Find the most recent potential link start before our match
      const linkTextStart = textBeforeMatch.lastIndexOf('[');
      
      // Only check for markdown links if there's a [ before our match
      if (linkTextStart !== -1) {
        const linkTextEnd = fullString.indexOf(']', linkTextStart);
        
        // If there's a ] after the [, check if it forms a valid markdown link
        if (linkTextEnd !== -1 && linkTextEnd > offset) {
          const possibleUrlStart = fullString.indexOf('(', linkTextEnd);
          const possibleUrlEnd = fullString.indexOf(')', possibleUrlStart);
          
          // Only treat as markdown link if we have the complete [text](url) pattern
          // AND our match is between [ and ]
          if (possibleUrlStart === linkTextEnd + 1 && possibleUrlEnd !== -1) {
            if (offset > linkTextStart && offset < linkTextEnd) {
              return match; // Don't link if inside markdown link text
            }
          }
        }
      }
      
      // Only the first mention per section becomes a link
      if (linkedSlugs.has(slug)) {
        return match;
      }
      linkedSlugs.add(slug);

      // For interactive content, use concept: protocol for sidebar handling
      return `<a href="concept:${slug}" class="concept-link" title="${match}">${match}</a>`;
    });
  });
  
  return processedContent;
}

// Process images with proper paths and styling
function processImages(content) {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)(\{([^}]+)\})?/g, (match, alt, src, _, attributes) => {
    let imageStyle = '';
    let imageClass = 'guidance-image';
    
    // Parse attributes if provided
    if (attributes) {
      const attrPairs = attributes.split(/\s+/);
      attrPairs.forEach((attr) => {
        if (attr.includes('=')) {
          const [key, value] = attr.split('=');
          const cleanValue = value.replace(/['"]/g, '');
          
          if (key === 'width') {
            imageStyle += `max-width: ${cleanValue}; `;
          } else if (key === 'height') {
            imageStyle += `max-height: ${cleanValue}; `;
          } else if (key === 'class') {
            imageClass += ` ${cleanValue}`;
          }
        } else {
          imageClass += ` ${attr}`;
        }
      });
    }
    
    // Special handling for logo images
    if (!imageStyle && (src.includes('logo') || alt.toLowerCase().includes('logo') || alt.toLowerCase().includes('vägledning'))) {
      imageClass += ' logo-image';
    }
    
    const styleAttr = imageStyle ? ` style="${imageStyle.trim()}"` : '';
    
    // Convert relative paths to proper static asset paths
    const resolvedSrc = src.startsWith('http') ? src : `/${src.startsWith('/') ? src.slice(1) : src}`;
    
    return `<figure class="image-figure">
        <img src="${resolvedSrc}" alt="${alt}" class="${imageClass}"${styleAttr} loading="lazy" />
        ${alt ? `<figcaption class="image-caption">${alt}</figcaption>` : ''}
    </figure>`;
  });
}

// Process principle references
function processPrincipleReferences(content) {
  const governanceDir = path.join(process.cwd(), 'src/content/governance/principles');
  
  if (!fs.existsSync(governanceDir)) {
    return content;
  }
  
  const principleFiles = fs.readdirSync(governanceDir).filter(f => f.endsWith('.md'));
  const principles = [];
  
  for (const file of principleFiles) {
    const filePath = path.join(governanceDir, file);
    const principle = processMarkdownFile(filePath);
    principles.push({ id: principle.metadata.id, header: principle.metadata.principle });
  }
  
  return content.replace(/\[P:([^\]]+)\]/g, (match, principleRef) => {
    const principle = principles.find(p => p.id.toLowerCase() === principleRef.toLowerCase());
    return principle ? 
      `<a href="principle:${principle.id}" class="principle-ref" title="Visa princip: ${principle.id}">${principle.id} - ${principle.header}</a>` : 
      match;
  });
}

// Process cross-references to sections within the document
function processCrossReferences(content) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, reference) => {
    const sectionId = reference.toLowerCase()
      .replace(/[åäö]/g, (char) => ({ 'å': 'a', 'ä': 'a', 'ö': 'o' }[char] || char))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<a href="#${sectionId}" class="section-ref" title="Gå till: ${reference}">${reference}</a>`;
  });
}

// Process HERAM references
function processHeramReferences(content) {
  // Only process standalone [HERAM] references, not ones that are part of markdown links
  return content.replace(/\[HERAM\](?!\([^)]*\))/g, '<a href="concept:heram" class="concept-link">HERAM</a>');
}

// Process callouts
function processCallouts(content) {
  const calloutTypes = ['note', 'tip', 'warning', 'danger', 'info', 'important', 'example'];
  return content.replace(/```(\w+)\s*(.*?)\n([\s\S]*?)```/gs, (match, type, titleLine, content) => {
    if (!calloutTypes.includes(type.toLowerCase())) {
      return match; // Return unchanged for code blocks
    }
    
    const title = titleLine.trim() || type.charAt(0).toUpperCase() + type.slice(1);

    return `<aside class="callout callout-${type}">
      <p class="callout-title">${title}</p>
      <div class="callout-content">${marked.parse(content?.trim() || '')}</div>
    </aside>`;
  });
}

function buildContentData() {
  const contentDir = path.join(process.cwd(), 'src/content');
  const governanceDir = path.join(contentDir, 'governance');
  const principlesDir = path.join(governanceDir, 'principles');
  const rulesDir = path.join(governanceDir, 'rules');
  const guidelinesDir = path.join(governanceDir, 'guidelines');
  const conceptsDir = path.join(contentDir, 'concepts');
  
  const data = {
    governance: {
      principles: [],
      rules: [],
      guidelines: []
    },
    concepts: [],
    guidance: null,
    heram: null
  };
  
  // Process guidance
  data.guidance = processGuidanceMarkdown();
  
  // Process principles
  if (fs.existsSync(principlesDir)) {
    const principleFiles = fs.readdirSync(principlesDir).filter(f => f.endsWith('.md'));
    for (const file of principleFiles) {
      const filePath = path.join(principlesDir, file);
      try {
        const principle = processMarkdownFile(filePath);
        data.governance.principles.push(principle);
      } catch (error) {
        console.error(`Error processing principle ${file}:`, error);
      }
    }
  }
  
  // Process rules
  if (fs.existsSync(rulesDir)) {
    const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));
    for (const file of ruleFiles) {
      const filePath = path.join(rulesDir, file);
      try {
        const rule = processMarkdownFile(filePath);
        data.governance.rules.push(rule);
      } catch (error) {
        console.error(`Error processing rule ${file}:`, error);
      }
    }
  }
  
  // Process guidelines
  if (fs.existsSync(guidelinesDir)) {
    const guidelineFiles = fs.readdirSync(guidelinesDir).filter(f => f.endsWith('.md'));
    for (const file of guidelineFiles) {
      const filePath = path.join(guidelinesDir, file);
      try {
        const guideline = processMarkdownFile(filePath);
        data.governance.guidelines.push(guideline);
      } catch (error) {
        console.error(`Error processing guideline ${file}:`, error);
      }
    }
  }
  
  // Process concepts
  if (fs.existsSync(conceptsDir)) {
    const conceptFiles = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
    for (const file of conceptFiles) {
      const filePath = path.join(conceptsDir, file);
      try {
        const concept = processMarkdownFile(filePath);
        concept.bodyHtml = conceptBodyHtml(concept.content);
        data.concepts.push(concept);
      } catch (error) {
        console.error(`Error processing concept ${file}:`, error);
      }
    }
  }
  
  // HERAM page structure; concepts are ordered as listed in heram.md
  data.heram = readHeramStructure(data.concepts.map(c => c.slug));
  const conceptOrder = data.heram.groups.flatMap(g => g.concepts);
  data.concepts.sort((a, b) => conceptOrder.indexOf(a.slug) - conceptOrder.indexOf(b.slug));

  // Governance parts for the HERAM page
  for (const [list, field] of [['principles', 'principle'], ['guidelines', 'guideline'], ['rules', 'rule']]) {
    for (const item of data.governance[list]) {
      item.parts = governanceParts(item.content, item.metadata[field], item.metadata.references);
    }
  }

  // Sort governance items
  data.governance.principles.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.id.localeCompare(b.metadata.id, 'sv', { numeric: true });
  });
  
  data.governance.rules.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.id.localeCompare(b.metadata.id);
  });
  
  data.governance.guidelines.sort((a, b) => {
    if (a.metadata.status !== b.metadata.status) {
      return a.metadata.status === 'active' ? -1 : 1;
    }
    return a.metadata.id.localeCompare(b.metadata.id);
  });
  
  return data;
}

// Publish templates as downloadable files under static/mallar/, as Markdown and Word
async function publishTemplates() {
  const templatesDir = path.join(process.cwd(), 'src/content/templates');
  const outDir = path.join(process.cwd(), 'static/mallar');
  if (!fs.existsSync(templatesDir)) return;
  fs.mkdirSync(outDir, { recursive: true });
  const published = { 'iteration_template.md': 'iterationsmall' };
  for (const [source, target] of Object.entries(published)) {
    const sourcePath = path.join(templatesDir, source);
    if (!fs.existsSync(sourcePath)) continue;
    fs.copyFileSync(sourcePath, path.join(outDir, `${target}.md`));
    const docx = await templateToDocx(fs.readFileSync(sourcePath, 'utf-8'));
    fs.writeFileSync(path.join(outDir, `${target}.docx`), docx);
  }
}

await publishTemplates();

// ---------------------------------------------------------------------------
// AI agent guide: static/heraf-agent.md + static/llms.txt
// Built from the same sources as the site so it never drifts from the guidance.
// ---------------------------------------------------------------------------

// Return the body of a "## Title" section (up to the next "## " heading)
function extractH2Section(markdown, title) {
  const lines = markdown.split('\n');
  const start = lines.findIndex(l => l.trim() === `## ${title}`);
  if (start === -1) {
    console.warn(`⚠️  Agent guide: section "## ${title}" not found in vagledning.md`);
    return '';
  }
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(l => /^##\s/.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n');
}

// Turn site-specific markdown into plain, self-contained markdown
function flattenForAgent(markdown, principles) {
  const crossRefNames = { 'exempel och mallar': 'Bilaga A' };
  return markdown
    // Drop images and diagrams – agents can't use them
    .replace(/^!\[[^\]]*\]\([^)]+\)(\{[^}]*\})?\s*$/gm, '')
    .replace(/^\{\{diagram:[^}]*\}\}[ \t]*$/gm, '')
    // [P:ID] -> "ID – principle text"
    .replace(/\[P:([^\]]+)\]/g, (match, id) => {
      const p = principles.find(x => x.id.toLowerCase() === id.toLowerCase());
      return p ? `${p.id} – ${p.text}` : id;
    })
    // [[Section]] -> section name (or appendix)
    .replace(/\[\[([^\]]+)\]\]/g, (match, ref) => crossRefNames[ref.toLowerCase()] || ref)
    // [text](concept:slug) -> text
    .replace(/\[([^\]]+)\]\(concept:[^)]+\)/g, '$1')
    .replace(/\[HERAM\]/g, 'HERAM')
    // Callouts -> bold title + body
    .replace(/```(note|tip|warning|danger|info|important|example)[ \t]*(.*?)\n([\s\S]*?)```/g,
      (match, type, title, body) => `**${title.trim() || 'Obs'}**\n${body.trim()}`)
    // Horizontal rules and repeated blank lines
    .replace(/^---\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function readGovernance(dir, textField) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => matter(fs.readFileSync(path.join(dir, f), 'utf-8')).data)
    .filter(d => d.id && d[textField])
    .map(d => ({ id: d.id, text: d[textField], status: d.status, references: d.references || [] }))
    .sort((a, b) => a.id.localeCompare(b.id, 'sv', { numeric: true }));
}

function formatGovernanceList(items) {
  return items.map(item => {
    const refs = item.references.length ? ` *(refererar: ${item.references.join(', ')})*` : '';
    const status = item.status && item.status !== 'active' ? ` **[${item.status}]**` : '';
    return `- **${item.id}** – ${item.text}${refs}${status}`;
  }).join('\n');
}

function readConceptDefinitions(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf-8'));
      // First paragraph that isn't a heading = the definition
      const definition = content
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .find(p => p && !p.startsWith('#')) || '';
      return {
        slug: path.basename(f, '.md'),
        title: data.title || path.basename(f, '.md'),
        definition: definition.replace(/\s*\n\s*/g, ' ')
      };
    });
}

function buildAgentGuide() {
  const root = process.cwd();
  const templatePath = path.join(root, 'src/content/agent/heraf-agent.template.md');
  const guidancePath = path.join(root, 'static/vagledning.md');
  const iterationTemplatePath = path.join(root, 'src/content/templates/iteration_template.md');
  if (!fs.existsSync(templatePath) || !fs.existsSync(guidancePath)) {
    console.warn('⚠️  Agent guide: template or vagledning.md missing – skipped');
    return;
  }

  const guidance = fs.readFileSync(guidancePath, 'utf-8');
  const governanceDir = path.join(root, 'src/content/governance');
  const principles = readGovernance(path.join(governanceDir, 'principles'), 'principle');
  const guidelines = readGovernance(path.join(governanceDir, 'guidelines'), 'guideline');
  const rules = readGovernance(path.join(governanceDir, 'rules'), 'rule');
  const concepts = readConceptDefinitions(path.join(root, 'src/content/concepts'));

  const version = (guidance.match(/\*\*Version\s+([^*]+)\*\*/) || [])[1]?.trim() || 'okänd';

  // Extracted sections keep their "###"/"####" levels and slot in under the guide's "##" headings
  const values = {
    version,
    process: flattenForAgent(extractH2Section(guidance, 'Process: Skapa referensarkitektur'), principles),
    minimum: flattenForAgent(extractH2Section(guidance, 'Vad ska en referensarkitektur innehålla?'), principles),
    template: fs.existsSync(iterationTemplatePath) ? fs.readFileSync(iterationTemplatePath, 'utf-8').trim() : '(mall saknas)',
    governance: [
      '### Principer', formatGovernanceList(principles),
      '### Riktlinjer', formatGovernanceList(guidelines),
      '### Regler', formatGovernanceList(rules)
    ].join('\n\n'),
    // Same grouping and order as the HERAM page
    concepts: readHeramStructure(concepts.map(c => c.slug)).groups
      .map(group => [
        `### ${group.title}`,
        group.concepts
          .map(slug => concepts.find(c => c.slug === slug))
          .map(c => `- **${c.title}** – ${c.definition}`)
          .join('\n')
      ].join('\n\n'))
      .join('\n\n')
  };

  const output = fs.readFileSync(templatePath, 'utf-8')
    .replace(/\{\{(\w+)\}\}/g, (match, key) => (key in values ? values[key] : match));

  fs.writeFileSync(path.join(root, 'static/heraf-agent.md'), output);

  const llms = `# HERAF

> Higher Education Reference Architecture Framework – ett ramverk för att ta fram referensarkitekturer inom svensk högre utbildning. Version ${version}.

## För AI-agenter

- [Instruktion för AI-agenter](heraf-agent.md): Fristående instruktion med process, regler, styrning, begrepp och iterationsmall. Börja här.

## Källmaterial

- [Vägledning](vagledning.md): Vägledningen för människor, i markdown.
- [Iterationsmall](mallar/iterationsmall.md): Mall för att dokumentera en iteration.
`;
  fs.writeFileSync(path.join(root, 'static/llms.txt'), llms);
  console.log('✅ Agent guide generated at static/heraf-agent.md and static/llms.txt');
}

buildAgentGuide();

// Generate the content
const contentData = buildContentData();

// Write to a file that can be imported
const outputDir = path.join(process.cwd(), 'src/lib');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, 'content-data.generated.ts');
const content = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const contentData = ${JSON.stringify(contentData, null, 2)};
`;

fs.writeFileSync(outputFile, content);
console.log('✅ Content data generated successfully at', outputFile);
console.log(`📊 Generated ${contentData.governance.principles.length} principles, ${contentData.governance.rules.length} rules, ${contentData.governance.guidelines.length} guidelines, ${contentData.concepts.length} concepts, and ${contentData.guidance ? 'guidance content' : 'no guidance'}`);