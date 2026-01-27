#!/usr/bin/env python3
"""
Sigma Rules Parser
Extracts rule metadata from SigmaHQ/sigma repository and outputs a minified JSON file.
"""

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML not installed. Installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml"])
    import yaml


SIGMA_REPO_URL = "https://github.com/SigmaHQ/sigma.git"
RULES_SUBDIR = "rules"
OUTPUT_FILE = "rules.json"


def clone_sigma_repo(target_dir: str) -> str:
    """Clone the SigmaHQ repository to a target directory."""
    print(f"Cloning SigmaHQ/sigma repository...")
    subprocess.run(
        ["git", "clone", "--depth", "1", SIGMA_REPO_URL, target_dir],
        check=True,
        capture_output=True,
        text=True
    )
    return target_dir


def extract_logsource(logsource: dict) -> dict:
    """Extract logsource fields safely."""
    if not isinstance(logsource, dict):
        return {"category": None, "product": None, "service": None}
    
    return {
        "category": logsource.get("category"),
        "product": logsource.get("product"),
        "service": logsource.get("service")
    }


def normalize_tags(tags: list) -> list:
    """Normalize tags to lowercase strings."""
    if not tags or not isinstance(tags, list):
        return []
    
    normalized = []
    for tag in tags:
        if isinstance(tag, str):
            normalized.append(tag.lower())
    return normalized


def format_detection(detection: dict) -> str:
    """Convert detection block back to YAML string for display."""
    if not detection or not isinstance(detection, dict):
        return ""
    
    try:
        return yaml.dump(detection, default_flow_style=False, allow_unicode=True)
    except Exception:
        return str(detection)


def parse_sigma_file(filepath: Path) -> dict | None:
    """Parse a single Sigma YAML file and extract relevant fields."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Handle multi-document YAML files (some rules have multiple docs)
        docs = list(yaml.safe_load_all(content))
        if not docs:
            return None
        
        # Use the first document (main rule)
        rule = docs[0]
        if not isinstance(rule, dict):
            return None
        
        # Skip if no title (invalid rule)
        title = rule.get("title")
        if not title:
            return None
        
        # Extract fields
        logsource = extract_logsource(rule.get("logsource", {}))
        tags = normalize_tags(rule.get("tags", []))
        detection = rule.get("detection", {})
        
        # Build the rule object
        parsed = {
            "title": str(title),
            "id": str(rule.get("id", "")),
            "status": str(rule.get("status", "unknown")).lower(),
            "description": str(rule.get("description", "")),
            "author": str(rule.get("author", "Unknown")),
            "date": str(rule.get("date", "")),
            "modified": str(rule.get("modified", "")),
            "logsource": logsource,
            "tags": tags,
            "level": str(rule.get("level", "medium")).lower(),
            "detection": format_detection(detection),
            "filename": filepath.name
        }
        
        # Create a searchable tags string for MITRE ATT&CK
        mitre_tags = [t for t in tags if t.startswith("attack.")]
        parsed["mitre_tags"] = mitre_tags
        
        return parsed
        
    except yaml.YAMLError as e:
        print(f"  YAML error in {filepath.name}: {e}")
        return None
    except Exception as e:
        print(f"  Error parsing {filepath.name}: {e}")
        return None


def scan_rules_directory(repo_path: str) -> list:
    """Recursively scan the rules directory for YAML files."""
    rules_path = Path(repo_path) / RULES_SUBDIR
    
    if not rules_path.exists():
        print(f"Rules directory not found: {rules_path}")
        return []
    
    rules = []
    yaml_files = list(rules_path.rglob("*.yml"))
    total_files = len(yaml_files)
    
    print(f"Found {total_files} YAML files to process...")
    
    for i, filepath in enumerate(yaml_files, 1):
        if i % 500 == 0:
            print(f"  Processed {i}/{total_files} files...")
        
        rule = parse_sigma_file(filepath)
        if rule:
            rules.append(rule)
    
    return rules


def generate_rules_json(rules: list, output_path: str) -> None:
    """Write rules to a minified JSON file."""
    print(f"Writing {len(rules)} rules to {output_path}...")
    
    # Sort rules by title for consistent output
    rules.sort(key=lambda r: r.get("title", "").lower())
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(rules, f, separators=(",", ":"), ensure_ascii=False)
    
    # Get file size
    size_bytes = os.path.getsize(output_path)
    size_mb = size_bytes / (1024 * 1024)
    print(f"Output file size: {size_mb:.2f} MB")


def main():
    """Main entry point."""
    script_dir = Path(__file__).parent.resolve()
    output_path = script_dir / OUTPUT_FILE
    
    # Create a temporary directory for cloning
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            # Clone the repository
            repo_path = clone_sigma_repo(temp_dir)
            
            # Scan and parse rules
            rules = scan_rules_directory(repo_path)
            
            if not rules:
                print("No rules found!")
                sys.exit(1)
            
            # Generate output JSON
            generate_rules_json(rules, str(output_path))
            
            print(f"\nSuccess! Extracted {len(rules)} Sigma rules.")
            
            # Print some stats
            status_counts = {}
            level_counts = {}
            product_counts = {}
            
            for rule in rules:
                status = rule.get("status", "unknown")
                level = rule.get("level", "unknown")
                product = rule.get("logsource", {}).get("product", "unknown")
                
                status_counts[status] = status_counts.get(status, 0) + 1
                level_counts[level] = level_counts.get(level, 0) + 1
                if product:
                    product_counts[product] = product_counts.get(product, 0) + 1
            
            print("\nStatus distribution:")
            for status, count in sorted(status_counts.items()):
                print(f"  {status}: {count}")
            
            print("\nLevel distribution:")
            for level, count in sorted(level_counts.items()):
                print(f"  {level}: {count}")
            
            print("\nTop 10 products:")
            for product, count in sorted(product_counts.items(), key=lambda x: -x[1])[:10]:
                print(f"  {product}: {count}")
                
        except subprocess.CalledProcessError as e:
            print(f"Git error: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
