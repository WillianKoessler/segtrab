#!/usr/bin/env python3
from __future__ import annotations

import re
import os
import shutil
import subprocess
import sys
import tarfile
import traceback
from tqdm import tqdm
from pathlib import Path


# --- CONFIG ---
PROJECT_ROOT = Path(os.getcwd())
LARAVEL_DIR = PROJECT_ROOT / "Laravel"
PUBLIC_HTML_DIR = PROJECT_ROOT / "public_html"
STAGE_DIR = PROJECT_ROOT / "_deploy_stage"
ARCHIVE_PATH = PROJECT_ROOT / "deploy.tgz"

REMOTE = "segtrab"
REMOTE_PATH = "/home/storage/c/83/d5/segtrab2"

# Adjust if your build output differs:
VITE_BUILD_DIR = LARAVEL_DIR / "public" / "build"
PUBLIC_BUILD_DIR = PUBLIC_HTML_DIR / "build"


def run(cmds: list[str]) -> None:
    subprocess.run(" && ".join(cmds), shell=True, check=True)

def build_frontend():
    print("Building frontend...")
    tempname = f"{PUBLIC_BUILD_DIR}.temp"
    try: os.rename(PUBLIC_BUILD_DIR, tempname)
    except: print("No build found.")
    try:
        run([f"cd {LARAVEL_DIR}", "npm run build --emptyOutDir"])
        shutil.rmtree(tempname)
    except:
        try: os.rename(tempname, PUBLIC_BUILD_DIR)
        except: pass

def ensure_clean_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)

def copytree_filtered(src: Path, dst: Path, ignoring: set[str]) -> None:
    copied = []
    
    def is_ignored(file):
        return any( bool(re.match(pattern, f"{file}")) for pattern in ignoring )

    def ignore_func(_dir, names):
        return { name for name in names if is_ignored(name) }

    total = 0

    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if not is_ignored(d)]
        total += sum( 1 for file in files if not is_ignored(file) )

    src_name = f"{PROJECT_ROOT.name}\\{Path(src).relative_to(PROJECT_ROOT)}".replace('\\', '/')
    with tqdm(total=total, desc=f"Copying {src_name}", unit="file") as pbar:
        def verbosity(src, dst):
            filename = src_name
            shutil.copy2(src, dst)
            copied.append(filename)
            pbar.update(1)

        shutil.copytree(src, dst, dirs_exist_ok=True, ignore=ignore_func, copy_function=verbosity)

    return copied



def create_stage() -> None:
    print("Creating staging folder...")
    ensure_clean_dir(STAGE_DIR)

    # Copy Laravel project files, excluding heavy/unneeded folders.
    # Add/remove exclusions to match your deployment strategy.
    ignore = {
        # r"\..*",
        ".env",
        ".env.example",
        r"\.git.*",
        # "artisan",
        # "composer", # this removes the vendor/composer/*
        "node_modules",
        "tests",
        # "storage",
        # "vendor",
    }

    staged = []

    # Copy Laravel app
    staged += copytree_filtered(LARAVEL_DIR, STAGE_DIR / "Laravel", ignore)

    # Copy public_html separately (includes the build output)
    staged += copytree_filtered(PUBLIC_HTML_DIR, STAGE_DIR / "public_html", { "hot" })

    print(f"Staged #{len(staged)} files")


def cleanup_stage() -> None:
    print("Cleaning staging folder...")
    shutil.rmtree(f"{STAGE_DIR}")

def make_7z_archive() -> None:
    if ARCHIVE_PATH.exists():
        ARCHIVE_PATH.unlink()

    # 7z maximum compression: -mx=9
    # -m0=lzma2 is usually best for 7z archives
    run([
        "7z", "a",
        "-t7z",
        "-mx=9",
        "-m0=lzma2",
        str(ARCHIVE_PATH),
        "."
    ])

def make_tgz_archive() -> None:
    print("Compressing package...")
    if ARCHIVE_PATH.exists():
        ARCHIVE_PATH.unlink()

    total = sum( len(files) for _, _, files in os.walk(STAGE_DIR) )

    with tarfile.open(ARCHIVE_PATH, mode="w:gz", compresslevel=9) as tar:
        with tqdm(total=total, desc="Compressing", unit="file") as pbar:
            for root, _, files in os.walk(STAGE_DIR):
                root = Path(root)
                for filename in files:
                    path = root / filename
                    tar.add(path, arcname=path.relative_to(STAGE_DIR))
                    pbar.update(1)


def upload_with_scp() -> None:
    print("Uploading via scp...")
    remote_target = f"{REMOTE}:{REMOTE_PATH}/deploy.tgz"
    run([f"scp {ARCHIVE_PATH} {remote_target}"])


def extract_on_server() -> None:
    print("Extracting on server...")
    run([f'ssh {REMOTE} "bash ~/unpack.sh"'])


def main() -> int:
    try:
        build_frontend()
        create_stage()
        make_tgz_archive()
        cleanup_stage()
        upload_with_scp()
        # extract_on_server() # Not necessary, there's a cronjob running every minute with this script.

        print("\nDone.")
        return 0

    except subprocess.CalledProcessError as e:
        print(f"\nCommand failed with exit code {e.returncode}")
        return e.returncode
    except:
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())