# CP1 — GitHub Repository Setup

[![Copy Exercise](https://img.shields.io/badge/COPY%20EXERCISE-%E2%86%92-2ea44f?style=for-the-badge&logo=github)](https://github.com/new?template_owner=KLIS-CS&template_name=GitHub-Repository-Setup&owner=%40me&name=cp1-repository-setup-YOUR-GITHUB-USERNAME&description=CP1%3A+GitHub+Repository+Setup&visibility=public)

**Start here:** click **COPY EXERCISE**, replace `YOUR-GITHUB-USERNAME` in the repository name with your real GitHub username, keep the repository **Public**, and create the repository.

CP1 checks whether you can complete a clean GitHub repository with three required project files while working directly on `main`.

## Required files

Create these three project files at the repository root:

```text
README.md
.gitignore
LICENSE   (LICENSE.md or LICENSE.txt is also accepted)
```

### `README.md`

Write your own README. It must include:

- an H1 project title;
- a clear explanation of what the repository is for;
- a **Setup**, **Usage**, **Getting Started**, **Installation**, or **How to Run** section;
- at least one useful instruction another developer could follow.

### `.gitignore`

Create a `.gitignore` with at least one meaningful ignore rule appropriate for the project.

### License file

Add the complete text of a real open-source license such as MIT, Apache-2.0, or GPL-3.0. The grader accepts `LICENSE`, `LICENSE.md`, or `LICENSE.txt`.

## How automatic grading works

The grader separates **file existence** from **file quality**. Creating a required file earns the existence portion of the score even when the file is still empty; the remaining points require meaningful content.

For example, an empty `.gitignore` is recognized as an existing file, but it still needs at least one real ignore rule for full credit.

## CP1 workflow

CP1 does **not** use a feature branch or Pull Request.

```text
Copy Exercise
→ work directly on main
→ create README.md
→ create .gitignore
→ create a license file
→ save / push the finished files
→ automatic score appears in your own CP1 — Score Issue
→ Submit CP1 to the mother repository
→ teacher grades in the mother repository
→ teacher score syncs back to your own CP1 — Score Issue
```

## Repository name

Your copied repository must be named exactly:

```text
cp1-repository-setup-YOUR-GITHUB-USERNAME
```

Example:

```text
cp1-repository-setup-octocat
```

Keep the repository **Public** and keep `main` as the default branch.

## Your score

After you create or update one of the required files, GitHub Actions creates or refreshes an Issue named:

```text
CP1 — Score
```

That Issue shows:

- Automatic score `/60`
- Teacher score `/40`
- Final score `/100`
- Teacher feedback

Teacher grades are entered in the KLIS-CS mother repository and then synchronized back to your own Score Issue. The sync runs automatically about once per hour. You can also refresh immediately with:

**Actions → CP1 — Student Score → Run workflow**

## Submit CP1

When the three files are ready, submit your repository to the mother repository:

[![Submit CP1](https://img.shields.io/badge/SUBMIT%20CP1-%E2%86%92-0969da?style=for-the-badge&logo=github)](https://github.com/KLIS-CS/GitHub-Repository-Setup/issues/new?template=cp1-submission.yml)

Paste the repository URL, not a file URL.

## Before you submit

- [ ] Repository name is exactly `cp1-repository-setup-YOUR-GITHUB-USERNAME`
- [ ] Repository is Public
- [ ] Repository belongs to your GitHub account
- [ ] `main` is the default branch
- [ ] `README.md` is complete
- [ ] `.gitignore` contains a meaningful rule
- [ ] `LICENSE`, `LICENSE.md`, or `LICENSE.txt` contains complete license text
- [ ] No feature branch or Pull Request was created for CP1
- [ ] No passwords, API keys, tokens, or other secrets were committed
