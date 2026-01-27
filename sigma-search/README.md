# Sigma Search Engine

A high-performance, cybersecurity-themed search interface for browsing and searching [Sigma detection rules](https://github.com/SigmaHQ/sigma). Designed to be hosted on GitHub Pages as a fully static site with client-side search powered by Fuse.js.

![Sigma Search Screenshot](https://img.shields.io/badge/Rules-3000+-22d3ee?style=for-the-badge&logo=shield&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-4ade80?style=for-the-badge&logo=github&logoColor=white)
![Auto Updated](https://img.shields.io/badge/Auto%20Updated-Daily-a855f7?style=for-the-badge&logo=github-actions&logoColor=white)

## ✨ Features

- **🔍 Instant Fuzzy Search** - Search rules by title, description, author, or MITRE ATT&CK technique IDs (e.g., `T1059`)
- **🏷️ Smart Filtering** - Filter by status (Stable/Experimental), severity level, and product
- **🎨 Cybersecurity Aesthetic** - Dark SOC-style dashboard with neon accents
- **📱 Fully Responsive** - Works great on desktop, tablet, and mobile
- **⚡ Lightning Fast** - Client-side search with Fuse.js, no server required
- **📝 Syntax Highlighting** - View rule YAML with beautiful Prism.js highlighting
- **🔄 Auto-Updated** - GitHub Actions fetches the latest rules daily

## 🚀 Quick Start

### Option 1: Deploy to Your GitHub Pages

1. **Fork this repository** (or copy the `sigma-search` folder to your existing GitHub Pages repo)

2. **Generate the initial rules.json**:
   ```bash
   cd sigma-search
   pip install pyyaml
   python parser.py
   ```

3. **Commit and push** the generated `rules.json`:
   ```bash
   git add .
   git commit -m "Initial Sigma rules data"
   git push
   ```

4. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)` 

5. **Access your search engine** at:
   ```
   https://YOUR-USERNAME.github.io/sigma-search/
   ```

### Option 2: Local Development

1. **Clone and generate rules**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO/sigma-search
   pip install pyyaml
   python parser.py
   ```

2. **Start a local server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use any static file server
   npx serve .
   ```

3. **Open** `http://localhost:8000` in your browser

## 📁 File Structure

```
sigma-search/
├── index.html      # Main SPA (HTML + CSS + JavaScript)
├── parser.py       # Python script to extract Sigma rules
├── rules.json      # Generated rules data (auto-updated)
└── README.md       # This file

.github/
└── workflows/
    └── sigma-update.yml  # Daily automation workflow
```

## 🔧 How It Works

### Data Pipeline

1. **parser.py** clones the [SigmaHQ/sigma](https://github.com/SigmaHQ/sigma) repository
2. Recursively scans the `/rules` directory for `.yml` files
3. Extracts metadata: title, id, status, description, author, date, logsource, tags, level, detection
4. Outputs a minified `rules.json` file (~2-5 MB depending on rule count)

### Frontend

- **Tailwind CSS** (via CDN) for styling with custom cybersecurity theme
- **Fuse.js** for fast, fuzzy client-side search
- **Prism.js** for YAML syntax highlighting in the detail modal
- All dependencies loaded via CDN - no build step required!

### Automation

The GitHub Actions workflow (`.github/workflows/sigma-update.yml`):
- Runs daily at 6:00 AM UTC
- Can also be triggered manually via the Actions tab
- Only commits if `rules.json` actually changed
- Uses the GitHub Actions bot for commits

## 🔍 Search Tips

| Search Query | Description |
|-------------|-------------|
| `mimikatz` | Find rules mentioning Mimikatz |
| `T1059` | Search by MITRE ATT&CK technique ID |
| `attack.t1059.001` | Full technique tag search |
| `powershell execution` | Multi-word fuzzy search |
| `thomas patzke` | Search by author name |

## ⚙️ Configuration

### Customizing the Parser

Edit `parser.py` to modify:
- `SIGMA_REPO_URL` - Change source repository
- `RULES_SUBDIR` - Change rules directory
- `OUTPUT_FILE` - Change output filename
- Add/remove extracted fields as needed

### Customizing the Frontend

Edit `index.html` to modify:
- Color scheme in the Tailwind config
- Search weights in Fuse.js configuration
- Filter options and categories
- Number of rules per page (`RULES_PER_PAGE`)

### Changing Update Schedule

Edit `.github/workflows/sigma-update.yml`:
```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Change this cron expression
```

Common schedules:
- `'0 */6 * * *'` - Every 6 hours
- `'0 0 * * 0'` - Weekly on Sunday
- `'0 0 1 * *'` - Monthly on the 1st

## 🛠️ Troubleshooting

### rules.json is not generated

1. Make sure Python 3.8+ is installed
2. Install PyYAML: `pip install pyyaml`
3. Run from the `sigma-search` directory: `python parser.py`

### Search is slow

- The initial load of `rules.json` may take a few seconds on slow connections
- Consider enabling gzip compression on your web server
- The Fuse.js index is built on first load - subsequent searches are instant

### GitHub Actions workflow fails

1. Check that `sigma-search/parser.py` exists
2. Ensure the workflow has write permissions (check repository settings)
3. View the workflow logs in the Actions tab for specific errors

### CORS errors when running locally

Use a local HTTP server instead of opening `index.html` directly:
```bash
python -m http.server 8000
```

## 📊 Statistics

After running `parser.py`, you'll see statistics like:
- Total rules extracted
- Status distribution (stable, experimental, test)
- Level distribution (critical, high, medium, low)
- Top products (windows, linux, azure, etc.)

## 🙏 Credits

- **[SigmaHQ](https://github.com/SigmaHQ/sigma)** - The amazing Sigma detection rule repository
- **[Fuse.js](https://fusejs.io)** - Lightweight fuzzy-search library
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Prism.js](https://prismjs.com)** - Syntax highlighting

## 📄 License

This project is open source. The Sigma rules themselves are subject to the [SigmaHQ license](https://github.com/SigmaHQ/sigma/blob/master/LICENSE).

---

**Built with 💜 for the SOC community**
