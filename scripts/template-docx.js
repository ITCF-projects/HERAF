// Convert the iteration template (Markdown) to a Word document.
// The template uses a small subset of Markdown: # and ## headings, tables,
// bullet lines, bold labels and italic hints. It is parsed line by line,
// since a bold label followed by "- " would otherwise read as a setext heading.

import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';

const HINT_COLOR = '6B6478';
const BORDER_COLOR = 'B8B3C2';
const HEADER_FILL = 'EEEBF2';
const TEXT_WIDTH = 9026; // A4 width minus default margins, in twips

// "**bold** and _italic_" -> TextRuns
function inlineRuns(text, base = {}) {
  return text
    .split(/(\*\*[^*]+\*\*|_[^_]+_)/)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('**')) return new TextRun({ ...base, text: part.slice(2, -2), bold: true });
      if (part.startsWith('_') && part.endsWith('_') && part.length > 1)
        return new TextRun({ ...base, text: part.slice(1, -1), italics: true, color: HINT_COLOR });
      return new TextRun({ ...base, text: part });
    });
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function cell(text, { header = false, width }) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: HEADER_FILL } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: inlineRuns(text, header ? { bold: true } : {}) })]
  });
}

function table(lines) {
  const rows = lines.filter((l) => !/^\|\s*:?-{3,}/.test(l.trim())).map(splitRow);
  const cols = Math.max(...rows.map((r) => r.length));
  const width = Math.floor(TEXT_WIDTH / cols);
  // "| | |" as the first row means a key–value table without a header
  const hasHeader = rows[0].some((c) => c !== '');
  const body = rows.slice(1);
  // Give header-only tables an empty row to write in
  if (hasHeader && body.length === 0) body.push(Array(cols).fill(''));

  const pad = (r) => [...r, ...Array(cols - r.length).fill('')];
  const border = { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR };

  return new Table({
    width: { size: TEXT_WIDTH, type: WidthType.DXA },
    columnWidths: Array(cols).fill(width),
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: [
      ...(hasHeader ? [new TableRow({ tableHeader: true, children: pad(rows[0]).map((t) => cell(t, { header: true, width })) })] : []),
      ...body.map((r) => new TableRow({ children: pad(r).map((t) => cell(t, { width })) }))
    ]
  });
}

export async function templateToDocx(markdown, { title = 'Iterationsmall' } = {}) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const children = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') continue;

    if (trimmed.startsWith('|')) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) block.push(lines[i++]);
      i--;
      children.push(table(block));
      children.push(new Paragraph({ text: '' }));
      continue;
    }

    if (trimmed.startsWith('# ')) {
      children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: inlineRuns(trimmed.slice(2)) }));
    } else if (trimmed.startsWith('## ')) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: inlineRuns(trimmed.slice(3)) }));
    } else if (/^-(\s|$)/.test(trimmed)) {
      children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: inlineRuns(trimmed.slice(1).trim()) }));
    } else if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      // A bold label on its own line introduces a field
      children.push(new Paragraph({ spacing: { before: 200, after: 60 }, keepNext: true, children: inlineRuns(trimmed) }));
    } else {
      children.push(new Paragraph({ spacing: { after: 120 }, children: inlineRuns(trimmed) }));
    }
  }

  const doc = new Document({
    title,
    creator: 'HERAF',
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 } } },
      paragraphStyles: [
        { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { size: 40, bold: true }, paragraph: { spacing: { after: 240 } } },
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true }, paragraph: { spacing: { before: 360, after: 120 }, keepNext: true } }
      ]
    },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } } } }]
        }
      ]
    },
    sections: [{ children }]
  });

  return Packer.toBuffer(doc);
}
