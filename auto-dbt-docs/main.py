#!/usr/bin/env python3
"""
Main script for dbt documentation automation

Runs both the documentation generator and navigation updater in sequence.
"""

import argparse
import sys
import subprocess
from pathlib import Path

def run_script(script_path, args=None):
    """Run a Python script with optional arguments"""
    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)
    
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    
    return result.returncode == 0

def main():
    parser = argparse.ArgumentParser(description='Generate dbt documentation and update navigation')
    parser.add_argument('--project', help='Specific project to process')
    parser.add_argument('--rebuild-all', action='store_true', help='Rebuild all projects')
    parser.add_argument('--skip-navigation', action='store_true', help='Skip navigation update')
    args = parser.parse_args()
    
    scripts_dir = Path('scripts')
    
    # Step 1: Generate documentation
    print("=== Step 1: Generating dbt documentation ===")
    generator_args = []
    if args.project:
        generator_args.extend(['--project', args.project])
    elif args.rebuild_all:
        generator_args.append('--rebuild-all')
    
    success = run_script(scripts_dir / 'dbt_docs_generator.py', generator_args)
    if not success:
        print("❌ Documentation generation failed")
        sys.exit(1)
    
    # Step 2: Update navigation (unless skipped)
    if not args.skip_navigation:
        print("\n=== Step 2: Updating navigation ===")
        success = run_script(scripts_dir / 'update_navigation.py')
        if not success:
            print("❌ Navigation update failed")
            sys.exit(1)
    else:
        print("\n⏭️  Skipping navigation update")
    
    print("\n✅ All tasks completed successfully!")

if __name__ == '__main__':
    main()