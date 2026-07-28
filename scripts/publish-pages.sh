#!/bin/sh
# Publishes a built directory to the gh-pages branch, either at its root or
# under a sub directory, leaving the other deployment untouched.
#
# usage: publish-pages.sh <built-dir> <. | subdir> <commit message>
set -eu

built=$1
subdir=$2
message=$3

branch=gh-pages
work=.gh-pages-worktree

git worktree remove --force "$work" 2>/dev/null || true
rm -rf "$work"

git fetch origin "$branch" 2>/dev/null || true

if git rev-parse --verify --quiet "origin/$branch" >/dev/null; then
  git worktree add --detach "$work" "origin/$branch"
  git -C "$work" checkout -B "$branch"
else
  git worktree add --detach "$work"
  git -C "$work" checkout --orphan "$branch"
  git -C "$work" rm -rf . >/dev/null 2>&1 || true
fi

target=$work
[ "$subdir" = "." ] || target="$work/$subdir"

mkdir -p "$target"

find "$target" -mindepth 1 -maxdepth 1 \
  ! -name .git ! -name .nojekyll ! -name staging \
  -exec rm -rf {} +

cp -R "$built/." "$target/"

touch "$work/.nojekyll"

git -C "$work" add -A

git -C "$work" commit -m "$message" || echo "nothing to publish"

git -C "$work" push origin "$branch"

git worktree remove --force "$work"
