function buildMarkdownText(phase1: string, phase2: string): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let md = `# JobCraft 面试题\n\n`;
  md += `> 生成日期：${dateStr}\n\n---\n\n`;

  if (phase1) {
    md += `## 一面 · 专业执行力\n\n${phase1}\n\n---\n\n`;
  }
  if (phase2) {
    md += `## 二面 · 思维力\n\n${phase2}\n`;
  }

  return md;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(phase1: string, phase2: string) {
  const md = buildMarkdownText(phase1, phase2);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const dateStr = new Date().toISOString().slice(0, 10);
  triggerDownload(blob, `JobCraft-面试题-${dateStr}.md`);
}

export function exportExtractionAsMarkdown(content: string) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let md = `# JobCraft 面试记录提取\n\n`;
  md += `> 生成日期：${dateStr}\n\n---\n\n`;
  md += content;
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `JobCraft-面试记录提取-${dateStr}.md`);
}

export function exportOptimizeAsMarkdown(content: string) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let md = `# JobCraft 回答优化报告\n\n`;
  md += `> 生成日期：${dateStr}\n\n---\n\n`;
  md += content;
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `JobCraft-回答优化-${dateStr}.md`);
}
