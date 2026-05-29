import os

OUTPUT_FILE = "clean_project_dump.txt"

# Folders to ignore completely
IGNORE_FOLDERS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "__pycache__",
    "venv",
    ".venv",
    "coverage",
    ".idea",
    ".vscode",
    "target",
    "bin",
    "obj"
}

# Specific files to ignore
IGNORE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".DS_Store"
}

# Extensions to include
INCLUDE_EXTENSIONS = {
    ".js", ".jsx",
    ".ts", ".tsx",
    ".py",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".md",
    ".java",
    ".cpp",
    ".c",
    ".go",
    ".rs",
    ".php",
    ".sql",
    ".sh",
    ".yaml",
    ".yml"
}

# Extensions to exclude
EXCLUDE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".ico",
    ".mp4", ".mp3",
    ".zip", ".rar",
    ".pdf",
    ".exe",
    ".dll",
    ".env"
}

MAX_FILE_SIZE = 300 * 1024  # 300 KB


def should_include(file_path, file_name):
    ext = os.path.splitext(file_name)[1].lower()

    if file_name in IGNORE_FILES:
        return False

    if ext in EXCLUDE_EXTENSIONS:
        return False

    if ext not in INCLUDE_EXTENSIONS:
        return False

    try:
        if os.path.getsize(file_path) > MAX_FILE_SIZE:
            return False
    except:
        return False

    return True


with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:

    for root, dirs, files in os.walk("."):

        # Ignore unwanted folders
        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

        for file in files:

            file_path = os.path.join(root, file)

            if should_include(file_path, file):

                try:
                    with open(file_path, "r", encoding="utf-8") as infile:
                        content = infile.read()

                    outfile.write("\n")
                    outfile.write("=" * 100 + "\n")
                    outfile.write(f"FILE: {file_path}\n")
                    outfile.write("=" * 100 + "\n\n")

                    outfile.write(content)
                    outfile.write("\n\n")

                except Exception as e:
                    outfile.write(f"\nERROR READING {file_path}\n")
                    outfile.write(str(e))
                    outfile.write("\n")

print(f"\nDone! Output saved to: {OUTPUT_FILE}")
