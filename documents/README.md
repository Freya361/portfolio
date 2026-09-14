# Portfolio AI Assistant — Document Setup

This folder contains configuration and documents that power your AI assistant.

## How It Works

Your AI assistant reads from these documents to answer visitor questions with accurate, detailed information about your experience, projects, and approach.

## Files & Setup

### 1. **config.json** (Required)
Main configuration file. Update with:
- `documentsToInclude`: List of markdown files to include (e.g., `resume.md`, `case-studies.md`)

### 2. **resume.md** (Recommended)
Your professional resume in markdown format. Include:
- Professional summary
- Work experience with achievements
- Education
- Skills
- Certifications & achievements
- Technical skills

**Tip:** Be detailed here — the AI uses this to answer questions about your background.

### 3. **case-studies.md** (Recommended)
Detailed case studies for your major projects. For each project include:
- Challenge (what problem you solved)
- Solution (your approach)
- Impact & Metrics (quantifiable results)
- Key Learnings (insights gained)

**Example metrics to include:**
- Conversion rate improvements
- Time saved
- User satisfaction scores
- Revenue impact
- Team efficiency gains

### 4. **Additional Documents** (Optional)
You can add any other markdown files and reference them in `config.json`:
- `achievements.md` — Notable accomplishments
- `skills.md` — Detailed skill breakdown
- `certifications.md` — Courses & certifications
- `speaking.md` — Conference talks or presentations

## How to Update

1. **Edit the markdown files** with your actual information
2. **Update config.json** to point to the files you want to include
3. **Redeploy** to Vercel (push to GitHub)
4. The AI will automatically load your updated documents

## Best Practices

✅ **Do:**
- Be specific with metrics and achievements
- Use clear section headings
- Include dates for projects
- Describe challenges before solutions
- Quantify your impact when possible

❌ **Don't:**
- Leave placeholder text in documents
- Use overly technical jargon
- Make claims without evidence
- Forget to update when you have new achievements

## Testing Locally

After updating documents, restart your local server:
```bash
npm run dev
```

The AI will load the updated documents on the next chat request.

## Example Case Study Format

```markdown
## Project: [Project Name]

### Challenge
Clear description of the problem or business need.

### Solution
Your approach, strategy, and implementation.

### Impact & Metrics
- Result 1: X% improvement
- Result 2: Y metric achieved
- Result 3: Z impact

### Key Learnings
What you learned from this project.
```

---

**Questions?** Make sure all files are properly formatted markdown and referenced in config.json!
